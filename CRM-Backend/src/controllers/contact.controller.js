// controllers\contact.controller.js
import prisma from "../utils/prisma.js";
import { ApiError, asyncHandler } from "../utils/ApiError.js";
import * as xlsx from "xlsx";

// @desc    Get all contacts
// @route   GET /api/contacts
export const getContacts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
    accountId,
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {
    ...(search && {
      OR: [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(accountId && { accountId }),
  };

  if (req.user.role !== "ADMIN") {
    where.OR = [
      { contactOwnerId: req.user.id },
      { assignments: { some: { userId: req.user.id } } },
      {
        account: {
          OR: [
            { accountOwnerId: req.user.id },
            { keyAccountManagerId: req.user.id },
            { assignments: { some: { userId: req.user.id } } },
            { deals: { some: { personInCharge: { equals: req.user.name, mode: "insensitive" } } } },
            { deals: { some: { assignments: { some: { userId: req.user.id } } } } },
          ],
        },
      },
    ];
  }

  const includeDeals = parseInt(limit) > 1000;

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      include: {
        account: {
          select: {
            id: true,
            accountName: true,
            keyAccountManager: { select: { id: true, name: true } },
          },
        },
        owner: { select: { id: true, name: true } },

        // ✅ include deals ONLY for export
        ...(includeDeals && {
          deals: {
            select: {
              id: true,
              dealName: true,
              amount: true,
              stage: true,
            },
          },
        }),

        _count: { select: { deals: true } },

        // ⭐ UPCOMING TASK
        tasks: {
          where: {
            status: { not: "COMPLETED" },
            dueDate: { gte: new Date() },
          },
          orderBy: { dueDate: "asc" },
          take: 1,
          select: {
            subject: true,
            dueDate: true,
            priority: true,
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: parseInt(limit),
    }),

    prisma.contact.count({ where }),
  ]);

  // 👉 flatten upcomingTask for frontend
  const formatted = contacts.map((c) => ({
    ...c,
    upcomingTask: c.tasks[0] || null,
  }));

  res.json({
    success: true,
    data: formatted,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

// @desc    Get single contact
// @route   GET /api/contacts/:id
export const getContact = asyncHandler(async (req, res) => {
  const contact = await prisma.contact.findFirst({
    where: {
      id: req.params.id,
      ...(req.user.role !== "ADMIN" && {
        OR: [
          { contactOwnerId: req.user.id },
          { assignments: { some: { userId: req.user.id } } },
          {
            account: {
              OR: [
                { accountOwnerId: req.user.id },
                { keyAccountManagerId: req.user.id },
                { assignments: { some: { userId: req.user.id } } },
                { deals: { some: { personInCharge: { equals: req.user.name, mode: "insensitive" } } } },
                { deals: { some: { assignments: { some: { userId: req.user.id } } } } },
              ],
            },
          },
        ],
      }),
    },
    include: {
      account: {
        select: {
          id: true,
          accountName: true,
          keyAccountManager: { select: { id: true, name: true, email: true } },
        },
      },
      owner: { select: { id: true, name: true, email: true } },
      createdBy: { select: { id: true, name: true } },
      modifiedBy: { select: { id: true, name: true } },
      deals: {
        select: {
          id: true,
          dealName: true,
          amount: true,
          stage: true,
          closingDate: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!contact) {
    throw new ApiError(404, "Contact not found");
  }

  res.json({ success: true, data: contact });
});

// @desc    Create contact
// @route   POST /api/contacts
export const createContact = asyncHandler(async (req, res) => {
  const existingEmail = await prisma.contact.findUnique({
    where: { email: req.body.email },
  });

  if (existingEmail) {
    throw new ApiError(400, "Contact with this email already exists");
  }

  const data = {
    ...req.body,
    contactOwnerId: req.body.contactOwnerId || req.user.id,
    createdById: req.user.id,
    modifiedById: req.user.id,
  };

  // 🔥 remove null/empty fields
  Object.keys(data).forEach((k) => {
    if (data[k] === null || data[k] === "") delete data[k];
  });

  const result = await prisma.$transaction(async (tx) => {
    const contact = await tx.contact.create({
      data,
    });

    await tx.contactAssignment.create({
      data: {
        contactId: contact.id,
        userId: req.user.id,
      },
    });

    return tx.contact.findUnique({
      where: { id: contact.id },
      include: {
        account: {
          select: {
            id: true,
            accountName: true,
            keyAccountManager: { select: { id: true, name: true } },
          },
        },
        owner: { select: { id: true, name: true } },
      },
    });
  });

  res.status(201).json({ success: true, data: result });
});

// @desc    Update contact
// @route   PUT /api/contacts/:id
export const updateContact = asyncHandler(async (req, res) => {
  const existing = await prisma.contact.findUnique({
    where: { id: req.params.id },
  });

  if (!existing) {
    throw new ApiError(404, "Contact not found");
  }

  // 🛡️ Ownership protection
  if (req.user.role !== "ADMIN") {
    const assigned = await prisma.contactAssignment.findFirst({
      where: {
        contactId: req.params.id,
        userId: req.user.id,
      },
    });

    if (!assigned) {
      // Check if user is Account KAM
      const contact = await prisma.contact.findUnique({
        where: { id: req.params.id },
        select: { account: { select: { keyAccountManagerId: true } } },
      });

      if (contact?.account?.keyAccountManagerId !== req.user.id) {
        throw new ApiError(403, "Forbidden: Not assigned to this contact");
      }
    }
  }

  // Check email uniqueness if changing
  if (req.body.email && req.body.email !== existing.email) {
    const emailExists = await prisma.contact.findUnique({
      where: { email: req.body.email },
    });
    if (emailExists) {
      throw new ApiError(400, "Email already in use by another contact");
    }
  }

  const data = { ...req.body, modifiedById: req.user.id };

  // 🔥 prevent overwriting with null
  Object.keys(data).forEach((k) => {
    if (data[k] === null || data[k] === "") delete data[k];
  });
  delete data.id;
  delete data.createdAt;
  delete data.updatedAt;
  delete data.createdById;

  const contact = await prisma.contact.update({
    where: { id: req.params.id },
    data,
    include: {
      account: {
        select: {
          id: true,
          accountName: true,
          keyAccountManager: { select: { id: true, name: true } },
        },
      },
      owner: { select: { id: true, name: true } },
    },
  });

  res.json({ success: true, data: contact });
});

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
export const deleteContact = asyncHandler(async (req, res) => {
  if (req.user.role === "SALES_REP") {
    throw new ApiError(403, "Forbidden: Sales Reps cannot delete records");
  }

  const existing = await prisma.contact.findUnique({
    where: { id: req.params.id },
  });

  if (!existing) {
    throw new ApiError(404, "Contact not found");
  }

  await prisma.contact.delete({ where: { id: req.params.id } });

  res.json({ success: true, message: "Contact deleted successfully" });
});

// @desc    Get contacts dropdown
// @route   GET /api/contacts/dropdown/list
export const getContactsDropdown = asyncHandler(async (req, res) => {
  const { accountId } = req.query;

  const where = accountId ? { accountId } : {};
  if (req.user.role !== "ADMIN") {
    where.OR = [
      { assignments: { some: { userId: req.user.id } } },
      { account: { keyAccountManagerId: req.user.id } },
      { account: { deals: { some: { personInCharge: req.user.name } } } },
    ];
  }

  const contacts = await prisma.contact.findMany({
    where,
    select: { id: true, firstName: true, lastName: true, email: true },
    orderBy: { firstName: "asc" },
  });

  res.json({ success: true, data: contacts });
});

// @desc    Import contacts from Excel
// @route   POST /api/contacts/import
export const importContacts = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Please upload an Excel file");
  }

  // Parse Excel buffer
  const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet);

  const stats = {
    total: rows.length,
    created: 0,
    updated: 0,
    noAccountMatch: 0,
    skipped: 0,
    errors: [],
  };

  // Pre-load all accounts into a high-performance hash map
  const accounts = await prisma.account.findMany({
    select: { id: true, accountName: true },
  });
  const accountMap = {};
  accounts.forEach((acc) => {
    // Normalizing DB account name for strict matching
    const cleanDbName = acc.accountName
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase();
    accountMap[cleanDbName] = acc.id;
  });

  const parseLeadSource = (src) => {
    if (!src) return null;
    const s = String(src)
      .toUpperCase()
      .replace(/[\s_\-]/g, "");
    if (s.includes("WEB")) return "WEB"; // catches "Web Mail", "Website", "Web"
    if (s.includes("EMPLOYEEREFERRAL") || s.includes("EMPLOYEEREF"))
      return "EMPLOYEE_REFERRAL";
    if (s.includes("EXTERNALREFERRAL") || s.includes("EXTERNAL"))
      return "PARTNER_REFERRAL";
    if (s.includes("PARTNERREFERRAL")) return "PARTNER_REFERRAL";
    if (s.includes("PARTNER")) return "PARTNER_REFERRAL"; // catches plain "Partner"
    if (s.includes("REFERRAL")) return "PARTNER_REFERRAL"; // catches "Referral"
    if (s.includes("COLDCALL")) return "COLD_CALL";
    if (s.includes("TRADESHOW") || s.includes("TRADE")) return "TRADE_SHOW";
    if (
      s.includes("ADVERTISEMENT") ||
      s.includes("ADVERT") ||
      s.includes("ADS")
    )
      return "ADVERTISEMENT";
    if (
      s.includes("SOCIALMEDIA") ||
      s.includes("SOCIAL") ||
      s.includes("LINKEDIN") ||
      s.includes("TWITTER") ||
      s.includes("FACEBOOK")
    )
      return "SOCIAL_MEDIA";
    if (s.includes("EMAILCAMPAIGN") || s.includes("EMAIL"))
      return "EMAIL_CAMPAIGN";
    if (s.includes("PURCHASEDLIST") || s.includes("PURCHASED"))
      return "PURCHASED_LIST";
    if (s.includes("PHONEINQUIRY") || s.includes("PHONE"))
      return "PHONE_INQUIRY";
    if (s.includes("OTHER")) return "OTHER";
    return null;
  };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    // Normalize keys: lowercase, no symbols/spaces (removes BOM, zero-width, punctuation)
    const rowData = {};
    Object.keys(row).forEach((key) => {
      const cleanKey = key.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      let val = row[key];
      if (typeof val === "string") val = val.trim();
      rowData[cleanKey] = val;
    });

    const firstName = rowData["firstname"] || rowData["first"] || rowData["name"] || "Unknown";
    const lastName = rowData["lastname"] || rowData["last"] || null;

    const emailStr = rowData["email"] ? String(rowData["email"]).toLowerCase().trim() : null;
    
    // Deterministic fake email based on name to prevent duplicates on re-import
    const fnClean = firstName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const lnClean = (lastName || "none").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const fakeEmail = `noemail_${fnClean}_${lnClean}@unknown.local`;

    const email = emailStr || fakeEmail;

    const rawAccountName =
      rowData["accountname"] || 
      rowData["account"] || 
      rowData["companyname"] || 
      rowData["company"] || 
      rowData["organization"];

    let accountId = null;
    const resolvedAccountName = rawAccountName
      ? String(rawAccountName).trim()
      : "Unassigned";
    const cleanExcelAccName = resolvedAccountName
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase();
    accountId = accountMap[cleanExcelAccName] || null;

    if (!accountId) {
      // create account automatically because schema strictly requires accountId
      try {
        const newAccount = await prisma.account.create({
          data: {
            accountName: resolvedAccountName,
            accountOwnerId: req.user.id,
          },
        });
        accountId = newAccount.id;
        accountMap[cleanExcelAccName] = accountId;
        if (rawAccountName) stats.noAccountMatch++;
      } catch (err) {
        stats.skipped++;
        const msg = `Row ${i + 2}: Failed to auto-create Account "${resolvedAccountName}": ${err.message}`;
        stats.errors.push(msg);
        console.error(msg);
        continue;
      }
    }

    // Map messy Excel columns to db fields using normalized keys
    const payload = {
      firstName,
      lastName,
      email,
      phone: rowData["phone"] ? String(rowData["phone"]) : null,
      mobile: rowData["mobile"] ? String(rowData["mobile"]) : null,
      title: rowData["title"] || null,
      department: rowData["department"] || null,
      leadSource: parseLeadSource(rowData["leadsource"]),
      mailingCity: rowData["mailingcity"] || null,
      mailingState: rowData["mailingstate"] || null,
      mailingCountry: rowData["mailingcountry"] || null,
      mailingFlat: rowData["mailingflat"] || rowData["flat"] || null,
      mailingStreet: rowData["mailingstreet"] || null,
      mailingZip: rowData["mailingzip"] || rowData["zipcode"] || null,
      description: rowData["description"] || null,
      accountId: accountId,
      contactOwnerId: req.user.id,
      modifiedById: req.user.id,
    };

    // Remove empty nulls to prevent erasing existing data
    const updatePayload = { ...payload };
    Object.keys(updatePayload).forEach((k) => {
      if (updatePayload[k] === null || updatePayload[k] === "") {
        delete updatePayload[k];
      }
    });

    try {
      const existing = await prisma.contact.findUnique({
        where: { email },
      });

      if (existing) {
        await prisma.contact.update({
          where: { id: existing.id },
          data: updatePayload,
        });
        stats.updated++;
      } else {
        await prisma.$transaction(async (tx) => {
          const contact = await tx.contact.create({
            data: { ...payload, createdById: req.user.id },
          });

          await tx.contactAssignment.create({
            data: {
              contactId: contact.id,
              userId: req.user.id,
            },
          });
        });
        stats.created++;
      }
    } catch (err) {
      stats.skipped++;
      const msg = `Row ${i + 2} (${email}): ${err.message}`;
      stats.errors.push(msg);
      console.error("IMPORT ERROR:", msg);
    }
  }

  console.log("[CONTACT IMPORT SUMMARY]", {
    total: stats.total,
    created: stats.created,
    updated: stats.updated,
    skipped: stats.skipped,
    errors: stats.errors,
  });

  res.json({
    success: true,
    data: stats,
  });
});

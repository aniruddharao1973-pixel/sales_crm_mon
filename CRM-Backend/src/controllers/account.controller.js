// src\controllers\account.controller.js
import prisma from "../utils/prisma.js";
import { ApiError, asyncHandler } from "../utils/ApiError.js";
import xlsx from "xlsx";

// @desc    Get all accounts
// @route   GET /api/accounts
export const getAccounts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
    industry,
    accountType,
  } = req.query;

  const user = req.user;
  const { lifecycle } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const where = {
    ...(search && {
      OR: [
        { accountName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { accountNumber: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(industry && { industry }),
    ...(accountType && { accountType }),
    // 🔥 Lifecycle filter
    ...(lifecycle ? { lifecycle } : { lifecycle: { not: "DEACTIVATED" } }),

    // 🔥 Assignment-based access
    ...(user.role !== "ADMIN" && {
      OR: [
        { accountOwnerId: user.id },
        { keyAccountManagerId: user.id },
        { assignments: { some: { userId: user.id } } },
        { deals: { some: { personInCharge: { equals: user.name, mode: "insensitive" } } } },
        { deals: { some: { assignments: { some: { userId: user.id } } } } },
      ],
    }),
  };

  // if (req.user.role === "SALES_REP") {
  //   where.accountOwnerId = req.user.id;
  // }
  const includeDeals = parseInt(limit) > 1000;

  const [accounts, total] = await Promise.all([
    prisma.account.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true, email: true } },
        keyAccountManager: { select: { id: true, name: true, email: true } },
        parentAccount: { select: { id: true, accountName: true } },

        // ✅ include deals ONLY for export (large limit)
        ...(includeDeals && {
          deals: {
            select: {
              id: true,
              dealName: true,
              amount: true,
              stage: true,
              owner: {
                select: { id: true, name: true },
              },
            },
          },
        }),

        _count: { select: { contacts: true, deals: true } },
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: parseInt(limit),
    }),
    prisma.account.count({ where }),
  ]);

  res.json({
    success: true,
    data: accounts,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

// @desc    Get single account
// @route   GET /api/accounts/:id
export const getAccount = asyncHandler(async (req, res) => {
  const user = req.user;

  const account = await prisma.account.findFirst({
    where: {
      id: req.params.id,

      ...(user.role !== "ADMIN" && {
        OR: [
          { accountOwnerId: user.id },
          { keyAccountManagerId: user.id },
          { assignments: { some: { userId: user.id } } },
          { deals: { some: { personInCharge: { equals: user.name, mode: "insensitive" } } } },
          { deals: { some: { assignments: { some: { userId: user.id } } } } },
        ],
      }),
    },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      keyAccountManager: { select: { id: true, name: true, email: true } },
      parentAccount: { select: { id: true, accountName: true } },
      childAccounts: { select: { id: true, accountName: true } },
      contacts: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          title: true,
        },
        orderBy: { createdAt: "desc" },
      },
      deals: {
        select: {
          id: true,
          dealName: true,
          amount: true,
          stage: true,
          closingDate: true,
          owner: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!account) {
    throw new ApiError(404, "Account not found or not assigned");
  }

  res.json({ success: true, data: account });
});

// @desc    Create account
// @route   POST /api/accounts
export const createAccount = asyncHandler(async (req, res) => {
  const data = {
    ...req.body,
    accountOwnerId: req.body.accountOwnerId || req.user.id,
    keyAccountManagerId: req.body.keyAccountManagerId || null,
    annualRevenue: req.body.annualRevenue
      ? parseFloat(req.body.annualRevenue)
      : null,
    employees: req.body.employees ? parseInt(req.body.employees) : null,
    // 🔥 Lifecycle fields
    lifecycle: req.body.lifecycle || "PROSPECT",
    lifecycleUpdatedAt: new Date(),
    lastActivityAt: new Date(),
  };

  // Generate account number
  const count = await prisma.account.count();
  data.accountNumber = `ACC-${String(count + 1).padStart(6, "0")}`;

  const account = await prisma.account.create({
    data,
    include: {
      owner: { select: { id: true, name: true, email: true } },
      keyAccountManager: { select: { id: true, name: true, email: true } },
    },
  });

  // 🔥 Assignment creation
  await prisma.accountAssignment.create({
    data: {
      accountId: account.id,
      userId: req.user.id,
    },
  });

  res.status(201).json({ success: true, data: account });
});

// @desc    Update account
// @route   PUT /api/accounts/:id
export const updateAccount = asyncHandler(async (req, res) => {
  const existing = await prisma.account.findUnique({
    where: { id: req.params.id },
  });

  if (!existing) {
    throw new ApiError(404, "Account not found");
  }

  // 🛡️ Ownership protection
  if (
    req.user.role !== "ADMIN" &&
    existing.accountOwnerId !== req.user.id
  ) {
    // Check if user is KAM, assigned, or PIC of a deal
    const authorized = await prisma.account.findFirst({
      where: {
        id: req.params.id,
        OR: [
          { keyAccountManagerId: req.user.id },
          { assignments: { some: { userId: req.user.id } } },
          { deals: { some: { personInCharge: { equals: req.user.name, mode: "insensitive" } } } },
          { deals: { some: { assignments: { some: { userId: req.user.id } } } } },
        ],
      },
    });

    if (!authorized) {
      throw new ApiError(403, "Forbidden: You do not have permission to update this account");
    }
  }

  const data = {
    ...req.body,
    annualRevenue: req.body.annualRevenue
      ? parseFloat(req.body.annualRevenue)
      : null,
    employees: req.body.employees ? parseInt(req.body.employees) : null,
    keyAccountManagerId: req.body.keyAccountManagerId !== undefined ? req.body.keyAccountManagerId : existing.keyAccountManagerId,
  };

  if (req.body.lifecycle) {
    data.lifecycleUpdatedAt = new Date();
  }

  // Remove fields that shouldn't be updated directly
  delete data.id;
  delete data.accountNumber;
  delete data.createdAt;
  delete data.updatedAt;

  const account = await prisma.account.update({
    where: { id: req.params.id },
    data,
    include: {
      owner: { select: { id: true, name: true, email: true } },
      keyAccountManager: { select: { id: true, name: true, email: true } },
    },
  });

  res.json({ success: true, data: account });
});

// @desc    Delete account
// @route   DELETE /api/accounts/:id
export const deleteAccount = asyncHandler(async (req, res) => {
  if (req.user.role === "SALES_REP") {
    throw new ApiError(403, "Forbidden: Sales Reps cannot delete records");
  }

  const existing = await prisma.account.findUnique({
    where: { id: req.params.id },
    include: { _count: { select: { contacts: true, deals: true } } },
  });

  if (!existing) {
    throw new ApiError(404, "Account not found");
  }

  await prisma.account.update({
    where: { id: req.params.id },
    data: {
      lifecycle: "DEACTIVATED",
      lifecycleUpdatedAt: new Date(),
    },
  });

  res.json({ success: true, message: "Account deleted successfully" });
});

// @desc    Get accounts for dropdown
// @route   GET /api/accounts/dropdown/list
export const getAccountsDropdown = asyncHandler(async (req, res) => {
  const user = req.user;

  const where = {
    lifecycle: { not: "DEACTIVATED" },

    ...(user.role !== "ADMIN" && {
      OR: [
        { accountOwnerId: user.id },
        { keyAccountManagerId: user.id },
        { assignments: { some: { userId: user.id } } },
        { deals: { some: { personInCharge: { equals: user.name, mode: "insensitive" } } } },
        { deals: { some: { assignments: { some: { userId: user.id } } } } },
      ],
    }),
  };

  const accounts = await prisma.account.findMany({
    where,
    select: { id: true, accountName: true },
    orderBy: { accountName: "asc" },
  });

  res.json({ success: true, data: accounts });
});

// @desc    Import accounts from Excel
// @route   POST /api/accounts/import
export const importAccounts = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Please upload an Excel file");
  }

  // Find ADMIN user dynamically
  const adminUser = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!adminUser) {
    throw new ApiError(
      500,
      "No ADMIN user found in the system to assign accounts.",
    );
  }

  const ADMIN_USER_ID = adminUser.id;

  // Parse Excel buffer
  const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet);

  const stats = {
    total: rows.length,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  const parseAccountType = (typeStr) => {
    if (!typeStr) return null;
    const t = String(typeStr).toUpperCase().trim();
    if (t === "PROSPECT") return "PROSPECT";
    if (t.includes("CUSTOMER") && t.includes("CHANNEL"))
      return "CUSTOMER_CHANNEL";
    if (t.includes("CUSTOMER")) return "CUSTOMER_DIRECT";
    if (t.includes("CHANNEL") && t.includes("PARTNER"))
      return "CHANNEL_PARTNER";
    if (t.includes("INSTALLATION")) return "INSTALLATION_PARTNER";
    if (t.includes("TECHNOLOGY")) return "TECHNOLOGY_PARTNER";

    return "OTHER";
  };


  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (i === 0) {
      console.log("--- EXCEL IMPORT DEBUG ---");
      console.log("RAW ROW 1:", JSON.stringify(row, null, 2));
    }

    // Normalize keys: lowercase, no symbols/spaces (removes BOM, zero-width, punctuation)
    const rowData = {};
    Object.keys(row).forEach((key) => {
      const cleanKey = key.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      let val = row[key];
      if (typeof val === "string") val = val.trim();
      rowData[cleanKey] = val;
    });

    if (i === 0) {
      console.log("NORMALIZED ROW 1:", JSON.stringify(rowData, null, 2));
    }

    const accountName = rowData["accountname"];
    if (!accountName) {
      stats.skipped++;
      stats.errors.push(`Row ${i + 2}: Missing Account Name`);
      continue;
    }

    let accNum = rowData["accountnumber"]
      ? String(rowData["accountnumber"]).trim()
      : null;
    if (accNum === "0" || accNum === "none" || accNum === "") {
      accNum = null;
    }

    // Map messy Excel columns to db fields using normalized keys
    const payload = {
      accountName,
      phone: rowData["phone"] ? String(rowData["phone"]) : null,
      website: rowData["website"] || null,
      accountType: parseAccountType(rowData["accounttype"]),
      ownership: rowData["ownership"] || null,
      industry: rowData["industry"] || null,
      employees:
        rowData["employees"] && !isNaN(parseInt(rowData["employees"]))
          ? parseInt(rowData["employees"])
          : null,
      annualRevenue:
        rowData["annualrevenue"] && !isNaN(parseFloat(rowData["annualrevenue"]))
          ? parseFloat(rowData["annualrevenue"])
          : null,
      accountNumber: accNum,
      parentAccountId: rowData["parentaccountid"] || null,

      // ✅ BILLING with fallback from shipping
      billingStreet: rowData["billingstreet"] || null,
      billingCity: rowData["billingcity"] || null,
      billingState: rowData["billingstate"] || null,
      billingPincode: rowData["billingcode"]
        ? String(rowData["billingcode"])
        : null,
      billingCountry: rowData["billingcountry"] || null,
    };

    // Remove empty nulls to prevent erasing existing data
    Object.keys(payload).forEach((k) => {
      if (payload[k] === null || payload[k] === "") {
        delete payload[k];
      }
    });

    try {
      if (payload.accountNumber) {
        // Upsert by accountNumber
        const existing = await prisma.account.findFirst({
          where: { accountNumber: payload.accountNumber },
        });

        if (existing) {
          await prisma.account.update({
            where: { id: existing.id },
            data: payload,
          });
          stats.updated++;
        } else {
          await prisma.account.create({
            data: { ...payload, accountOwnerId: ADMIN_USER_ID },
          });
          stats.created++;
        }
      } else {
        // Upsert by accountName
        const existing = await prisma.account.findFirst({
          where: { accountName: payload.accountName },
        });

        if (existing) {
          await prisma.account.update({
            where: { id: existing.id },
            data: payload,
          });
          stats.updated++;
        } else {
          await prisma.account.create({
            data: { ...payload, accountOwnerId: ADMIN_USER_ID },
          });
          stats.created++;
        }
      }
    } catch (error) {
      stats.errors.push(`Row ${i + 2} (${accountName}): ${error.message}`);
      stats.skipped++;
    }
  }

  res.json({
    success: true,
    message: "Import complete",
    ...stats,
  });
});
export const restoreAccount = asyncHandler(async (req, res) => {
  const account = await prisma.account.findUnique({
    where: { id: req.params.id },
  });

  if (!account) {
    throw new ApiError(404, "Account not found");
  }

  if (account.lifecycle !== "DEACTIVATED") {
    throw new ApiError(400, "Only deactivated accounts can be restored");
  }

  const updated = await prisma.account.update({
    where: { id: req.params.id },
    data: {
      lifecycle: "ACTIVE",
      lifecycleUpdatedAt: new Date(),
    },
    include: {
      owner: { select: { id: true, name: true, email: true } },
    },
  });

  res.json({
    success: true,
    message: "Account restored successfully",
    data: updated,
  });
});

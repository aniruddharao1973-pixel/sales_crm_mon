// CRM-Backend\CRM-Backend\src\controllers\deal.controller.js
import prisma from "../utils/prisma.js";
import { ApiError, asyncHandler } from "../utils/ApiError.js";
import * as xlsx from "xlsx";

/* =========================================================
   STAGE → PROBABILITY MAP
========================================================= */
const STAGE_PROBABILITY = {
  RFQ: 10,
  VISIT_MEETING: 20,
  PREVIEW: 30,
  TECHNICAL_PROPOSAL: 40,
  COMMERCIAL_PROPOSAL: 50,
  REVIEW_FEEDBACK: 60,
  MOVED_TO_PURCHASE: 75,
  NEGOTIATION: 90,
  CLOSED_WON: 100,
  CLOSED_LOST: 0,
  CLOSED_LOST_TO_COMPETITION: 0,
  REGRETTED: 0,
};

/* =========================================================
   FY DEAL LOG ID GENERATOR
========================================================= */
const generateDealLogId = async (tx) => {
  const now = new Date();

  const year = now.getFullYear();
  const nextYear = year + 1;

  const fy =
    now.getMonth() + 1 >= 4
      ? `FY${String(year).slice(2)}${String(nextYear).slice(2)}`
      : `FY${String(year - 1).slice(2)}${String(year).slice(2)}`;

  const last = await tx.deal.findFirst({
    where: { dealLogId: { startsWith: fy } },
    orderBy: { dealLogId: "desc" },
    select: { dealLogId: true },
  });

  let number = 1000;

  if (last?.dealLogId) {
    number = parseInt(last.dealLogId.split(".")[1]) + 1;
  }

  return `${fy}.${number}`;
};

/* =========================================================
   COMMON INCLUDE (for frontend)
========================================================= */
// const dealInclude = {
//   account: { select: { id: true, accountName: true } },
//   contact: { select: { id: true, firstName: true, lastName: true } },
//   owner: { select: { id: true, name: true } },
//   createdBy: { select: { name: true } },
//   modifiedBy: { select: { name: true } },
// };

const dealInclude = {
    account: {
    select: {
      id: true,
      accountName: true,
      keyAccountManager: { select: { id: true, name: true } },
    },
  },

  contact: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },

  owner: { select: { id: true, name: true } },
  createdBy: { select: { id: true, name: true } },
  modifiedBy: { select: { id: true, name: true } },

  stageHistory: {
    include: { changedBy: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  },
};

/* =========================================================
   GET ALL DEALS
========================================================= */
export const getDeals = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc",
    stage,
    status,
    accountId,
    type,
    productGroup,
  } = req.query;

  const isExport = parseInt(limit) > 1000;

  const skip = isExport ? 0 : (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  // Define search filter
  const searchFilter = search
    ? {
        OR: [
          { dealName: { contains: search, mode: "insensitive" } },
          { dealLogId: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { personInCharge: { contains: search, mode: "insensitive" } },
          {
            account: { accountName: { contains: search, mode: "insensitive" } },
          },
          {
            owner: {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { username: { contains: search, mode: "insensitive" } },
              ],
            },
          },
          {
            contact: {
              OR: [
                { firstName: { contains: search, mode: "insensitive" } },
                { lastName: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            },
          },
        ],
      }
    : {};

  const where = {
    ...searchFilter,
    ...(stage && { stage }),
    ...(status && { status }),
    ...(accountId && { accountId }),
    ...(type && { type }),
    ...(productGroup && { productGroup }),

    // ✅ ASSIGNMENT BASED ACCESS
    ...(req.user.role !== "ADMIN" && {
      OR: [
        { dealOwnerId: req.user.id },
        { personInCharge: { equals: req.user.name, mode: "insensitive" } },
        { assignments: { some: { userId: req.user.id } } },
        {
          account: {
            OR: [
              { accountOwnerId: req.user.id },
              { keyAccountManagerId: req.user.id },
              { assignments: { some: { userId: req.user.id } } },
            ],
          },
        },
      ],
    }),
  };

  // Handle nested sorting
  let orderBy = { [sortBy]: sortOrder };
  if (sortBy === "accountName") {
    orderBy = { account: { accountName: sortOrder } };
  } else if (sortBy === "owner" || sortBy === "ownerName") {
    orderBy = { owner: { name: sortOrder } };
  } else if (sortBy === "personInCharge") {
    orderBy = { personInCharge: sortOrder };
  } else if (sortBy === "keyAccountManager") {
    orderBy = { account: { keyAccountManager: { name: sortOrder } } };
  } else if (sortBy === "contactName") {
    orderBy = { contact: { firstName: sortOrder } };
  }

  const [deals, total] = await Promise.all([
    prisma.deal.findMany({
      where,

      include: {
        ...dealInclude,

        // ✅ ADD THIS
        _count: {
          select: {
            stageHistory: true,
          },
        },
      },

      orderBy,
      skip,
      take,
    }),
    prisma.deal.count({ where }),
  ]);

  res.json({
    success: true,
    data: deals,
    pagination: {
      total,
      page: parseInt(page),
      limit: take,
      pages: Math.ceil(total / take),
    },
  });
});

/* =========================================================
   BULK DELETE DEALS
========================================================= */
export const bulkDeleteDeals = asyncHandler(async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide an array of deal IDs to delete",
    });
  }

  // If user is SALES_REP, they can only delete their own deals
  // We'll filter the IDs to ensure they own them if they aren't ADMIN/MANAGER
  let deleteWhere = { id: { in: ids } };

  if (req.user.role === "SALES_REP") {
    deleteWhere.dealOwnerId = req.user.id;
  }

  const { count } = await prisma.deal.deleteMany({
    where: deleteWhere,
  });

  res.json({
    success: true,
    message: `Successfully deleted ${count} deals`,
    count,
  });
});

/* =========================================================
   GET SINGLE DEAL
========================================================= */
export const getDeal = asyncHandler(async (req, res) => {
  console.log(`[DEBUG] getDeal called by ${req.user.name} (${req.user.role}) for ID: ${req.params.id}`);
  const deal = await prisma.deal.findFirst({
    where: {
      id: req.params.id,
      ...(req.user.role !== "ADMIN" && {
        OR: [
          { dealOwnerId: req.user.id },
          { personInCharge: { equals: req.user.name, mode: "insensitive" } },
          { assignments: { some: { userId: req.user.id } } },
          {
            account: {
              OR: [
                { accountOwnerId: req.user.id },
                { keyAccountManagerId: req.user.id },
                { assignments: { some: { userId: req.user.id } } },
              ],
            },
          },
        ],
      }),
    },
    include: dealInclude,
  });

  if (!deal) throw new ApiError(404, "Deal not found");

  res.json({ success: true, data: deal });
});

/* =========================================================
   CREATE DEAL
========================================================= */
export const createDeal = asyncHandler(async (req, res) => {
  const result = await prisma.$transaction(async (tx) => {
    const dealLogId = await generateDealLogId(tx);

    const deal = await tx.deal.create({
      data: {
        dealName: req.body.dealName,
        stage: req.body.stage,
        status: req.body.status || "IN_PROGRESS",
        stageUpdatedAt: new Date(),
        productGroup: req.body.productGroup || null,
        weightage: req.body.weightage || null,

        accountId: req.body.accountId,
        contactId: req.body.contactId || null,

        dealOwnerId: req.body.dealOwnerId || req.user.id,

        closingDate: new Date(req.body.closingDate),

        amount: req.body.amount ? parseFloat(req.body.amount) : null,
        expectedRevenue: req.body.expectedRevenue
          ? parseFloat(req.body.expectedRevenue)
          : null,

        probability: STAGE_PROBABILITY[req.body.stage] ?? null,

        dealLogId,

        createdById: req.user.id,
        modifiedById: req.user.id,
      },
    });

    await tx.dealStageHistory.create({
      data: {
        dealId: deal.id,
        stage: deal.stage,
        status: deal.status,
        amount: deal.amount,
        probability: deal.probability,
        expectedRevenue: deal.expectedRevenue,
        closingDate: deal.closingDate,
        changedById: req.user.id,
      },
    });

    // ✅ CREATE ASSIGNMENT (CRITICAL)
    await tx.dealAssignment.create({
      data: {
        dealId: deal.id,
        userId: req.user.id,
      },
    });

    return tx.deal.findUnique({
      where: { id: deal.id },
      include: dealInclude,
    });
  });

  res.status(201).json({ success: true, data: result });
});

// /* =========================================================
//    UPDATE DEAL + STAGE HISTORY
// ========================================================= */
// export const updateDeal = asyncHandler(async (req, res) => {
//   const existing = await prisma.deal.findUnique({
//     where: { id: req.params.id },
//   });

//   if (!existing) throw new ApiError(404, "Deal not found");

//   const result = await prisma.$transaction(async (tx) => {
//     const updated = await tx.deal.update({
//       where: { id: req.params.id },
//       data: {
//         dealName: req.body.dealName ?? existing.dealName,
//         stage: req.body.stage ?? existing.stage,
//         productGroup: req.body.productGroup ?? existing.productGroup,
//         weightage: req.body.weightage ?? existing.weightage,

//         accountId: req.body.accountId ?? existing.accountId,
//         contactId: req.body.contactId ?? existing.contactId,

//         closingDate: req.body.closingDate
//           ? new Date(req.body.closingDate)
//           : existing.closingDate,

//         amount:
//           req.body.amount !== undefined
//             ? req.body.amount
//               ? parseFloat(req.body.amount)
//               : null
//             : existing.amount,

//         expectedRevenue:
//           req.body.expectedRevenue !== undefined
//             ? req.body.expectedRevenue
//               ? parseFloat(req.body.expectedRevenue)
//               : null
//             : existing.expectedRevenue,

//         probability: req.body.stage
//           ? STAGE_PROBABILITY[req.body.stage]
//           : existing.probability,

//         modifiedById: req.user.id,
//       },
//     });

//     /* 🔥 stage changed → history */
//     if (req.body.stage && req.body.stage !== existing.stage) {
//       await tx.dealStageHistory.create({
//         data: {
//           dealId: updated.id,
//           stage: updated.stage,
//           amount: updated.amount,
//           probability: updated.probability,
//           expectedRevenue: updated.expectedRevenue,
//           closingDate: updated.closingDate,
//           changedById: req.user.id,
//         },
//       });
//     }

//     return tx.deal.findUnique({
//       where: { id: updated.id },
//       include: dealInclude,
//     });
//   });

//   res.json({ success: true, data: result });
// });

/* =========================================================
   UPDATE DEAL + STAGE HISTORY
========================================================= */
export const updateDeal = asyncHandler(async (req, res) => {
  const { description, ...body } = req.body;

  const existing = await prisma.deal.findUnique({
    where: { id: req.params.id },
  });

  if (!existing) throw new ApiError(404, "Deal not found");

  // 🛡️ Ownership protection
  if (req.user.role !== "ADMIN" && existing.dealOwnerId !== req.user.id) {
    // Hierarchical access check
    const authorized = await prisma.deal.findFirst({
      where: {
        id: req.params.id,
        OR: [
          { personInCharge: { equals: req.user.name, mode: "insensitive" } },
          { assignments: { some: { userId: req.user.id } } },
          {
            account: {
              OR: [
                { accountOwnerId: req.user.id },
                { keyAccountManagerId: req.user.id },
                { assignments: { some: { userId: req.user.id } } },
              ],
            },
          },
        ],
      },
    });

    if (!authorized) {
      throw new ApiError(
        403,
        "Forbidden: You do not have permission to update this deal",
      );
    }
  }

  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.deal.update({
      where: { id: req.params.id },

      data: {
        dealName: req.body.dealName ?? existing.dealName,

        stage: req.body.stage ?? existing.stage,
        status: req.body.status ?? existing.status,

        stageUpdatedAt:
          req.body.stage && req.body.stage !== existing.stage
            ? new Date()
            : existing.stageUpdatedAt,

        productGroup:
          req.body.productGroup !== undefined
            ? req.body.productGroup
            : existing.productGroup,

        weightage:
          req.body.weightage !== undefined
            ? req.body.weightage
            : existing.weightage,

        personInCharge:
          req.body.personInCharge !== undefined
            ? req.body.personInCharge
            : existing.personInCharge,

        accountId: req.body.accountId ?? existing.accountId,
        contactId: req.body.contactId ?? existing.contactId,

        closingDate: req.body.closingDate
          ? new Date(req.body.closingDate)
          : existing.closingDate,

        amount:
          req.body.amount !== undefined
            ? req.body.amount
              ? parseFloat(req.body.amount)
              : null
            : existing.amount,

        expectedRevenue:
          req.body.expectedRevenue !== undefined
            ? req.body.expectedRevenue
              ? parseFloat(req.body.expectedRevenue)
              : null
            : existing.expectedRevenue,

        probability: req.body.stage
          ? STAGE_PROBABILITY[req.body.stage]
          : existing.probability,

        modifiedById: req.user.id,
      },
    });

    /* 🔥 STAGE CHANGED → CREATE HISTORY */
    /* 🔥 CREATE HISTORY (stage change OR notes added) */
    if (
      (req.body.stage && req.body.stage !== existing.stage) ||
      (req.body.status && req.body.status !== existing.status) ||
      (req.body.stage === existing.stage && description)
    ) {
      await tx.dealStageHistory.create({
        data: {
          dealId: updated.id,

          // ✅ if same stage, keep existing stage
          stage: req.body.stage || existing.stage,
          status: req.body.status || existing.status,

          amount: updated.amount,
          probability: updated.probability,
          expectedRevenue: updated.expectedRevenue,
          closingDate: updated.closingDate,

          description: description || null,

          changedById: req.user.id,
        },
      });
    }

    return tx.deal.findUnique({
      where: { id: updated.id },
      include: dealInclude,
    });
  });

  res.json({ success: true, data: result });
});
/* =========================================================
   DELETE DEAL
========================================================= */
export const deleteDeal = asyncHandler(async (req, res) => {
  if (req.user.role === "SALES_REP") {
    throw new ApiError(403, "Forbidden: Sales Reps cannot delete records");
  }

  await prisma.deal.delete({
    where: { id: req.params.id },
  });

  res.json({ success: true, message: "Deal deleted" });
});

/* =========================================================
   UPDATE STAGE HISTORY NOTE
========================================================= */
export const updateStageHistoryNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;

  const updated = await prisma.dealStageHistory.update({
    where: { id },
    data: { description },
  });

  res.json({ success: true, data: updated });
});

/* =========================================================
   IMPORT DEALS FROM EXCEL
   POST /api/deals/import
=========================================================  */
export const importDeals = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Please upload an Excel file");
  }

  // --- Parse Excel ---
  const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet);

  // --- Pre-load relational maps ---
  const [allAccounts, allContacts, allUsers, adminUser] = await Promise.all([
    prisma.account.findMany({ select: { id: true, accountName: true } }),
    prisma.contact.findMany({
      select: { id: true, firstName: true, lastName: true },
    }),
    prisma.user.findMany({
      select: { id: true, name: true, username: true, role: true },
    }),
    prisma.user.findFirst({ where: { role: "ADMIN" } }),
  ]);

  const accountMap = {};
  allAccounts.forEach((a) => {
    const raw = a.accountName || "";
    accountMap[raw.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()] = a.id;
  });

  const contactMap = {};
  allContacts.forEach((c) => {
    const key = `${c.firstName || ""}${c.lastName || ""}`
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase();
    contactMap[key] = c.id;
  });

  const userMap = {};
  allUsers.forEach((u) => {
    if (u.name)
      userMap[u.name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()] = u.id;
    if (u.username)
      userMap[u.username.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()] = u.id;
  });

  const ADMIN_ID = adminUser?.id || req.user.id;

  // --- Enum parsers ---
  const parseDealStage = (s) => {
    if (!s) return "RFQ";
    const v = String(s)
      .toUpperCase()
      .replace(/[\s\-]/g, "_");
    const map = {
      RFQ: "RFQ",
      VISITMEETING: "VISIT_MEETING",
      VISIT_MEETING: "VISIT_MEETING",
      PREVIEW: "PREVIEW",
      REGRETTED: "REGRETTED",
      TECHNICAL_PROPOSAL: "TECHNICAL_PROPOSAL",
      TECHNICALPROPOSAL: "TECHNICAL_PROPOSAL",
      COMMERCIAL_PROPOSAL: "COMMERCIAL_PROPOSAL",
      COMMERCIALPROPOSAL: "COMMERCIAL_PROPOSAL",
      REVIEW_FEEDBACK: "REVIEW_FEEDBACK",
      REVIEWFEEDBACK: "REVIEW_FEEDBACK",
      MOVED_TO_PURCHASE: "MOVED_TO_PURCHASE",
      MOVEDTOPURCHASE: "MOVED_TO_PURCHASE",
      NEGOTIATION: "NEGOTIATION",
      CLOSED_WON: "CLOSED_WON",
      CLOSEDWON: "CLOSED_WON",
      CLOSED_LOST: "CLOSED_LOST",
      CLOSEDLOST: "CLOSED_LOST",
      CLOSED_LOST_TO_COMPETITION: "CLOSED_LOST_TO_COMPETITION",
      CLOSEDLOSTTOCOMPETITION: "CLOSED_LOST_TO_COMPETITION",
    };
    const clean = v.replace(/_/g, "");
    return map[v] || map[clean] || "RFQ";
  };

    const parseDealStatus = (s) => {
    if (!s) return "IN_PROGRESS";
    const v = String(s).toUpperCase().replace(/[\s\-]/g, "_");
    const map = {
      INPROGRESS: "IN_PROGRESS",
      IN_PROGRESS: "IN_PROGRESS",
      PENDING_AT_CUSTOMER: "PENDING_AT_CUSTOMER",
      PENDINGATCUSTOMER: "PENDING_AT_CUSTOMER",
      REGRETTED: "REGRETTED",
      CLOSED: "CLOSED",
    };
    return map[v] || map[v.replace(/_/g, "")] || "IN_PROGRESS";
  };

  const parseDealType = (t) => {
    if (!t) return null;
    const v = String(t)
      .toUpperCase()
      .replace(/[\s\-_]/g, "");
    if (v.includes("EXISTING")) return "EXISTING_BUSINESS";
    if (v.includes("NEW")) return "NEW_BUSINESS";
    return null;
  };

  const parseProductGroup = (pg) => {
    if (!pg) return null;
    const v = String(pg)
      .toUpperCase()
      .replace(/[\s\-_]/g, "");
    if (v.includes("MTSPRO") || v === "MTSPRO") return "MTS_PRO";
    if (v.includes("MTSSTANDARD") || v.includes("STANDARD"))
      return "MTS_STANDARD";
    if (v.includes("FACTEYES")) return "FACTEYES";
    if (v.includes("ASSEMBLY")) return "MTS_ASSEMBLY";
    return null;
  };

  const parseWeightage = (w) => {
    if (!w) return null;
    const v = String(w)
      .toUpperCase()
      .replace(/[\s\-_]/g, "");
    if (v.includes("PROBABILITY")) return "PROBABILITY";
    if (v.includes("BALLPARK")) return "BALLPARK_OFFER";
    if (v.includes("BUDGETARY")) return "BUDGETARY_OFFER";
    if (v.includes("DETAILL1") || v === "L1") return "DETAIL_L1";
    if (v.includes("DETAILL2") || v === "L2") return "DETAIL_L2";
    if (v.includes("FIRM")) return "FIRM_AFTER_PRICE_FINALIZATION";
    if (v.includes("TECHNICAL")) return "TECHNICAL_ONLY";
    return null;
  };

  const parseLeadSource = (src) => {
    if (!src) return null;
    const s = String(src)
      .toUpperCase()
      .replace(/[\s_\-]/g, "");
    if (s.includes("WEB")) return "WEB";
    if (s.includes("EMPLOYEEREFERRAL") || s.includes("EMPLOYEEREF"))
      return "EMPLOYEE_REFERRAL";
    if (s.includes("EXTERNALREFERRAL") || s.includes("EXTERNAL"))
      return "PARTNER_REFERRAL";
    if (s.includes("PARTNER")) return "PARTNER_REFERRAL";
    if (s.includes("REFERRAL")) return "PARTNER_REFERRAL";
    if (s.includes("COLDCALL")) return "COLD_CALL";
    if (s.includes("TRADESHOW") || s.includes("TRADE")) return "TRADE_SHOW";
    if (s.includes("ADVERTISEMENT") || s.includes("ADVERT"))
      return "ADVERTISEMENT";
    if (s.includes("SOCIALMEDIA") || s.includes("SOCIAL"))
      return "SOCIAL_MEDIA";
    if (s.includes("EMAILCAMPAIGN") || s.includes("EMAIL"))
      return "EMAIL_CAMPAIGN";
    if (s.includes("PURCHASED")) return "PURCHASED_LIST";
    if (s.includes("PHONE")) return "PHONE_INQUIRY";
    if (s.includes("OTHER")) return "OTHER";
    return null;
  };

  const stats = {
    total: rows.length,
    created: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    // Normalize keys
    const r = {};
    Object.keys(row).forEach((key) => {
      r[key.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()] =
        typeof row[key] === "string" ? row[key].trim() : row[key];
    });

    const dealName = r["dealname"];
    if (!dealName) {
      stats.skipped++;
      continue;
    }

    const closingDateRaw = r["closingdate"];
    if (!closingDateRaw) {
      stats.skipped++;
      stats.errors.push(`Row ${i + 2}: Missing Closing Date`);
      continue;
    }

    // Parse closing date
    let closingDate;
    try {
      // Handle Excel serial date numbers
      if (typeof closingDateRaw === "number") {
        closingDate = new Date(
          Math.round((closingDateRaw - 25569) * 86400 * 1000),
        );
      } else {
        closingDate = new Date(closingDateRaw);
      }
      if (isNaN(closingDate.getTime())) throw new Error("Invalid date");
    } catch {
      stats.skipped++;
      stats.errors.push(
        `Row ${i + 2}: Invalid Closing Date "${closingDateRaw}"`,
      );
      continue;
    }

    // Resolve account
    const rawAccount = r["accountname"];
    const cleanAccount = rawAccount
      ? String(rawAccount)
          .replace(/[^a-zA-Z0-9]/g, "")
          .toLowerCase()
      : "";
    const accountId = accountMap[cleanAccount] || null;

    if (!accountId) {
      stats.skipped++;
      stats.errors.push(`Row ${i + 2}: Account not found "${rawAccount}"`);
      continue;
    }

    // Resolve contact (optional)
    const rawContact = r["contactname"];
    let contactId = null;
    if (rawContact) {
      const parts = String(rawContact).trim().split(/\s+/);
      const key = parts
        .join("")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();
      contactId = contactMap[key] || null;
    }

    // Resolve owner → fallback to ADMIN
    const rawOwner = r["dealowner"];
    let dealOwnerId = ADMIN_ID;
    if (rawOwner) {
      const cleanOwner = String(rawOwner)
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();
      dealOwnerId = userMap[cleanOwner] || ADMIN_ID;
    }

    const dealLogId = r["deallogid"]
      ? String(r["deallogid"]).trim()
      : `DL-${Date.now()}-${i}`;

    const payload = {
      dealName: String(dealName).trim(),
      dealLogId,
      amount:
        r["amount"] && !isNaN(parseFloat(r["amount"]))
          ? parseFloat(r["amount"])
          : null,
      expectedRevenue:
        r["expectedrevenue"] && !isNaN(parseFloat(r["expectedrevenue"]))
          ? parseFloat(r["expectedrevenue"])
          : null,
      closingDate,
      probability:
        r["probability"] && !isNaN(parseInt(r["probability"]))
          ? parseInt(r["probability"])
          : null,
      status: parseDealStatus(r["status"]),
      stage: parseDealStage(r["stage"]),
      type: parseDealType(r["type"]),
      nextStep: r["nextstep"] || null,
      leadSource: parseLeadSource(r["leadsource"]),
      campaignSource: r["campaignsource"] || null,
      description: r["description"] || null,
      productGroup: parseProductGroup(r["productgroup"]),
      weightage: parseWeightage(r["weightage"]),
      personInCharge: r["personincharge"] || null,
      dealOwnerId,
      accountId,
      contactId,
    };

    try {
      const existing = await prisma.deal.findUnique({ where: { dealLogId } });

      if (existing) {
        const {
          dealName,
          dealLogId: _l,
          dealOwnerId,
          accountId,
          contactId,
          createdById,
          ...updatePayload
        } = payload;
        // Remove nulls from update to avoid wiping existing data
        Object.keys(updatePayload).forEach((k) => {
          if (updatePayload[k] === null) delete updatePayload[k];
        });
        await prisma.deal.update({
          where: { id: existing.id },
          data: { ...updatePayload, modifiedById: req.user.id },
        });
        stats.updated++;
      } else {
        await prisma.deal.create({
          data: {
            ...payload,
            createdById: req.user.id,
            modifiedById: req.user.id,
          },
        });
        stats.created++;
      }
    } catch (err) {
      stats.skipped++;
      const msg = `Row ${i + 2} ("${dealName}"): ${err.message}`;
      stats.errors.push(msg);
      console.error("DEAL IMPORT ERROR:", msg);
    }
  }

  console.log("[DEAL IMPORT SUMMARY]", stats);
  res.json({ success: true, data: stats });
});
/* =========================================================
   PIPELINE STATS (FOR DASHBOARD CARDS)
========================================================= */
export const getPipelineStats = asyncHandler(async (req, res) => {
  const baseWhere = {
    ...(req.user.role !== "ADMIN" && {
      assignments: {
        some: { userId: req.user.id },
      },
    }),
  };

  const [won, negotiation, proposal] = await Promise.all([
    prisma.deal.count({
      where: { ...baseWhere, stage: "CLOSED_WON" },
    }),
    prisma.deal.count({
      where: { ...baseWhere, stage: "NEGOTIATION" },
    }),
    prisma.deal.count({
      where: { ...baseWhere, stage: "COMMERCIAL_PROPOSAL" },
    }),
  ]);

  res.json({
    success: true,
    data: {
      won,
      negotiation,
      proposal,
    },
  });
});

export const getDealByLogId = asyncHandler(async (req, res) => {
  const { logId } = req.params;

  const deal = await prisma.deal.findFirst({
    where: {
      dealLogId: {
        equals: logId,
        mode: "insensitive",
      },
    },

    include: {
      account: {
        select: {
          id: true,
          accountName: true,
        },
      },

      contact: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      quotations: {
        where: { isLatest: true },
        select: { id: true, quotationNo: true, status: true }
      }
    },
  });

  if (!deal) {
    throw new ApiError(404, "Deal not found");
  }

  const contacts = deal.contact ? [deal.contact] : [];

  res.json({
    success: true,

    deal,

    account: deal.account,

    contacts,
  });
});

// src\controllers\analytics.controller.js
import prisma from "../utils/prisma.js";
import { asyncHandler } from "../utils/ApiError.js";
import { getDealPriority } from "../services/analytics/dealPriority.service.js";

/* ============================================================
   DASHBOARD OVERVIEW (Clean Operational Version)
============================================================ */
export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const isRestricted = req.user.role !== "ADMIN";
  const accFilter = isRestricted
    ? {
        lifecycle: { not: "DEACTIVATED" },
        OR: [
          { assignments: { some: { userId: req.user.id } } },
          { keyAccountManagerId: req.user.id },
          { accountOwnerId: req.user.id },
        ],
      }
    : {
        lifecycle: { not: "DEACTIVATED" },
      };

  const conFilter = isRestricted
    ? {
        OR: [
          { assignments: { some: { userId: req.user.id } } },
          { account: { keyAccountManagerId: req.user.id } },
          { account: { accountOwnerId: req.user.id } },
          { contactOwnerId: req.user.id },
        ],
      }
    : {};

  const dealFilter = isRestricted
    ? {
        OR: [
          { assignments: { some: { userId: req.user.id } } },
          { account: { keyAccountManagerId: req.user.id } },
          { account: { accountOwnerId: req.user.id } },
          { dealOwnerId: req.user.id },
        ],
      }
    : {};

  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [
    totalAccounts,
    totalContacts,
    totalDeals,
    openDeals,
    wonDeals,
    lostDeals,
    thisMonthDeals,
  ] = await Promise.all([
    prisma.account.count({ where: accFilter }),
    prisma.contact.count({ where: conFilter }),
    prisma.deal.count({ where: dealFilter }),

    prisma.deal.count({
      where: {
        ...dealFilter,
        stage: {
          notIn: [
            "CLOSED_WON",
            "CLOSED_LOST",
            "CLOSED_LOST_TO_COMPETITION",
            "REGRETTED",
          ],
        },
      },
    }),

    prisma.deal.count({
      where: { ...dealFilter, stage: "CLOSED_WON" },
    }),

    prisma.deal.count({
      where: {
        ...dealFilter,
        stage: {
          in: ["CLOSED_LOST", "CLOSED_LOST_TO_COMPETITION", "REGRETTED"],
        },
      },
    }),

    prisma.deal.count({
      where: {
        ...dealFilter,
        createdAt: { gte: startOfMonth, lte: endOfMonth },
      },
    }),
  ]);

  const closedDeals = wonDeals + lostDeals;

  const winRate =
    closedDeals > 0 ? Math.round((wonDeals / closedDeals) * 100) : 0;

  const dealsClosingThisMonth = await prisma.deal.findMany({
    where: {
      ...dealFilter,
      closingDate: { gte: startOfMonth, lte: endOfMonth },
      stage: {
        notIn: [
          "CLOSED_WON",
          "CLOSED_LOST",
          "CLOSED_LOST_TO_COMPETITION",
          "REGRETTED",
        ],
      },
    },
    include: {
      account: { select: { id: true, accountName: true } },
      owner: { select: { id: true, name: true } },
    },
    orderBy: { closingDate: "asc" },
    take: 10,
  });

  res.json({
    success: true,
    data: {
      summary: {
        totalAccounts,
        totalContacts,
        totalDeals,
        openDeals,
        closedDeals,
        thisMonthDeals,
      },
      performance: {
        wonDeals,
        lostDeals,
        winRate,
      },
      dealsClosingThisMonth,
    },
  });
});

/* ============================================================
   DEALS BY STAGE (Count Only)
============================================================ */
export const getDealsByStage = asyncHandler(async (req, res) => {
  const isRestricted = req.user.role !== "ADMIN";
  const dealFilter = isRestricted
    ? {
        OR: [
          { assignments: { some: { userId: req.user.id } } },
          { account: { keyAccountManagerId: req.user.id } },
          { account: { accountOwnerId: req.user.id } },
          { dealOwnerId: req.user.id },
        ],
      }
    : {};

  const stages = await prisma.deal.groupBy({
    by: ["stage"],
    where: dealFilter,
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  res.json({
    success: true,
    data: stages.map((s) => ({
      stage: s.stage,
      count: s._count.id,
    })),
  });
});

/* ============================================================
   MONTHLY TREND (Count-Based Only)
============================================================ */
export const getMonthlyTrend = asyncHandler(async (req, res) => {
  const isRestricted = req.user.role !== "ADMIN";
  const dealFilter = isRestricted
    ? {
        OR: [
          { assignments: { some: { userId: req.user.id } } },
          { account: { keyAccountManagerId: req.user.id } },
          { account: { accountOwnerId: req.user.id } },
          { dealOwnerId: req.user.id },
        ],
      }
    : {};

  const months = parseInt(req.query.months) || 6;
  const today = new Date();
  const data = [];

  for (let i = months - 1; i >= 0; i--) {
    const startDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);

    const [wonCount, newDeals, lostCount] = await Promise.all([
      prisma.deal.count({
        where: {
          ...dealFilter,
          stage: "CLOSED_WON",
          updatedAt: { gte: startDate, lte: endDate },
        },
      }),
      prisma.deal.count({
        where: {
          ...dealFilter,
          createdAt: { gte: startDate, lte: endDate },
        },
      }),
      prisma.deal.count({
        where: {
          ...dealFilter,
          stage: { in: ["CLOSED_LOST", "CLOSED_LOST_TO_COMPETITION"] },
          updatedAt: { gte: startDate, lte: endDate },
        },
      }),
    ]);

    data.push({
      month: startDate.toLocaleDateString("en-IN", {
        month: "short",
        year: "2-digit",
      }),
      wonCount,
      newDeals,
      lostCount,
    });
  }

  res.json({ success: true, data });
});

/* ============================================================
   TOP PERFORMERS (No Revenue, Only Deal Performance)
============================================================ */
export const getTopPerformers = asyncHandler(async (req, res) => {
  const isRestricted = req.user.role !== "ADMIN";
  const dealFilter = isRestricted
    ? {
        OR: [
          { assignments: { some: { userId: req.user.id } } },
          { account: { keyAccountManagerId: req.user.id } },
          { account: { accountOwnerId: req.user.id } },
          { dealOwnerId: req.user.id },
        ],
      }
    : {};

  const limit = parseInt(req.query.limit) || 5;

  const performers = await prisma.deal.groupBy({
    by: ["dealOwnerId"],
    where: { stage: "CLOSED_WON", ...dealFilter },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: limit,
  });

  const performersWithDetails = await Promise.all(
    performers.map(async (p) => {
      const user = await prisma.user.findUnique({
        where: { id: p.dealOwnerId },
        select: { id: true, name: true, email: true, avatar: true },
      });

      const totalDeals = await prisma.deal.count({
        where: { dealOwnerId: p.dealOwnerId },
      });

      const lostDeals = await prisma.deal.count({
        where: {
          dealOwnerId: p.dealOwnerId,
          stage: { in: ["CLOSED_LOST", "CLOSED_LOST_TO_COMPETITION"] },
        },
      });

      const closedDeals = p._count.id + lostDeals;

      const winRate =
        closedDeals > 0 ? Math.round((p._count.id / closedDeals) * 100) : 0;

      return {
        user,
        wonDeals: p._count.id,
        totalDeals,
        winRate,
      };
    }),
  );

  res.json({ success: true, data: performersWithDetails });
});

/* ============================================================
   DEALS BY LEAD SOURCE (Count-Based)
============================================================ */
export const getDealsBySource = asyncHandler(async (req, res) => {
  const isSalesRep = req.user.role === "SALES_REP";
  const dealFilter = isSalesRep ? { dealOwnerId: req.user.id } : {};

  const sources = await prisma.deal.groupBy({
    by: ["leadSource"],
    where: dealFilter,
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  const wonBySource = await prisma.deal.groupBy({
    by: ["leadSource"],
    where: { stage: "CLOSED_WON", ...dealFilter },
    _count: { id: true },
  });

  const data = sources.map((s) => {
    const won = wonBySource.find((w) => w.leadSource === s.leadSource);

    const winRate =
      s._count.id > 0 && won
        ? Math.round((won._count.id / s._count.id) * 100)
        : 0;

    return {
      source: s.leadSource || "Unknown",
      totalDeals: s._count.id,
      wonDeals: won?._count.id || 0,
      winRate,
    };
  });

  res.json({ success: true, data });
});

/* ============================================================
   RECENT ACTIVITIES
============================================================ */
export const getRecentActivities = asyncHandler(async (req, res) => {
  const isRestricted = req.user.role !== "ADMIN";
  const accFilter = isRestricted
    ? {
        OR: [
          { assignments: { some: { userId: req.user.id } } },
          { keyAccountManagerId: req.user.id },
          { accountOwnerId: req.user.id },
        ],
      }
    : {};
  const conFilter = isRestricted
    ? {
        OR: [
          { assignments: { some: { userId: req.user.id } } },
          { account: { keyAccountManagerId: req.user.id } },
          { account: { accountOwnerId: req.user.id } },
          { contactOwnerId: req.user.id },
        ],
      }
    : {};
  const dealFilter = isRestricted
    ? {
        OR: [
          { assignments: { some: { userId: req.user.id } } },
          { account: { keyAccountManagerId: req.user.id } },
          { account: { accountOwnerId: req.user.id } },
          { dealOwnerId: req.user.id },
        ],
      }
    : {};

  const limit = parseInt(req.query.limit) || 10;

  const [recentDeals, recentContacts, recentAccounts] = await Promise.all([
    prisma.deal.findMany({
      where: dealFilter,
      orderBy: { updatedAt: "desc" },
      take: limit,
      include: {
        account: { select: { id: true, accountName: true } },
        owner: { select: { id: true, name: true } },
      },
    }),
    prisma.contact.findMany({
      where: conFilter,
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        account: { select: { id: true, accountName: true } },
      },
    }),
    prisma.account.findMany({
      where: accFilter,
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        owner: { select: { id: true, name: true } },
      },
    }),
  ]);

  res.json({
    success: true,
    data: {
      recentDeals,
      recentContacts,
      recentAccounts,
    },
  });
});

// NEW ONE ANIRUDDHA
// @desc    Lead Source Cohort Analytics
// @route   GET /api/analytics/cohort-lead-source
export const getLeadSourceCohort = asyncHandler(async (req, res) => {
  const deals = await prisma.deal.findMany({
    include: {
      account: {
        select: {
          id: true,
          accountName: true,
        },
      },
      owner: {
        select: {
          name: true,
        },
      },
    },
  });

  const cohortMap = {};

  deals.forEach((deal) => {
    const source = deal.leadSource || "Unknown";

    if (!cohortMap[source]) {
      cohortMap[source] = {
        source,
        totalDeals: 0,
        wonDeals: 0,
        totalAmount: 0,
        totalCloseDays: 0,
        closedCount: 0,
        accounts: new Set(),
        deals: [], // 🔥 ADD DEAL BREAKDOWN
      };
    }

    const cohort = cohortMap[source];

    cohort.totalDeals++;
    cohort.totalAmount += deal.amount || 0;
    cohort.accounts.add(deal.accountId);

    // 🔥 Push deal details for drilldown
    cohort.deals.push({
      dealId: deal.id,
      dealName: deal.dealName,
      accountName: deal.account?.accountName || "Unknown",
      amount: deal.amount || 0,
      stage: deal.stage,
      owner: deal.owner?.name || "N/A",
      createdAt: deal.createdAt,
    });

    if (deal.stage === "CLOSED_WON") {
      cohort.wonDeals++;
      cohort.closedCount++;

      const closeDays = Math.floor(
        (new Date(deal.updatedAt) - new Date(deal.createdAt)) /
          (1000 * 60 * 60 * 24),
      );

      cohort.totalCloseDays += closeDays;
    }
  });

  const result = Object.values(cohortMap).map((c) => {
    const winRate =
      c.totalDeals > 0 ? Math.round((c.wonDeals / c.totalDeals) * 100) : 0;

    const avgDealSize =
      c.totalDeals > 0 ? Math.round(c.totalAmount / c.totalDeals) : 0;

    const avgCloseDays =
      c.closedCount > 0 ? Math.round(c.totalCloseDays / c.closedCount) : 0;

    const repeatFactor =
      c.accounts.size > 0 ? c.totalDeals / c.accounts.size : 1;

    const ltv = Math.round(avgDealSize * repeatFactor);

    return {
      source: c.source,
      totalDeals: c.totalDeals,
      winRate,
      avgDealSize,
      avgCloseDays,
      ltv,
      deals: c.deals, // 🔥 SEND DEAL DETAILS
    };
  });

  res.json({ success: true, data: result });
});
// @desc    Sales Funnel Conversion
// @route   GET /api/analytics/funnel
export const getFunnelAnalytics = asyncHandler(async (req, res) => {
  const stages = await prisma.deal.groupBy({
    by: ["stage"],
    _count: { id: true },
    orderBy: { _count: { id: "desc" } }, // keeps 2 → 1 order
  });

  const totalDeals = stages.reduce((sum, s) => sum + s._count.id, 0);

  const funnel = stages.map((s) => ({
    stage: s.stage,
    count: s._count.id,
    conversion:
      totalDeals > 0
        ? Number(((s._count.id / totalDeals) * 100).toFixed(1)) // ✅ keeps decimal
        : 0,
  }));

  res.json({
    success: true,
    data: funnel,
  });
});

// @desc    Risk Distribution
// @route   GET /api/analytics/risk-distribution
// ✅ Risk Distribution (DYNAMIC, CONSISTENT)
// @route GET /api/analytics/risk-distribution
export const getRiskDistribution = asyncHandler(async (req, res) => {
  const now = new Date();

  const ACTIVE_STAGES = [
    "RFQ",
    "VISIT_MEETING",
    "PREVIEW",
    "TECHNICAL_PROPOSAL",
    "COMMERCIAL_PROPOSAL",
    "REVIEW_FEEDBACK",
    "MOVED_TO_PURCHASE",
    "NEGOTIATION",
  ];

  const deals = await prisma.deal.findMany({
    where: { stage: { in: ACTIVE_STAGES } },
    include: {
      stageHistory: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const counters = { LOW: 0, MEDIUM: 0, HIGH: 0 };

  deals.forEach((deal) => {
    const enteredAt =
      deal.stageHistory[0]?.createdAt || deal.updatedAt || deal.createdAt;

    const daysInStage = Math.max(
      1,
      Math.floor((now - enteredAt) / (1000 * 60 * 60 * 24)),
    );

    if (daysInStage >= 30) counters.HIGH++;
    else if (daysInStage >= 8) counters.MEDIUM++;
    else counters.LOW++;
  });

  res.json({
    success: true,
    data: [
      { riskLevel: "LOW", _count: { id: counters.LOW } },
      { riskLevel: "MEDIUM", _count: { id: counters.MEDIUM } },
      { riskLevel: "HIGH", _count: { id: counters.HIGH } },
    ],
  });
});

// @desc    Stage Aging Analytics
// @route   GET /api/analytics/stage-aging
// @desc    Stage Aging Analytics
// @route   GET /api/analytics/stage-aging
export const getStageAgingAnalytics = asyncHandler(async (req, res) => {
  const now = new Date();

  const ACTIVE_STAGES = [
    "RFQ",
    "VISIT_MEETING",
    "PREVIEW",
    "TECHNICAL_PROPOSAL",
    "COMMERCIAL_PROPOSAL",
    "REVIEW_FEEDBACK",
    "MOVED_TO_PURCHASE",
    "NEGOTIATION",
  ];

  const deals = await prisma.deal.findMany({
    where: {
      stage: { in: ACTIVE_STAGES },
    },
    include: {
      owner: { select: { name: true } },
      stageHistory: {
        where: { stage: { in: ACTIVE_STAGES } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const stageMap = {};
  const dealAgingList = [];

  deals.forEach((deal) => {
    const stage = deal.stage;

    const lastStageEntry = deal.stageHistory.find((h) => h.stage === stage);

    const enteredAt = lastStageEntry?.createdAt || deal.createdAt;

    const daysInStage = Math.max(
      1,
      Math.floor((now - enteredAt) / (1000 * 60 * 60 * 24)),
    );

    // Track per-stage
    if (!stageMap[stage]) {
      stageMap[stage] = {
        stage,
        deals: 0,
        totalDays: 0,
        stuckDeals: 0,
      };
    }

    stageMap[stage].deals += 1;
    stageMap[stage].totalDays += daysInStage;
    if (daysInStage > 14) stageMap[stage].stuckDeals += 1;

    // Track individual deal aging
    dealAgingList.push({
      dealId: deal.id,
      dealName: deal.dealName,
      stage,
      daysInStage,
      owner: deal.owner?.name || "N/A",
    });
  });

  const stages = Object.values(stageMap).map((s) => ({
    stage: s.stage,
    deals: s.deals,
    avgDays: Math.round(s.totalDays / s.deals),
    stuckDeals: s.stuckDeals,
  }));

  // 🔥 PRIMARY BOTTLENECK
  const bottleneckStage = stages.reduce(
    (max, s) => (s.avgDays > max.avgDays ? s : max),
    stages[0],
  );

  // 🔥 TOP STUCK DEALS (from bottleneck stage only)
  const topStuckDeals = dealAgingList
    .filter((d) => d.stage === bottleneckStage.stage)
    .sort((a, b) => b.daysInStage - a.daysInStage)
    .slice(0, 5);

  res.json({
    success: true,
    data: {
      stages,
      bottleneck: bottleneckStage,
      topStuckDeals,
    },
  });
});

// @desc    Pipeline Risk – Deal level drilldown
// @route   GET /api/analytics/risk-deals?risk=LOW|MEDIUM|HIGH
export const getRiskDeals = asyncHandler(async (req, res) => {
  const risk = (req.query.risk || "").toUpperCase();
  const now = new Date();

  const ACTIVE_STAGES = [
    "RFQ",
    "VISIT_MEETING",
    "PREVIEW",
    "TECHNICAL_PROPOSAL",
    "COMMERCIAL_PROPOSAL",
    "REVIEW_FEEDBACK",
    "MOVED_TO_PURCHASE",
    "NEGOTIATION",
  ];

  if (!["LOW", "MEDIUM", "HIGH"].includes(risk)) {
    return res.status(400).json({
      success: false,
      message: "Invalid risk level",
    });
  }

  const deals = await prisma.deal.findMany({
    where: {
      stage: { in: ACTIVE_STAGES },
    },
    include: {
      owner: { select: { name: true } },
      account: { select: { accountName: true } },
      stageHistory: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const result = [];

  deals.forEach((deal) => {
    const enteredAt =
      deal.stageHistory[0]?.createdAt || deal.updatedAt || deal.createdAt;

    const daysInStage = Math.max(
      1,
      Math.floor((now - enteredAt) / (1000 * 60 * 60 * 24)),
    );

    let dealRisk = "LOW";
    if (daysInStage >= 30) dealRisk = "HIGH";
    else if (daysInStage >= 8) dealRisk = "MEDIUM";

    if (dealRisk === risk) {
      result.push({
        dealId: deal.id,
        dealName: deal.dealName,
        accountName: deal.account?.accountName || "Unknown",
        stage: deal.stage,
        daysInStage,
        closingDate: deal.closingDate,
        owner: deal.owner?.name || "N/A",
        lastStageChangeAt: enteredAt,
      });
    }
  });

  res.json({
    success: true,
    data: result.sort((a, b) => b.daysInStage - a.daysInStage),
  });
});

// @desc    Pipeline Velocity – Stage drilldown (deal list)
// @route   GET /api/analytics/stage-deals?stage=STAGE_NAME
export const getStageDeals = asyncHandler(async (req, res) => {
  const stage = req.query.stage;
  const now = new Date();

  if (!stage) {
    return res.status(400).json({
      success: false,
      message: "Stage is required",
    });
  }

  const deals = await prisma.deal.findMany({
    where: { stage },
    include: {
      owner: { select: { name: true } },
      account: { select: { accountName: true } },
      stageHistory: {
        where: { stage },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!deals.length) {
    return res.json({
      success: true,
      data: [],
    });
  }

  // 🔥 calculate avg days for this stage
  const avgDays =
    deals.reduce((sum, deal) => {
      const enteredAt =
        deal.stageHistory[0]?.createdAt || deal.updatedAt || deal.createdAt;

      return (
        sum + Math.max(1, Math.floor((now - enteredAt) / (1000 * 60 * 60 * 24)))
      );
    }, 0) / deals.length;

  // 🔥 only return deals >= avgDays
  const data = deals
    .map((deal) => {
      const enteredAt =
        deal.stageHistory[0]?.createdAt || deal.updatedAt || deal.createdAt;

      const daysInStage = Math.max(
        1,
        Math.floor((now - enteredAt) / (1000 * 60 * 60 * 24)),
      );

      return {
        dealId: deal.id,
        dealName: deal.dealName,
        accountName: deal.account?.accountName || "Unknown",
        owner: deal.owner?.name || "N/A",
        stage,
        daysInStage,
        closingDate: deal.closingDate,
        enteredStageAt: enteredAt,
      };
    })
    .filter((d) => d.daysInStage >= Math.round(avgDays))
    .sort((a, b) => b.daysInStage - a.daysInStage);

  res.json({
    success: true,
    data: data.sort((a, b) => b.daysInStage - a.daysInStage),
  });
});

/* =====================================
   KPI METRICS
===================================== */

export const getKpiMetrics = asyncHandler(async (req, res) => {
  /* -----------------------------
     CLOSED DEAL COUNTS
  ----------------------------- */

  const wonDeals = await prisma.deal.count({
    where: { stage: "CLOSED_WON" },
  });

  const lostDeals = await prisma.deal.count({
    where: {
      stage: {
        in: ["CLOSED_LOST", "CLOSED_LOST_TO_COMPETITION", "REGRETTED"],
      },
    },
  });

  const closedDeals = wonDeals + lostDeals;

  /* -----------------------------
     1️⃣ CONVERSION RATE
  ----------------------------- */

  const conversionRate =
    closedDeals > 0 ? Math.round((wonDeals / closedDeals) * 100) : 0;

  /* -----------------------------
     2️⃣ REVENUE WON
  ----------------------------- */

  const revenueWonAgg = await prisma.deal.aggregate({
    _sum: { amount: true },
    where: { stage: "CLOSED_WON" },
  });

  const revenueWon = Math.round(revenueWonAgg._sum.amount || 0);

  /* -----------------------------
     3️⃣ REVENUE REALIZATION RATE
  ----------------------------- */

  const revenueLostAgg = await prisma.deal.aggregate({
    _sum: { amount: true },
    where: {
      stage: {
        in: ["CLOSED_LOST", "CLOSED_LOST_TO_COMPETITION", "REGRETTED"],
      },
    },
  });

  const revenueLost = revenueLostAgg._sum.amount || 0;

  const revenueRealizationRate =
    revenueWon + revenueLost > 0
      ? Number(((revenueWon / (revenueWon + revenueLost)) * 100).toFixed(2))
      : 0;

  /* -----------------------------
     4️⃣ OVERDUE DEALS %
  ----------------------------- */

  const activeDealsWhere = {
    stage: {
      notIn: [
        "CLOSED_WON",
        "CLOSED_LOST",
        "CLOSED_LOST_TO_COMPETITION",
        "REGRETTED",
      ],
    },
  };

  const totalActiveDeals = await prisma.deal.count({
    where: activeDealsWhere,
  });

  const today = new Date();

  const overdueDeals = await prisma.deal.count({
    where: {
      ...activeDealsWhere,
      closingDate: {
        lt: today,
      },
    },
  });

  const overdueDealsPercent =
    totalActiveDeals > 0
      ? Number(((overdueDeals / totalActiveDeals) * 100).toFixed(1))
      : 0;

  /* -----------------------------
     RESPONSE
  ----------------------------- */

  res.json({
    success: true,
    data: {
      conversionRate,
      revenueWon,
      overdueDealsPercent, // ✅ NEW KPI
      revenueRealizationRate,

      calculation: {
        wonDeals,
        lostDeals,
        closedDeals,
        revenueWon,
        revenueLost,

        // ✅ NEW
        totalActiveDeals,
        overdueDeals,
      },
    },
  });
});

/* ============================================================
   DEAL MOMENTUM ENGINE
   @route GET /api/analytics/deal-momentum
============================================================ */

export const getDealMomentumAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  const deals = await getDealPriority(userId);

  res.json({
    success: true,
    count: deals.length,
    data: deals,
  });
});

/* ============================================================
   OVERDUE DEALS (Drilldown)
   @route GET /api/analytics/overdue-deals
============================================================ */

export const getOverdueDeals = asyncHandler(async (req, res) => {
  const today = new Date();

  const ACTIVE_STAGES = [
    "RFQ",
    "VISIT_MEETING",
    "PREVIEW",
    "TECHNICAL_PROPOSAL",
    "COMMERCIAL_PROPOSAL",
    "REVIEW_FEEDBACK",
    "MOVED_TO_PURCHASE",
    "NEGOTIATION",
  ];

  const deals = await prisma.deal.findMany({
    where: {
      stage: { in: ACTIVE_STAGES },
      closingDate: { lt: today }, // ✅ overdue condition
    },
    include: {
      owner: { select: { name: true } },
      account: { select: { accountName: true } },
      stageHistory: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const result = deals.map((deal) => {
    const enteredAt =
      deal.stageHistory[0]?.createdAt || deal.updatedAt || deal.createdAt;

    const daysOverdue = Math.max(
      1,
      Math.floor((today - new Date(deal.closingDate)) / (1000 * 60 * 60 * 24)),
    );

    return {
      dealId: deal.id,
      dealName: deal.dealName,
      accountName: deal.account?.accountName || "Unknown",
      stage: deal.stage,
      owner: deal.owner?.name || "N/A",
      closingDate: deal.closingDate,
      delayDays: daysOverdue,
      enteredStageAt: enteredAt,
    };
  });

  res.json({
    success: true,
    data: result.sort((a, b) => b.daysOverdue - a.daysOverdue), // ✅ sorted
  });
});

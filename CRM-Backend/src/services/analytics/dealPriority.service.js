// CRM-Backend/src/services/analytics/dealPriority.service.js

import prisma from "../../utils/prisma.js";

/*
Deal Momentum Factors

1️⃣ Deal Value (0–30)
2️⃣ Stage Importance (0–20)
3️⃣ Days Stuck In Stage (0–20)
4️⃣ Closing Date Urgency (0–20)
5️⃣ Risk Level Adjustment (-10 → +10)

Final Momentum Score ≈ 0–100
*/

export async function getDealPriority(userId, isSalesRep = false) {
  const whereFilter = {
    stage: {
      notIn: [
        "CLOSED_WON",
        "CLOSED_LOST",
        "CLOSED_LOST_TO_COMPETITION",
        "REGRETTED",
      ],
    },
  };

  if (isSalesRep) {
    whereFilter.dealOwnerId = userId;
  }

  const deals = await prisma.deal.findMany({
    where: whereFilter,
    include: {
      account: true,
      risk: true,
      stageHistory: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  const today = new Date();

  const scoredDeals = deals.map((deal) => {
    /* ---------------- VALUE SCORE ---------------- */

    let valueScore = 0;

    if (deal.amount) {
      valueScore = Math.min(deal.amount / 100000, 30);
    }

    /* ---------------- STAGE SCORE ---------------- */

    const stageWeights = {
      RFQ: 5,
      VISIT_MEETING: 7,
      PREVIEW: 9,
      TECHNICAL_PROPOSAL: 12,
      COMMERCIAL_PROPOSAL: 15,
      REVIEW_FEEDBACK: 16,
      MOVED_TO_PURCHASE: 17,
      NEGOTIATION: 20,
    };

    const stageScore = stageWeights[deal.stage] || 5;

    /* ---------------- STAGE AGING ---------------- */

    let agingScore = 0;

    if (deal.stageHistory.length) {
      const entered = new Date(deal.stageHistory[0].createdAt);

      const daysInStage = Math.floor((today - entered) / (1000 * 60 * 60 * 24));

      agingScore = Math.min(daysInStage * 2, 20);
    }

    /* ---------------- CLOSING URGENCY ---------------- */

    let closingScore = 0;

    if (deal.closingDate) {
      const daysToClose = Math.floor(
        (new Date(deal.closingDate) - today) / (1000 * 60 * 60 * 24),
      );

      if (daysToClose <= 7) closingScore = 20;
      else if (daysToClose <= 14) closingScore = 15;
      else if (daysToClose <= 30) closingScore = 10;
      else closingScore = 5;
    }

    /* ---------------- RISK ADJUSTMENT ---------------- */

    let riskAdjustment = 0;

    if (deal.risk) {
      const riskMap = {
        LOW: 5,
        MEDIUM: 0,
        HIGH: -5,
        CRITICAL: -10,
      };

      riskAdjustment = riskMap[deal.risk.riskLevel] || 0;
    }

    /* ---------------- FINAL MOMENTUM SCORE ---------------- */

    const momentumScore =
      valueScore + stageScore + agingScore + closingScore + riskAdjustment;

    /* ---------------- MOMENTUM LEVEL ---------------- */

    let momentumLevel = "LOW";

    if (momentumScore >= 60) momentumLevel = "HIGH";
    else if (momentumScore >= 35) momentumLevel = "MEDIUM";

    /* ---------------- REASON ---------------- */

    let reason = "Deal gaining momentum";

    if (closingScore >= 15) reason = "Closing date approaching";

    if (agingScore >= 15) reason = "Deal stuck in stage";

    if (valueScore >= 20) reason = "High value opportunity";

    if (deal.risk?.riskLevel === "HIGH")
      reason = "High risk deal requiring attention";

    return {
      dealId: deal.id,
      dealName: deal.dealName,
      account: deal.account?.accountName,
      stage: deal.stage,

      momentumScore: Math.round(momentumScore),
      momentumLevel,
      reason,

      breakdown: {
        valueScore: Math.round(valueScore),
        stageScore,
        agingScore,
        closingScore,
        riskAdjustment,
      },

      // ✅ HUMAN EXPLANATION (IMPORTANT)
      explanation: {
        value:
          valueScore > 0
            ? `Deal value contributed ${Math.round(valueScore)} points based on amount ₹${deal.amount}`
            : "No deal value added",

        stage: `Current stage "${deal.stage.replace(
          /_/g,
          " ",
        )}" contributed ${stageScore} points`,

        aging:
          agingScore > 0
            ? `Deal has been in this stage for some time, adding ${agingScore} points`
            : "Recently moved to this stage",

        closing:
          closingScore > 0
            ? `Closing date urgency added ${closingScore} points`
            : "No urgency from closing date",

        risk:
          riskAdjustment !== 0
            ? `Risk level adjusted score by ${riskAdjustment} points`
            : "No risk impact",
      },
    };
  });

  /* ---------------- SORT BY MOMENTUM ---------------- */

  return scoredDeals.sort((a, b) => b.momentumScore - a.momentumScore);
}

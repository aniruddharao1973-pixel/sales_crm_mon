// src/jobs/rfqMonitor.job.js
import prisma from "../utils/prisma.js";
import dayjs from "dayjs";
import { sendMail } from "../utils/mailer.js"; // we’ll create this next

export const runRFQMonitor = async () => {
  try {
    console.log("🔍 Running RFQ Monitor Job...");

    const threeDaysAgo = dayjs().subtract(3, "day").toDate();

    // 1. Fetch stuck RFQ deals
    const deals = await prisma.deal.findMany({
      where: {
        stage: "RFQ",
        stageUpdatedAt: {
          lte: threeDaysAgo,
        },
        rfqAlertSentAt: null,
      },
      include: {
        owner: true,
      },
    });

    console.log(`⚠️ Found ${deals.length} stuck RFQ deals`);

    for (const deal of deals) {
      const personName = deal.personInCharge || deal.owner?.name || "Team";

      // 2. Email
      const subject = `⚠️ Deal Stuck in RFQ - ${deal.dealName}`;

      const body = `
        <p>Hi ${personName},</p>

        <p>
          The deal <b>${deal.dealName}</b> has been in <b>RFQ stage</b>
          for more than 3 days.
        </p>

        <p>Please review and take necessary action.</p>

        <br/>
        <p>Regards,<br/>FactEyes CRM</p>
      `;

      await sendMail({
        to: "aniruddharao16@gmail.com", // temp
        subject,
        html: body,
      });

      // 3. Notification
      await prisma.notification.create({
        data: {
          title: "RFQ Deal Alert",
          message: `Deal "${deal.dealName}" is stuck in RFQ. Assigned to ${personName}.`,
          type: "RFQ_ALERT",
          recordId: deal.id,
          userId: deal.dealOwnerId,
        },
      });

      // 4. Mark alert sent
      await prisma.deal.update({
        where: { id: deal.id },
        data: {
          rfqAlertSentAt: new Date(),
        },
      });
    }
  } catch (error) {
    console.error("❌ RFQ Monitor Error:", error);
  }
};

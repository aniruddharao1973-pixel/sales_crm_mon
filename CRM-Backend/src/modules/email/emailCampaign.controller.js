// src/modules/email/emailCampaign.controller.js

import prisma from "../../utils/prisma.js";
import { sendBulkEmailCampaign } from "./emailCampaign.service.js";


/*
=====================================================
SEND BULK EMAIL CAMPAIGN
=====================================================
*/

export async function sendCampaign(req, res) {
  try {
    const {
      templateId,
      recipients,
      contactIds,
      subject,
      body,
      campaignName,
      bcc, // ✅ NEW
    } = req.body;

    const userId = req.user.id;

    // ✅ Normalize BCC (array OR comma string)
    const normalizeEmails = (field) => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      return field
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);
    };

    const normalizedBcc = normalizeEmails(bcc);

    if (normalizedBcc.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Too many BCC recipients (max 500)",
      });
    }

    /*
    =====================================================
    RESOLVE RECIPIENTS
    (supports recipients[] OR contactIds[])
    =====================================================
    */

    let finalRecipients = recipients;

    if (!finalRecipients && contactIds?.length) {
      const contacts = await prisma.contact.findMany({
        where: {
          id: { in: contactIds },
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      });

      finalRecipients = contacts
        .filter((c) => c.email)
        .map((c) => ({
          id: c.id, // ✅ IMPORTANT
          email: c.email,
          firstName: c.firstName,
          lastName: c.lastName,
          name: `${c.firstName || ""} ${c.lastName || ""}`.trim(),
        }));
    }

    if (!finalRecipients || finalRecipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No recipients provided",
      });
    }

    /*
    =====================================================
    LOAD TEMPLATE (OPTIONAL)
    =====================================================
    */

    let template = null;

    if (templateId) {
      template = await prisma.emailTemplate.findUnique({
        where: { id: templateId },
      });

      if (!template) {
        return res.status(404).json({
          success: false,
          message: "Template not found",
        });
      }
    }

    /*
    =====================================================
    VALIDATE SUBJECT + BODY
    =====================================================
    */

    const finalSubject = subject || template?.subject;
    const finalBody = body || template?.body;

    if (!finalSubject || !finalBody) {
      return res.status(400).json({
        success: false,
        message: "Email subject and body are required",
      });
    }

    /*
    =====================================================
    CREATE CAMPAIGN RECORD
    =====================================================
    */

    const campaign = await prisma.emailCampaign.create({
      data: {
        name: campaignName || template?.name || "Email Campaign",
        subject: finalSubject,
        templateId: template ? template.id : null,
        createdById: userId,
        totalRecipients: finalRecipients.length,
        sentCount: 0,
        failedCount: 0,
      },
    });

    /*
    =====================================================
    SEND BULK EMAILS
    =====================================================
    */

    const results = await sendBulkEmailCampaign({
      template,
      recipients: finalRecipients,
      userId,
      campaignId: campaign.id,
      subject: finalSubject,
      body: finalBody,
      bcc: normalizedBcc, // ✅ NEW
    });

    /*
    =====================================================
    UPDATE CAMPAIGN STATS
    =====================================================
    */

    await prisma.emailCampaign.update({
      where: { id: campaign.id },
      data: {
        sentCount: results.sent || 0,
        failedCount: results.failed || 0,
      },
    });

    res.json({
      success: true,
      message: "Campaign started",
      campaignId: campaign.id,
      data: results,
    });
  } catch (error) {
    console.error("❌ Campaign send error:", error);

    res.status(500).json({
      success: false,
      message: "Campaign failed",
    });
  }
}

/*
=====================================================
GET CAMPAIGN STATUS (FOR PROGRESS BAR)
=====================================================
*/

export const getCampaignStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await prisma.emailCampaign.findUnique({
      where: { id },
      select: {
        sentCount: true,
        failedCount: true,
        totalRecipients: true,
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    const completed = campaign.sentCount + campaign.failedCount;

    const progress = Math.round((completed / campaign.totalRecipients) * 100);

    res.json({
      success: true,
      sent: campaign.sentCount,
      failed: campaign.failedCount,
      total: campaign.totalRecipients,
      progress,
    });
  } catch (error) {
    console.error("Campaign status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch campaign status",
    });
  }
};

/*
=====================================================
GET CAMPAIGNS (Campaign Inbox)
=====================================================
*/

export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await prisma.emailCampaign.findMany({
      orderBy: { createdAt: "desc" },

      include: {
        template: true,

        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: campaigns,
    });
  } catch (error) {
    console.error("Fetch campaigns error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch campaigns",
    });
  }
};
/*
=====================================================
DELETE CAMPAIGN
=====================================================
*/

export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await prisma.emailCampaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    /*
    =========================================
    DELETE EMAIL LOGS FIRST (FK constraint)
    =========================================
    */

    await prisma.emailLog.deleteMany({
      where: { campaignId: id },
    });

    /*
    =========================================
    DELETE CAMPAIGN
    =========================================
    */

    await prisma.emailCampaign.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Campaign deleted successfully",
    });
  } catch (error) {
    console.error("Delete campaign error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete campaign",
    });
  }
};

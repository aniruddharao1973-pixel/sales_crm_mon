// src/modules/email/emailCampaign.service.js
import prisma from "../../utils/prisma.js";
import { sendEmailGateway } from "./emailGateway.js";
import { renderTemplate } from "./templateRenderer.js";
import { parseTemplate } from "./templateParser.js";

export async function sendBulkEmailCampaign({
  template,
  recipients,
  userId,
  campaignId,
  subject,
  body,
  bcc = [],
}) {
  const results = {
    sent: 0,
    failed: 0,
  };

  /*
  =====================================================
  LOAD SENDER USER
  =====================================================
  */

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("Sender user not found");
  }

  /*
  =====================================================
  REAL CAMPAIGN MODE (SINGLE SEND WITH BCC)
  =====================================================
  */

  try {
    // ✅ Collect all recipient emails
    const recipientEmails = recipients.map((r) => r.email).filter(Boolean);

    // ✅ Merge manual BCC + recipients (remove duplicates)
    const finalBcc = [...new Set([...(bcc || []), ...recipientEmails])];

    if (!finalBcc.length) {
      throw new Error("No valid recipient emails found");
    }

    // ✅ Use sender email as primary TO (required)
    const primaryTo = user.email;

    /*
    =====================================================
    TEMPLATE RENDER (use first contact for variables)
    =====================================================
    */

    const sampleRecipient = recipients[0];

    const fullContact = sampleRecipient?.id
      ? await prisma.contact.findUnique({
          where: { id: sampleRecipient.id },
          include: {
            account: {
              select: {
                accountName: true,
                industry: true,
              },
            },
          },
        })
      : null;

    const variables = {
      contact: fullContact || sampleRecipient,
      account: fullContact?.account || {},
    };

    const templateBody = template?.body || "";
    const templateSubject = template?.subject || "";

    const finalBody = renderTemplate(body || templateBody, variables);
    const finalSubject = parseTemplate(subject || templateSubject, variables);

    /*
    =====================================================
    SEND SINGLE EMAIL
    =====================================================
    */

    await sendEmailGateway({
      userId,
      from: user.email,
      to: primaryTo,
      bcc: finalBcc,
      subject: finalSubject,
      html: finalBody,
      provider: user.emailProvider || "SMTP",
    });

    /*
    =====================================================
    LOG EMAIL (STORE FULL BCC LIST)
    =====================================================
    */

    await prisma.emailLog.create({
      data: {
        fromEmail: user.email,
        toEmail: primaryTo,

        ccEmails: [],
        bccEmails: finalBcc, // ✅ full campaign list

        subject: finalSubject,
        body: finalBody,
        templateId: template?.id || null,
        campaignId,
        sentById: userId,
        status: "SENT",
        direction: "OUTBOUND",
        folder: "SENT",
        sentAt: new Date(),
      },
    });

    results.sent = finalBcc.length;
  } catch (err) {
    console.error("❌ Campaign failed:", err.message);
    results.failed = recipients.length;
  }

  /*
  =====================================================
  FINAL CAMPAIGN UPDATE
  =====================================================
  */

  await prisma.emailCampaign.update({
    where: { id: campaignId },
    data: {
      sentCount: results.sent,
      failedCount: results.failed,
    },
  });

  return results;
}

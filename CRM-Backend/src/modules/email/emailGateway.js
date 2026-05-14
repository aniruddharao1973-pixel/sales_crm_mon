// CRM-Backend/src/modules/email/emailGateway.js
import prisma from "../../utils/prisma.js";
import path from "path";
import { sendGmail, sendSMTP, sendOutlook } from "./emailProvider.js";

/*
=====================================================
UNIVERSAL EMAIL GATEWAY
=====================================================
*/

export const sendEmailGateway = async ({
  userId,
  from,
  to,
  bcc = [],
  subject,
  html,
  provider,
  attachments = [], // 🔥 ADD THIS
}) => {
  console.log("📨 Email Gateway Started");
  console.log("Provider:", provider);
  console.log("From:", from);
  console.log("To:", to);
  console.log("BCC:", bcc);
  console.log("Subject:", subject);
  console.log("=====================================");

  /*
  =====================================================
  BASIC VALIDATION
  =====================================================
  */

  if (!to) {
    throw new Error("Recipient email is required");
  }

  if (!subject) {
    console.warn("⚠️ Email subject is empty");
  }

  if (!html) {
    console.warn("⚠️ Email body is empty");
  }

  const logoAttachment = {
    filename: "Micro_2026.png",
    path: path.join(process.cwd(), "public", "Micro_2026.png"),
    cid: "micrologic-logo",
  };

  // 🔥 Merge logo + uploaded files
  const finalAttachments =
    attachments && attachments.length
      ? [logoAttachment, ...attachments]
      : [logoAttachment];

  console.log(
    "Logo path:",
    path.join(process.cwd(), "public", "Micro_2026.png"),
  );

  /*
  =====================================================
  ROUTE TO PROVIDER
  =====================================================
  */

  try {
    if (provider === "GOOGLE") {
      console.log("📡 Routing to Gmail provider");

      return await sendGmail({
        userId,
        from,
        to,
        bcc,
        subject,
        html,
        attachments: finalAttachments,
      });
    }

    if (provider === "MICROSOFT") {
      console.log("📡 Routing to Outlook provider");

      return await sendOutlook({
        userId,
        from,
        to,
        bcc,
        subject,
        html,
        attachments: finalAttachments,
      });
    }

    console.log("📡 Routing to SMTP provider");

    return await sendSMTP({
      userId,
      from,
      to,
      bcc,
      subject,
      html,
      attachments: finalAttachments,
    });
  } catch (error) {
    console.error("❌ Email Gateway Failed:", error.message);
    throw error;
  }
};

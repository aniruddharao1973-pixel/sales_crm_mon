// CRM-Backend/src/modules/email/email.controller.js

import * as emailService from "./email.service.js";
import { google } from "googleapis";
import prisma from "../../utils/prisma.js";
import { generateEmailTemplateAI } from "../../controllers/ai.controller.js";
import { resend } from "./resendClient.js";



/*
CREATE EMAIL TEMPLATE
*/
export const createTemplate = async (req, res) => {
  try {
    const { name, subject, body } = req.body;

    if (!name || !subject || !body) {
      return res.status(400).json({
        success: false,
        message: "Template name, subject, and body are required",
      });
    }

    const template = await emailService.createTemplate(
      { name, subject, body },
      req.user.id,
    );

    return res.status(201).json({
      success: true,
      message: "Template created successfully",
      data: template,
    });
  } catch (error) {
    console.error("Create Template Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create template",
    });
  }
};

/*
GET ALL EMAIL TEMPLATES
*/
export const getTemplates = async (req, res) => {
  try {
    const templates = await emailService.getTemplates();

    return res.status(200).json({
      success: true,
      count: templates.length,
      data: templates,
    });
  } catch (error) {
    console.error("Get Templates Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch templates",
    });
  }
};

/*
SEND EMAIL
*/
/*
SEND EMAIL
*/
export const sendEmail = async (req, res) => {
  try {
    const { toEmail, subject, body, templateId, attachments = [] } = req.body;

    if (!toEmail) {
      return res.status(400).json({
        success: false,
        message: "Recipient email (toEmail) is required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(toEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (!subject && !templateId) {
      return res.status(400).json({
        success: false,
        message: "Subject or templateId must be provided",
      });
    }

    const email = await emailService.sendEmail(
      {
        ...req.body,
        attachments, // ✅ explicitly pass attachments
      },
      req.user.id,
    );

    /*
    IMPORTANT FIX
    */

    if (email.status === "FAILED") {
      return res.status(500).json({
        success: false,
        message: "Email sending failed",
        data: email,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      data: email,
    });
  } catch (error) {
    console.error("Send Email Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
};

/*
GET EMAIL LOGS
*/
export const getEmailLogs = async (req, res) => {
  try {
    const logs = await emailService.getEmailLogs(req.query);

    return res.status(200).json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    console.error("Get Email Logs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch email logs",
    });
  }
};

/*
CONNECT GOOGLE EMAIL
*/
export const connectGoogle = async (req, res) => {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    const scopes = [
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/gmail.readonly",
    ];

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: scopes,
      state: req.user.id,
      include_granted_scopes: true,
    });

    res.json({ url });
  } catch (error) {
    console.error("Google Connect Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to connect Gmail",
    });
  }
};

/*
GOOGLE OAUTH CALLBACK
*/
export const googleCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    const userId = state;

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const profile = await gmail.users.getProfile({
      userId: "me",
    });

    const gmailAddress = profile.data.emailAddress;

    await prisma.user.update({
      where: { id: userId },
      data: {
        emailProvider: "GOOGLE",
        emailAccessToken: tokens.access_token,
        emailRefreshToken: tokens.refresh_token,
        emailTokenExpiry: tokens.expiry_date
          ? new Date(tokens.expiry_date)
          : null,
      },
    });

    console.log("✅ Gmail connected for user:", userId, gmailAddress);

    const frontendUrl = process.env.FRONTEND_URL;
    res.redirect(frontendUrl);
  } catch (error) {
    console.error("Google Callback Error:", error);

    res.status(500).json({
      success: false,
      message: "Email connection failed",
    });
  }
};

/*
=====================================================
CONNECT OUTLOOK
=====================================================
*/
export const connectOutlook = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const params = new URLSearchParams({
      client_id: process.env.OUTLOOK_CLIENT_ID,
      response_type: "code",
      redirect_uri: process.env.OUTLOOK_REDIRECT_URI,
      response_mode: "query",
      scope:
        "offline_access https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/User.Read",
      state: userId,

      // ⭐ THIS LINE REMOVES ACCOUNT PICKER
      login_hint: user.email,
    });

    const url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`;

    res.json({ url });
  } catch (error) {
    console.error("Outlook Connect Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to connect Outlook",
    });
  }
};

/*
=====================================================
OUTLOOK CALLBACK
=====================================================
*/
export const outlookCallback = async (req, res) => {
  try {
    const { code, state } = req.query;
    const userId = state;

    console.log("📨 Outlook OAuth Callback");

    /*
    =====================================================
    EXCHANGE CODE FOR TOKEN
    =====================================================
    */

    const tokenRes = await fetch(
      "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.OUTLOOK_CLIENT_ID,
          client_secret: process.env.OUTLOOK_CLIENT_SECRET,
          code,
          redirect_uri: process.env.OUTLOOK_REDIRECT_URI,
          grant_type: "authorization_code",
        }),
      },
    );

    const tokens = await tokenRes.json();

    if (!tokens.access_token) {
      console.error("❌ Microsoft OAuth token missing");
      console.error(tokens);

      return res.status(500).send("Microsoft OAuth failed");
    }

    /*
    =====================================================
    TOKEN DEBUG
    =====================================================
    */

    console.log("🔑 Outlook Token Length:", tokens.access_token?.length);
    console.log(
      "🔑 Outlook Token Dot Count:",
      (tokens.access_token?.match(/\./g) || []).length,
    );

    /*
    =====================================================
    GET MICROSOFT ACCOUNT EMAIL
    =====================================================
    */

    const profileRes = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const profile = await profileRes.json();

    const connectedEmail = profile.mail || profile.userPrincipalName;

    console.log("📧 Microsoft Connected Email:", connectedEmail);

    /*
    =====================================================
    VALIDATE USER EMAIL
    =====================================================
    */

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (
      connectedEmail &&
      connectedEmail.toLowerCase() !== user.email.toLowerCase()
    ) {
      console.error("❌ OAuth email mismatch");
      console.error("CRM User:", user.email);
      console.error("Connected Microsoft:", connectedEmail);

      return res.send(`
        <h2>Outlook Connection Failed</h2>
        <p>The selected Microsoft account does not match your CRM login.</p>
        <p><b>CRM Email:</b> ${user.email}</p>
        <p><b>Microsoft Email:</b> ${connectedEmail}</p>
        <p>Please reconnect using the correct account.</p>
      `);
    }

    /*
    =====================================================
    SAVE TOKEN
    =====================================================
    */

    await prisma.user.update({
      where: { id: userId },
      data: {
        emailProvider: "MICROSOFT",
        emailAccessToken: tokens.access_token,
        emailRefreshToken: tokens.refresh_token,
      },
    });

    console.log("✅ Outlook connected:", user.email);

    const frontendUrl = process.env.FRONTEND_URL;
    res.redirect(frontendUrl);
  } catch (error) {
    console.error("Outlook Callback Error:", error);

    res.status(500).json({
      success: false,
      message: "Outlook connection failed",
    });
  }
};

/*
=====================================================
GENERATE EMAIL TEMPLATE USING AI
=====================================================
*/

export const generateTemplateAI = async (req, res) => {
  try {
    console.log("🤖 [EMAIL CTRL] AI Template Request");

    const { purpose, customPurpose, tone, category, recipient, length } =
      req.body;

    /* ─────────────────────────────────────────────
       BASIC VALIDATION
    ───────────────────────────────────────────── */

    if (!purpose) {
      return res.status(400).json({
        success: false,
        message: "Purpose is required for AI template generation",
      });
    }

    /* ─────────────────────────────────────────────
       ALLOWED PURPOSE VALUES
    ───────────────────────────────────────────── */

    const allowedPurposes = [
      "cold outreach",
      "follow up",
      "proposal submission",
      "meeting request",
      "negotiation",
      "deal closing",
      "re-engagement",
      "thank you",

      // campaign purposes
      "promotion",
      "festival greeting",
      "newsletter",
      "product update",
      "engagement",
      "notification",
      "event invitation",
    ];

    let finalPurpose = purpose;

    /*
    ────────────────────────────
    CUSTOM PURPOSE SUPPORT
    ────────────────────────────
    */

    if (purpose.toLowerCase() === "custom") {
      if (!customPurpose || !customPurpose.trim()) {
        return res.status(400).json({
          success: false,
          message: "Custom purpose text is required",
        });
      }

      finalPurpose = customPurpose.trim();
    } else if (!allowedPurposes.includes(purpose.toLowerCase())) {
      /*
    ────────────────────────────
    STANDARD PURPOSE VALIDATION
    ────────────────────────────
    */
      console.warn("⚠️ Invalid AI purpose:", purpose);

      return res.status(400).json({
        success: false,
        message: "Invalid email purpose",
      });
    }

    /*
    ────────────────────────────
    PASS FINAL PURPOSE TO AI
    ────────────────────────────
    */

    req.body.purpose = finalPurpose;

    /* ─────────────────────────────────────────────
       LENGTH VALIDATION
    ───────────────────────────────────────────── */

    const allowedLengths = ["short", "medium", "long"];

    if (length && !allowedLengths.includes(length.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid email length",
      });
    }

    /* ─────────────────────────────────────────────
       FORWARD TO AI CONTROLLER
    ───────────────────────────────────────────── */

    return generateEmailTemplateAI(req, res);
  } catch (error) {
    console.error("❌ [EMAIL CTRL] AI Template Error:", error);

    return res.status(500).json({
      success: false,
      message: "AI template generation failed",
    });
  }
};

/*
=====================================================
DELETE EMAIL LOG (EMAIL HISTORY)
=====================================================
*/

export const deleteEmailLog = async (req, res) => {
  try {
    const { id } = req.params;

    const email = await prisma.emailLog.findUnique({
      where: { id },
    });

    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    await prisma.emailLog.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Email history deleted successfully",
    });
  } catch (error) {
    console.error("Delete Email Log Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete email history",
    });
  }
};
/*
=====================================================
DELETE EMAIL TEMPLATE
=====================================================
*/

export const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    await emailService.deleteTemplate(id, req.user.id);

    return res.status(200).json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    console.error("Delete Template Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete template",
    });
  }
};

/*
=====================================================
UPDATE TEMPLATE
=====================================================
*/

export const updateTemplate = async (req, res) => {
  try {
    const templateId = req.params.id;
    const userId = req.user.id;

    const updated = await emailService.updateTemplate(
      templateId,
      req.body,
      userId,
    );

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const testResendEmail = async (req, res) => {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "aniruddharao1973@gmail.com", // 👈 your email only
      subject: "Test Email",
      html: "<h1>Resend working ✅</h1>",
    });

    console.log("RESEND SUCCESS:", response);

    res.json({ success: true, response });
  } catch (error) {
    console.error("RESEND ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};
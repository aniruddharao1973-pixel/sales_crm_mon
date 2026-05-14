// src/modules/email/emailProvider.js
import nodemailer from "nodemailer";
import prisma from "../../utils/prisma.js";
import { google } from "googleapis";

/*
=====================================================
SEND VIA SMTP (COMPANY MAIL)
=====================================================
*/
export const sendSMTP = async ({
  userId,
  from,
  to,
  bcc = [],
  subject,
  html,
  attachments,
}) => {
  console.log("=================================================");
  console.log("📨 SMTP EMAIL SENDING STARTED");
  console.log("=================================================");

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("SMTP user not found");
    }
    /*
=====================================================
RESOLVE SMTP CONFIG
=====================================================
*/

    const smtpHost = user.smtpHost || process.env.SMTP_HOST;
    const smtpPort = user.smtpPort || process.env.SMTP_PORT || 587;
    const smtpUser = user.smtpUser || user.email;
    const smtpPass = user.smtpPassword || process.env.SMTP_PASS;

    if (!smtpHost || !smtpPass) {
      throw new Error("No SMTP configuration available");
    }

    console.log("📧 SMTP Host:", smtpHost);
    console.log("📧 SMTP User:", smtpUser);

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: Number(smtpPort) === 465, // true for 465, false for 587
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    console.log("📨 Sending SMTP email...");

    /*
=====================================================
EMAIL SIZE SAFETY CHECK
=====================================================
*/
    if (html && html.length > 500000) {
      console.warn("⚠️ Email body is very large");
    }

    const info = await transporter.sendMail({
      from: `"CRM System" <${from}>`,
      to,
      bcc,
      subject,
      html,
      attachments,
    });

    console.log("✅ SMTP Email Sent:", info.messageId);

    return { messageId: info.messageId };
  } catch (error) {
    console.error("❌ SMTP Email Failed:", error.message);
    throw error;
  }
};

// /*
// =====================================================
// SEND VIA GMAIL (GOOGLE API OAUTH)
// =====================================================
// */
// export const sendGmail = async ({ userId, to, subject, html, attachments }) => {
//   console.log("=================================================");
//   console.log("📨 GMAIL EMAIL SENDING STARTED");
//   console.log("=================================================");

//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//     });

//     if (!user) {
//       throw new Error("User not found");
//     }

//     if (!user.emailAccessToken || !user.emailRefreshToken) {
//       throw new Error("Gmail not connected for this user");
//     }

//     console.log("📧 Gmail User:", user.email);
//     console.log("🔑 Access Token Exists:", !!user.emailAccessToken);

//     const oauth2Client = new google.auth.OAuth2(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET,
//       process.env.GOOGLE_REDIRECT_URI,
//     );

//     oauth2Client.setCredentials({
//       access_token: user.emailAccessToken,
//       refresh_token: user.emailRefreshToken,
//     });

//     /*
// =====================================================
// AUTO REFRESH TOKEN
// =====================================================
// */

//     oauth2Client.on("tokens", async (tokens) => {
//       console.log("🔄 Gmail Token Refreshed");

//       await prisma.user.update({
//         where: { id: userId },
//         data: {
//           emailAccessToken: tokens.access_token ?? user.emailAccessToken,
//           emailRefreshToken: tokens.refresh_token ?? user.emailRefreshToken,
//           emailTokenExpiry: tokens.expiry_date
//             ? new Date(tokens.expiry_date)
//             : user.emailTokenExpiry,
//         },
//       });
//     });

//     const gmail = google.gmail({
//       version: "v1",
//       auth: oauth2Client,
//     });

//     const boundary = "crm_boundary";

//     let messageParts = [
//       `From: CRM System <${user.email}>`,
//       `To: ${to}`,
//       `Subject: ${subject}`,
//       "MIME-Version: 1.0",
//       `Content-Type: multipart/related; boundary=${boundary}`,
//       "",
//       `--${boundary}`,
//       "Content-Type: text/html; charset=UTF-8",
//       "",
//       html,
//     ];

//     for (const file of attachments) {
//       const fs = await import("fs");
//       const content = fs.readFileSync(file.path).toString("base64");

//       messageParts.push(
//         `--${boundary}`,
//         `Content-Type: image/png`,
//         `Content-Transfer-Encoding: base64`,
//         `Content-ID: <${file.cid}>`,
//         `Content-Disposition: inline; filename="${file.filename}"`,
//         "",
//         content,
//       );
//     }

//     messageParts.push(`--${boundary}--`);

//     const message = messageParts.join("\r\n");

//     const encodedMessage = Buffer.from(message)
//       .toString("base64")
//       .replace(/\+/g, "-")
//       .replace(/\//g, "_")
//       .replace(/=+$/, "");

//     console.log("📨 Sending Gmail API email...");

//     const res = await gmail.users.messages.send({
//       userId: "me",
//       requestBody: {
//         raw: encodedMessage,
//       },
//     });

//     console.log("✅ Gmail Email Sent:", res.data.id);

//     /*
// =================================================
// DEBUG GMAIL MESSAGE LOCATION
// =================================================
// */

//     console.log("📨 Gmail API FULL RESPONSE:");
//     console.log(JSON.stringify(res.data, null, 2));

//     const messageDetails = await gmail.users.messages.get({
//       userId: "me",
//       id: res.data.id,
//     });

//     console.log("📧 Gmail Stored Labels:", messageDetails.data.labelIds);
//     console.log("📧 Gmail Thread ID:", messageDetails.data.threadId);

//     return {
//       messageId: res.data.id,
//       threadId: res.data.threadId,
//     };
//   } catch (error) {
//     console.error("❌ Gmail Email Failed:", error.message);
//     throw error;
//   }
// };

/*
=====================================================
SEND VIA GMAIL (GOOGLE API OAUTH)
=====================================================
*/
export const sendGmail = async ({
  userId,
  to,
  bcc = [],
  subject,
  html,
  attachments,
}) => {
  console.log("=================================================");
  console.log("📨 GMAIL EMAIL SENDING STARTED");
  console.log("=================================================");

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    /*
    =====================================================
    GET GOOGLE TOKENS FROM CalendarIntegration
    =====================================================
    */
    const integration = await prisma.calendarIntegration.findFirst({
      where: {
        userId: user.id,
        provider: "GOOGLE",
      },
    });

    if (!integration || !integration.refreshToken) {
      throw new Error("Google not connected. Please reconnect.");
    }

    console.log("📧 Gmail User:", user.email);
    console.log("🔑 Using CalendarIntegration tokens");

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    oauth2Client.setCredentials({
      access_token: integration.accessToken,
      refresh_token: integration.refreshToken,
    });

    /*
    =====================================================
    AUTO REFRESH TOKEN
    =====================================================
    */
    oauth2Client.on("tokens", async (tokens) => {
      try {
        console.log("🔄 Gmail Token Refreshed");

        await prisma.calendarIntegration.update({
          where: {
            id: integration.id,
          },
          data: {
            accessToken: tokens.access_token ?? integration.accessToken,
            refreshToken: tokens.refresh_token ?? integration.refreshToken,
            tokenExpiry: tokens.expiry_date
              ? new Date(tokens.expiry_date)
              : integration.tokenExpiry,
          },
        });
      } catch (err) {
        console.error("⚠️ Token refresh failed (non-blocking):", err.message);
      }
    });

    const gmail = google.gmail({
      version: "v1",
      auth: oauth2Client,
    });

    // const boundary = "crm_boundary";

    // let messageParts = [
    //   `From: CRM System <${user.email}>`,
    //   `To: ${to}`,
    //   ...(bcc.length ? [`Bcc: ${bcc.join(",")}`] : []),
    //   `Subject: ${subject}`,
    //   "MIME-Version: 1.0",
    //   `Content-Type: multipart/alternative; boundary="${boundary}"`,
    //   "",

    //   `--${boundary}`,
    //   "Content-Type: text/plain; charset=UTF-8",
    //   "",
    //   "Your email client does not support HTML emails.",

    //   `--${boundary}`,
    //   "Content-Type: text/html; charset=UTF-8",
    //   "",
    //   html,

    //   `--${boundary}--`,
    // ];

    const boundary = "crm_boundary";

    let messageParts = [
      `From: CRM System <${user.email}>`,
      `To: ${to}`,
      ...(bcc.length ? [`Bcc: ${bcc.join(",")}`] : []),
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/related; boundary="${boundary}"`,
      "",

      `--${boundary}`,
      "Content-Type: text/html; charset=UTF-8",
      "",
      html,
    ];

    // ✅ INLINE IMAGE SUPPORT
    for (const file of attachments || []) {
      const fs = await import("fs");
      const content = fs.readFileSync(file.path).toString("base64");

      messageParts.push(
        `--${boundary}`,
        `Content-Type: image/png`,
        `Content-Transfer-Encoding: base64`,
        `Content-ID: <${file.cid}>`,
        `Content-Disposition: inline; filename="${file.filename}"`,
        "",
        content,
      );
    }

    messageParts.push(`--${boundary}--`);

    // for (const file of attachments) {
    //   const fs = await import("fs");
    //   const content = fs.readFileSync(file.path).toString("base64");

    //   messageParts.push(
    //     `--${boundary}`,
    //     `Content-Type: image/png`,
    //     `Content-Transfer-Encoding: base64`,
    //     `Content-ID: <${file.cid}>`,
    //     `Content-Disposition: inline; filename="${file.filename}"`,
    //     "",
    //     content,
    //   );
    // }

    // messageParts.push(`--${boundary}--`);

    const message = messageParts.join("\r\n");

    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    console.log("📨 Sending Gmail API email...");

    let res;

    try {
      res = await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: encodedMessage,
        },
      });
    } catch (err) {
      console.error("❌ Gmail API Error:", err.message);
      throw err;
    }

    console.log("✅ Gmail Email Sent:", res.data.id);

    /*
    =================================================
    DEBUG GMAIL MESSAGE LOCATION
    =================================================
    */
    console.log("📨 Gmail API FULL RESPONSE:");
    console.log(JSON.stringify(res.data, null, 2));

    // const messageDetails = await gmail.users.messages.get({
    //   userId: "me",
    //   id: res.data.id,
    // });

    // console.log("📧 Gmail Stored Labels:", messageDetails.data.labelIds);
    // console.log("📧 Gmail Thread ID:", messageDetails.data.threadId);

    return {
      messageId: res.data.id,
      threadId: res.data.threadId,
    };
  } catch (error) {
    console.error("❌ Gmail Email Failed:", error.message);
    throw error;
  }
};

/*
=====================================================
REFRESH MICROSOFT TOKEN
=====================================================
*/

const refreshMicrosoftToken = async (user) => {
  console.log("🔄 Refreshing Microsoft token...");

  const tokenRes = await fetch(
    "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.OUTLOOK_CLIENT_ID,
        client_secret: process.env.OUTLOOK_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: user.emailRefreshToken,

        redirect_uri: process.env.OUTLOOK_REDIRECT_URI,

        scope:
          "offline_access https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/User.Read",
      }),
    },
  );

  const tokens = await tokenRes.json();

  if (!tokens.access_token) {
    console.error("Microsoft Refresh Error:", tokens);
    throw new Error("Microsoft token refresh failed");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailAccessToken: tokens.access_token,
      emailRefreshToken: tokens.refresh_token || user.emailRefreshToken,
    },
  });

  console.log("✅ Microsoft token refreshed");

  return tokens.access_token;
};

const buildRecipients = (emails = []) =>
  emails.map((email) => ({
    emailAddress: { address: email },
  }));

/*
=====================================================
SEND VIA OUTLOOK (MICROSOFT GRAPH API)
=====================================================
*/
export const sendOutlook = async ({
  userId,
  to,
  bcc = [],
  subject,
  html,
  attachments = [],
}) => {
  console.log("=================================================");
  console.log("📨 OUTLOOK EMAIL SENDING STARTED");
  console.log("=================================================");

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.emailAccessToken) {
      throw new Error("Outlook not connected for this user");
    }

    console.log("📧 Outlook Sender:", user.email);

    /*
=================================================
TOKEN DEBUG
=================================================
*/

    console.log("🔑 TOKEN LENGTH:", user.emailAccessToken?.length);

    console.log(
      "🔑 TOKEN START:",
      user.emailAccessToken
        ? user.emailAccessToken.substring(0, 40)
        : "NO TOKEN",
    );

    console.log(
      "🔑 TOKEN DOT COUNT:",
      user.emailAccessToken
        ? (user.emailAccessToken.match(/\./g) || []).length
        : 0,
    );

    console.log("🔑 TOKEN TYPE:", typeof user.emailAccessToken);

    /*
=================================================
SEND REQUEST
=================================================
*/

    let accessToken = user.emailAccessToken;

    const fs = await import("fs");

    const inlineAttachments = attachments.map((file) => ({
      "@odata.type": "#microsoft.graph.fileAttachment",
      name: file.filename,
      contentId: file.cid,
      isInline: true,
      contentType: "image/png",
      contentBytes: fs.readFileSync(file.path).toString("base64"),
    }));

    let response = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject: subject,
          body: {
            contentType: "HTML",
            content: html,
          },
          from: {
            emailAddress: {
              address: user.email,
            },
          },
          toRecipients: buildRecipients([to]),
          bccRecipients: buildRecipients(bcc), // ✅ NEW
          attachments: inlineAttachments,
        },
        saveToSentItems: true,
      }),
    });

    /*
=================================================
AUTO REFRESH TOKEN IF EXPIRED
=================================================
*/

    if (response.status === 401) {
      console.log("⚠️ Microsoft token expired — refreshing...");

      accessToken = await refreshMicrosoftToken(user);

      response = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            subject: subject,
            body: {
              contentType: "HTML",
              content: html,
            },
            toRecipients: buildRecipients([to]),
            bccRecipients: buildRecipients(bcc), // ✅ NEW
            attachments: inlineAttachments,
          },
          saveToSentItems: true,
        }),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Graph API error:", errorText);
      throw new Error(errorText);
    }

    console.log("✅ Outlook Email Sent Successfully");

    return { messageId: Date.now().toString() };
  } catch (error) {
    console.error("❌ Outlook Email Failed:", error.message);
    throw error;
  }
};

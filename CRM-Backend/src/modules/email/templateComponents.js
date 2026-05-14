// src/modules/email/templateComponents.js
const LOGO_CID = "micrologic-logo";
export const templateComponents = {
  /*
  =====================================================
  EMAIL HEADER
  =====================================================
  */

  header: [
    `<div style="padding-bottom:24px;">`,

    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">`,
    `<tr>`,

    `<td align="left" style="vertical-align:middle;">`,

    `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">`,
    `<tr>`,

    /* LOGO */
    `<td width="180" style="vertical-align:middle;">`,
    `<img 
      src="cid:micrologic-logo"
      alt="Micrologic"
      width="170"
      style="display:block;width:170px;height:auto;border:0;outline:none;text-decoration:none;"
  />`,
    `</td>`,

    /* COMPANY TEXT */
    `<td style="padding-left:16px;vertical-align:middle;">`,

    `<div style="font-family:'Georgia','Times New Roman',serif;font-size:18px;color:#1a2e44;font-weight:700;line-height:22px;letter-spacing:0.2px;">`,
    `Micrologic Integrated Systems`,
    `</div>`,

    `<div style="font-family:'Georgia','Times New Roman',serif;font-size:11px;color:#2d6a9f;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;line-height:16px;">`,
    `Bangalore`,
    `</div>`,

    `</td>`,

    `</tr>`,
    `</table>`,

    `</td>`,
    `</tr>`,
    `</table>`,

    `<div style="margin-top:18px;height:1px;background:linear-gradient(to right,#2d6a9f 0%,#93c5e8 50%,#e8f0f7 100%);"></div>`,

    `</div>`,
  ].join(""),

  /*
  =====================================================
  EMAIL SIGNATURE
  =====================================================
  */
  signature: [
    `<div style="margin-top:32px;">`,
    `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;">`,
    `<tr>`,
    `<td style="border-left:3px solid #2d6a9f;padding-left:16px;">`,
    `<p style="margin:0 0 2px 0;font-family:'Georgia','Times New Roman',serif;font-size:13px;color:#64748b;letter-spacing:0.3px;">Regards,</p>`,
    `<p style="margin:5px 0 2px 0;font-family:'Georgia','Times New Roman',serif;font-size:16px;font-weight:700;color:#1a2e44;letter-spacing:0.2px;">Admin User</p>`,
    `<p style="margin:0;font-family:'Georgia','Times New Roman',serif;font-size:11px;color:#2d6a9f;letter-spacing:1.4px;text-transform:uppercase;font-weight:600;">Micrologic Integrated Systems</p>`,
    `</td>`,
    `</tr>`,
    `</table>`,
    `</div>`,
  ].join(""),

  /*
  =====================================================
  EMAIL FOOTER
  =====================================================
  */
  footer: [
    `<div style="margin-top:36px;">`,
    `<div style="height:1px;background:linear-gradient(to right,#e8f0f7 0%,#93c5e8 50%,#e8f0f7 100%);margin-bottom:16px;"></div>`,
    `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">`,
    `<tr>`,
    `<td style="vertical-align:middle;">`,
    `<p style="margin:0;font-family:'Georgia','Times New Roman',serif;font-size:11.5px;color:#94a3b8;letter-spacing:0.3px;">Micrologic Integrated Systems</p>`,
    `</td>`,
    `<td style="text-align:right;vertical-align:middle;">`,
    `<a href="https://www.micrologicglobal.com" style="font-family:'Georgia','Times New Roman',serif;font-size:11.5px;color:#2d6a9f;text-decoration:none;letter-spacing:0.3px;border-bottom:1px solid #93c5e8;padding-bottom:1px;">www.micrologicglobal.com</a>`,
    `</td>`,
    `</tr>`,
    `</table>`,
    `</div>`,
  ].join(""),
};

// CRM-Backend/src/modules/email/templateRenderer.js
import { parseTemplate } from "./templateParser.js";
import { templateComponents } from "./templateComponents.js";

/*
=====================================================
CHECK FOR UNRESOLVED VARIABLES
=====================================================
*/
function detectUnresolved(html) {
  const matches = html.match(/{{(.*?)}}/g);
  return matches || [];
}

/*
=====================================================
RENDER TEMPLATE
=====================================================
*/
export function renderTemplate(template, variables = {}) {
  let html = template || "";

  /*
  =====================================================
  STEP 1 — Inject Components (header/footer/signature)
  =====================================================
  */

  html = html.replace(/{{(header|footer|signature)}}/g, (_, key) => {
    let component = templateComponents[key] || "";

    component = parseTemplate(component, variables);

    return component;
  });

  /*
  =====================================================
  STEP 2 — Parse Variables
  =====================================================
  */

  html = parseTemplate(html, variables);

  /*
=====================================================
STEP 2.5 — Normalize Component Order
Ensures {{footer}} always renders last
=====================================================
*/
  if (html.includes("{{footer}}")) {
    html = html.replace("{{footer}}", "");
    html = html.trimEnd() + "\n{{footer}}";
  }
  /*
  =====================================================
  STEP 3 — Detect Missing Variables (Warning Only)
  =====================================================
  */

  const unresolved = detectUnresolved(html);

  if (unresolved.length > 0) {
    console.warn("⚠️ Unresolved template variables:", unresolved);

    // Replace unresolved variables with empty string
    unresolved.forEach((v) => {
      html = html.replaceAll(v, "");
    });
  }

  /*
  =====================================================
  STEP 4 — Preserve Line Breaks
  =====================================================
  */

  // Convert new lines to <br> so manual text shows correctly
  html = html
    .split(/\n\s*\n/)
    .map((p) => `<p style="margin:0 0 16px 0;">${p.trim()}</p>`)
    .join("");

  /*
  =====================================================
  STEP 5 — Wrap in Professional Email Layout
  =====================================================
  */

  html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;background-image:radial-gradient(circle at 20% 0%,rgba(186,217,245,0.35) 0%,transparent 55%),radial-gradient(circle at 80% 100%,rgba(196,221,246,0.25) 0%,transparent 50%);font-family:'DM Sans',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:transparent;padding:48px 16px 56px;">
    <tr>
      <td align="center">
        <div style="margin-bottom:14px;font-family:'DM Sans',sans-serif;font-size:10px;font-weight:500;letter-spacing:2.5px;text-transform:uppercase;color:#8faec8;">Secure Message · Micrologic Global</div>
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;width:100%;">
          <tr>
            <td style="background:#ffffff;border-radius:16px;border:1px solid rgba(180,210,235,0.55);box-shadow:0 1px 2px rgba(30,60,100,0.04),0 4px 16px rgba(30,60,100,0.07),0 16px 48px rgba(30,60,100,0.06);overflow:hidden;">
              <div style="height:4px;background:linear-gradient(90deg,#1e3a5f 0%,#3b82c4 40%,#93c5e8 80%,#dbeafe 100%);"></div>
              <div style="padding:44px 48px 40px;">
                <div style="font-family:'DM Sans',Helvetica,sans-serif;font-size:15px;line-height:1.75;color:#2d3f52;letter-spacing:0.1px;">${html}</div>
              </div>
            </td>
          </tr>
        </table>
        <div style="margin-top:24px;font-family:'DM Sans',sans-serif;font-size:11px;color:#a0b4c6;letter-spacing:0.8px;display:inline-flex;align-items:center;gap:8px;">
          <div style="width:20px;height:1px;background:#b8ccdc;display:inline-block;vertical-align:middle;"></div>
          <span style="vertical-align:middle;">Powered by CRM</span>
          <div style="width:20px;height:1px;background:#b8ccdc;display:inline-block;vertical-align:middle;"></div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return html;
}

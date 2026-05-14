// // src/controllers/ai.controller.js

// import { getSalesInsights } from "../ai/salesInsights.service.js";
// import {
//   buildSalesPrompt,
//   buildAdvancedAnalyticsPrompt,
//   buildQuickAnalyticsPrompt,
// } from "../ai/promptBuilder.js";
// import { generateAIResponse, getModelStatus } from "../ai/aiClient.js";
// import { getAdvancedAnalyticsSnapshot } from "../ai/advancedAnalytics.service.js";

// /* ─────────────────────────────────────────────
//    🧠 MAIN CHATBOT CONTROLLER (SMART ROUTING)
// ───────────────────────────────────────────── */
// export async function askAI(req, res) {
//   const start = Date.now();
//   console.log("🧠 [AI CTRL] ══════════════════════════════════");
//   console.log("🧠 [AI CTRL] Request received at", new Date().toISOString());

//   try {
//     const { question } = req.body;
//     console.log("❓ [AI CTRL] Question:", question);

//     if (!question?.trim()) {
//       console.warn("⚠️  [AI CTRL] Empty question — rejected");
//       return res.status(400).json({ message: "Question required" });
//     }

//     const status = getModelStatus();
//     console.log("📊 [AI CTRL] Model status:", JSON.stringify(status));

//     const q = question.toLowerCase();

//     // 🔥 Detect analytics-style questions
//     const analyticsTriggers = [
//       "overview",
//       "scenario",
//       "current situation",
//       "analytics",
//       "pipeline health",
//       "risk",
//       "bottleneck",
//       "performance",
//       "strategic",
//       "strategy",
//       "growth",
//       "funnel",
//       "velocity",
//       "current scenario",
//       "advanced analytics",
//     ];

//     const isAnalyticsQuery = analyticsTriggers.some((word) => q.includes(word));

//     let prompt;

//     if (isAnalyticsQuery) {
//       console.log("📊 [AI CTRL] Routing to Advanced Analytics mode");

//       const t1 = Date.now();
//       const snapshot = await getAdvancedAnalyticsSnapshot();
//       console.log(
//         `📊 [AI CTRL] Analytics snapshot fetched in ${Date.now() - t1}ms`,
//       );

//       prompt = buildAdvancedAnalyticsPrompt(snapshot, question);
//     } else {
//       console.log("📈 [AI CTRL] Routing to Sales Assistant mode");

//       const t1 = Date.now();
//       const insights = await getSalesInsights();
//       console.log(
//         `📈 [AI CTRL] Sales insights fetched in ${Date.now() - t1}ms`,
//       );

//       prompt = buildSalesPrompt(insights, question);
//     }

//     console.log(`📝 [AI CTRL] Prompt length: ${prompt.length} chars`);

//     // ── Call Sarvam AI ─────────────────────────────
//     const t3 = Date.now();
//     const answer = await generateAIResponse(prompt);
//     console.log(`🤖 [AI CTRL] Sarvam responded in ${Date.now() - t3}ms`);

//     const total = Date.now() - start;
//     if (total > 5000) {
//       console.warn(`⚠️  [AI CTRL] SLOW: ${total}ms — check internet`);
//     } else {
//       console.log(`🚀 [AI CTRL] FAST: ${total}ms ✓`);
//     }

//     console.log("🧠 [AI CTRL] ══════════════════════════════════");

//     res.json({ answer });
//   } catch (err) {
//     const total = Date.now() - start;
//     console.error(`❌ [AI CTRL] FAILED after ${total}ms:`, err.message);
//     console.error("❌ [AI CTRL] ══════════════════════════════════");
//     res.status(503).json({ message: "AI busy, retry shortly" });
//   }
// }

// /* ─────────────────────────────────────────────
//    📊 DEDICATED ANALYTICS AI ENDPOINT
//    POST /api/ai/analytics
// ───────────────────────────────────────────── */
// export async function askAnalyticsAI(req, res) {
//   console.log("📊 [ANALYTICS AI] Dedicated analytics endpoint triggered");

//   try {
//     const { question } = req.body;

//     if (!question?.trim()) {
//       return res.status(400).json({ message: "Question required" });
//     }

//     const snapshot = await getAdvancedAnalyticsSnapshot();

//     let prompt;

//     if (
//       question.includes("Pipeline Status:") &&
//       question.includes("Main Risk:") &&
//       question.includes("Immediate Action:")
//     ) {
//       console.log("⚡ [ANALYTYTICS AI] Quick mode detected");
//       prompt = buildQuickAnalyticsPrompt(snapshot);
//     } else {
//       console.log("📊 [ANALYTICS AI] Detailed mode detected");
//       prompt = buildAdvancedAnalyticsPrompt(snapshot, question);
//     }

//     const answer = await generateAIResponse(prompt);

//     res.json({ answer });
//   } catch (err) {
//     console.error("❌ [ANALYTICS AI] Error:", err.message);
//     res.status(503).json({ message: "Analytics AI busy" });
//   }
// }

// src/controllers/ai.controller.js
import { getSalesInsights } from "../ai/salesInsights.service.js";
import {
  buildSalesPrompt,
  buildAdvancedAnalyticsPrompt,
  buildQuickAnalyticsPrompt,
  buildEmailTemplatePrompt,
  classifyQuestion,
} from "../ai/promptBuilder.js";

import { generateAIResponse, getModelStatus } from "../ai/aiClient.js";
import { getAdvancedAnalyticsSnapshot } from "../ai/advancedAnalytics.service.js";

/* ─────────────────────────────────────────────
   🔐 SECURITY BLOCK RESPONSE
───────────────────────────────────────────── */
function securityBlockedResponse() {
  return {
    answer:
      "For security reasons, customer personal data cannot be accessed through the AI assistant. I can help with CRM analytics, pipeline insights, and sales performance instead.",
  };
}

/* ─────────────────────────────────────────────
   🧠 MAIN CHATBOT CONTROLLER
   POST /api/ai/chat
───────────────────────────────────────────── */
export async function askAI(req, res) {
  const start = Date.now();

  // console.log("🧠 [AI CTRL] ══════════════════════════════════");
  // console.log("🧠 [AI CTRL] Request received:", new Date().toISOString());

  try {
    const { question } = req.body;

    console.log("❓ [AI CTRL] Question:", question);

    if (!question?.trim()) {
      console.warn("⚠️ [AI CTRL] Empty question");
      return res.status(400).json({ message: "Question required" });
    }

    /* ─────────────────────────────────────────────
       MODEL STATUS
    ───────────────────────────────────────────── */
    const status = getModelStatus();
    console.log("📊 [AI CTRL] Model status:", JSON.stringify(status));

    /* ─────────────────────────────────────────────
       CLASSIFY QUESTION
    ───────────────────────────────────────────── */
    const category = classifyQuestion(question);

    console.log("🧠 [AI CTRL] Classified as:", category);

    /* ─────────────────────────────────────────────
       SECURITY GATEWAY
    ───────────────────────────────────────────── */
    if (category === "security_sensitive") {
      console.warn("🔐 [AI CTRL] Security-sensitive query blocked");
      return res.json(securityBlockedResponse());
    }

    /* ─────────────────────────────────────────────
       ROUTING LOGIC
    ───────────────────────────────────────────── */

    let messages;

    if (category === "analytics_question") {
      console.log("📊 [AI CTRL] Routing → Advanced Analytics");

      const t1 = Date.now();
      const snapshot = await getAdvancedAnalyticsSnapshot();

      console.log(
        `📊 [AI CTRL] Analytics snapshot fetched in ${Date.now() - t1}ms`,
      );

      messages = buildAdvancedAnalyticsPrompt(snapshot, question);
    } else {
      console.log("📈 [AI CTRL] Routing → Sales Assistant");

      const t1 = Date.now();
      const insights = await getSalesInsights();

      // console.log(
      //   `📈 [AI CTRL] Sales insights fetched in ${Date.now() - t1}ms`,
      // );

      messages = buildSalesPrompt(insights, question);
    }

    console.log(
      `📝 [AI CTRL] Message payload size: ${JSON.stringify(messages).length} chars`,
    );

    /* ─────────────────────────────────────────────
       CALL SARVAM AI
    ───────────────────────────────────────────── */

    const t3 = Date.now();

    // const answer = await generateAIResponse(messages);

    let answer = await generateAIResponse(messages);

    // 🔥 CLEAN <think> TAGS (ADD THIS BLOCK)
    if (typeof answer === "string") {
      answer = answer
        .replace(/<think>[\s\S]*?<\/think>/gi, "")
        .replace(/<think>/gi, "")
        .replace(/<\/think>/gi, "")
        .trim();
    }

    console.log(`🤖 [AI CTRL] Sarvam responded in ${Date.now() - t3}ms`);

    const total = Date.now() - start;

    if (total > 5000) {
      console.warn(`⚠️ [AI CTRL] SLOW RESPONSE: ${total}ms`);
    } else {
      console.log(`🚀 [AI CTRL] FAST RESPONSE: ${total}ms`);
    }

    // console.log("🧠 [AI CTRL] ══════════════════════════════════");

    res.json({ answer });
  } catch (err) {
    const total = Date.now() - start;

    console.error(`❌ [AI CTRL] FAILED after ${total}ms`);
    console.error("❌ [AI CTRL] Error:", err.message);

    res.status(503).json({
      message: "AI service temporarily unavailable. Please retry.",
    });
  }
}

// /* ─────────────────────────────────────────────
//    📊 ANALYTICS AI ENDPOINT
//    POST /api/ai/analytics
// ───────────────────────────────────────────── */

// export async function askAnalyticsAI(req, res) {
//   console.log("📊 [ANALYTICS AI] Endpoint triggered");

//   try {
//     const { question, snapshot: frontendSnapshot, mode, regenerate } = req.body;

//     console.log("📊 Incoming body:", req.body);

//     /* ─────────────────────────────────────────────
//        ✅ SAFE QUESTION HANDLING + VARIATION INJECTION
//     ───────────────────────────────────────────── */

//     let safeQuestion = "";

//     if (typeof question === "string") {
//       safeQuestion = question;
//     } else if (typeof question === "object" && question?.question) {
//       safeQuestion = question.question;
//       console.log("⚠️ Extracted nested question");
//     } else {
//       console.warn("⚠️ Invalid question format:", question);
//       safeQuestion = "Generate CRM analytics insights";
//     }

//     if (!safeQuestion.trim()) {
//       safeQuestion = "Generate CRM analytics insights";
//     }

//     // 🔥 CRITICAL: FORCE NEW WORDING ON REGENERATE
//     if (regenerate) {
//       safeQuestion += ` (variation ${Date.now()})`;
//     }

//     /* ─────────────────────────────────────────────
//        ✅ SNAPSHOT (REUSE SAME DATA)
//     ───────────────────────────────────────────── */

//     const snapshot = frontendSnapshot || (await getAdvancedAnalyticsSnapshot());

//     /* ─────────────────────────────────────────────
//        ✅ BUILD PROMPT BASED ON MODE
//     ───────────────────────────────────────────── */

//     let messages;

//     if (mode === "quick") {
//       console.log("⚡ [ANALYTICS AI] Quick analytics mode");

//       messages = buildQuickAnalyticsPrompt({
//         ...snapshot,
//         regenerate, // pass signal
//       });
//     } else {
//       console.log("📊 [ANALYTICS AI] Detailed analytics mode");

//       messages = buildAdvancedAnalyticsPrompt(
//         {
//           ...snapshot,
//           regenerate, // pass signal
//         },
//         safeQuestion,
//       );
//     }

//     console.log("🧠 FINAL MODE:", mode);
//     console.log("🔁 REGENERATE:", regenerate);
//     console.log("❓ FINAL QUESTION:", safeQuestion);

//     /* ─────────────────────────────────────────────
//        🤖 CALL AI
//     ───────────────────────────────────────────── */

//     let answer = await generateAIResponse(messages);

//     /* ─────────────────────────────────────────────
//        🧹 CLEAN <think> TAGS
//     ───────────────────────────────────────────── */

//     if (typeof answer === "string") {
//       answer = answer
//         .replace(/<think>[\s\S]*?<\/think>/gi, "")
//         .replace(/<think>/gi, "")
//         .replace(/<\/think>/gi, "")
//         .trim();
//     }

//     console.log("🧠 [ANALYTICS AI] RAW AI RESPONSE:");
//     console.log(answer);
//     console.log("────────────────────────");

//     /* ─────────────────────────────────────────────
//        ✅ NORMALIZATION FOR FRONTEND
//     ───────────────────────────────────────────── */

//     if (typeof answer === "string") {
//       answer = answer
//         // 🔥 Normalize section titles
//         .replace(/Pipeline Overview/gi, "Pipeline Status:")
//         .replace(/Revenue Performance/gi, "Pipeline Status:")
//         .replace(/Key Observations/gi, "Main Risk:")
//         .replace(/Risk Analysis/gi, "Main Risk:")
//         .replace(/Recommendations/gi, "Strategic Recommendation:")

//         // 🔥 Remove bullets/dashes
//         .replace(/^\s*[-•]\s*/gm, "")

//         // 🔥 Clean spacing
//         .replace(/\n{2,}/g, "\n")
//         .trim();

//       // 🔥 Ensure Immediate Action exists
//       if (!answer.includes("Immediate Action:")) {
//         answer +=
//           "\nImmediate Action: Focus on progressing active deals and accelerating deal closures.";
//       }
//     }

//     /* ─────────────────────────────────────────────
//        🚀 RESPONSE
//     ───────────────────────────────────────────── */

//     res.json({ answer });
//   } catch (err) {
//     console.error("❌ [ANALYTICS AI] Error:", err.message);

//     res.status(503).json({
//       message: "Analytics AI temporarily unavailable",
//     });
//   }
// }

export async function askAnalyticsAI(req, res) {
  console.log("📊 [ANALYTICS AI] Endpoint triggered");

  try {
    const { question, snapshot: frontendSnapshot, mode, regenerate } = req.body;

    console.log("📊 Incoming body:", req.body);

    /* ─────────────────────────────────────────────
       ✅ SAFE QUESTION HANDLING + VARIATION INJECTION
    ───────────────────────────────────────────── */

    let safeQuestion = "";

    if (typeof question === "string") {
      safeQuestion = question;
    } else if (typeof question === "object" && question?.question) {
      safeQuestion = question.question;
      console.log("⚠️ Extracted nested question");
    } else {
      console.warn("⚠️ Invalid question format:", question);
      safeQuestion = "Generate CRM analytics insights";
    }

    if (!safeQuestion.trim()) {
      safeQuestion = "Generate CRM analytics insights";
    }

    // 🔥 FORCE NEW WORDING ON REGENERATE
    if (regenerate) {
      safeQuestion += ` (variation ${Date.now()})`;
    }

    /* ─────────────────────────────────────────────
       ✅ SNAPSHOT (REUSE SAME DATA)
    ───────────────────────────────────────────── */

    const snapshot = frontendSnapshot || (await getAdvancedAnalyticsSnapshot());

    console.log("🧠 SNAPSHOT:", snapshot);

    /* ─────────────────────────────────────────────
       ✅ BUILD PROMPT BASED ON MODE
    ───────────────────────────────────────────── */

    let messages;

    if (mode === "quick") {
      console.log("⚡ [ANALYTICS AI] Quick analytics mode");

      messages = buildQuickAnalyticsPrompt({
        ...snapshot,
        regenerate,
      });
    } else {
      console.log("📊 [ANALYTICS AI] Detailed analytics mode");

      messages = buildAdvancedAnalyticsPrompt(
        {
          ...snapshot,
          regenerate,
        },
        safeQuestion,
      );
    }

    console.log("🧠 FINAL MODE:", mode);
    console.log("🔁 REGENERATE:", regenerate);
    console.log("❓ FINAL QUESTION:", safeQuestion);

    /* ─────────────────────────────────────────────
       🤖 CALL AI
    ───────────────────────────────────────────── */

    let answer = await generateAIResponse(messages);

    // 🔥 FORCE ONE-LINE PER SECTION
    function limitToOneLine(text) {
      if (!text) return text;
      const firstSentence = text.split(".")[0];
      return firstSentence.trim() + ".";
    }

    /* ─────────────────────────────────────────────
       🧹 CLEAN <think> TAGS
    ───────────────────────────────────────────── */

    if (typeof answer === "string") {
      answer = answer
        .replace(/<think>[\s\S]*?<\/think>/gi, "")
        .replace(/<think>/gi, "")
        .replace(/<\/think>/gi, "")
        .trim();
    }
    

    // console.log("🧠 [ANALYTICS AI] RAW AI RESPONSE:");
    // console.log(answer);
    // console.log("────────────────────────");

    /* ─────────────────────────────────────────────
       ✅ NORMALIZATION + HARD GUARANTEE (CRITICAL FIX)
    ───────────────────────────────────────────── */

    if (typeof answer === "string") {
      answer = answer
        // Normalize section titles
        .replace(/Pipeline Overview/gi, "Pipeline Status:")
        .replace(/Revenue Performance/gi, "Pipeline Status:")
        .replace(/Key Observations/gi, "Main Risk:")
        .replace(/Risk Analysis/gi, "Main Risk:")
        .replace(/Recommendations/gi, "Strategic Recommendation:")

        // Remove bullets
        .replace(/^\s*[-•]\s*/gm, "")

        // Clean spacing
        .replace(/\n{2,}/g, "\n")
        .trim();

      // 🔥 GUARANTEE ALL 4 SECTIONS

      if (!answer.includes("Pipeline Status:")) {
        answer =
          "Pipeline Status: Pipeline shows moderate activity with open deals requiring attention.\n" +
          answer;
      }

      if (!answer.includes("Main Risk:")) {
        answer +=
          "\nMain Risk: High number of open deals may delay revenue realization.";
      }

      if (!answer.includes("Immediate Action:")) {
        answer +=
          "\nImmediate Action: Focus on progressing active deals and accelerating deal closures.";
      }

      if (!answer.includes("Strategic Recommendation:")) {
        answer +=
          "\nStrategic Recommendation: Improve pipeline balance by prioritizing high-probability deals and strengthening conversion strategies.";
      }
    }

    /* ─────────────────────────────────────────────
       🚀 RESPONSE
    ───────────────────────────────────────────── */

    res.json({ answer });
  } catch (err) {
    console.error("❌ [ANALYTICS AI] Error:", err.message);

    res.status(503).json({
      message: "Analytics AI temporarily unavailable",
    });
  }
}
/* ─────────────────────────────────────────────
   ✉️ AI EMAIL TEMPLATE GENERATOR
   POST /api/ai/generate-template
───────────────────────────────────────────── */

// export async function generateEmailTemplateAI(req, res) {
//   try {
//     const { purpose, tone, category, recipient, length } = req.body;

//     console.log("✉️ [AI TEMPLATE] Generating template");

//     const messages = buildEmailTemplatePrompt({
//       purpose,
//       tone,
//       category,
//       recipient,
//       length,
//     });

//     const aiText = await generateAIResponse(messages);

//     if (!aiText) {
//       return res.status(500).json({
//         success: false,
//         message: "AI failed to generate template",
//       });
//     }

//     /*
//     ─────────────────────────────────────────────
//     CLEAN AI RESPONSE
//     Remove <think> reasoning and extract JSON
//     ─────────────────────────────────────────────
//     */

//     let parsed;

//     try {
//       // Remove <think> blocks
//       let cleaned = aiText.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

//       // Extract JSON object
//       const jsonMatch = cleaned.match(/\{[\s\S]*\}/);

//       if (!jsonMatch) {
//         throw new Error("No JSON object found in AI response");
//       }

//       parsed = JSON.parse(jsonMatch[0]);
//     } catch (err) {
//       console.error("❌ AI JSON parse failed:", aiText);

//       return res.status(500).json({
//         success: false,
//         message: "AI returned invalid format",
//       });
//     }

//     /*
//     ─────────────────────────────────────────────
//     SUCCESS RESPONSE
//     ─────────────────────────────────────────────
//     */

//     console.log("✅ AI Template Generated");

//     res.json({
//       success: true,
//       data: {
//         name: parsed.templateName || "AI Generated Template",
//         subject: parsed.subject || "",
//         body: parsed.body || "",
//       },
//     });
//   } catch (err) {
//     console.error("❌ AI Template Generation Failed:", err.message);

//     res.status(503).json({
//       success: false,
//       message: "AI template generation unavailable",
//     });
//   }
// }

// /* ─────────────────────────────────────────────
//    ✉️ AI EMAIL TEMPLATE GENERATOR
//    POST /api/ai/generate-template
// ───────────────────────────────────────────── */

// export async function generateEmailTemplateAI(req, res) {
//   try {
//     const { purpose, tone, category, recipient, length } = req.body;

//     console.log("✉️ [AI TEMPLATE] Generating template");

//     /* ─────────────────────────────────────────────
//        BUILD PROMPT
//     ───────────────────────────────────────────── */

//     const messages = buildEmailTemplatePrompt({
//       purpose,
//       tone,
//       category,
//       recipient,
//       length,
//     });

//     /* ─────────────────────────────────────────────
//        CALL AI
//     ───────────────────────────────────────────── */

//     const aiText = await generateAIResponse(messages);
//     console.log("🧠 RAW AI TEMPLATE RESPONSE:\n", aiText);

//     if (!aiText) {
//       console.warn("⚠️ [AI TEMPLATE] Empty AI response");

//       return res.status(500).json({
//         success: false,
//         message: "AI failed to generate template",
//       });
//     }

//     /*
//     ─────────────────────────────────────────────
//     CLEAN AI RESPONSE
//     Remove reasoning blocks and extract JSON
//     ─────────────────────────────────────────────
//     */

//     let parsed;

//     try {
//       function extractJSONSafe(text) {
//         try {
//           // 1. Remove <think>
//           text = text.replace(/<think>[\s\S]*?<\/think>/gi, "");

//           // 2. Remove markdown
//           text = text.replace(/```json/gi, "").replace(/```/g, "");

//           // 3. Fix broken escape characters (CRITICAL FIX)
//           text = text.replace(/\\\n/g, "\\n");

//           // 4. Extract JSON block
//           const match = text.match(/\{[\s\S]*\}/);

//           if (!match) {
//             throw new Error("No JSON found");
//           }

//           let jsonString = match[0];

//           // 5. Remove trailing commas (optional safety)
//           jsonString = jsonString.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");

//           return JSON.parse(jsonString);
//         } catch (err) {
//           console.error("❌ JSON extraction failed");
//           console.error("RAW AI RESPONSE:\n", text);
//           throw err;
//         }
//       }
//     } catch (err) {
//       console.error("❌ [AI TEMPLATE] JSON parse failed");
//       console.error("AI RESPONSE:", aiText);

//       return res.status(500).json({
//         success: false,
//         message: "AI returned invalid format",
//       });
//     }

//     /*
//     ─────────────────────────────────────────────
//     SANITIZE AI OUTPUT
//     Remove hallucinated placeholders
//     ─────────────────────────────────────────────
//     */

//     let body = parsed.body || "";

//     body = body
//       .replace(/\[your name\]/gi, "{{user.name}}")
//       .replace(/\[your company\]/gi, "our company")
//       .replace(/\[company name\]/gi, "{{account.accountName}}")
//       .replace(/\[product\]/gi, "{{deal.dealName}}")
//       .replace(/\[key benefit\]/gi, "value")
//       .replace(/\[.*?\]/g, "");

//     /*
//     ─────────────────────────────────────────────
//     SECURITY VALIDATION
//     Prevent sensitive data leaks
//     ─────────────────────────────────────────────
//     */

//     if (body.includes("@") || body.match(/\+?\d{6,}/)) {
//       console.warn("⚠️ [AI TEMPLATE] Possible sensitive data detected");

//       return res.status(500).json({
//         success: false,
//         message: "AI generated unsafe template",
//       });
//     }

//     /*
//     ─────────────────────────────────────────────
//     SUCCESS RESPONSE
//     ─────────────────────────────────────────────
//     */

//     console.log("✅ [AI TEMPLATE] Template Generated Successfully");

//     res.json({
//       success: true,
//       data: {
//         name: parsed.templateName || "AI Generated Template",
//         subject: parsed.subject || "",
//         body: body,
//       },
//     });
//   } catch (err) {
//     console.error("❌ [AI TEMPLATE] Generation Failed:", err.message);

//     res.status(503).json({
//       success: false,
//       message: "AI template generation unavailable",
//     });
//   }
// }

/* ─────────────────────────────────────────────
   ✉️ AI EMAIL TEMPLATE GENERATOR
   POST /api/ai/generate-template
───────────────────────────────────────────── */

export async function generateEmailTemplateAI(req, res) {
  try {
    const { purpose, tone, category, recipient, length } = req.body;

    console.log("✉️ [AI TEMPLATE] Generating template");

    /* ─────────────────────────────────────────────
       BUILD PROMPT
    ───────────────────────────────────────────── */

    const messages = buildEmailTemplatePrompt({
      purpose,
      tone,
      category,
      recipient,
      length,
    });

    /* ─────────────────────────────────────────────
       CALL AI WITH RETRY (CRITICAL FIX)
    ───────────────────────────────────────────── */

    let aiText = null;
    for (let attempt = 1; attempt <= 2; attempt++) {
      let retryMessages = messages;

      // 🔥 SECOND ATTEMPT = FORCE JSON MODE
      if (attempt === 2) {
        retryMessages = [
          {
            role: "system",
            content:
              "Return ONLY valid JSON. No <think>. No explanation. Start with { and end with }. Do not write anything else.",
          },
          ...messages,
        ];
      }

      aiText = await generateAIResponse(retryMessages);

      console.log(`🧠 AI Attempt ${attempt}:\n`, aiText);

      if (aiText && aiText.includes("{") && aiText.includes("}")) {
        break; // valid JSON candidate
      }

      console.warn(`⚠️ AI returned non-JSON (attempt ${attempt})`);
    }

    if (!aiText || !aiText.includes("{")) {
      console.warn("⚠️ AI failed → returning safe fallback");

      return res.json({
        success: true,
        data: {
          name: "AI Generated Template",
          subject: "Quick discussion",
          body: "{{header}}\n\nHi {{contact.firstName}},\n\nI wanted to connect with you regarding {{deal.dealName}}.\n\nWould you be open to a brief conversation next week?\n\n{{signature}}\n{{footer}}",
        },
      });
    }

    /* ─────────────────────────────────────────────
       SAFE JSON EXTRACTION
    ───────────────────────────────────────────── */

    function extractJSONSafe(text) {
      try {
        // Remove <think>
        text = text.replace(/<think>[\s\S]*?<\/think>/gi, "");

        // Remove markdown
        text = text.replace(/```json/gi, "").replace(/```/g, "");

        // Fix broken escapes
        text = text.replace(/\\\n/g, "\\n");

        // Extract JSON
        const match = text.match(/\{[\s\S]*\}/);

        if (!match) {
          throw new Error("No JSON found");
        }

        let jsonString = match[0];

        // Remove trailing commas
        jsonString = jsonString.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");

        return JSON.parse(jsonString);
      } catch (err) {
        console.error("❌ JSON extraction failed");
        console.error("❌ RAW AI RESPONSE:\n", text);
        throw err;
      }
    }

    let parsed = null;

    try {
      parsed = extractJSONSafe(aiText);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "AI returned invalid JSON",
      });
    }

    /* ─────────────────────────────────────────────
       VALIDATION
    ───────────────────────────────────────────── */

    if (!parsed || typeof parsed !== "object") {
      return res.status(500).json({
        success: false,
        message: "AI response parsing failed",
      });
    }

    /* ─────────────────────────────────────────────
       SANITIZE OUTPUT
    ───────────────────────────────────────────── */

    let body = parsed?.body || "";

    body = body
      .replace(/\[your name\]/gi, "{{user.name}}")
      .replace(/\[your company\]/gi, "our company")
      .replace(/\[company name\]/gi, "{{account.accountName}}")
      .replace(/\[product\]/gi, "{{deal.dealName}}")
      .replace(/\[key benefit\]/gi, "value")
      .replace(/\[.*?\]/g, "");

    /* ─────────────────────────────────────────────
       SECURITY CHECK
    ───────────────────────────────────────────── */

    if (body.includes("@") || body.match(/\+?\d{6,}/)) {
      console.warn("⚠️ [AI TEMPLATE] Possible sensitive data detected");

      return res.status(500).json({
        success: false,
        message: "AI generated unsafe template",
      });
    }

    /* ─────────────────────────────────────────────
       SUCCESS RESPONSE
    ───────────────────────────────────────────── */

    console.log("✅ [AI TEMPLATE] Template Generated Successfully");

    res.json({
      success: true,
      data: {
        name: parsed.templateName || "AI Generated Template",
        subject: parsed.subject || "",
        body: body,
      },
    });
  } catch (err) {
    console.error("❌ [AI TEMPLATE] Generation Failed:", err.message);

    res.status(503).json({
      success: false,
      message: "AI template generation unavailable",
    });
  }
}

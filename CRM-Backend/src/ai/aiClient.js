// src/ai/aiClient.js

import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const SARVAM_API_URL = "https://api.sarvam.ai/v1/chat/completions";
const SARVAM_MODEL = "sarvam-m";

let modelReady = false;
let apiKeyLogged = false;

function getApiKey() {
  const key = process.env.SARVAM_API_KEY;

  if (!key) {
    throw new Error("SARVAM_API_KEY missing from .env");
  }

  // Log only once in development
  if (!apiKeyLogged && process.env.NODE_ENV === "development") {
    console.log("🔑 Sarvam API key loaded");
    apiKeyLogged = true;
  }

  return key;
}

/* ─────────────────────────────────────────────
   🔥 Warm-up (startup validation only)
───────────────────────────────────────────── */
export async function warmUpModel() {
  try {
    getApiKey();
    modelReady = true;
  } catch (err) {
    modelReady = false;
    console.error("AI initialization failed:", err.message);
    throw err;
  }
}

// /* ─────────────────────────────────────────────
//    🤖 Generate AI Response
// ───────────────────────────────────────────── */
// export async function generateAIResponse(messages) {
//   try {
//     const res = await axios.post(
//       SARVAM_API_URL,
//       {
//         model: SARVAM_MODEL,
//         messages,
//         max_tokens: 600,

//         // 🔥 CRITICAL FOR REGENERATION VARIATION
//         temperature: 0.95,
//         top_p: 0.9,

//         // 🔥 (optional but strong)
//         presence_penalty: 0.6,
//         frequency_penalty: 0.4,
//       },
//       {
//         headers: {
//           "api-subscription-key": getApiKey(),
//           "Content-Type": "application/json",
//         },
//         timeout: 20000,
//       },
//     );

//     return res.data?.choices?.[0]?.message?.content?.trim() || "";
//   } catch (err) {
//     if (err.response?.status === 401) {
//       console.error("Sarvam API unauthorized — check SARVAM_API_KEY");
//     } else if (err.response?.status === 429) {
//       console.error("Sarvam rate limit exceeded");
//     } else if (err.code === "ECONNABORTED") {
//       console.error("Sarvam request timeout");
//     } else {
//       console.error("Sarvam error:", err.message);
//     }

//     throw err;
//   }
// }

/* ─────────────────────────────────────────────
   🤖 Generate AI Response (STABLE + BALANCED)
───────────────────────────────────────────── */
export async function generateAIResponse(messages) {
  try {
    const res = await axios.post(
      SARVAM_API_URL,
      {
        model: SARVAM_MODEL,
        messages,

        // ✅ Increased to avoid truncation (important for JSON)
        max_tokens: 900,

        // ✅ BALANCED (key fix)
        // - low enough for JSON stability
        // - not too low (analytics/chat won't feel robotic)
        temperature: 0.3,

        // ✅ full probability (no randomness cut-off)
        top_p: 1,

        // ❌ REMOVED penalties (they break structure)
        // presence_penalty: 0.6,
        // frequency_penalty: 0.4,
      },
      {
        headers: {
          "api-subscription-key": getApiKey(),
          "Content-Type": "application/json",
        },
        timeout: 20000,
      },
    );

    let output = res.data?.choices?.[0]?.message?.content?.trim() || "";

    /* ─────────────────────────────────────────────
       🧹 HARD CLEAN (GLOBAL FIX)
    ───────────────────────────────────────────── */

    if (typeof output === "string") {
      output = output
        // remove <think> completely
        .replace(/<think>[\s\S]*?<\/think>/gi, "")
        .replace(/<think>/gi, "")
        .replace(/<\/think>/gi, "")
        .trim();
    }

    return output;
  } catch (err) {
    if (err.response?.status === 401) {
      console.error("Sarvam API unauthorized — check SARVAM_API_KEY");
    } else if (err.response?.status === 429) {
      console.error("Sarvam rate limit exceeded");
    } else if (err.code === "ECONNABORTED") {
      console.error("Sarvam request timeout");
    } else {
      console.error("Sarvam error:", err.message);
    }

    throw err;
  }
}

/* ─────────────────────────────────────────────
   📊 Model Status
───────────────────────────────────────────── */
export function getModelStatus() {
  return {
    ready: modelReady,
    model: SARVAM_MODEL,
    provider: "sarvam-ai",
  };
}

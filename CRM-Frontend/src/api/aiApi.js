// // src/api/aiApi.js
// import axios from "axios";

// const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// export async function askCRM(question) {
//   const start = Date.now();
//   console.log("🧠 [AI API] ──────────────────────────────────");
//   console.log("🧠 [AI API] Sending question:", question);
//   console.log("🧠 [AI API] Target:", `${API}/api/ai/ask`);

//   try {
//     const res = await axios.post(
//       `${API}/api/ai/ask`,
//       { question },
//       { timeout: 20000 } // 20s — Sarvam responds in 1-3s, 20s is safe buffer
//     );

//     const elapsed = Date.now() - start;
//     console.log(`✅ [AI API] Response received in ${elapsed}ms`);

//     if (elapsed > 5000) {
//       console.warn(`⚠️  [AI API] Slow response (${elapsed}ms) — check internet`);
//     } else {
//       console.log(`🚀 [AI API] Fast response (${elapsed}ms) ✓`);
//     }

//     console.log("🧠 [AI API] ──────────────────────────────────");
//     return res.data.answer;

//   } catch (err) {
//     const elapsed = Date.now() - start;
//     console.error("❌ [AI API] ──────────────────────────────────");
//     console.error(`❌ [AI API] FAILED after ${elapsed}ms — ${err.message}`);

//     if (err.code === "ECONNABORTED") {
//       console.error("❌ [AI API] TIMEOUT — Sarvam took >20s, check internet");
//     } else if (err.response?.status === 503) {
//       console.error("❌ [AI API] 503 — backend error, check server logs");
//     } else if (err.code === "ERR_NETWORK") {
//       console.error("❌ [AI API] Network error — is backend running on", API);
//     }

//     console.error("❌ [AI API] ──────────────────────────────────");
//     return "Something went wrong. Please try again.";
//   }
// }
// // 🔥 Advanced Analytics AI (Executive Strategist)
// export async function askAnalyticsAI(question) {
//   const start = Date.now();
//   console.log("📊 [AI API] Analytics question:", question);

//   try {
//     const res = await axios.post(
//       `${API}/api/ai/analytics`,
//       { question },
//       { timeout: 20000 }
//     );

//     const elapsed = Date.now() - start;
//     console.log(`📊 [AI API] Analytics response in ${elapsed}ms`);

//     return res.data.answer;
//   } catch (err) {
//     console.error("❌ [AI API] Analytics AI failed:", err.message);
//     return "Unable to generate analytics insights. Please try again.";
//   }
// }

// // src/api/aiApi.js
// import axios from "axios";

// const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// /* ─────────────────────────────────────────────
//    🤖 CRM AI CHAT
//    POST /api/ai/chat
// ───────────────────────────────────────────── */
// export async function askCRM(question) {
//   const start = Date.now();

//   console.log("🧠 [AI API] ──────────────────────────────────");
//   console.log("🧠 [AI API] Sending question:", question);
//   console.log("🧠 [AI API] Target:", `${API}/api/ai/chat`);

//   try {
//     const res = await axios.post(
//       `${API}/api/ai/chat`,
//       { question },
//       { timeout: 20000 }, // 20s safe timeout
//     );

//     const elapsed = Date.now() - start;
//     console.log(`✅ [AI API] Response received in ${elapsed}ms`);

//     if (elapsed > 5000) {
//       console.warn(`⚠️ [AI API] Slow response (${elapsed}ms) — check internet`);
//     } else {
//       console.log(`🚀 [AI API] Fast response (${elapsed}ms) ✓`);
//     }

//     console.log("🧠 [AI API] ──────────────────────────────────");

//     return res.data?.answer || "No insights available.";
//   } catch (err) {
//     const elapsed = Date.now() - start;

//     console.error("❌ [AI API] ──────────────────────────────────");
//     console.error(`❌ [AI API] FAILED after ${elapsed}ms — ${err.message}`);

//     if (err.code === "ECONNABORTED") {
//       console.error("❌ [AI API] TIMEOUT — AI request took >20s");
//     } else if (err.response?.status === 503) {
//       console.error("❌ [AI API] 503 — backend error, check server logs");
//     } else if (err.response?.status === 404) {
//       console.error("❌ [AI API] 404 — route not found");
//     } else if (err.code === "ERR_NETWORK") {
//       console.error("❌ [AI API] Network error — backend not running at", API);
//     }

//     console.error("❌ [AI API] ──────────────────────────────────");

//     return "Something went wrong. Please try again.";
//   }
// }

// /* ─────────────────────────────────────────────
//    📊 ADVANCED ANALYTICS AI
//    POST /api/ai/analytics
// ───────────────────────────────────────────── */
// export async function askAnalyticsAI(question) {
//   const start = Date.now();

//   console.log("📊 [AI API] ──────────────────────────────────");
//   console.log("📊 [AI API] Analytics question:", question);
//   console.log("📊 [AI API] Target:", `${API}/api/ai/analytics`);

//   try {
//     const res = await axios.post(
//       `${API}/api/ai/analytics`,
//       { question },
//       { timeout: 20000 },
//     );

//     const elapsed = Date.now() - start;
//     console.log(`📊 [AI API] Analytics response in ${elapsed}ms`);
//     console.log("📊 [AI API] ──────────────────────────────────");

//     const answer = res.data?.answer || "";

//     return answer.trim();
//   } catch (err) {
//     console.error("❌ [AI API] ──────────────────────────────────");
//     console.error("❌ [AI API] Analytics AI failed:", err.message);

//     if (err.response?.status === 503) {
//       console.error("❌ [AI API] Backend analytics service busy");
//     }

//     console.error("❌ [AI API] ──────────────────────────────────");

//     return "Unable to generate analytics insights. Please try again.";
//   }
// }

// src/api/aiApi.js
import API from "./axios";

/* ─────────────────────────────────────────────
   🤖 CRM AI CHAT
───────────────────────────────────────────── */
export async function askCRM(question) {
  try {
    const res = await API.post("/ai/chat", { question });
    return res.data?.answer || "No insights available.";
  } catch (err) {
    console.error("AI chat failed:", err.message);
    return "Something went wrong. Please try again.";
  }
}

/* ─────────────────────────────────────────────
   📊 ADVANCED ANALYTICS AI
───────────────────────────────────────────── */
export async function askAnalyticsAI(payload) {
  try {
    const res = await API.post("/ai/analytics", {
      question: payload.question,
      mode: payload.mode,
      regenerate: payload.regenerate,
      snapshot: payload.snapshot,
    });

    return res.data?.answer?.trim() || "";
  } catch (err) {
    console.error("Analytics AI failed:", err.message);
    return "Unable to generate analytics insights. Please try again.";
  }
}

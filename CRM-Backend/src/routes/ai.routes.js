// // src/routes/ai.routes.js

// import express from "express";
// import { askAI, askAnalyticsAI } from "../controllers/ai.controller.js";

// const router = express.Router();

// router.post("/ask", askAI);
// router.post("/analytics", askAnalyticsAI); // 🔥 NEW ROUTE

// export default router;
//======================================================================//  


// src/routes/ai.routes.js
import express from "express";
import { askAI, askAnalyticsAI } from "../controllers/ai.controller.js";

const router = express.Router();

/* ─────────────────────────────────────────────
   🤖 AI CHAT ENDPOINT
   POST /api/ai/chat
   Handles general CRM questions
───────────────────────────────────────────── */
router.post("/chat", askAI);

/* ─────────────────────────────────────────────
   📊 AI ANALYTICS ENDPOINT
   POST /api/ai/analytics
   Dedicated analytics insights
───────────────────────────────────────────── */
router.post("/analytics", askAnalyticsAI);

export default router;

// src/modules/quotation/quotation.routes.js

import express from "express";
import {
  createQuotationController,
  getQuotationsController,
  getQuotationByIdController,
  getQuotationHistoryController,
  updateQuotationController,
  deleteQuotationController,
  submitQuotationController,
  approveQuotationController,
  rejectQuotationController,
  reviseQuotationController,
  getQuotationStatusSummaryController,
  getQuotationLifecycleController,
  getQuotationValueTrendController,
} from "./quotation.controller.js";

import { protect, authorize } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= CREATE ================= */
router.post("/", protect, createQuotationController);

/* ================= GET ALL ================= */
router.get("/", protect, getQuotationsController);

/* ================= GET HISTORY ================= */
// 🔥 IMPORTANT: place BEFORE "/:id"
router.get("/history/:quotationNo", protect, getQuotationHistoryController);

/* ================= APPROVAL FLOW ================= */
// 🔒 SALES REP ONLY
router.post(
  "/:id/submit",
  protect,
  authorize("SUPER_ADMIN", "TSL", "MANAGER", "TSE"),
  submitQuotationController,
);

// 🔒 ADMIN ONLY
router.post(
  "/:id/approve",
  protect,
  authorize("SUPER_ADMIN", "TSL", "MANAGER", "KAM"),
  approveQuotationController,
);
router.post(
  "/:id/reject",
  protect,
  authorize("SUPER_ADMIN", "TSL", "MANAGER", "KAM"),
  rejectQuotationController,
);

/* ================= ANALYTICS ================= */

router.get(
  "/analytics/status-summary",
  protect,
  getQuotationStatusSummaryController,
);

router.get("/analytics/lifecycle", protect, getQuotationLifecycleController);

router.get("/analytics/value-trend", protect, getQuotationValueTrendController);
router.post("/:id/revise", protect, reviseQuotationController);

/* ================= GET ONE ================= */
router.get("/:id", protect, getQuotationByIdController);

/* ================= UPDATE ================= */
router.put("/:id", protect, updateQuotationController);

/* ================= DELETE ================= */
router.delete("/:id", protect, authorize("SUPER_ADMIN", "TSL"), deleteQuotationController);

export default router;

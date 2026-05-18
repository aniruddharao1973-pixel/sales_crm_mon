// src/routes/assignment.routes.js

import express from "express";
import {
  toggleAssignmentController,
  getDealAssignments,
  getContactAssignments,
  getAccountAssignments,
} from "../controllers/assignment.controller.js";

import { protect, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

/**
 * 🔁 Toggle assignment
 * POST /api/assignment/toggle
 */
router.post("/toggle", authorize("SUPER_ADMIN", "TSL"), toggleAssignmentController);

/**
 * 📊 Fetch assignment matrix (for grid UI)
 */
router.get("/deal", getDealAssignments);
router.get("/contact", getContactAssignments);
router.get("/account", getAccountAssignments);

export default router;

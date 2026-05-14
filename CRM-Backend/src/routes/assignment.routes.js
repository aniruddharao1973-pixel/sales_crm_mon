// src/routes/assignment.routes.js

import express from "express";
import {
  toggleAssignmentController,
  getDealAssignments,
  getContactAssignments,
  getAccountAssignments,
} from "../controllers/assignment.controller.js";

const router = express.Router();

/**
 * 🔁 Toggle assignment
 * POST /api/assignment/toggle
 */
router.post("/toggle", toggleAssignmentController);

/**
 * 📊 Fetch assignment matrix (for grid UI)
 */
router.get("/deal", getDealAssignments);
router.get("/contact", getContactAssignments);
router.get("/account", getAccountAssignments);

export default router;

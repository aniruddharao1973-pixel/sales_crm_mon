// src/modules/item/item.routes.js

import express from "express";
import multer from "multer";

import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  importItems, // 🔥 NEW
  getItemTreeBySku,
  searchItems,
} from "./item.controller.js";

import { protect, authorize } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= MULTER SETUP ================= */
const upload = multer({
  storage: multer.memoryStorage(), // ✅ keep simple (buffer-based)
});

/* ================= CREATE ================= */
router.post("/", protect, createItem);

/* ================= IMPORT ================= */
// 🔥 NEW ROUTE
router.post(
  "/import",
  protect,
  upload.single("file"), // frontend must send "file"
  importItems,
);

/* ================= READ ================= */
router.get("/", protect, getItems);

router.get("/search", protect, searchItems);

router.get("/by-sku/:sku", protect, getItemTreeBySku);

router.get("/:id", protect, getItemById);

/* ================= UPDATE ================= */
router.put("/:id", protect, updateItem);

/* ================= DELETE ================= */
router.delete("/:id", protect, authorize("ADMIN"), deleteItem);

export default router;
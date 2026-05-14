// CRM-Backend/src/modules/email/email.routes.js

import express from "express";
import * as emailController from "./email.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import campaignRoutes from "./emailCampaign.routes.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { testResendEmail } from "./email.controller.js";

// =====================================================
// 📎 MULTER CONFIG (PRODUCTION READY)
// =====================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const uploadPath = path.join("uploads", "attachments", today);

    // Ensure folder exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const timestamp = Date.now();

    // 🔹 Extract extension
    const ext = path.extname(file.originalname);

    // 🔹 Extract base name (without extension)
    const baseName = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "-") // spaces → dash
      .replace(/[^a-zA-Z0-9-_]/g, "") // remove unsafe chars
      .toLowerCase();

    // 🔹 Final filename
    const finalName = `${baseName}-${timestamp}${ext}`;

    cb(null, finalName);
  },
});

export const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/",
      "application/pdf",
      "application/msword",
      "application/vnd",
    ];

    const isValid = allowedTypes.some((type) => file.mimetype.startsWith(type));

    if (!isValid) {
      return cb(new Error(`File type not allowed: ${file.mimetype}`), false);
    }

    cb(null, true);
  },
});

const router = express.Router();

/*
=====================================================
EMAIL TEMPLATE ROUTES
=====================================================
*/
router.post("/templates", protect, emailController.createTemplate);
router.get("/templates", protect, emailController.getTemplates);

/*
=====================================================
SEND EMAIL
=====================================================
*/
router.post("/send", protect, emailController.sendEmail);

/*
=====================================================
EMAIL LOGS
=====================================================
*/
router.get("/logs", protect, emailController.getEmailLogs);
router.delete("/logs/:id", protect, emailController.deleteEmailLog);

/*
=====================================================
CONNECT GOOGLE
=====================================================
*/
router.get("/connect/google", protect, emailController.connectGoogle);
router.get("/google/callback", emailController.googleCallback);

/*
=====================================================
CONNECT OUTLOOK
=====================================================
*/
router.get("/connect/outlook", protect, emailController.connectOutlook);
router.get("/outlook/callback", emailController.outlookCallback);

router.post(
  "/templates/generate-ai",
  protect,
  emailController.generateTemplateAI,
);

router.delete("/templates/:id", protect, emailController.deleteTemplate);

router.put("/templates/:id", protect, emailController.updateTemplate);

router.use("/campaign", campaignRoutes);

/*
=====================================================
UPLOAD ATTACHMENTS
=====================================================
*/
router.post("/upload", protect, upload.array("files"), (req, res) => {
  try {
    const files = req.files;

    const formatted = files.map((file) => {
      const folder = file.destination.split(path.sep).pop(); // 2026-03-16

      return {
        fileName: file.originalname,
        fileUrl: `/${file.path.replace(/\\/g, "/")}`, // ✅ URL format
        fileType: file.mimetype,
        fileSize: file.size,
        folder,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

router.get("/test-resend", testResendEmail);

export default router;

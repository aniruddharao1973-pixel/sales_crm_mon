// CRM-Backend\src\routes\deal.routes.js
import { Router } from "express";
import multer from "multer";
import {
  getDeals,
  getDeal,
  createDeal,
  updateDeal,
  deleteDeal,
  bulkDeleteDeals,
  importDeals,
  updateStageHistoryNote,
  getPipelineStats,
  getDealByLogId,
} from "../controllers/deal.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { validateDeal } from "../middlewares/validate.middleware.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.use(protect);

// router.get("/pipeline/stats", getPipelineStats);
router.post(
  "/import",
  protect,
  authorize("SUPER_ADMIN", "TSL"),
  upload.single("file"),
  importDeals,
);
router.post("/bulk-delete", protect, authorize("SUPER_ADMIN", "TSL"), bulkDeleteDeals);
router.route("/").get(getDeals).post(authorize("SUPER_ADMIN", "TSL", "MANAGER"), validateDeal, createDeal);
router
  .route("/:id")
  .get(getDeal)
  .put(authorize("SUPER_ADMIN", "TSL", "MANAGER", "TSE"), validateDeal, updateDeal)
  .delete(authorize("SUPER_ADMIN", "TSL", "MANAGER"), deleteDeal);

router.put("/stage-history/:id", updateStageHistoryNote);

router.get("/by-log-id/:logId", getDealByLogId);

router.get("/pipeline/stats", protect, getPipelineStats);

export default router;

// export default router;
import { Router } from "express";
import {
  getAccounts,
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount,
  getAccountsDropdown,
  importAccounts,
  restoreAccount,
} from "../controllers/account.controller.js";

import { protect, authorize } from "../middlewares/auth.middleware.js";
import { validateAccount } from "../middlewares/validate.middleware.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// 🔐 All routes require login
router.use(protect);

// 👀 Read access → all logged-in users
router.get("/dropdown/list", getAccountsDropdown);
router.get("/", getAccounts);
router.get("/:id", getAccount);

// 🛑 ADMIN, MANAGER, SALES_REP → create / update
router.post(
  "/import",
  authorize("ADMIN", "MANAGER"),
  upload.single("file"),
  importAccounts,
);
router.post(
  "/",
  authorize("ADMIN", "MANAGER", "SALES_REP"),
  validateAccount,
  createAccount,
);
router.put(
  "/:id",
  authorize("ADMIN", "MANAGER", "SALES_REP"),
  validateAccount,
  updateAccount,
);
router.delete("/:id", authorize("ADMIN", "MANAGER"), deleteAccount);

router.patch("/:id/restore", authorize("ADMIN", "MANAGER"), restoreAccount);

export default router;

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

// 🛑 SUPER_ADMIN, TSL → import
router.post(
  "/import",
  authorize("SUPER_ADMIN", "TSL"),
  upload.single("file"),
  importAccounts,
);

// 🛑 SUPER_ADMIN, TSL, MANAGER → create / update
router.post(
  "/",
  authorize("SUPER_ADMIN", "TSL", "MANAGER"),
  validateAccount,
  createAccount,
);
router.put(
  "/:id",
  authorize("SUPER_ADMIN", "TSL", "MANAGER"),
  validateAccount,
  updateAccount,
);
router.delete("/:id", authorize("SUPER_ADMIN", "TSL"), deleteAccount);

router.patch("/:id/restore", authorize("SUPER_ADMIN", "TSL"), restoreAccount);

export default router;

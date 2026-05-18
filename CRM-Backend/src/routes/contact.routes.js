// src\routes\contact.routes.js
import { Router } from "express";
import multer from "multer";
import {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  getContactsDropdown,
  importContacts,
} from "../controllers/contact.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { validateContact } from "../middlewares/validate.middleware.js";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.use(protect);

router.get("/dropdown/list", getContactsDropdown);
router.post("/import", authorize("SUPER_ADMIN", "TSL"), upload.single("file"), importContacts);
router.route("/").get(getContacts).post(authorize("SUPER_ADMIN", "TSL", "MANAGER"), validateContact, createContact);
router
  .route("/:id")
  .get(getContact)
  .put(authorize("SUPER_ADMIN", "TSL", "MANAGER"), validateContact, updateContact)
  .delete(authorize("SUPER_ADMIN", "TSL"), deleteContact);

export default router;
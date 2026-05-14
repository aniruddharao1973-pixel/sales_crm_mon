// src/modules/email/emailCampaign.routes.js

import express from "express";
import {
  sendCampaign,
  getCampaigns,
  getCampaignStatus,
  deleteCampaign,
} from "./emailCampaign.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/*
=====================================================
SEND BULK EMAIL CAMPAIGN
=====================================================
*/
router.post("/send", protect, sendCampaign);

/*
=====================================================
GET CAMPAIGNS (Campaign Inbox)
=====================================================
*/
router.get("/list", protect, getCampaigns);

/*
=====================================================
GET CAMPAIGN STATUS (Progress Bar)
=====================================================
*/
router.get("/:id/status", protect, getCampaignStatus);

/*
=====================================================
DELETE CAMPAIGN
=====================================================
*/
router.delete("/:id", protect, deleteCampaign);

export default router;

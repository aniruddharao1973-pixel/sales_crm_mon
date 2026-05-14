// src/modules/calendar/calendar.routes.js

import express from "express";
import {
  connectGoogleCalendar,
  oauthCallback,
  createMeetingController,
  getCalendarMeetings,
  updateMeetingController,
  deleteMeetingController,
  connectMicrosoftCalendar,
  microsoftCallback,
} from "./calendar.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* CONNECT GOOGLE CALENDAR */

router.get("/connect", connectGoogleCalendar);

/* GOOGLE OAUTH CALLBACK */

router.get("/oauth/callback", oauthCallback);

/* CREATE MEETING */

router.post("/create-meeting", protect, createMeetingController);

/* GET CALENDAR MEETINGS */
router.get("/calendar", protect, getCalendarMeetings);

router.put("/update-meeting/:id", protect, updateMeetingController);

router.delete("/delete-meeting/:id", protect, deleteMeetingController);

/* CONNECT MICROSOFT TEAMS */
router.get("/microsoft/connect", connectMicrosoftCalendar);

/* MICROSOFT OAUTH CALLBACK */
router.get("/microsoft/callback", microsoftCallback);

export default router;

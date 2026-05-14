// src/modules/calendar/calendar.controller.js

import prisma from "../../utils/prisma.js";
import { getOAuthClient, getCalendarClient } from "./googleCalendar.service.js";
import { createMeeting } from "./calendar.service.js";
import axios from "axios";
/*
────────────────────────────────────────────
CONNECT GOOGLE CALENDAR
────────────────────────────────────────────
*/

export const connectGoogleCalendar = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    const oauth2Client = getOAuthClient();

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
      state: userId,
    });

    res.redirect(url);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to connect Google Calendar",
    });
  }
};

/*
────────────────────────────────────────────
GOOGLE OAUTH CALLBACK
────────────────────────────────────────────
*/
/*
────────────────────────────────────────────
GOOGLE OAUTH CALLBACK
────────────────────────────────────────────
*/

// export const oauthCallback = async (req, res) => {
//   try {
//     const { code, state } = req.query;

//     if (!code || !state) {
//       return res.status(400).json({
//         message: "Invalid OAuth callback",
//       });
//     }

//     const oauth2Client = getOAuthClient();

//     const { tokens } = await oauth2Client.getToken(code);

//     const userId = state;

//     await prisma.calendarIntegration.upsert({
//       where: {
//         userId: userId,
//       },

//       update: {
//         accessToken: tokens.access_token,
//         refreshToken: tokens.refresh_token,
//         tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
//       },

//       create: {
//         userId: userId,
//         provider: "GOOGLE",
//         accessToken: tokens.access_token,
//         refreshToken: tokens.refresh_token,
//         tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
//       },
//     });

//     /*
//     ────────────────────────────────────────────
//     REDIRECT BACK TO FRONTEND
//     ────────────────────────────────────────────
//     */

//     const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

//     return res.redirect(`${frontendUrl}/calendar?connected=true`);
//   } catch (error) {
//     console.error("Google OAuth error:", error);

//     const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

//     return res.redirect(`${frontendUrl}/calendar?connected=false`);
//   }
// };

/*
────────────────────────────────────────────
GOOGLE OAUTH CALLBACK
────────────────────────────────────────────
*/

export const oauthCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code || !state) {
      return res.status(400).json({
        message: "Invalid OAuth callback",
      });
    }

    const oauth2Client = getOAuthClient();

    const { tokens } = await oauth2Client.getToken(code);

    const userId = state;

    /*
    ────────────────────────────────────────────
    DEBUG LOGS
    ────────────────────────────────────────────
    */
    console.log("👉 Google OAuth userId:", userId);
    console.log("👉 Access Token exists:", !!tokens.access_token);
    console.log("👉 Refresh Token exists:", !!tokens.refresh_token);

    /*
    ────────────────────────────────────────────
    🔥 FIXED UPSERT (COMPOSITE UNIQUE)
    ────────────────────────────────────────────
    */
    await prisma.calendarIntegration.upsert({
      where: {
        userId_provider: {
          userId: userId,
          provider: "GOOGLE",
        },
      },

      update: {
        provider: "GOOGLE",
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      },

      create: {
        userId: userId,
        provider: "GOOGLE",
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      },
    });

    /*
    ────────────────────────────────────────────
    REDIRECT BACK TO FRONTEND
    ────────────────────────────────────────────
    */
    const frontendUrl = process.env.FRONTEND_URL;

    return res.redirect(`${frontendUrl}/calendar?connected=true`);
  } catch (error) {
    console.error("Google OAuth error:", error);

    const frontendUrl = process.env.FRONTEND_URL;

    return res.redirect(`${frontendUrl}/calendar?connected=false`);
  }
};
/*
────────────────────────────────────────────
CREATE MEETING
────────────────────────────────────────────
*/

export const createMeetingController = async (req, res) => {
  try {
    const userId = req.user.id;

    const meeting = await createMeeting({
      userId,
      ...req.body,
    });

    res.json(meeting);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/*
────────────────────────────────────────────
GET MEETINGS FOR CALENDAR (PHASE 1)
────────────────────────────────────────────
*/

export const getCalendarMeetings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({
        message: "start and end date are required",
      });
    }

    const meetings = await prisma.meeting.findMany({
      where: {
        organizerId: userId,
        startTime: {
          gte: new Date(start),
          lte: new Date(end),
        },
      },
      include: {
        contact: true,
        account: true,
        deal: true,
        attendees: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    const events = meetings.map((m) => ({
      id: m.id,
      title: m.title,
      start: m.startTime,
      end: m.endTime,

      // 🔥 used in modal
      extendedProps: {
        description: m.description,
        location: m.location,
        meetingLink: m.meetingLink,
        status: m.status,
        provider: m.provider,

        contact: m.contact,
        account: m.account,
        deal: m.deal,
        attendees: m.attendees,
      },
    }));

    res.json(events);
  } catch (error) {
    console.error("Calendar fetch error:", error);

    res.status(500).json({
      message: "Failed to fetch calendar meetings",
    });
  }
};
/*
────────────────────────────────────────────
UPDATE MEETING
────────────────────────────────────────────
*/

// export const updateMeetingController = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const updated = await prisma.meeting.update({
//       where: { id },
//       data: {
//         title: req.body.title,
//         description: req.body.description,
//         startTime: new Date(req.body.startTime),
//         endTime: new Date(req.body.endTime),
//       },
//       include: {
//         attendees: true,
//         contact: true,
//         account: true,
//         deal: true,
//       },
//     });

//     res.json(updated);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to update meeting" });
//   }
// };

// export const updateMeetingController = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;

//     const {
//       title,
//       description,
//       startTime,
//       endTime,
//       contactIds = [],
//     } = req.body;

//     /*
//     ────────────────────────────────────────────
//     GET GOOGLE INTEGRATION
//     ────────────────────────────────────────────
//     */
//     const integration = await prisma.calendarIntegration.findUnique({
//       where: { userId },
//     });

//     if (!integration) {
//       return res.status(400).json({
//         message: "Google Calendar not connected",
//       });
//     }

//     /*
//     ────────────────────────────────────────────
//     FETCH CONTACTS
//     ────────────────────────────────────────────
//     */
//     const contacts = await prisma.contact.findMany({
//       where: {
//         id: { in: contactIds },
//       },
//       select: {
//         id: true,
//         email: true,
//         firstName: true,
//         lastName: true,
//       },
//     });

//     /*
//     ────────────────────────────────────────────
//     GET EXISTING MEETING (for googleEventId)
//     ────────────────────────────────────────────
//     */
//     const existingMeeting = await prisma.meeting.findUnique({
//       where: { id },
//     });

//     /*
//     ────────────────────────────────────────────
//     GOOGLE CALENDAR UPDATE (🔥 KEY FEATURE)
//     ────────────────────────────────────────────
//     */
//     // const calendar = getCalendarClient(integration);

//     // await calendar.events.patch({
//     //   calendarId: "primary",
//     //   eventId: existingMeeting.googleEventId,
//     //   resource: {
//     //     summary: title,
//     //     description,
//     //     start: {
//     //       dateTime: new Date(startTime).toISOString(),
//     //       timeZone: "Asia/Kolkata",
//     //     },
//     //     end: {
//     //       dateTime: new Date(endTime).toISOString(),
//     //       timeZone: "Asia/Kolkata",
//     //     },
//     //     attendees: contacts.map((c) => ({
//     //       email: c.email,
//     //     })),
//     //   },
//     //   sendUpdates: "all", // 🔥 resend email invites
//     // });

//     // ✅ GOOGLE UPDATE (NO CHANGE)
//     if (existingMeeting.provider === "GOOGLE") {
//       const calendar = getCalendarClient(integration);

//       await calendar.events.patch({
//         calendarId: "primary",
//         eventId: existingMeeting.googleEventId,
//         resource: {
//           summary: title,
//           description,
//           start: {
//             dateTime: new Date(startTime).toISOString(),
//             timeZone: "Asia/Kolkata",
//           },
//           end: {
//             dateTime: new Date(endTime).toISOString(),
//             timeZone: "Asia/Kolkata",
//           },
//           attendees: contacts.map((c) => ({
//             email: c.email,
//           })),
//         },
//         sendUpdates: "all",
//       });
//     }

//     /*
//     ────────────────────────────────────────────
//     DELETE OLD ATTENDEES
//     ────────────────────────────────────────────
//     */
//     await prisma.meetingAttendee.deleteMany({
//       where: { meetingId: id },
//     });

//     /*
//     ────────────────────────────────────────────
//     UPDATE MEETING + NEW ATTENDEES
//     ────────────────────────────────────────────
//     */
//     const updated = await prisma.meeting.update({
//       where: { id },
//       data: {
//         title,
//         description,
//         startTime: new Date(startTime),
//         endTime: new Date(endTime),

//         attendees: {
//           create: contacts.map((c) => ({
//             email: c.email,
//             name: `${c.firstName} ${c.lastName || ""}`,
//             contactId: c.id,
//           })),
//         },
//       },
//       include: {
//         attendees: true,
//         contact: true,
//         account: true,
//         deal: true,
//       },
//     });

//     res.json(updated);
//   } catch (error) {
//     console.error("Update meeting error:", error);
//     res.status(500).json({
//       message: "Failed to update meeting",
//     });
//   }
// };

export const updateMeetingController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const {
      title,
      description,
      startTime,
      endTime,
      contactIds = [],
    } = req.body;

    /*
    ────────────────────────────────────────────
    GET EXISTING MEETING FIRST (🔥 IMPORTANT)
    ────────────────────────────────────────────
    */
    const existingMeeting = await prisma.meeting.findUnique({
      where: { id },
    });

    if (!existingMeeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    console.log("👉 Update Provider:", existingMeeting.provider);

    /*
    ────────────────────────────────────────────
    GET INTEGRATION (🔥 FIXED)
    ────────────────────────────────────────────
    */
    const integration = await prisma.calendarIntegration.findUnique({
      where: {
        userId_provider: {
          userId,
          provider: existingMeeting.provider,
        },
      },
    });

    console.log("👉 Integration Found:", integration?.provider);

    if (!integration) {
      return res.status(400).json({
        message: `${existingMeeting.provider} Calendar not connected`,
      });
    }

    /*
    ────────────────────────────────────────────
    FETCH CONTACTS
    ────────────────────────────────────────────
    */
    const contacts = await prisma.contact.findMany({
      where: {
        id: { in: contactIds },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    /*
    ────────────────────────────────────────────
    GOOGLE CALENDAR UPDATE
    ────────────────────────────────────────────
    */
    if (existingMeeting.provider === "GOOGLE") {
      const calendar = getCalendarClient(integration);

      console.log("📅 Updating Google Event:", existingMeeting.googleEventId);

      await calendar.events.patch({
        calendarId: "primary",
        eventId: existingMeeting.googleEventId,
        resource: {
          summary: title,
          description,
          start: {
            dateTime: new Date(startTime).toISOString(),
            timeZone: "Asia/Kolkata",
          },
          end: {
            dateTime: new Date(endTime).toISOString(),
            timeZone: "Asia/Kolkata",
          },
          attendees: contacts.map((c) => ({
            email: c.email,
          })),
        },
        sendUpdates: "all",
      });

      console.log("✅ Google Event Updated");
    }

    /*
    ────────────────────────────────────────────
    DELETE OLD ATTENDEES
    ────────────────────────────────────────────
    */
    await prisma.meetingAttendee.deleteMany({
      where: { meetingId: id },
    });

    /*
    ────────────────────────────────────────────
    UPDATE MEETING + NEW ATTENDEES
    ────────────────────────────────────────────
    */
    const updated = await prisma.meeting.update({
      where: { id },
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),

        attendees: {
          create: contacts.map((c) => ({
            email: c.email,
            name: `${c.firstName} ${c.lastName || ""}`,
            contactId: c.id,
          })),
        },
      },
      include: {
        attendees: true,
        contact: true,
        account: true,
        deal: true,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error("❌ Update meeting error:", error);

    res.status(500).json({
      message: "Failed to update meeting",
    });
  }
};

/*
────────────────────────────────────────────
DELETE MEETING
────────────────────────────────────────────
*/

export const deleteMeetingController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    /*
    ────────────────────────────────────────────
    GET MEETING FIRST (🔥 IMPORTANT)
    ────────────────────────────────────────────
    */
    const meeting = await prisma.meeting.findUnique({
      where: { id },
    });

    if (!meeting) {
      return res.status(404).json({
        message: "Meeting not found",
      });
    }

    console.log("👉 Delete Provider:", meeting.provider);

    /*
    ────────────────────────────────────────────
    GET INTEGRATION (🔥 FIXED)
    ────────────────────────────────────────────
    */
    const integration = await prisma.calendarIntegration.findUnique({
      where: {
        userId_provider: {
          userId,
          provider: meeting.provider,
        },
      },
    });

    console.log("👉 Integration Found:", integration?.provider);

    /*
    ────────────────────────────────────────────
    DELETE FROM CALENDAR
    ────────────────────────────────────────────
    */

    // ✅ GOOGLE DELETE
    if (meeting.provider === "GOOGLE" && meeting.googleEventId) {
      const calendar = getCalendarClient(integration);

      console.log("🗑️ Deleting Google Event:", meeting.googleEventId);

      await calendar.events.delete({
        calendarId: "primary",
        eventId: meeting.googleEventId,
        sendUpdates: "all",
      });

      console.log("✅ Google Event Deleted");
    }

    // ✅ MICROSOFT DELETE
    if (meeting.provider === "MICROSOFT" && meeting.microsoftEventId) {
      console.log("🗑️ Deleting Teams Event:", meeting.microsoftEventId);

      await axios.delete(
        `https://graph.microsoft.com/v1.0/me/events/${meeting.microsoftEventId}`,
        {
          headers: {
            Authorization: `Bearer ${integration.accessToken}`,
          },
        },
      );

      console.log("✅ Teams Event Deleted");
    }

    /*
    ────────────────────────────────────────────
    DELETE FROM DB
    ────────────────────────────────────────────
    */
    await prisma.meeting.delete({
      where: { id },
    });

    res.json({ message: "Meeting deleted successfully" });
  } catch (error) {
    console.error("❌ Delete meeting error:", error);

    res.status(500).json({
      message: "Failed to delete meeting",
    });
  }
};

// microsoft connect //
export const connectMicrosoftCalendar = async (req, res) => {
  try {
    const { userId } = req.query;

    const url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${process.env.MICROSOFT_CLIENT_ID}&response_type=code&redirect_uri=${process.env.MICROSOFT_REDIRECT_URI}&response_mode=query&scope=offline_access%20User.Read%20Calendars.ReadWrite%20OnlineMeetings.ReadWrite&prompt=consent&state=${userId}`;

    res.redirect(url);
  } catch (error) {
    console.error("Microsoft connect error:", error);
    res.status(500).json({ message: "Microsoft connect failed" });
  }
};

// callback microsoft//

export const microsoftCallback = async (req, res) => {
  try {
    const { code, state } = req.query;

    if (!code || !state) {
      return res.status(400).json({
        message: "Invalid Microsoft OAuth callback",
      });
    }

    /*
    ────────────────────────────────────────────
    EXCHANGE CODE FOR TOKENS
    ────────────────────────────────────────────
    */
    const tokenRes = await axios.post(
      "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      new URLSearchParams({
        client_id: process.env.MICROSOFT_CLIENT_ID,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET,
        code,
        redirect_uri: process.env.MICROSOFT_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    );

    const tokens = tokenRes.data;

    /*
    ────────────────────────────────────────────
    DEBUG LOGS
    ────────────────────────────────────────────
    */
    console.log("👉 Microsoft OAuth state (userId):", state);
    console.log("👉 Access Token exists:", !!tokens.access_token);
    console.log("👉 Refresh Token exists:", !!tokens.refresh_token);

    /*
    ────────────────────────────────────────────
    🔥 FIXED UPSERT (COMPOSITE UNIQUE)
    ────────────────────────────────────────────
    */
    await prisma.calendarIntegration.upsert({
      where: {
        userId_provider: {
          userId: state,
          provider: "MICROSOFT",
        },
      },
      update: {
        provider: "MICROSOFT",
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiry: new Date(Date.now() + tokens.expires_in * 1000),
      },
      create: {
        userId: state,
        provider: "MICROSOFT",
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiry: new Date(Date.now() + tokens.expires_in * 1000),
      },
    });

    /*
    ────────────────────────────────────────────
    REDIRECT FRONTEND
    ────────────────────────────────────────────
    */
    const frontendUrl = process.env.FRONTEND_URL;

    return res.redirect(`${frontendUrl}/calendar?connected=teams`);
  } catch (error) {
    console.error("Microsoft OAuth error:", error);

    const frontendUrl = process.env.FRONTEND_URL;

    return res.redirect(`${frontendUrl}/calendar?connected=false`);
  }
};

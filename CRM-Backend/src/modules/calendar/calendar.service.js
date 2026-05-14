// // src/modules/calendar/calendar.service.js

// import prisma from "../../utils/prisma.js";
// import { getCalendarClient } from "./googleCalendar.service.js";

// export const createMeeting = async ({
//   userId,
//   title,
//   description,
//   startTime,
//   endTime,
//   contactIds = [],
// }) => {
//   /*
//   -------------------------------------------------------
//   CHECK GOOGLE CALENDAR INTEGRATION
//   -------------------------------------------------------
//   */

//   const integration = await prisma.calendarIntegration.findUnique({
//     where: { userId },
//   });

//   if (!integration) {
//     throw new Error("Google Calendar not connected");
//   }

//   /*
//   -------------------------------------------------------
//   FETCH CONTACTS FOR ATTENDEES
//   -------------------------------------------------------
//   */

//   const contacts = await prisma.contact.findMany({
//     where: {
//       id: { in: contactIds },
//     },
//     select: {
//       id: true,
//       email: true,
//       firstName: true,
//       lastName: true,
//     },
//   });

//   const attendees = contacts.map((c) => ({
//     email: c.email,
//   }));

//   /*
//   -------------------------------------------------------
//   GOOGLE CALENDAR CLIENT
//   -------------------------------------------------------
//   */

//   const calendar = getCalendarClient(integration);

//   /*
//   -------------------------------------------------------
//   GOOGLE EVENT
//   -------------------------------------------------------
//   */

//   const event = {
//     summary: title,
//     description,

//     start: {
//       dateTime: new Date(startTime).toISOString(),
//       timeZone: "Asia/Kolkata",
//     },

//     end: {
//       dateTime: new Date(endTime).toISOString(),
//       timeZone: "Asia/Kolkata",
//     },

//     attendees,

//     conferenceData: {
//       createRequest: {
//         requestId: `${Date.now()}`,
//         conferenceSolutionKey: {
//           type: "hangoutsMeet",
//         },
//       },
//     },
//   };

//   /*
//   -------------------------------------------------------
//   CREATE GOOGLE EVENT
//   -------------------------------------------------------
//   */

//   const response = await calendar.events.insert({
//     calendarId: "primary",
//     resource: event,
//     conferenceDataVersion: 1,
//     sendUpdates: "all",
//   });

//   const googleEvent = response.data;

//   /*
//   -------------------------------------------------------
//   EXTRACT MEET LINK
//   -------------------------------------------------------
//   */

//   const meetLink =
//     googleEvent?.conferenceData?.entryPoints?.find(
//       (entry) => entry.entryPointType === "video",
//     )?.uri || null;

//   /*
//   -------------------------------------------------------
//   SAVE MEETING
//   -------------------------------------------------------
//   */

//   const meeting = await prisma.meeting.create({
//     data: {
//       title,
//       description,

//       startTime: new Date(startTime),
//       endTime: new Date(endTime),

//       googleEventId: googleEvent.id,
//       meetingLink: meetLink,

//       organizerId: userId,

//       attendees: {
//         create: contacts.map((c) => ({
//           email: c.email,
//           name: `${c.firstName} ${c.lastName || ""}`,
//           contactId: c.id,
//         })),
//       },
//     },
//     include: {
//       attendees: true,
//     },
//   });

//   return meeting;
// };

// src/modules/calendar/calendar.service.js
import prisma from "../../utils/prisma.js";
import { getCalendarClient } from "./googleCalendar.service.js";
import { sendEmail } from "../email/email.service.js";

export const createMeeting = async ({
  userId,
  title,
  description,
  startTime,
  endTime,
  contactIds = [],
  meetingType,
}) => {
  /*
  -------------------------------------------------------
  CHECK CALENDAR INTEGRATION
  -------------------------------------------------------
  */
  // const integration = await prisma.calendarIntegration.findUnique({
  //   where: { userId },
  // });

  // const integration = await prisma.calendarIntegration.findFirst({
  //   where: {
  //     userId,
  //     provider: provider, // 🔥 IMPORTANT
  //   },
  // });

  // if (!integration) {
  //   throw new Error("Calendar not connected");
  // }
  // const provider = meetingType?.toUpperCase();

  const provider = meetingType?.toUpperCase();

  const integration = await prisma.calendarIntegration.findFirst({
    where: {
      userId,
      provider,
    },
  });

  console.log("👉 Selected Provider:", provider);
  console.log("👉 Integration Found:", integration?.provider);

  if (!integration) {
    throw new Error("Calendar not connected");
  }

  /*
  -------------------------------------------------------
  FETCH CONTACTS
  -------------------------------------------------------
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

  const attendees = contacts.map((c) => ({
    email: c.email,
  }));

  /*
  -------------------------------------------------------
  PROVIDER BASED CREATION
  -------------------------------------------------------
  */
  let meetingLink = null;
  let googleEventId = null;
  let microsoftEventId = null;

  /*
  -------------------------------------------------------
  GOOGLE MEET
  -------------------------------------------------------
  */
  if (provider === "GOOGLE") {
    const calendar = getCalendarClient(integration);

    const event = {
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

      attendees,

      conferenceData: {
        createRequest: {
          requestId: `${Date.now()}`,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: "all",
    });

    const googleEvent = response.data;

    googleEventId = googleEvent.id;

    meetingLink =
      googleEvent?.conferenceData?.entryPoints?.find(
        (entry) => entry.entryPointType === "video",
      )?.uri || null;

    console.log("✅ Google Meet created:", meetingLink);
  }

  /*
  -------------------------------------------------------
  MICROSOFT TEAMS
  -------------------------------------------------------
  */
  /*
-------------------------------------------------------
MICROSOFT TEAMS (DEEP LINK)
-------------------------------------------------------
*/
  if (provider === "MICROSOFT") {
    // 👉 Generate Teams Deep Link
    const baseUrl = "https://teams.microsoft.com/l/meeting/new";

    const params = new URLSearchParams({
      subject: title,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
    });

    meetingLink = `${baseUrl}?${params.toString()}`;

    microsoftEventId = null;

    console.log("✅ Teams meeting link generated:", meetingLink);

    /*
  -------------------------------------------------------
  SEND EMAIL TO ATTENDEES (MANUAL)
  -------------------------------------------------------
  */
    try {
      for (const contact of contacts) {
        await sendEmail(
          {
            toEmail: contact.email, // ✅ IMPORTANT (not "to")
            subject: `Meeting Scheduled: ${title}`,
            body: `
        <p>Hello ${contact.firstName || ""},</p>

        <p>You have been invited to a meeting.</p>

        <p><b>Title:</b> ${title}</p>
        <p><b>Description:</b> ${description || "-"}</p>
        <p><b>Time:</b> ${new Date(startTime).toLocaleString()} - ${new Date(endTime).toLocaleString()}</p>

        <p>
          <b>Join Microsoft Teams:</b><br/>
          <a href="${meetingLink}">Join Meeting</a>
        </p>

        <p>Regards,<br/>CRM Team</p>
      `,
          },
          userId, // ✅ REQUIRED
        );
      }

      console.log("📧 Teams invites sent");
    } catch (err) {
      console.error("❌ Email sending failed:", err.message);
    }
  }

  /*
  -------------------------------------------------------
  SAVE TO DB
  -------------------------------------------------------
  */
  const meeting = await prisma.meeting.create({
    data: {
      title,
      description,

      startTime: new Date(startTime),
      endTime: new Date(endTime),

      provider: provider,

      googleEventId,
      microsoftEventId,
      meetingLink,

      organizerId: userId,

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
    },
  });

  return meeting;
};

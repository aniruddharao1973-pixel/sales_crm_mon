// src/modules/calendar/microsoftCalendar.service.js

import axios from "axios";

/**
 * Create Microsoft Teams Meeting via Graph API
 * (Uses /onlineMeetings → guarantees join link)
 */
export const createMicrosoftMeeting = async (integration, data) => {
  try {
    console.log("──────────────── MICROSOFT MEETING DEBUG ────────────────");

    // 🔍 BASIC DEBUG
    console.log("👉 Provider:", integration.provider);
    console.log("👉 Token exists:", !!integration.accessToken);
    console.log(
      "👉 Token preview:",
      integration.accessToken
        ? integration.accessToken.substring(0, 25) + "..."
        : "NO TOKEN",
    );
    console.log("👉 Token expiry:", integration.tokenExpiry);

    // 🚨 HARD CHECK
    if (!integration.accessToken) {
      throw new Error("❌ No access token found");
    }

    /*
    -------------------------------------------------------
    STEP 1: CREATE TEAMS ONLINE MEETING
    -------------------------------------------------------
    */
    console.log("🚀 Creating Teams Online Meeting...");

    const onlineMeetingRes = await axios.post(
      "https://graph.microsoft.com/v1.0/me/onlineMeetings",
      {
        subject: data.title,
        startDateTime: data.startTime,
        endDateTime: data.endTime,
      },
      {
        headers: {
          Authorization: `Bearer ${integration.accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("✅ Online meeting API success");

    const onlineMeeting = onlineMeetingRes.data;
    const meetingLink = onlineMeeting.joinWebUrl;

    console.log("✅ Teams link created:", meetingLink);

    /*
    -------------------------------------------------------
    STEP 2: CREATE CALENDAR EVENT
    -------------------------------------------------------
    */
    console.log("📅 Creating Outlook calendar event...");

    const eventRes = await axios.post(
      "https://graph.microsoft.com/v1.0/me/events",
      {
        subject: data.title,

        body: {
          contentType: "HTML",
          content: `
            ${data.description || ""}
            <br/><br/>
            <b>Join Teams Meeting:</b><br/>
            <a href="${meetingLink}">${meetingLink}</a>
          `,
        },

        start: {
          dateTime: data.startTime,
          timeZone: "Asia/Kolkata",
        },

        end: {
          dateTime: data.endTime,
          timeZone: "Asia/Kolkata",
        },

        attendees: (data.attendees || []).map((attendee) => ({
          emailAddress: {
            address: attendee.email,
            name: attendee.name || attendee.email,
          },
          type: "required",
        })),
      },
      {
        headers: {
          Authorization: `Bearer ${integration.accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    console.log("✅ Calendar event created");

    const event = eventRes.data;

    console.log("──────────────── SUCCESS ────────────────");

    return {
      microsoftEventId: event.id,
      meetingLink: meetingLink,
    };
  } catch (error) {
    console.log("──────────────── ERROR DEBUG ────────────────");

    if (error.response) {
      console.error("❌ Status:", error.response.status);
      console.error("❌ Data:", error.response.data);
    } else {
      console.error("❌ Error:", error.message);
    }

    console.log("──────────────── END ERROR ────────────────");

    throw new Error("Failed to create Microsoft Teams meeting");
  }
};

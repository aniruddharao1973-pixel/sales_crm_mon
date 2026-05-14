// src/modules/calendar/googleCalendar.service.js

import { google } from "googleapis";

export const getOAuthClient = () => {

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALENDAR_REDIRECT_URI
  );

  return oauth2Client;
};

export const getCalendarClient = (tokens) => {

  const oauth2Client = getOAuthClient();

  oauth2Client.setCredentials({
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken
  });

  return google.calendar({
    version: "v3",
    auth: oauth2Client
  });

};
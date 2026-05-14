// generateRefreshToken
import readline from "readline";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: ["https://mail.google.com/"],
});

console.log("Authorize this app by visiting this url:\n");
console.log(authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("\nEnter the code from that page here: ", async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);

    console.log("\n==============================");
    console.log("Your Refresh Token:\n");
    console.log(tokens.refresh_token);
    console.log("==============================\n");

    rl.close();
  } catch (error) {
    console.error("Error retrieving refresh token:", error);
    rl.close();
  }
});

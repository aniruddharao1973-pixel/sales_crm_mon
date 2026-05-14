// CRM-Backend/src/server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import "./services/reminder.scheduler.js";
import "./jobs/dealReminder.job.js";

import authRoutes from "./routes/auth.routes.js";
import accountRoutes from "./routes/account.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import dealRoutes from "./routes/deal.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

import reminderRoutes from "./routes/reminder.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import dealRiskRoutes from "./routes/dealRisk.routes.js";
import emailRoutes from "./modules/email/email.routes.js";
import calendarRoutes from "./modules/calendar/calendar.routes.js";
import quotationRoutes from "./modules/quotation/quotation.routes.js";
import itemRoutes from "./modules/item/item.routes.js";

import { warmUpModel, getModelStatus } from "./ai/aiClient.js";

import assignmentRoutes from "./routes/assignment.routes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

/* =========================================================
   ✅ ALLOWED ORIGINS (ALL ENVIRONMENTS)
========================================================= */
const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.135.69:5173",
  "http://192.168.135.59:5173",
];

/* =========================================================
   ✅ CORS CONFIG (DYNAMIC)
========================================================= */
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       } else {
//         return callback(new Error("CORS not allowed"), false);
//       }
//     },
//     credentials: true,
//   }),
// );

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") // ✅ KEY FIX
      ) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"), false);
    },
    credentials: true,
  }),
);

/* =========================================================
   ✅ SOCKET.IO
========================================================= */
// export const io = new Server(server, {
//   cors: {
//     origin: allowedOrigins,
//     credentials: true,
//   },
// });

// export const io = new Server(server, {
//   cors: {
//     origin: allowedOrigins,
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

export const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") // ✅ KEY FIX
      ) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});
io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    socket.join(userId);
  });
});

/* =========================================================
   ✅ MIDDLEWARE
========================================================= */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/* =========================================================
   ✅ ROUTES
========================================================= */
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/analytics", dealRiskRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/assignment", assignmentRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/api/items", itemRoutes);

app.use("/public", express.static("public"));

// ✅ ADD THIS (CRITICAL FOR ATTACHMENTS)
app.use("/uploads", express.static("uploads"));

/* =========================================================
   ✅ HEALTH CHECK
========================================================= */
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    ai: getModelStatus(),
  });
});

/* =========================================================
   ✅ START SERVER
========================================================= */
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

server.listen(PORT, HOST, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌐 Allowed FRONTEND_URL: ${process.env.FRONTEND_URL}`);

  try {
    await warmUpModel();
  } catch (err) {
    console.error("AI initialization failed:", err.message);
  }
});
 
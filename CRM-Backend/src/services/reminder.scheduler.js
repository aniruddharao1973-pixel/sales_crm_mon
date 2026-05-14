// // src\services\reminder.scheduler.js
// import cron from "node-cron";
// import prisma from "../utils/prisma.js";
// import { sendEmail } from "../utils/sendEmail.js";
// import { io } from "../server.js";

// cron.schedule("* * * * *", async () => {
//   try {
//     const now = new Date();

//     const reminders = await prisma.reminder.findMany({
//       where: {
//         OR: [
//           { emailBefore: { not: null }, isEmailSent: false },
//           { popupBefore: { not: null }, isPopupSent: false },
//         ],
//       },
//       include: {
//         user: true,
//         task: true,
//       },
//     });

//     for (const r of reminders) {
//       const emailTime =
//         r.emailBefore !== null
//           ? new Date(r.remindAt.getTime() - r.emailBefore * 60000)
//           : null;

//       const popupTime =
//         r.popupBefore !== null
//           ? new Date(r.remindAt.getTime() - r.popupBefore * 60000)
//           : null;

//       /* ================= EMAIL ================= */

//       if (emailTime && emailTime <= now && !r.isEmailSent) {
//         await sendEmail({
//           to: r.user.email,
//           subject: `Reminder: ${r.title}`,
//           html: `
//             <h3>${r.title}</h3>
//             <p>${r.description || ""}</p>
//             <p><b>Due:</b> ${r.remindAt}</p>
//           `,
//         });

//         await prisma.reminder.update({
//           where: { id: r.id },
//           data: { isEmailSent: true },
//         });
//       }

//       /* ================= POPUP ================= */

//       if (popupTime && popupTime <= now && !r.isPopupSent) {
//         const notification = await prisma.notification.create({
//           data: {
//             title: "Task Reminder",
//             message: r.title,
//             type: "TASK",
//             recordId: r.taskId, // ✅ navigation
//             userId: r.userId,
//           },
//         });

//         /* ⚡ REALTIME PUSH */
//         io.to(r.userId).emit("new_notification", notification);

//         await prisma.reminder.update({
//           where: { id: r.id },
//           data: { isPopupSent: true },
//         });
//       }
//     }
//   } catch (err) {
//     console.log("❌ REMINDER CRON ERROR:", err.message);
//   }
// });


// src/services/reminder.scheduler.js
import cron from "node-cron";
import prisma from "../utils/prisma.js";
import { sendEmail } from "../modules/email/email.service.js"; // ✅ FIXED
import { io } from "../server.js";

cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();

    const reminders = await prisma.reminder.findMany({
      where: {
        OR: [
          { emailBefore: { not: null }, isEmailSent: false },
          { popupBefore: { not: null }, isPopupSent: false },
        ],
      },
      include: {
        user: true,
      },
    });

    for (const r of reminders) {
      const emailTime =
        r.emailBefore !== null
          ? new Date(r.remindAt.getTime() - r.emailBefore * 60000)
          : null;

      const popupTime =
        r.popupBefore !== null
          ? new Date(r.remindAt.getTime() - r.popupBefore * 60000)
          : null;

      /* ================= EMAIL ================= */

      if (emailTime && emailTime <= now && !r.isEmailSent) {
        await sendEmail(
          {
            toEmail: r.user.email,
            subject: `Reminder: ${r.title}`,
            body: `
              <h3>${r.title}</h3>
              <p>${r.description || ""}</p>
              <p><b>Due:</b> ${r.remindAt}</p>
            `,
          },
          r.userId,
        );

        await prisma.reminder.update({
          where: { id: r.id },
          data: { isEmailSent: true },
        });
      }

      /* ================= POPUP ================= */

      if (popupTime && popupTime <= now && !r.isPopupSent) {
        const notification = await prisma.notification.create({
          data: {
            title: "Reminder",
            message: r.title,
            type: "REMINDER",
            recordId: r.dealId || r.accountId || r.contactId, // ✅ navigation to related record
            userId: r.userId,
          },
        });

        /* ⚡ REALTIME PUSH (FIXED EVENT NAME) */
        io.to(r.userId).emit("notification", notification);

        await prisma.reminder.update({
          where: { id: r.id },
          data: { isPopupSent: true },
        });
      }
    }
  } catch (err) {
    console.log("❌ REMINDER CRON ERROR:", err.message);
  }
});

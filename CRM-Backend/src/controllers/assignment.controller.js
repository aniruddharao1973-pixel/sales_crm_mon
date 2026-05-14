// src/controllers/assignment.controller.js

import { toggleAssignment } from "../services/assign/assignment.service.js";
import prisma from "../utils/prisma.js";

/**
 * 🔁 Toggle assignment
 */
export const toggleAssignmentController = async (req, res) => {
  try {
    const { type, recordId, userId, assigned } = req.body;

    if (!type || !recordId || !userId) {
      return res.status(400).json({
        success: false,
        message: "type, recordId and userId are required",
      });
    }

    const result = await toggleAssignment({
      type,
      recordId,
      userId,
      assigned,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Assignment Toggle Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

/**
 * 📊 DEAL ASSIGNMENTS
 */
export const getDealAssignments = async (req, res) => {
  const users = await prisma.user.findMany({
    where: {
      role: { in: ["MANAGER", "SALES_REP"] },
      isActive: true,
    },
    select: { id: true, name: true, role: true },
  });

  const deals = await prisma.deal.findMany({
    select: {
      id: true,
      dealName: true,
      assignments: true,
    },
  });

  const formatted = deals.map((deal) => {
    const map = {};

    users.forEach((u) => {
      map[u.id] = false;
    });

    // ✅ ONLY ASSIGNMENTS
    deal.assignments.forEach((a) => {
      map[a.userId] = true;
    });

    return {
      id: deal.id,
      name: deal.dealName,
      assignments: map,
    };
  });

  res.json({ users, records: formatted });
};

/**
 * 📊 CONTACT ASSIGNMENTS
 */
export const getContactAssignments = async (req, res) => {
  const users = await prisma.user.findMany({
    where: {
      role: { in: ["MANAGER", "SALES_REP"] },
      isActive: true,
    },
    select: { id: true, name: true, role: true },
  });

  const contacts = await prisma.contact.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      assignments: true,
    },
  });

  const formatted = contacts.map((c) => {
    const map = {};

    users.forEach((u) => (map[u.id] = false));

    // ✅ ONLY ASSIGNMENTS
    c.assignments.forEach((a) => {
      map[a.userId] = true;
    });

    return {
      id: c.id,
      name: `${c.firstName} ${c.lastName || ""}`,
      assignments: map,
    };
  });

  res.json({ users, records: formatted });
};

// /**
//  * 📊 ACCOUNT ASSIGNMENTS
//  */
// export const getAccountAssignments = async (req, res) => {
//   const users = await prisma.user.findMany({
//     where: {
//       role: { in: ["MANAGER", "SALES_REP"] },
//       isActive: true,
//     },
//     select: { id: true, name: true, role: true },
//   });

//   const accounts = await prisma.account.findMany({
//     select: {
//       id: true,
//       accountName: true,
//       lifecycle: true, // ✅ FIX
//       assignments: true,
//     },
//   });

//   const formatted = accounts.map((a) => {
//     const map = {};

//     users.forEach((u) => (map[u.id] = false));

//     // ✅ ONLY ASSIGNMENTS
//     a.assignments.forEach((x) => {
//       map[x.userId] = true;
//     });

//     return {
//       id: a.id,
//       name: a.accountName,
//       lifecycle: a.lifecycle, // ✅ FIX
//       assignments: map,
//     };
//   });

//   res.json({ users, records: formatted });
// };

/**
 * 📊 ACCOUNT ASSIGNMENTS (FINAL - CORRECT ARCHITECTURE)
 */
export const getAccountAssignments = async (req, res) => {
  // ✅ 1. Fetch ALL active users (DO NOT FILTER HERE)
  const allUsers = await prisma.user.findMany({
    where: {
      isActive: true,
    },
    select: { id: true, name: true, role: true },
  });

  // ✅ 2. UI USERS (ONLY Manager + Sales Rep)
  const visibleUsers = allUsers.filter((u) =>
    ["MANAGER", "SALES_REP"].includes(u.role),
  );

  const accounts = await prisma.account.findMany({
    select: {
      id: true,
      accountName: true,
      lifecycle: true,
      assignments: {
        select: {
          userId: true,
        },
      },
    },
  });

  // 🔍 DEBUG (keep for now)
  console.log(
    "👉 ALL USERS IDS:",
    allUsers.map((u) => u.id),
  );
  console.log(
    "👉 VISIBLE USERS IDS:",
    visibleUsers.map((u) => u.id),
  );

  console.log(
    "👉 RAW ASSIGNMENTS:",
    accounts.map((a) => ({
      account: a.accountName,
      assignments: a.assignments,
    })),
  );

  const formatted = accounts.map((a) => {
    const map = {};

    // ✅ IMPORTANT: initialize ONLY visible users
    visibleUsers.forEach((u) => {
      map[u.id] = false;
    });

    a.assignments.forEach((x) => {
      const assignmentUserId = String(x.userId).toLowerCase();

      const matchedUser = allUsers.find(
        (u) => String(u.id).toLowerCase() === assignmentUserId,
      );

      if (matchedUser) {
        // ✅ ONLY map if user is visible in UI
        if (map.hasOwnProperty(matchedUser.id)) {
          map[matchedUser.id] = true;
        }
      } else {
        console.log("❌ UNMATCHED USER ID:", x.userId);
      }
    });

    return {
      id: a.id,
      name: a.accountName,
      lifecycle: a.lifecycle,
      assignments: map,
    };
  });

  console.log(
    "👉 FINAL FORMATTED:",
    formatted.map((f) => ({
      name: f.name,
      assignedUsers: Object.entries(f.assignments)
        .filter(([_, v]) => v)
        .map(([k]) => k),
    })),
  );

  // ✅ RETURN ONLY VISIBLE USERS
  res.json({
    users: visibleUsers,
    records: formatted,
  });
};

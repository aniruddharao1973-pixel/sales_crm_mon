// src/services/assign/assignment.service.js

import prisma from "../../utils/prisma.js";

/**
 * Mapping config → avoids duplication
 * Visibility and toggle are driven only by assignment tables.
 */
const MODEL_MAP = {
  deal: {
    table: prisma.dealAssignment,
    field: "dealId",
  },
  contact: {
    table: prisma.contactAssignment,
    field: "contactId",
  },
  account: {
    table: prisma.accountAssignment,
    field: "accountId",
  },
};

/**
 * 🔁 TOGGLE ASSIGNMENT
 * - assigned: true  → create assignment
 * - assigned: false → delete assignment
 *
 * No owner-field updates. Assignment table is the single source of truth.
 */
export const toggleAssignment = async ({
  type,
  recordId,
  userId,
  assigned,
}) => {
  const model = MODEL_MAP[type];

  if (!model) {
    throw new Error("Invalid assignment type");
  }

  const uniqueKey = `${model.field}_userId`;

  const existing = await model.table.findUnique({
    where: {
      [uniqueKey]: {
        [model.field]: recordId,
        userId,
      },
    },
  });

  // ✅ ASSIGN
  if (assigned) {
    if (!existing) {
      await model.table.create({
        data: {
          [model.field]: recordId,
          userId,
        },
      });
    }

    return { assigned: true, type: "ASSIGNMENT" };
  }

  // ✅ UNASSIGN
  if (!assigned) {
    if (existing) {
      await model.table.delete({
        where: {
          [uniqueKey]: {
            [model.field]: recordId,
            userId,
          },
        },
      });
    }

    return { assigned: false, type: "ASSIGNMENT" };
  }

  return { assigned: !!existing, type: "ASSIGNMENT" };
};

/**
 * 📊 GET ASSIGNMENTS FOR A RECORD
 */
export const getAssignmentsForRecord = async ({ type, recordId }) => {
  const model = MODEL_MAP[type];

  if (!model) {
    throw new Error("Invalid assignment type");
  }

  const assignments = await model.table.findMany({
    where: {
      [model.field]: recordId,
    },
    select: {
      userId: true,
    },
  });

  return assignments.map((a) => a.userId);
};

/**
 * 📊 GET ALL ASSIGNMENTS FOR USER
 */
export const getAssignmentsForUser = async ({ type, userId }) => {
  const model = MODEL_MAP[type];

  if (!model) {
    throw new Error("Invalid assignment type");
  }

  const records = await model.table.findMany({
    where: {
      userId,
    },
    select: {
      [model.field]: true,
    },
  });

  return records.map((r) => r[model.field]);
};

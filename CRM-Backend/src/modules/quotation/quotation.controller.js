// src/modules/quotation/quotation.controller.js

import prisma from "../../utils/prisma.js";
import {
  createQuotation,
  updateQuotation,
  reviseQuotation, // 🔥 NEW
  getQuotationStatusSummary,
  getQuotationLifecycle,
  getQuotationValueTrend,
} from "./quotation.service.js";

/* ================= HELPERS ================= */
const attachRevisionHistory = async (quotation) => {
  if (!quotation || !quotation.dealId) return quotation;

  const revisions = await prisma.quotation.findMany({
    where: { dealId: quotation.dealId },
    orderBy: { version: "asc" },
    select: {
      id: true,
      quotationNo: true,
      version: true,
      createdAt: true,
      revisionReason: true,
    },
  });

  return { ...quotation, revisionHistory: revisions };
};

/* ================= CREATE ================= */
export const createQuotationController = async (req, res) => {
  try {
    const { dealId } = req.body;

    if (!dealId) {
      return res.status(400).json({ message: "dealId is required" });
    }

    // 1. Fetch the deal to check personInCharge
    const deal = await prisma.deal.findUnique({
      where: { id: dealId },
      select: { personInCharge: true },
    });

    if (!deal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    // 2. Authorization check
    const isAdmin = req.user?.role === "ADMIN";
    // We compare against user name since personInCharge is currently a string field
    const isPIC = deal.personInCharge === req.user?.name;

    if (!isAdmin && !isPIC) {
      return res.status(403).json({
        message: `Unauthorized: Only Admin or the Person in Charge (${deal.personInCharge}) can create quotations for this deal.`,
      });
    }

    const normalizedBody = {
      ...req.body,
      items: (req.body.items || []).map((item) => ({
        ...item,
        subItems: item.subItems || item.selectedSubItems || [],
      })),
    };

    const quotation = await createQuotation({
      ...normalizedBody,
      userId: req.user.id,
    });

    res.status(201).json(quotation);
  } catch (error) {
    console.error("❌ Create quotation error:", error);

    const isClientError =
      error.message?.includes("required") ||
      error.message?.includes("not found") ||
      error.message?.includes("invalid");

    res.status(isClientError ? 400 : 500).json({
      message: error.message || "Failed to create quotation",
    });
  }
};

/* ================= GET ALL ================= */
export const getQuotationsController = async (req, res) => {
  try {
    const data = await prisma.quotation.findMany({
      where: {
        isLatest: true,
        // ✅ Authorization: Admin sees all, others see PIC or KAM records
        ...(req.user.role !== "ADMIN" && {
          OR: [
            { deal: { personInCharge: req.user.name } },
            { account: { keyAccountManagerId: req.user.id } },
            { account: { accountOwnerId: req.user.id } },
          ],
        }),
      },
      include: {
        account: {
          select: {
            id: true, // 🔥 ADD THIS
            accountName: true,
            phone: true,

            billingStreet: true,
            billingCity: true,
            billingState: true,
            billingPincode: true,
            billingCountry: true,

            contacts: {
              select: {
                id: true, // 🔥 ADD THIS
                salutation: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
              take: 1, // 👈 only primary contact
            },
            keyAccountManager: {
              select: { id: true, name: true, email: true, mobile: true },
            },
          },
        },
        deal: {
          include: { contact: true },
        },
        items: {
          include: {
            item: true,
            subItems: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(data);
  } catch (error) {
    console.error("❌ Fetch quotations error:", error);
    res.status(500).json({ message: "Failed to fetch quotations" });
  }
};

/* ================= GET ONE ================= */
export const getQuotationByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: {
        // account: {
        //   select: {
        //     id: true, // 🔥 ADD THIS
        //     accountName: true,
        //     phone: true,

        //     billingStreet: true,
        //     billingCity: true,
        //     billingState: true,
        //     billingPincode: true,
        //     billingCountry: true,

        //     contacts: {
        //       select: {
        //         id: true, // 🔥 ADD THIS
        //         firstName: true,
        //         lastName: true,
        //         email: true,
        //         phone: true,
        //       },
        //       take: 1, // 👈 only primary contact
        //     },
        //     keyAccountManager: {
        //       select: {
        //         id: true,
        //         name: true,
        //         email: true,
        //         mobile: true,
        //       }
        //     },
        //   },
        // },
        account: {
          select: {
            id: true,

            // 🔥 ADD THESE
            keyAccountManagerId: true,
            accountOwnerId: true,

            accountName: true,
            phone: true,

            billingStreet: true,
            billingCity: true,
            billingState: true,
            billingPincode: true,
            billingCountry: true,

            contacts: {
              select: {
                id: true,
                salutation: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
              },
              take: 1,
            },

            keyAccountManager: {
              select: {
                id: true,
                name: true,
                email: true,
                mobile: true,
              },
            },
          },
        },
        deal: {
          include: { contact: true },
        },
        items: {
          include: {
            item: true,
            subItems: true,
          },
          orderBy: { createdAt: "asc" },
        },
        approvals: {
          include: { actedBy: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    // 🔥 ATTACH REVISION HISTORY
    const quotationWithHistory = await attachRevisionHistory(quotation);

    // ✅ AUTHORIZATION CHECK
    const isAdmin = req.user.role === "ADMIN";
    const isPIC = quotation.deal?.personInCharge === req.user.name;
    const isKAM = quotation.account?.keyAccountManagerId === req.user.id;
    const isAccountOwner = quotation.account?.accountOwnerId === req.user.id;

    if (!isAdmin && !isPIC && !isKAM && !isAccountOwner) {
      return res
        .status(403)
        .json({ message: "Unauthorized access to this quotation" });
    }

    res.json(quotationWithHistory);
  } catch (error) {
    console.error("❌ Fetch quotation error:", error);
    res.status(500).json({ message: "Failed to fetch quotation" });
  }
};

/* ================= DELETE ================= */
export const deleteQuotationController = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔥 DEBUG
    console.log("========== DELETE DEBUG ==========");
    console.log("REQ.USER:", req.user);
    console.log("ROLE:", req.user?.role);
    console.log("==================================");

    // 🔒 RBAC CHECK
    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({
        message: "Only admin can delete quotation",
      });
    }

    // ✅ SIMPLE + RELIABLE (CASCADE HANDLES CHILDREN)
    await prisma.quotation.delete({
      where: { id },
    });

    res.json({ message: "Quotation deleted successfully" });
  } catch (error) {
    console.error("❌ Delete quotation error:", error);
    res.status(500).json({ message: "Failed to delete quotation" });
  }
};

/* ================= UPDATE ================= */
export const updateQuotationController = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔒 OPTIONAL OWNERSHIP CHECK
    const existing = await prisma.quotation.findUnique({
      where: { id },
      include: { deal: { select: { personInCharge: true } } },
    });

    if (!existing) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    // 🔒 RBAC CHECK: Only PIC or Admin can update
    const isAdmin = req.user?.role === "ADMIN";
    const isPIC = existing.deal?.personInCharge === req.user?.name;

    if (!isAdmin && !isPIC) {
      return res.status(403).json({
        message: `Unauthorized: Only Admin or the Person in Charge (${existing.deal?.personInCharge || "N/A"}) can update this quotation.`,
      });
    }

    const {
      issueDate,
      validUntil,
      notes,
      terms,
      paymentTerms,
      deliveryTerms,
      importantNotes,
      items,
      headerDiscount = 0,
      refDocuments,
      techPropRef,
      userId,
    } = req.body;

    // ✅ normalize items (keep your existing fix)
    const normalizedItems = (items || []).map((item) => ({
      ...item,
      subItems: item.subItems || item.selectedSubItems || [],
    }));

    // 🔥 REPLACED ENTIRE LOGIC → SERVICE
    const result = await updateQuotation(id, {
      issueDate,
      validUntil,
      notes,
      terms,
      paymentTerms,
      deliveryTerms,
      importantNotes,
      refDocuments,
      techPropRef,
      items: normalizedItems,
      headerDiscount,
      userId: req.user.id,
      role: req.user.role, // 🔥 ADD THIS
    });

    const finalResult = await attachRevisionHistory(result);
    res.json(finalResult);
  } catch (error) {
    console.error("❌ Update quotation error:", error);
    res.status(500).json({
      message: error.message || "Failed to update quotation",
    });
  }
};

/* ================= GET HISTORY ================= */
export const getQuotationHistoryController = async (req, res) => {
  try {
    const { quotationNo } = req.params;

    // 1. Find the quotation to get its dealId
    const current = await prisma.quotation.findFirst({
      where: { quotationNo },
      select: { dealId: true },
    });

    if (!current) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    // 2. Fetch all revisions for this deal
    const data = await prisma.quotation.findMany({
      where: { dealId: current.dealId },
      orderBy: { version: "desc" },
      include: {
        account: true,
        items: {
          include: {
            item: true,
            subItems: true,
          },
          orderBy: { createdAt: "asc" },
        },
        approvals: {
          include: { actedBy: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    res.json(data);
  } catch (error) {
    console.error("❌ Fetch quotation history error:", error);
    res.status(500).json({
      message: "Failed to fetch quotation history",
    });
  }
};

/* ================= SUBMIT ================= */
export const submitQuotationController = async (req, res) => {
  try {
    const { id } = req.params;

    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: { deal: { select: { personInCharge: true } } },
    });

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    // 🔒 RBAC CHECK: Only PIC or Admin can submit
    const isAdmin = req.user?.role === "ADMIN";
    const isPIC = quotation.deal?.personInCharge === req.user?.name;

    if (!isAdmin && !isPIC) {
      return res.status(403).json({
        message: `Unauthorized: Only Admin or the Person in Charge (${quotation.deal?.personInCharge || "N/A"}) can submit this quotation.`,
      });
    }

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    if (quotation.status !== "DRAFT" && quotation.status !== "REJECTED") {
      return res.status(400).json({
        message: "Only draft/rejected quotations can be submitted",
      });
    }

    await prisma.$transaction(async (tx) => {
      // 1️⃣ update status
      await tx.quotation.update({
        where: { id },
        data: { status: "SUBMITTED" },
      });

      // 2️⃣ approval log
      await tx.quotationApproval.create({
        data: {
          quotationId: id,
          action: quotation.status === "REJECTED" ? "RESUBMITTED" : "SUBMITTED",
          actedById: req.user.id,
        },
      });
      // 3️⃣ fetch updated (full)
      const updated = await tx.quotation.findUnique({
        where: { id },
        include: {
          account: {
            select: {
              id: true,
              accountName: true,
              phone: true,
              billingStreet: true,
              billingCity: true,
              billingState: true,
              billingPincode: true,
              billingCountry: true,
              contacts: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true,
                },
                take: 1,
              },
              keyAccountManager: {
                select: { id: true, name: true, email: true, mobile: true },
              },
            },
          },
          deal: {
            include: { contact: true },
          },
          items: {
            include: {
              item: true,
              subItems: true,
            },
            orderBy: { createdAt: "asc" },
          },
          approvals: {
            include: { actedBy: true },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      const finalUpdated = await attachRevisionHistory(updated);
      res.json(finalUpdated);
    });
  } catch (error) {
    console.error("❌ Submit quotation error:", error);
    res.status(500).json({ message: "Failed to submit quotation" });
  }
};

/* ================= APPROVE ================= */
export const approveQuotationController = async (req, res) => {
  try {
    const { id } = req.params;

    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: {
        account: {
          select: { keyAccountManagerId: true },
        },
      },
    });

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    // 🔒 RBAC: ADMIN or respective KAM
    const isAdmin = req.user?.role === "ADMIN";
    const isKAM = req.user?.id === quotation.account?.keyAccountManagerId;

    if (!isAdmin && !isKAM) {
      return res
        .status(403)
        .json({ message: "Only Admin or respective KAM can approve" });
    }

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    if (quotation.status !== "SUBMITTED") {
      return res.status(400).json({
        message: "Only submitted quotations can be approved",
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.quotation.update({
        where: { id },
        data: { status: "APPROVED" },
      });

      await tx.quotationApproval.create({
        data: {
          quotationId: id,
          action: "APPROVED",
          actedById: req.user.id,
        },
      });
      // 3️⃣ fetch updated (full)
      const updated = await tx.quotation.findUnique({
        where: { id },
        include: {
          account: {
            select: {
              id: true,
              accountName: true,
              phone: true,
              billingStreet: true,
              billingCity: true,
              billingState: true,
              billingPincode: true,
              billingCountry: true,
              contacts: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true,
                },
                take: 1,
              },
              keyAccountManager: {
                select: { id: true, name: true, email: true, mobile: true },
              },
            },
          },
          deal: {
            include: { contact: true },
          },
          items: {
            include: {
              item: true,
              subItems: true,
            },
            orderBy: { createdAt: "asc" },
          },
          approvals: {
            include: { actedBy: true },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      const finalUpdated = await attachRevisionHistory(updated);
      res.json(finalUpdated);
    });
  } catch (error) {
    console.error("❌ Approve quotation error:", error);
    res.status(500).json({ message: "Failed to approve quotation" });
  }
};

/* ================= REJECT ================= */
export const rejectQuotationController = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: {
        account: {
          select: { keyAccountManagerId: true },
        },
      },
    });

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    // 🔒 RBAC: ADMIN or respective KAM
    const isAdmin = req.user?.role === "ADMIN";
    const isKAM = req.user?.id === quotation.account?.keyAccountManagerId;

    if (!isAdmin && !isKAM) {
      return res
        .status(403)
        .json({ message: "Only Admin or respective KAM can reject" });
    }

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    if (quotation.status !== "SUBMITTED") {
      return res.status(400).json({
        message: "Only submitted quotations can be rejected",
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.quotation.update({
        where: { id },
        data: { status: "REJECTED" },
      });

      await tx.quotationApproval.create({
        data: {
          quotationId: id,
          action: "REJECTED",
          comment: comment || null,
          actedById: req.user.id,
        },
      });
      // 3️⃣ fetch updated (full)
      const updated = await tx.quotation.findUnique({
        where: { id },
        include: {
          account: {
            select: {
              id: true,
              accountName: true,
              phone: true,
              billingStreet: true,
              billingCity: true,
              billingState: true,
              billingPincode: true,
              billingCountry: true,
              contacts: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true,
                },
                take: 1,
              },
              keyAccountManager: {
                select: { id: true, name: true, email: true, mobile: true },
              },
            },
          },
          deal: {
            include: { contact: true },
          },
          items: {
            include: {
              item: true,
              subItems: true,
            },
            orderBy: { createdAt: "asc" },
          },
          approvals: {
            include: { actedBy: true },
            orderBy: { createdAt: "desc" },
          },
        },
      });

      const finalUpdated = await attachRevisionHistory(updated);
      res.json(finalUpdated);
    });
  } catch (error) {
    console.error("❌ Reject quotation error:", error);
    res.status(500).json({ message: "Failed to reject quotation" });
  }
};

/* ================= ANALYTICS ================= */

export const getQuotationStatusSummaryController =
  async (req, res) => {
    try {
      const data =
        await getQuotationStatusSummary();

      res.json(data);
    } catch (error) {
      console.error(
        "❌ Quotation status summary error:",
        error,
      );

      res.status(500).json({
        message:
          "Failed to fetch quotation summary",
      });
    }
  };

export const getQuotationLifecycleController =
  async (req, res) => {
    try {
      const data =
        await getQuotationLifecycle();

      res.json(data);
    } catch (error) {
      console.error(
        "❌ Quotation lifecycle error:",
        error,
      );

      res.status(500).json({
        message:
          "Failed to fetch quotation lifecycle",
      });
    }
  };

export const getQuotationValueTrendController =
  async (req, res) => {
    try {
      const months = Number(
        req.query.months || 6,
      );

      const data =
        await getQuotationValueTrend(months);

      res.json(data);
    } catch (error) {
      console.error(
        "❌ Quotation value trend error:",
        error,
      );

      res.status(500).json({
        message:
          "Failed to fetch quotation value trend",
      });
    }
  };

/* ================= REVISE ================= */
export const reviseQuotationController = async (req, res) => {
  try {
    // ✅ Extract values
    const { id } = req.params;
    const { reason } = req.body;

    // 🔒 RBAC CHECK: Only PIC or Admin can revise
    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: {
        deal: {
          select: { personInCharge: true },
        },
      },
    });

    if (!quotation) {
      return res.status(404).json({
        message: "Quotation not found",
      });
    }

    const isAdmin = req.user?.role === "ADMIN";
    const isPIC = quotation.deal?.personInCharge === req.user?.name;

    if (!isAdmin && !isPIC) {
      return res.status(403).json({
        message: `Unauthorized: Only Admin or the Person in Charge (${quotation.deal?.personInCharge || "N/A"}) can revise this quotation.`,
      });
    }

    const newQuotation = await reviseQuotation(id, req.user.id, reason);

    const finalResult = await attachRevisionHistory(newQuotation);
    res.status(201).json(finalResult);
  } catch (error) {
    console.error("❌ Revise quotation error:", error);

    res.status(500).json({
      message: error.message || "Failed to create revision",
    });
  }
};

// src/modules/quotation/quotation.service.js

import prisma from "../../utils/prisma.js";

const GST_RATE = 0.18;
const CGST_RATE = 0.09;
const SGST_RATE = 0.09;

export const createQuotation = async (data) => {
  const {
    quotationNumber,
    quotationType = "QUOTATION",
    accountId,
    dealId,
    issueDate,
    validUntil,
    items,
    notes,
    terms,
    paymentTerms = [],
    deliveryTerms = [],
    importantNotes = [],
    headerDiscount = 0,
    refDocuments,
    techPropRef,
  } = data;

  /* ================= VALIDATION ================= */
  if (!accountId) {
    throw new Error("Account is required");
  }

  if (!items || items.length === 0) {
    throw new Error("At least one item is required");
  }

  /* ================= FETCH USER MAX DISCOUNT ================= */
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
    select: { maxDiscount: true, role: true },
  });

  const maxLimit = user?.maxDiscount ?? 0;
  const isAdmin = user?.role === "ADMIN";

  // If not admin, enforce discount limit
  const checkLimit = (discount, name) => {
    if (!isAdmin && discount > maxLimit) {
      throw new Error(
        `Discount limit exceeded for ${name}. Your maximum allowed discount is ${maxLimit}%`,
      );
    }
  };

  /* ================= GENERATE QUOTATION NO ================= */
  // Fetch deal to get dealLogId
  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
    select: { dealLogId: true },
  });

  if (!deal) {
    throw new Error("Deal not found");
  }

  // Find the highest revision number for this deal
  const existingQuotes = await prisma.quotation.findMany({
    where: { dealId: dealId },
    select: { quotationNo: true },
  });

  if (existingQuotes.length > 0) {
    throw new Error(
      "A quotation already exists for this Log ID. Please use the 'Revise' option from the existing quotation to create a new version.",
    );
  }

  let maxRevision = 0;
  existingQuotes.forEach((q) => {
    // 🔥 Updated Regex to handle "Rev 01" or "_R1"
    const match = q.quotationNo.match(/(?:_R| Rev )(\d+)$/);
    if (match) {
      const rev = parseInt(match[1], 10);
      if (rev > maxRevision) maxRevision = rev;
    }
  });

  const nextRev = maxRevision + 1;
  const revStr = nextRev.toString().padStart(2, "0");
  const quotationNo = `${deal.dealLogId} Rev ${revStr}`;
  return await prisma.$transaction(async (tx) => {
    /* ================= 1️⃣ CREATE QUOTATION ================= */
    const quotation = await tx.quotation.create({
      data: {
        // createdBy: current.createdBy,
        quotationNo: quotationNo,
        quotationType,
        // 🔥 ADD THIS
        version: maxRevision + 1,
        isLatest: true,
        status: "DRAFT", // 🔥 FORCE RESET ON EDIT

        account: {
          connect: { id: accountId },
        },

        ...(dealId && {
          deal: {
            connect: { id: dealId },
          },
        }),

        issueDate: new Date(issueDate),
        validUntil: validUntil ? new Date(validUntil) : null,

        revisionReason: maxRevision === 0 ? "Creation" : (data.revisionReason || "History"),
        notes,
        terms,
        paymentTerms,
        deliveryTerms,
        importantNotes,
        refDocuments,
        techPropRef,
      },
    });

    // ✅ FETCH ITEM MASTER DATA (IMPORTANT)
    const itemIds = [
      ...items.map((i) => i.itemId).filter(Boolean),
      ...items.flatMap((i) =>
        (i.subItems || []).map((s) => s.itemId).filter(Boolean),
      ),
    ];

    const itemMasters = await tx.item.findMany({
      where: { id: { in: itemIds } },
    });

    const itemMap = {};
    itemMasters.forEach((i) => {
      itemMap[i.id] = i;
    });

    /* ================= 2️⃣ PROCESS ITEMS ================= */
    let subtotal = 0;

    const quotationItems = items.map((item) => {
      const master = item.itemId ? itemMap[item.itemId] : null;

      if (item.itemId && !master) {
        throw new Error(`Item not found: ${item.itemId}`);
      }

      const qty = Number(item.quantity || 1);
      const hasSubItems = item.subItems?.length > 0;

      const price = Number(item.price ?? master?.basePrice ?? 0);
      const discount = Number(item.discount || 0);

      
      checkLimit(discount, master?.name || item.name || "Item");

      const lineTotal = Math.max(0, qty * price * (1 - discount / 100));

      // ✅ INCLUDE SUB-ITEMS IN TOTAL
      let subTotalSum = 0;

      if (item.subItems?.length) {
        subTotalSum = item.subItems.reduce((sum, sub) => {
          const sQty = Number(sub.quantity || 1);
          const sPrice = Number(sub.price || 0);
          const sDiscount = Number(sub.discount || 0);

          return sum + Math.max(0, sQty * sPrice * (1 - sDiscount / 100));
        }, 0);
      }

      const finalLineTotal = lineTotal + subTotalSum;

      subtotal += finalLineTotal;

      return {
        quotationId: quotation.id,
        itemId: item.itemId,

        // ✅ SNAPSHOT (FROM MASTER OR PROVIDED)
        sku: item.sku || master?.sku || "",
        description: item.description || master?.description || "",

        // 🔥 CRITICAL ADD
        category: item.category || master?.category || null,

        make: item.make || master?.make || null,
        mfgPartNo: item.mfgPartNo || master?.mfgPartNo || null,
        uom: item.uom || master?.uom || null,

        // USER EDITABLE
        remarks:
          item.remarks !== undefined
            ? item.remarks
            : master?.defaultRemarks || null,

        quantity: qty,
        price,
        discount,
        lineTotal: finalLineTotal,
      };
    });

    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      const base = quotationItems[index];

      await tx.quotationItem.create({
        data: {
          // ✅ FIX 1: relation instead of quotationId
          quotation: {
            connect: { id: quotation.id },
          },

          // ✅ FIX 2: relation instead of itemId
          ...(item.itemId && {
            item: {
              connect: { id: item.itemId },
            },
          }),

          // ✅ SNAPSHOT (NO NULL CRASH)
          sku: base.sku || "",
          description: base.description || "",
          category: base.category || null,

          make: base.make || null,
          mfgPartNo: base.mfgPartNo || null,
          uom: base.uom || null,
          remarks: base.remarks || null,

          quantity: base.quantity,
          price: base.price,
          discount: base.discount,
          lineTotal: base.lineTotal,

          // ✅ SUB ITEMS (unchanged logic)
          subItems: {
            create:
              item.subItems?.map((sub) => {
                const subMaster = itemMap[sub.itemId];

                const qty = Number(sub.quantity || 1);
                const price = Number(sub.price || 0);
                const discount = Number(sub.discount || 0);

                checkLimit(discount, subMaster?.name || "Sub-item");

                return {
                  itemId: sub.itemId || null,

                  name: subMaster?.name || sub.name || "",
                  sku: subMaster?.sku || "",
                  category: subMaster?.category || null,

                  // 🔥 ADD THESE (CRITICAL)
                  make: subMaster?.make || null,
                  mfgPartNo: subMaster?.mfgPartNo || null,
                  uom: subMaster?.uom || null,

                  description: sub.description || null,
                  remarks: sub.remarks || null,
                  quantity: qty,
                  price,
                  discount,
                  lineTotal: Math.max(0, qty * price * (1 - discount / 100)),
                };
              }) || [],
          },
        },
      });
    }

    // await tx.quotationItem.createMany({
    //   data: quotationItems,
    // });

    /* ================= 3️⃣ HEADER DISCOUNT VALIDATION ================= */
    const quotationDiscount = Number(headerDiscount || 0);
    const headerDiscountPercent =
      subtotal > 0 ? (quotationDiscount / subtotal) * 100 : 0;

    if (!isAdmin && headerDiscountPercent > maxLimit) {
      throw new Error(
        `Overall discount (${headerDiscountPercent.toFixed(2)}%) exceeds your limit of ${maxLimit}%`,
      );
    }

    const taxableValue = Math.max(0, subtotal - quotationDiscount);

    const taxTotal = 0;
    const grandTotal = taxableValue;

    /* ================= 4️⃣ UPDATE TOTALS ================= */
    const updatedQuotation = await tx.quotation.update({
      where: { id: quotation.id },
      data: {
        subtotal,
        discountTotal: quotationDiscount,
        taxTotal,
        grandTotal,
      },
      include: {
        account: {
          include: { keyAccountManager: true }
        },
        deal: true,
        items: {
          include: {
            item: true,
            subItems: true, // ✅ ADD THIS
          },
        },
      },
    });

    return updatedQuotation;
  });
};

export const updateQuotation = async (id, data) => {
  const {
    issueDate,
    validUntil,
    items,
    notes,
    terms,
    paymentTerms,
    deliveryTerms,
    importantNotes,
    headerDiscount = 0,
    refDocuments,
    techPropRef,
  } = data;

  if (!items || items.length === 0) {
    throw new Error("At least one item is required");
  }

  return await prisma.$transaction(async (tx) => {
    /* ================= 1️⃣ GET CURRENT ================= */
    const current = await tx.quotation.findUnique({
      where: { id },
      include: {
        items: {
          include: { subItems: true },
        },
      },
    });

    if (!current) {
      throw new Error("Quotation not found");
    }

    /* ================= FETCH USER MAX DISCOUNT ================= */
    const user = await tx.user.findUnique({
      where: { id: data.userId },
      select: { maxDiscount: true, role: true },
    });

    const maxLimit = user?.maxDiscount ?? 0;
    const isAdmin = user?.role === "ADMIN";

    const checkLimit = (discount, name, existingDiscount = 0) => {
      // Logic: User can add up to their maxLimit on top of what's already there
      const allowedTotal = Number(existingDiscount) + Number(maxLimit);
      
      if (!isAdmin && discount > allowedTotal) {
        throw new Error(
          `Item "${name}" discount (${discount}%) exceeds your limit of ${maxLimit}% (Existing: ${existingDiscount}%)`,
        );
      }
    };

    // Allow edit only for draft/rejected (or ADMIN can edit SUBMITTED too)
    const currentStatus = current.status?.toUpperCase();

    if (currentStatus === "APPROVED") {
      throw new Error("Approved quotation cannot be edited. Please create a revision.");
    }

    if (!isAdmin && !["DRAFT", "REJECTED"].includes(currentStatus)) {
      throw new Error("Only draft or rejected quotation can be edited by Sales Rep");
    }

    if (isAdmin && !["DRAFT", "REJECTED", "SUBMITTED"].includes(currentStatus)) {
      throw new Error("Admin can only edit Draft, Rejected, or Submitted quotations");
    }

    /* ================= 2️⃣ UPDATE SAME QUOTATION ================= */
    const quotation = await tx.quotation.update({
      where: { id: current.id },
      data: {
        issueDate: issueDate ? new Date(issueDate) : current.issueDate,
        validUntil: validUntil ? new Date(validUntil) : current.validUntil,
        quotationType: data.quotationType || current.quotationType,
        notes: notes ?? current.notes,
        terms: terms ?? current.terms,
        paymentTerms:
          paymentTerms !== undefined ? paymentTerms : current.paymentTerms,

        deliveryTerms:
          deliveryTerms !== undefined ? deliveryTerms : current.deliveryTerms,

        importantNotes:
          importantNotes !== undefined
            ? importantNotes
            : current.importantNotes,
        refDocuments: refDocuments ?? current.refDocuments,
        techPropRef: techPropRef ?? current.techPropRef,

        // keep same status, do not create a new row/version
        status: current.status,
        updatedAt: new Date(),
      },
    });

    /* ================= 3️⃣ FETCH & REMOVE OLD ITEM ROWS ================= */
    const existingItems = await tx.quotationItem.findMany({
      where: { quotationId: quotation.id },
      include: { subItems: true },
    });

    const existingDiscountMap = {};
    existingItems.forEach((ei) => {
      // Priority: itemId > sku+desc
      const key = ei.itemId || `${ei.sku}_${ei.description}`;
      existingDiscountMap[key] = ei.discount || 0;

      ei.subItems?.forEach((es) => {
        const sKey = es.itemId || `SUB_${es.name}_${es.sku}`;
        existingDiscountMap[sKey] = es.discount || 0;
      });
    });

    await tx.quotationItem.deleteMany({
      where: { quotationId: quotation.id },
    });

    /* ================= 4️⃣ FETCH ITEM MASTER DATA ================= */
    const itemIds = [
      ...items.map((i) => i.itemId).filter(Boolean),
      ...items.flatMap((i) =>
        (i.subItems || []).map((s) => s.itemId).filter(Boolean),
      ),
    ];

    const itemMasters = await tx.item.findMany({
      where: { id: { in: itemIds } },
    });

    const itemMap = {};
    itemMasters.forEach((i) => {
      itemMap[i.id] = i;
    });

    /* ================= 5️⃣ RECREATE ITEMS ================= */
    let subtotal = 0;

    for (const item of items) {
      const master = item.itemId ? itemMap[item.itemId] : null;
      if (item.itemId && !master) {
        throw new Error(`Item not found: ${item.itemId}`);
      }

      const qty = Number(item.quantity || 1);
      const price = Number(item.price ?? master?.basePrice ?? 0);
      const discount = Number(item.discount || 0);

      const existingKey = item.itemId || `${item.sku || master?.sku}_${item.description || master?.description}`;
      const oldDiscount = existingDiscountMap[existingKey] || 0;



      checkLimit(discount, master?.name || item.name || "Item", oldDiscount);

      const lineTotal = Math.max(0, qty * price * (1 - discount / 100));

      let subTotalSum = 0;
      if (item.subItems?.length) {
        subTotalSum = item.subItems.reduce((sum, sub) => {
          const sQty = Number(sub.quantity || 1);
          const sPrice = Number(sub.price || 0);
          const sDiscount = Number(sub.discount || 0);
          return sum + Math.max(0, sQty * sPrice * (1 - sDiscount / 100));
        }, 0);
      }

      const finalLineTotal = lineTotal + subTotalSum;
      subtotal += finalLineTotal;

      await tx.quotationItem.create({
        data: {
          quotation: { connect: { id: quotation.id } },
          ...(item.itemId && {
            item: { connect: { id: item.itemId } },
          }),

          sku: item.sku || master?.sku || "",
          description: item.description || master?.description || "",
          category: item.category || master?.category || null,
          make: item.make || master?.make || null,
          mfgPartNo: item.mfgPartNo || master?.mfgPartNo || null,
          uom: item.uom || master?.uom || null,
          remarks:
            item.remarks !== undefined
              ? item.remarks
              : master?.defaultRemarks || null,

          quantity: qty,
          price,
          discount,
          lineTotal: finalLineTotal,

          subItems: {
            create:
              item.subItems?.map((sub) => {
                const subMaster = itemMap[sub.itemId];

                const sQty = Number(sub.quantity || 1);
                const sPrice = Number(sub.price || 0);
                const sDiscount = Number(sub.discount || 0);

                const sExistingKey = sub.itemId || `SUB_${sub.name || subMaster?.name}_${sub.sku || subMaster?.sku}`;
                const sOldDiscount = existingDiscountMap[sExistingKey] || 0;

                checkLimit(sDiscount, subMaster?.name || sub.name || "Sub-item", sOldDiscount);

                return {
                  itemId: sub.itemId || null,
                  name: subMaster?.name || sub.name || "",
                  sku: subMaster?.sku || "",
                  category: subMaster?.category || null,
                  make: subMaster?.make || null,
                  mfgPartNo: subMaster?.mfgPartNo || null,
                  uom: subMaster?.uom || null,
                  description: sub.description || null,
                  remarks: sub.remarks || null,
                  quantity: sQty,
                  price: sPrice,
                  discount: sDiscount,
                  lineTotal: Math.max(0, sQty * sPrice * (1 - sDiscount / 100)),
                };
              }) || [],
          },
        },
      });
    }

    /* ================= 6️⃣ UPDATE TOTALS ================= */
    /* ================= 6️⃣ HEADER DISCOUNT VALIDATION ================= */
    const quotationDiscount = Number(headerDiscount || 0);
    const headerDiscountPercent =
      subtotal > 0 ? (quotationDiscount / subtotal) * 100 : 0;

    const oldHeaderDiscountPercent =
      current.subtotal > 0 ? (current.discountTotal / current.subtotal) * 100 : 0;
    const allowedHeaderTotal = oldHeaderDiscountPercent + Number(maxLimit);

    if (!isAdmin && headerDiscountPercent > allowedHeaderTotal) {
      throw new Error(
        `Overall discount (${headerDiscountPercent.toFixed(2)}%) exceeds your limit of ${maxLimit}% (Existing: ${oldHeaderDiscountPercent.toFixed(2)}%)`,
      );
    }

    const taxableValue = Math.max(0, subtotal - quotationDiscount);

    const taxTotal = 0;
    const grandTotal = taxableValue;

    const finalQuotation = await tx.quotation.update({
      where: { id: quotation.id },
      data: {
        issueDate: issueDate ? new Date(issueDate) : undefined,
        validUntil: validUntil ? new Date(validUntil) : null,
        notes,
        terms,
        
        // ✅ NEW
        paymentTerms:
          paymentTerms !== undefined ? paymentTerms : current.paymentTerms,

        deliveryTerms:
          deliveryTerms !== undefined ? deliveryTerms : current.deliveryTerms,

        importantNotes:
          importantNotes !== undefined
            ? importantNotes
            : current.importantNotes,

        refDocuments,
        techPropRef,
        subtotal,
        discountTotal: quotationDiscount,
        taxTotal,
        grandTotal,
      },
      include: {
        account: {
          include: { keyAccountManager: true }
        },
        deal: true,
        items: {
          include: {
            item: true,
            subItems: true,
          },
        },
      },
    });

    return finalQuotation;
  });
};

export const reviseQuotation = async (id, userId, reason = "History") => {
  return await prisma.$transaction(async (tx) => {
    // 1. Get original
    const original = await tx.quotation.findUnique({
      where: { id },
      include: {
        items: {
          include: { subItems: true },
        },
      },
    });

    if (!original) throw new Error("Quotation not found");
    if (original.status !== "APPROVED") {
      throw new Error("Only approved quotations can be revised");
    }

    // 2. Generate new quotation number
    const deal = await tx.deal.findUnique({
      where: { id: original.dealId },
      select: { dealLogId: true },
    });

    if (!deal) throw new Error("Deal not found");

    // Find highest revision for this deal
    const existingQuotes = await tx.quotation.findMany({
      where: { dealId: original.dealId },
      select: { quotationNo: true },
    });

    let maxRevision = 0;
    existingQuotes.forEach((q) => {
      // 🔥 Updated Regex to handle "Rev 01" or "_R1"
      const match = q.quotationNo.match(/(?:_R| Rev )(\d+)$/);
      if (match) {
        const rev = parseInt(match[1], 10);
        if (rev > maxRevision) maxRevision = rev;
      }
    });

    const nextRev = maxRevision + 1;
    const revStr = nextRev.toString().padStart(2, "0");
    const newQuotationNo = `${deal.dealLogId} Rev ${revStr}`;

    // 3. Create new quotation record (DRAFT) with items nested
    const newQuotation = await tx.quotation.create({
      data: {
        quotationNo: newQuotationNo,
        quotationType: original.quotationType,
        version: maxRevision + 1,
        isLatest: true,
        parentQuotationId: original.id, // Link to previous revision
        status: "DRAFT",
        accountId: original.accountId,
        dealId: original.dealId,
        issueDate: new Date(),
        validUntil: original.validUntil,
        revisionReason: reason, // 🔥 NEW: Store the reason provided by user
        notes: original.notes,
        terms: original.terms,
        paymentTerms: original.paymentTerms,
        deliveryTerms: original.deliveryTerms,
        importantNotes: original.importantNotes,
        refDocuments: original.refDocuments,
        techPropRef: original.techPropRef,
        subtotal: original.subtotal,
        discountTotal: original.discountTotal,
        taxTotal: original.taxTotal,
        grandTotal: original.grandTotal,
        items: {
          create: original.items.map((item) => ({
            itemId: item.itemId,
            sku: item.sku,
            description: item.description,
            category: item.category,
            make: item.make,
            mfgPartNo: item.mfgPartNo,
            uom: item.uom,
            remarks: item.remarks,
            quantity: item.quantity,
            price: item.price,
            discount: item.discount,
            lineTotal: item.lineTotal,
            subItems: {
              create: item.subItems.map((sub) => ({
                itemId: sub.itemId,
                name: sub.name,
                sku: sub.sku,
                category: sub.category,
                make: sub.make,
                mfgPartNo: sub.mfgPartNo,
                uom: sub.uom,
                description: sub.description,
                remarks: sub.remarks,
                quantity: sub.quantity,
                price: sub.price,
                discount: sub.discount,
                lineTotal: sub.lineTotal,
              })),
            },
          })),
        },
      },
      include: {
        account: {
          include: { keyAccountManager: true }
        },
        deal: true,
        items: {
          include: { subItems: true },
        },
      },
    });

    // Mark previous as not latest
    await tx.quotation.update({
      where: { id: original.id },
      data: { isLatest: false },
    });

    return newQuotation;
  });
};

/* ================= QUOTATION ANALYTICS ================= */

export const getQuotationStatusSummary =
  async () => {
    const quotations =
      await prisma.quotation.groupBy({
        by: ["status"],

        _count: {
          status: true,
        },

        where: {
          isLatest: true,
        },
      });

    const summary = {
      total: 0,
      draft: 0,
      submitted: 0,
      approved: 0,
      rejected: 0,
      converted: 0,
    };

    quotations.forEach((q) => {
      const count = q._count.status;

      summary.total += count;

      switch (q.status) {
        case "DRAFT":
          summary.draft = count;
          break;

        case "SUBMITTED":
          summary.submitted = count;
          break;

        case "APPROVED":
          summary.approved = count;
          break;

        case "REJECTED":
          summary.rejected = count;
          break;

        case "CONVERTED":
          summary.converted = count;
          break;

        default:
          break;
      }
    });

    return summary;
  };

export const getQuotationLifecycle =
  async () => {
    const quotations =
      await prisma.quotation.groupBy({
        by: ["status"],

        _count: {
          status: true,
        },

        where: {
          isLatest: true,
        },
      });

    return quotations.map((q) => ({
      stage: q.status,
      count: q._count.status,
    }));
  };

export const getQuotationValueTrend =
  async (months = 6) => {
    const startDate = new Date();

    startDate.setMonth(
      startDate.getMonth() - months,
    );

    const quotations =
      await prisma.quotation.findMany({
        where: {
          isLatest: true,

          createdAt: {
            gte: startDate,
          },
        },

        select: {
          createdAt: true,
          grandTotal: true,
        },

        orderBy: {
          createdAt: "asc",
        },
      });

    const monthMap = {};

    quotations.forEach((q) => {
      const month = new Date(
        q.createdAt,
      ).toLocaleString("en-IN", {
        month: "short",
      });

      if (!monthMap[month]) {
        monthMap[month] = 0;
      }

      monthMap[month] += Number(
        q.grandTotal || 0,
      );
    });

    return Object.entries(monthMap).map(
      ([month, value]) => ({
        month,
        value,
      }),
    );
  };

  
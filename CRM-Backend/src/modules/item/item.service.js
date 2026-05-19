// src/modules/item/item.service.js

import prisma from "../../utils/prisma.js";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

/* ================= CREATE ================= */
export const createItemService = async (data) => {
  return prisma.item.create({
    data: {
      sku: data.sku ? String(data.sku).trim() : null,
      name: data.name || null,
      description: data.description,
      imageUrl: data.imageUrl || null,
      basePrice: data.basePrice ? Number(data.basePrice) : null,
      quantity: data.quantity !== undefined ? Number(data.quantity) : 1,
      unitPrice:
        data.unitPrice !== undefined
          ? Number(data.unitPrice)
          : data.basePrice
            ? Number(data.basePrice)
            : null,

      pricingMode: data.pricingMode || "parent_only",
      parentId: data.parentId || null,

      // ✅ NEW FIELD (ADDED)
      category: data.category || null,

      // ✅ EXISTING
      make: data.make || null,
      mfgPartNo: data.mfgPartNo || null,
      uom: data.uom || null,
      defaultRemarks: data.defaultRemarks || null,
    },
  });
};

/* ================= GET ALL ================= */
// export const getItemsService = async () => {
//   return prisma.item.findMany({
//     include: {
//       children: true, // ✅ useful later
//       parent: true,
//     },
//     orderBy: { createdAt: "asc" },
//   });
// };

/* ================= GET ALL ================= */
export const getItemsService = async ({ category } = {}) => {
  return prisma.item.findMany({
    where: {
      ...(category ? { category } : {}),
      parentId: null, // ✅ ONLY ROOT ITEMS
    },
    include: {
      children: {
        include: {
          children: true, // ✅ supports 2-level (your use case)
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });
};

/* ================= GET ONE ================= */
export const getItemByIdService = async (id) => {
  return prisma.item.findUnique({
    where: { id },
  });
};

/* ================= UPDATE ================= */
export const updateItemService = async (id, data) => {
  return prisma.item.update({
    where: { id },
    data: {
      sku: data.sku ? String(data.sku).trim() : null,
      name: data.name || null,
      description: data.description,
      imageUrl: data.imageUrl !== undefined ? data.imageUrl : undefined,
      basePrice: data.basePrice ? Number(data.basePrice) : null,
      quantity: data.quantity !== undefined ? Number(data.quantity) : undefined,
      unitPrice:
        data.unitPrice !== undefined ? Number(data.unitPrice) : undefined,

      pricingMode:
        data.pricingMode !== undefined ? data.pricingMode : undefined,

      parentId: data.parentId !== undefined ? data.parentId : undefined,

      // ✅ NEW FIELD (ADDED)
      category: data.category || null,

      // ✅ EXISTING
      make: data.make || null,
      mfgPartNo: data.mfgPartNo || null,
      uom: data.uom || null,
      defaultRemarks: data.defaultRemarks || null,
    },
  });
};

/* ================= DELETE ================= */
/* ================= DELETE ================= */
export const deleteItemService = async (id) => {
  return prisma.$transaction(async (tx) => {
    // ✅ 1. delete all descendants (recursive tree via parentId)
    const allItems = await tx.item.findMany({
      select: { id: true, parentId: true },
    });

    // build map
    const map = {};
    allItems.forEach((i) => {
      if (!map[i.parentId]) map[i.parentId] = [];
      map[i.parentId].push(i.id);
    });

    // collect all child ids
    const collect = (parentId) => {
      const children = map[parentId] || [];
      return children.flatMap((childId) => [childId, ...collect(childId)]);
    };

    const childIds = collect(id);

    // ✅ 2. delete children first
    if (childIds.length > 0) {
      await tx.item.deleteMany({
        where: { id: { in: childIds } },
      });
    }

    // ✅ 3. delete parent
    return tx.item.delete({
      where: { id },
    });
  });
};

/* ================= BULK IMPORT WITH HIERARCHY ================= */
export const bulkCreateItemsWithHierarchy = async (items) => {
  return prisma.$transaction(async (tx) => {
    const createdMap = {}; // parentKey → parentId

    for (const row of items) {
      // 👉 STEP 1: if parent row
      if (!row.parentKey || row.isParent) {
        const parent = await tx.item.create({
          data: {
            sku: row.sku || null,
            name: row.name,
            description: row.description,
            basePrice: row.basePrice ? Number(row.basePrice) : null,
            quantity: row.quantity !== undefined ? Number(row.quantity) : 1,
            unitPrice:
              row.unitPrice !== undefined
                ? Number(row.unitPrice)
                : row.basePrice
                  ? Number(row.basePrice)
                  : null,
            category: row.category || null,
            make: row.make || null,
            mfgPartNo: row.mfgPartNo || null,
            uom: row.uom || null,
            defaultRemarks: row.defaultRemarks || null,
          },
        });

        if (row.parentKey) {
          createdMap[row.parentKey] = parent.id;
        }

        continue;
      }

      // 👉 STEP 2: child row
      const parentId = createdMap[row.parentKey];

      await tx.item.create({
        data: {
          sku: row.sku || null,
          name: row.name,
          description: row.description,
          basePrice: row.basePrice ? Number(row.basePrice) : null,
          quantity: row.quantity !== undefined ? Number(row.quantity) : 1,
          unitPrice:
            row.unitPrice !== undefined
              ? Number(row.unitPrice)
              : row.basePrice
                ? Number(row.basePrice)
                : null,

          parentId: parentId || null,

          category: row.category || null,
          make: row.make || null,
          mfgPartNo: row.mfgPartNo || null,
          uom: row.uom || null,
          defaultRemarks: row.defaultRemarks || null,
        },
      });
    }

    return { message: "Bulk import completed" };
  });
};

/* ================= IMPORT ================= */

export const importItemsService = async ({ file, category }) => {
  const groupedCategories = ["Test Platform", "Fixture & Adapter"];

  const canonicalCategory = String(category ?? "")
    .replace(/\s+/g, " ")
    .trim();

  const importType = groupedCategories.includes(canonicalCategory)
    ? "grouped"
    : "flat";
  // ✅ read excel buffer
  const workbook = XLSX.read(file.buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // ✅ read as row arrays so merged/header-like sheets are handled correctly
  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    blankrows: false,
  });

  // ✅ skip first row if it is the report title/header row
  // const dataRows = rows.slice(2);

  // ✅ dynamically skip title/header rows
  // keep title/header filtering, but DO NOT drop blank continuation rows
  const normalizeCell = (value) =>
    String(value ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  const dataRows = rows.filter((row) => {
    const cells = row.slice(0, 12).map(normalizeCell);

    const isTitleRow = cells.some(
      (c) =>
        c.includes("price configurator") ||
        c.includes("items catalog") ||
        c.includes("item breakdown"),
    );

    const headerTokens = [
      "category",
      "catagory",
      "sku #",
      "item description",
      "mfg / make",
      "mfg pn",
      "qty",
      "uom",
      "unit price",
      "total price",
      "discount",
    ];

    const headerHits = cells.filter((cell) =>
      headerTokens.includes(cell),
    ).length;

    return !(isTitleRow || headerHits >= 3);
  });

  console.log("📦 IMPORT START");
  console.log("👉 CATEGORY:", category);
  console.log("👉 IMPORT TYPE:", importType);
  console.log("👉 TOTAL ROWS:", dataRows.length);

  let created = 0;
  let updated = 0;
  let skipped = 0;

  return prisma.$transaction(async (tx) => {
    // ======================================
    // FULL CATEGORY REPLACE
    // ======================================

    // ✅ collect all excel categories first
    const excelCategories = new Set();

    for (const row of dataRows) {
      const categoryValue = String(row[0] ?? row[1] ?? "")
        .replace(/\s+/g, " ")
        .trim();

      if (categoryValue) {
        excelCategories.add(categoryValue);
      }
    }

    // ✅ also include incoming dropdown category
    excelCategories.add(canonicalCategory);

    // ✅ delete matching old categories
    // ✅ get old items first
    const oldItems = await tx.item.findMany({
      where: {
        category: {
          in: Array.from(excelCategories),
        },
      },
      select: {
        imageUrl: true,
      },
    });

    // ✅ delete old DB rows
    await tx.item.deleteMany({
      where: {
        category: {
          in: Array.from(excelCategories),
        },
      },
    });

    // ✅ remove physical image files
    for (const item of oldItems) {
      if (!item.imageUrl) continue;

      const relativePath = item.imageUrl.replace(/^\/+/, "");

      const filePath = path.join(process.cwd(), "public", relativePath);

      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);

          console.log("🗑️ IMAGE REMOVED:", filePath);
        }
      } catch (err) {
        console.error("❌ IMAGE DELETE FAILED:", err.message);
      }
    }

    console.log("🗑️ OLD CATEGORY ITEMS + IMAGES REMOVED");
    // 🔹 FLAT IMPORT
    if (importType === "flat") {
      let instrumentationSoftwareCreated = false;
      let lastExcelCategory = canonicalCategory;
      for (const row of dataRows) {
        console.log("➡️ ROW:", row);

        // ✅ SUPPORT BOTH EXCEL FORMATS

        const firstCell = String(row[0] ?? "").trim();

        // ✅ detect if first column is serial number
        const hasSerialColumn = /^\d+$/.test(firstCell);

        // ======================================
        // FORMAT 1 → OLD FORMAT (WITH SERIAL)
        // ======================================
        // [SL, CATEGORY, SKU, DESCRIPTION, MAKE, MFG, QTY, UOM, UNIT PRICE...]

        let excelCategory;
        let sku;
        let description;
        let make;
        let mfgPartNo;
        let qty;
        let uom;
        let unitPrice;
        let totalPrice;
        let discount;
        let finalPrice;

        if (hasSerialColumn) {
          excelCategory = String(row[1] ?? "").trim();

          sku = String(row[2] ?? "").trim();

          description = String(row[3] ?? "").trim();

          make = String(row[4] ?? "").trim();

          mfgPartNo = String(row[5] ?? "").trim();

          qty = row[6] ?? null;

          uom = String(row[7] ?? "").trim();

          unitPrice = row[8] ?? null;

          totalPrice = row[9] ?? null;

          discount = row[10] ?? 0;

          finalPrice = row[11] ?? null;
        }

        // ======================================
        // FORMAT 2 → NEW FORMAT (NO SERIAL)
        // ======================================
        // [CATEGORY, SKU, DESCRIPTION, MAKE, MFG, QTY, UOM, UNIT PRICE...]
        else {
          excelCategory = String(row[0] ?? "").trim();

          if (excelCategory) {
            lastExcelCategory = excelCategory;
          } else {
            excelCategory = lastExcelCategory;
          }

          sku = String(row[1] ?? "").trim();

          description = String(row[2] ?? "").trim();

          make = String(row[3] ?? "").trim();

          mfgPartNo = String(row[4] ?? "").trim();

          qty = row[5] ?? null;

          uom = String(row[6] ?? "").trim();

          unitPrice = row[7] ?? null;

          totalPrice = row[8] ?? null;

          discount = row[9] ?? 0;

          finalPrice = row[10] ?? null;
        }

        if (!description) {
          console.log("⏭️ SKIPPED (NO DESCRIPTION)");
          skipped++;
          continue;
        }

        let existingItem = null;

        // ✅ WITH SKU
        if (sku) {
          existingItem = await tx.item.findFirst({
            where: {
              sku: {
                equals: sku.trim(),
                mode: "insensitive",
              },
            },
          });
        }

        // ✅ WITHOUT SKU
        else {
          existingItem = await tx.item.findFirst({
            where: {
              category: excelCategory || canonicalCategory,
              name: {
                equals: description.trim(),
                mode: "insensitive",
              },
            },
          });
        }

        const newBasePrice =
          unitPrice !== null && unitPrice !== ""
            ? Math.round(Number(unitPrice))
            : null;

        if (existingItem) {
          const hasChanges =
            existingItem.name !== description ||
            existingItem.description !== description ||
            existingItem.category !== canonicalCategory ||
            Number(existingItem.basePrice || 0) !== Number(newBasePrice || 0) ||
            Number(existingItem.quantity || 1) !==
              Number(qty !== null && qty !== "" ? qty : 1) ||
            existingItem.make !== (make || null) ||
            existingItem.mfgPartNo !== (mfgPartNo || null) ||
            existingItem.uom !== (uom || null);

          if (hasChanges) {
            await tx.item.update({
              where: {
                id: existingItem.id,
              },
              data: {
                name: description,
                description,
                category: excelCategory || canonicalCategory,
                basePrice: newBasePrice,
                quantity: qty !== null && qty !== "" ? Number(qty) : 1,
                unitPrice: newBasePrice,
                make: make || null,
                mfgPartNo: mfgPartNo || null,
                uom: uom || null,
              },
            });

            console.log("🟨 UPDATED:", sku);
            updated++;
          } else {
            console.log("⏭️ NO CHANGES:", sku);
            skipped++;
          }

          continue;
        }

        const data = {
          name: description,
          sku: sku ? sku.trim() : null,
          description,
          basePrice: newBasePrice,

          quantity: qty !== null && qty !== "" ? Number(qty) : 1,

          unitPrice: newBasePrice,

          discount:
            discount !== null &&
            discount !== undefined &&
            String(discount).trim() !== ""
              ? Number(discount)
              : null,

          // ✅ NORMAL ITEMS
          pricingMode: "parent_only",

          category: excelCategory || canonicalCategory,
          make: make || null,
          mfgPartNo: mfgPartNo || null,
          uom: uom || null,
          parentId: null,
        };

        console.log("✅ CREATING:", data);

        const createdItem = await tx.item.create({ data });
        created++;

        // ======================================
        // AUTO SOFTWARE ITEM ONLY ONCE
        // ======================================

        if (
          !instrumentationSoftwareCreated &&
          category === "Instrumentation & Test Computer" &&
          ["AE", "AP"].some((prefix) => sku?.toUpperCase().startsWith(prefix))
        ) {
          await tx.item.create({
            data: {
              category,

              pricingMode: "parent_only",

              sku: "SE1000001",

              name: "MTS Licensable Driver, Tool Monitor for the above",

              description: "MTS Licensable Driver, Tool Monitor for the above",

              make: "MTS",

              mfgPartNo: null,

              quantity: 1,

              unitPrice: 2000,

              basePrice: 2000,

              uom: uom || "Nos",

              discount: null,

              parentId: null,
            },
          });

          instrumentationSoftwareCreated = true;

          console.log("🟩 SINGLE SOFTWARE ITEM CREATED");
        }
      }
    }

    // 🔹 GROUPED IMPORT
    if (importType === "grouped") {
      let currentParent = null;

      const isTestPlatformImport = canonicalCategory === "Test Platform";

      for (const row of dataRows) {
        console.log("➡️ ROW:", row);

        const serial = String(row[0] ?? "").trim();
        const categoryCell = String(row[1] ?? "").trim();
        const sku = String(row[2] ?? "").trim();
        const description = String(row[3] ?? "").trim();
        const make = String(row[4] ?? "").trim();
        const mfgPartNo = String(row[5] ?? "").trim();

        /* =========================================
   FIXTURE & ADAPTER HEADER ROW SKIP ONLY
========================================= */
        const lowerSku = sku.toLowerCase();
        const lowerDesc = description.toLowerCase();

        const isExcelHeaderRow =
          lowerSku === "sku #" ||
          lowerDesc === "item description" ||
          make.toLowerCase() === "mfg / make" ||
          categoryCell.toLowerCase() === "application software";

        if (category === "Fixture & Adapter" && isExcelHeaderRow) {
          console.log("⏭️ FIXTURE HEADER ROW SKIPPED");
          skipped++;
          continue;
        }

        const qty =
          row[6] !== null &&
          row[6] !== undefined &&
          String(row[6]).trim() !== ""
            ? Number(row[6])
            : 1;

        const uom = String(row[7] ?? "").trim();

        const unitPrice = row[8] ?? null;
        const totalPrice = row[9] ?? null;

        const discount = row[10] ?? 0;

        const upperSku = sku.toUpperCase();

        const excelCategory = String(categoryCell ?? "")
          .replace(/\s+/g, " ")
          .trim();

        const resolvedCategory =
          canonicalCategory === "Fixture & Adapter"
            ? "Fixture & Adapter"
            : excelCategory || canonicalCategory;

        const normalizedCategory = excelCategory.toUpperCase();

        const isAssemblyPlatform = normalizedCategory === "ASSEMBLY PLATFORM";

        const isApplicationEngineering =
          normalizedCategory === "APPLICATION ENGINEERING";

        const isApplicationEngineeringHeader =
          isApplicationEngineering && !sku && description;

        const isParent =
          upperSku.startsWith("TC") || // Test Platform parent
          upperSku.startsWith("FX") || // Fixture & Adapter parent
          upperSku.startsWith("AC") || // Assembly Platform SKU parent
          isAssemblyPlatform || // Assembly Platform section rows
          isApplicationEngineeringHeader; // Application Engineering section rows

        const isChild =
          upperSku.startsWith("FC") || // Test Platform child
          upperSku.startsWith("INT") || // Test Platform multiline/spec child
          categoryCell.toUpperCase() === "ACCESSORY" || // Old Fixture child
          (canonicalCategory === "Fixture & Adapter" &&
            !sku &&
            !!description) ||
          isApplicationEngineering;

        // =========================
        // 1. PARENT ROW
        // =========================
        if (isParent) {
          const exists = await tx.item.findFirst({
            where: {
              sku: {
                equals: sku.trim(),
                mode: "insensitive",
              },
            },
          });

          if (exists) {
            const newBasePrice =
              unitPrice !== null && unitPrice !== "" ? Number(unitPrice) : null;

            const hasChanges =
              exists.name !== description ||
              exists.description !== description ||
              exists.category !== resolvedCategory ||
              Number(exists.basePrice || 0) !== Number(newBasePrice || 0) ||
              Number(exists.quantity || 1) !== Number(qty || 1) ||
              exists.make !== (make || null) ||
              exists.mfgPartNo !== (mfgPartNo || null) ||
              exists.uom !== (uom || null);

            if (hasChanges) {
              currentParent = await tx.item.update({
                where: {
                  id: exists.id,
                },
                data: {
                  name: description || "Unnamed Item",
                  description: isTestPlatformImport
                    ? null
                    : description || null,
                  category: resolvedCategory,

                  quantity: qty,

                  unitPrice:
                    unitPrice !== null && unitPrice !== ""
                      ? Number(unitPrice)
                      : null,

                  basePrice: newBasePrice,

                  make: make || null,
                  mfgPartNo: mfgPartNo || null,
                  uom: uom || null,
                },
              });

              console.log("🟨 UPDATED PARENT:", sku);
              updated++;
            } else {
              console.log("⏭️ NO CHANGES PARENT:", sku);
              skipped++;
              currentParent = exists;
            }

            continue;
          }

          currentParent = await tx.item.create({
            data: {
              name: description || "Unnamed Item",
              sku: sku || null,
              description: description || null,

              quantity: qty,

              unitPrice:
                unitPrice !== null && unitPrice !== ""
                  ? Number(unitPrice)
                  : null,

              basePrice:
                unitPrice !== null && unitPrice !== ""
                  ? Number(unitPrice)
                  : null,

              discount:
                discount !== null &&
                discount !== undefined &&
                String(discount).trim() !== ""
                  ? Number(discount)
                  : null,
              pricingMode: "parent_with_children",
              category: resolvedCategory,
              make: make || null,
              mfgPartNo: mfgPartNo || null,
              uom: uom || null,
              parentId: null,
            },
          });

          console.log("🟦 PARENT CREATED:", currentParent.id);
          created++;
          continue;
        }

        // =========================
        // 2. CHILD ROW
        // =========================
        if (currentParent && isChild) {
          let exists = null;

          // ✅ if child has SKU → match by SKU
          if (sku) {
            exists = await tx.item.findFirst({
              where: {
                sku: {
                  equals: sku.trim(),
                  mode: "insensitive",
                },
              },
            });
          }

          // ✅ if child has NO SKU → match by parent + description
          else {
            exists = await tx.item.findFirst({
              where: {
                parentId: currentParent.id,
                name: {
                  equals: description.trim(),
                  mode: "insensitive",
                },
              },
            });
          }

          // =========================================
          // UPDATE EXISTING CHILD
          // =========================================
          if (exists) {
            const updateUnitPrice =
              unitPrice !== null && unitPrice !== "" ? Number(unitPrice) : null;

            // ✅ IMPORTANT FIX
            // Test Platform child description should start EMPTY
            // continuation rows will append later
            const childDescription =
              canonicalCategory === "Test Platform"
                ? null
                : description || null;

            const hasChanges =
              exists.name !== description ||
              exists.description !== childDescription ||
              exists.category !== resolvedCategory ||
              Number(exists.basePrice || 0) !== Number(updateUnitPrice || 0) ||
              Number(exists.quantity || 1) !== Number(qty || 1) ||
              exists.make !== (make || null) ||
              exists.mfgPartNo !== (mfgPartNo || null) ||
              exists.uom !== (uom || null);

            if (hasChanges) {
              await tx.item.update({
                where: {
                  id: exists.id,
                },
                data: {
                  name: description || "Unnamed Child Item",

                  // ✅ FIXED
                  description: childDescription,

                  category: resolvedCategory,

                  quantity: qty,

                  unitPrice: updateUnitPrice,

                  basePrice: updateUnitPrice,

                  make: make || null,

                  mfgPartNo: mfgPartNo || null,

                  uom: uom || null,
                },
              });

              console.log("🟨 UPDATED CHILD:", sku || description);
              updated++;
            } else {
              console.log("⏭️ NO CHANGES CHILD:", sku || description);
              skipped++;
            }

            continue;
          }

          // =========================================
          // CREATE NEW CHILD
          // =========================================
          const qtyNumber = Number(qty || 1);

          const finalUnitPrice =
            unitPrice !== null && unitPrice !== ""
              ? Number(unitPrice)
              : totalPrice !== null && totalPrice !== "" && qtyNumber > 0
                ? Number(totalPrice) / qtyNumber
                : null;

          const finalLineTotal =
            finalUnitPrice !== null ? finalUnitPrice * qtyNumber : null;

          // ✅ IMPORTANT FIX
          // Test Platform child description should start EMPTY
          const childDescription =
            canonicalCategory === "Test Platform" ? null : description || null;

          const child = await tx.item.create({
            data: {
              name: description || "Unnamed Child Item",

              sku: sku || null,

              // ✅ FIXED
              description: childDescription,

              quantity: qty,

              unitPrice:
                unitPrice !== null && unitPrice !== ""
                  ? Number(unitPrice)
                  : null,

              basePrice: finalUnitPrice,

              discount:
                discount !== null &&
                discount !== undefined &&
                String(discount).trim() !== ""
                  ? Number(discount)
                  : null,

              pricingMode: "parent_only",

              category: resolvedCategory,

              make: make || null,

              mfgPartNo: mfgPartNo || null,

              uom: uom || null,

              parentId: currentParent.id,
            },
          });

          console.log("🟩 CHILD CREATED:", child.id);
          created++;
          continue;
        }

        // =========================================
        // 3. DESCRIPTION CONTINUATION ROW
        // =========================================
        if (currentParent && !sku && description) {
          const latestChild = await tx.item.findFirst({
            where: {
              parentId: currentParent.id,
            },
            orderBy: {
              createdAt: "desc",
            },
          });

          if (latestChild) {
            // ✅ avoid duplicate text append
            const existingDescription = latestChild.description || "";

            // ✅ skip if already exists
            if (existingDescription.includes(description.trim())) {
              console.log("⏭️ DUPLICATE DESCRIPTION SKIPPED");
              continue;
            }

            // ✅ proper multiline append
            const updatedDescription = existingDescription
              ? `${existingDescription}\n${description.trim()}`
              : description.trim();

            await tx.item.update({
              where: {
                id: latestChild.id,
              },
              data: {
                description: updatedDescription,
              },
            });

            console.log("📝 DESCRIPTION APPENDED");

            continue;
          }
        }

        console.log("⏭️ SKIPPED UNKNOWN ROW");
        skipped++;
      }
    }

    console.log("✅ IMPORT DONE:", { created, skipped });

    return {
      created,
      updated,
      skipped,
    };
  });
};

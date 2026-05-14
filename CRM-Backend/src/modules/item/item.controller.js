// src/modules/item/item.controller.js

import {
  createItemService,
  getItemsService,
  getItemByIdService,
  updateItemService,
  deleteItemService,
  importItemsService,
} from "./item.service.js";

import prisma from "../../utils/prisma.js";

/* ================= CREATE ================= */
export const createItem = async (req, res) => {
  try {
    const {
      category, // ✅ NEW
      sku,
      name,
      description,
      basePrice,
      pricingMode,
      make,
      mfgPartNo,
      uom,
      defaultRemarks,
      parentId,
    } = req.body;

    // ✅ BASIC VALIDATION
    if (!name || !sku) {
      return res.status(400).json({
        message: "SKU and Item Name are required",
      });
    }

const item = await createItemService({
  category: category || null,

  parentId: parentId || null,

  pricingMode: pricingMode || "parent_only",

  sku,
  name,
  description,
  basePrice,
  make,
  mfgPartNo,
  uom,
  defaultRemarks,
});

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ALL ================= */
export const getItems = async (req, res) => {
  try {
    const { category } = req.query;

    const items = await getItemsService({
      category, // 🔥 optional filter
    });

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET ONE ================= */
export const getItemById = async (req, res) => {
  try {
    console.log("🔥 ITEM API HIT");
    console.log("👉 PARAM ID:", req.params.id);

    const item = await getItemByIdService(req.params.id);

    console.log("👉 DB RESULT:", item);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE ================= */
export const updateItem = async (req, res) => {
  try {
    const {
      category, // ✅ NEW
      sku,
      name,
      description,
      basePrice,
      pricingMode,
      make,
      mfgPartNo,
      uom,
      defaultRemarks,
      parentId,
    } = req.body;

const item = await updateItemService(req.params.id, {
  category: category || null,

  parentId: parentId !== undefined ? parentId : undefined,

  pricingMode: pricingMode || "parent_only",

  sku,
  name,
  description,
  basePrice,
  make,
  mfgPartNo,
  uom,
  defaultRemarks,
});
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE ================= */
/* ================= DELETE ================= */
export const deleteItem = async (req, res) => {
  try {
    await deleteItemService(req.params.id);

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("❌ Delete item error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= IMPORT ================= */
export const importItems = async (req, res) => {
  try {
    console.log("🔥 IMPORT API HIT");
    console.log("👉 BODY:", req.body);
    console.log("👉 FILE:", req.file?.originalname);
    const { category, importType } = req.body;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Excel file is required" });
    }

    const result = await importItemsService({
      file: req.file,
      category,
      importType, // "flat" | "grouped"
    });

    res.json({
      message: "Items imported successfully",
      ...result,
    });
  } catch (err) {
    console.error("❌ Import items error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET TREE BY SKU ================= */
export const getItemTreeBySku = async (req, res) => {
  try {
    const { sku } = req.params;

    // 🔹 recursive function
    const buildTree = async (item) => {
      const children = await prisma.item.findMany({
        where: { parentId: item.id },
        orderBy: { createdAt: "asc" },
      });

      const nested = await Promise.all(
        children.map((child) => buildTree(child)),
      );

      return {
        ...item,
        children: nested,
      };
    };

    console.log("👉 REQUEST SKU:", JSON.stringify(sku));
    // 🔹 find root by SKU
    const cleanSku = String(sku || "").trim();

    console.log("🔎 SKU TREE LOOKUP:", JSON.stringify(cleanSku));

    const found = await prisma.item.findFirst({
      where: {
        sku: {
          equals: cleanSku,
          mode: "insensitive",
        },
      },
    });

    if (!found) {
      return res.status(404).json({ message: "Item not found" });
    }

    // 🔥 STEP UP TO ROOT (IMPORTANT)
    let root = found;

    while (root.parentId) {
      root = await prisma.item.findUnique({
        where: { id: root.parentId },
      });
    }

    if (!root) {
      return res.status(404).json({ message: "Item not found" });
    }

    const tree = await buildTree(root);

    res.json(tree);
  } catch (err) {
    console.error("❌ SKU TREE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= SEARCH ITEMS ================= */
export const searchItems = async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();

    if (!q) {
      return res.json([]);
    }

    const items = await prisma.item.findMany({
      where: {
        OR: [
          {
            sku: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: q,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: q,
              mode: "insensitive",
            },
          },
        ],
      },

      include: {
        children: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },

      orderBy: {
        createdAt: "asc",
      },

      take: 15,
    });

    res.json(items);
  } catch (err) {
    console.error("❌ ITEM SEARCH ERROR:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};
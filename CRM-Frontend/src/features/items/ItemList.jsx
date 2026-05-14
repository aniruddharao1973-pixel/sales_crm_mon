// src/features/items/ItemList.jsx

import { Fragment, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchItems, deleteItem, importItems } from "./itemSlice";
import {
  Package,
  Plus,
  Search,
  Trash2,
  Pencil,
  Eye,
  TrendingUp,
  Layers,
  DollarSign,
  Filter,
  Download,
  X,
  ChevronRight,
  ChevronDown,
  Upload,
  FileSpreadsheet,
  AlertCircle,
} from "lucide-react";
import { formatINR } from "../quotations/quotationUtils";
import ItemModal from "./ItemModal";

/* ─────────────────────────────────────────
   BADGE COMPONENTS
───────────────────────────────────────── */
function SkuBadge({ sku }) {
  if (!sku) return <span className="text-slate-300 text-xs">—</span>;

  return (
    <span className="text-[11px] font-mono font-extrabold tracking-wide text-slate-950 whitespace-nowrap">
      {sku}
    </span>
  );
}

function CategoryBadge({ category }) {
  if (!category) return <span className="text-slate-300 text-xs">—</span>;

  return (
    <span
      className="text-[11px] font-medium text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis"
      style={{ maxWidth: 140 }}
    >
      {category}
    </span>
  );
}

function UomBadge({ uom }) {
  if (!uom) return <span className="text-slate-300 text-xs">—</span>;

  return (
    <span className="text-[11px] font-medium text-slate-700 whitespace-nowrap">
      {uom}
    </span>
  );
}

function MfgCode({ code }) {
  if (!code) return <span className="text-slate-300 text-xs">—</span>;
  return (
    <code className="px-1.5 py-0.5 rounded text-[11px] font-mono bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap">
      {code}
    </code>
  );
}

/* ─────────────────────────────────────────
   STAT CARD
───────────────────────────────────────── */
function StatCard({ icon, label, value, color = "indigo", subtext }) {
  const colorMap = {
    indigo: { iconBg: "bg-violet-50 text-violet-600 border-violet-100" },
    emerald: { iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    amber: { iconBg: "bg-amber-50 text-amber-600 border-amber-100" },
  };
  const c = colorMap[color];

  return (
    <div className="flex items-center gap-3 bg-white border border-slate-200/80 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg border flex-shrink-0 ${c.iconBg}`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {label}
        </p>
        <p className="text-lg font-semibold tracking-tight text-slate-900 truncate mt-0.5">
          {value}
        </p>
        {subtext && (
          <p className="text-[10px] text-slate-400 mt-0.5">{subtext}</p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────── */
export default function ItemList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list, loading } = useSelector((state) => state.items);
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [expandedIds, setExpandedIds] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showImportModal, setShowImportModal] = useState(false);
  const [importCategory, setImportCategory] = useState("");
  // const [importType, setImportType] = useState("flat");
  const [importFile, setImportFile] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const formatAmount = (value) => {
    const amount = Number(value || 0);

    return Math.round(amount).toLocaleString("en-IN");
  };

  const toggleCategory = (cat) =>
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));

  const toggleRow = (id) =>
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  /* ── FILTER ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const cat = selectedCategory.trim();

    const matchesSearch = (item) =>
      item.name?.toLowerCase().includes(q) ||
      item.sku?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q) ||
      item.make?.toLowerCase().includes(q) ||
      item.mfgPartNo?.toLowerCase().includes(q);

    const filterTree = (nodes) =>
      nodes
        .map((node) => {
          const children = filterTree(node.children || []);
          const selfSearchMatch = !q || matchesSearch(node);
          const selfCategoryMatch =
            !cat || cat === "All Categories" || node.category === cat;
          const hasChildMatch = children.length > 0;

          if ((selfSearchMatch && selfCategoryMatch) || hasChildMatch) {
            return {
              ...node,
              children:
                selfCategoryMatch && (!cat || cat === node.category)
                  ? node.children || []
                  : children,
            };
          }
          return null;
        })
        .filter(Boolean);

    return filterTree(list);
  }, [list, search, selectedCategory]);

  const categoryOptions = useMemo(() => {
    const normalizedMap = new Map();

    list.forEach((item) => {
      if (!item.category) return;

      const normalized = item.category
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();

      if (!normalizedMap.has(normalized)) {
        normalizedMap.set(normalized, item.category.trim());
      }
    });

    return ["All Categories", ...Array.from(normalizedMap.values()).sort()];
  }, [list]);

  /* ── GROUP BY CATEGORY ── */
  // const groupedByCategory = useMemo(() => {
  //   const map = {};
  //   filtered.forEach((item) => {
  //     const cat = item.category || "Uncategorized";
  //     if (!map[cat]) map[cat] = [];
  //     map[cat].push(item);
  //   });
  //   return map;
  // }, [filtered]);

  // const groupedByCategory = useMemo(() => {
  //   const map = {};

  //   filtered.forEach((item) => {
  //     const cat = item.category || "Uncategorized";

  //     if (!map[cat]) map[cat] = [];

  //     map[cat].push(item);
  //   });

  //   // ✅ move SE1000001 to last
  //   Object.keys(map).forEach((cat) => {
  //     map[cat].sort((a, b) => {
  //       const aIsDriver = (a.sku || "").toUpperCase() === "SE1000001";

  //       const bIsDriver = (b.sku || "").toUpperCase() === "SE1000001";

  //       if (aIsDriver && !bIsDriver) return 1;
  //       if (!aIsDriver && bIsDriver) return -1;

  //       return 0;
  //     });
  //   });

  //   return map;
  // }, [filtered]);

  const groupedByCategory = useMemo(() => {
    const map = {};

    filtered.forEach((item) => {
      const cat = item.category || "Uncategorized";

      // ✅ STRICT CATEGORY FILTER
      if (
        selectedCategory &&
        selectedCategory !== "All Categories" &&
        cat !== selectedCategory
      ) {
        return;
      }

      if (!map[cat]) {
        map[cat] = [];
      }

      map[cat].push(item);
    });

    // ✅ move SE1000001 to last
    Object.keys(map).forEach((cat) => {
      map[cat].sort((a, b) => {
        const aIsDriver = (a.sku || "").toUpperCase() === "SE1000001";

        const bIsDriver = (b.sku || "").toUpperCase() === "SE1000001";

        if (aIsDriver && !bIsDriver) return 1;
        if (!aIsDriver && bIsDriver) return -1;

        return 0;
      });
    });

    return map;
  }, [filtered, selectedCategory]);

  /* ── STATS ── */
  const stats = useMemo(() => {
    const total = list.length;
    const totalValue = list.reduce(
      (sum, i) => sum + Number(i.basePrice || 0),
      0,
    );
    const avg = total > 0 ? totalValue / total : 0;
    return { total, totalValue, avg };
  }, [list]);

  /* ── DELETE ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item and ALL its children?")) return;
    await dispatch(deleteItem(id)).unwrap();
    dispatch(fetchItems());
    setExpandedIds({});
  };

  const getTotalPrice = (item) => {
    const self = Number(item.basePrice || 0) * Number(item.quantity || 1);
    if (!item.children || item.children.length === 0) return self;
    return (
      self + item.children.reduce((sum, child) => sum + getTotalPrice(child), 0)
    );
  };

  /* ── RENDER ROWS ── */
  const renderRows = (items, level = 0) =>
    items.map((item) => {
      const hasChildren = item.children?.length > 0;
      const isExpanded = expandedIds[item.id];
      const total = getTotalPrice(item);

      return (
        <Fragment key={`${item.id}-${level}`}>
          <tr
            className={`group border-b border-slate-100 transition-colors duration-100 hover:bg-slate-50 ${
              level > 0 ? "bg-slate-50/50" : "bg-white"
            }`}
          >
            {/* SKU */}
            <td className="px-4 py-3 whitespace-nowrap">
              <SkuBadge sku={item.sku} />
            </td>

            {/* CATEGORY */}
            <td className="px-4 py-3 whitespace-nowrap">
              <CategoryBadge category={item.category} />
            </td>

            {/* ITEM DETAILS */}
            <td className="px-4 py-3">
              <div
                className="flex items-start gap-2"
                style={{ paddingLeft: `${level * 20}px` }}
              >
                {hasChildren ? (
                  <button
                    onClick={() => toggleRow(item.id)}
                    className="mt-0.5 w-[18px] h-[18px] flex-shrink-0 flex items-center justify-center rounded border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-all"
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </button>
                ) : (
                  <div className="w-[18px] flex-shrink-0" />
                )}

                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-slate-800 leading-snug">
                    {item.name}
                  </p>

                  {item.description && item.description !== item.name && (
                    <pre className="mt-1 whitespace-pre-wrap break-words text-[11px] leading-5 text-slate-800 font-normal max-w-full overflow-hidden">
                      {item.description}
                    </pre>
                  )}
                </div>
              </div>
            </td>

            {/* MAKE */}
            <td className="px-4 py-3 whitespace-nowrap">
              <span className="text-[13px] text-slate-600">
                {item.make || <span className="text-slate-300">—</span>}
              </span>
            </td>

            {/* MFG PART NO */}
            <td className="px-4 py-3 whitespace-nowrap">
              <MfgCode code={item.mfgPartNo} />
            </td>

            {/* QTY */}
            <td className="px-4 py-3 text-center whitespace-nowrap">
              <span className="text-[12px] font-semibold text-slate-700">
                {Number(item.quantity || 1).toLocaleString("en-IN")}
              </span>
            </td>

            {/* UOM */}
            <td className="px-4 py-3 text-center whitespace-nowrap">
              <UomBadge uom={item.uom} />
            </td>

            {/* BASE PRICE */}
            <td className="px-4 py-3 text-right whitespace-nowrap">
              <span className="text-[13px] font-medium text-slate-800">
                {formatAmount(item.basePrice || 0)}
              </span>
            </td>

            {/* TOTAL PRICE */}
            {/* <td className="px-4 py-3 text-right whitespace-nowrap">
              <span className="text-[13px] font-medium text-blue-600">
                {formatAmount(hasChildren ? total : item.basePrice || 0)}
              </span>
            </td> */}

            {/* TOTAL PRICE */}
            <td className="px-4 py-3 text-right whitespace-nowrap">
              {level === 0 ? (
                <span className="text-[13px] font-bold text-slate-900">
                  {formatAmount(total)}
                </span>
              ) : item.category === "Fixture & Adapter" ? (
                <span className="text-[13px] font-medium text-slate-700">
                  {formatAmount(
                    Number(item.basePrice || 0) * Number(item.quantity || 1),
                  )}
                </span>
              ) : (
                <span className="text-slate-300">—</span>
              )}
            </td>

            {/* ACTIONS */}
            <td className="px-4 py-3">
              <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <button
                  onClick={() => navigate(`/items/${item.id}`)}
                  className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-all"
                  title="View"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setEditingItem(item)}
                  className="w-7 h-7 flex items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-all"
                  title="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => isAdmin && handleDelete(item.id)}
                  disabled={!isAdmin}
                  className={`w-7 h-7 flex items-center justify-center rounded-md border transition-all ${
                    isAdmin
                      ? "border-slate-200 bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200"
                      : "border-slate-100 bg-white text-slate-200 cursor-not-allowed"
                  }`}
                  title={isAdmin ? "Delete" : "Admin only"}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </td>
          </tr>

          {isExpanded && hasChildren && renderRows(item.children, level + 1)}
        </Fragment>
      );
    });

  /* ── JSX ── */
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[1800px] mx-auto px-5 py-5 flex flex-col gap-4">
        {/* ═══════════════ HEADER ═══════════════ */}
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white flex-shrink-0">
              <Package className="h-4 w-4" />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Inventory Management
              </p>

              <h1 className="text-[18px] font-semibold tracking-tight text-slate-900">
                Item Master
              </h1>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-wrap items-center gap-2">
            {/* SEARCH */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search items, SKU, make..."
                className="h-10 w-64 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-8 text-[13px] text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-100"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* IMPORT */}
            <button
              onClick={() => setShowImportModal(true)}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Upload className="h-3.5 w-3.5" />
              Import
            </button>

            {/* ADD ITEM */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-violet-600 px-4 text-[13px] font-medium text-white transition-colors hover:bg-violet-700"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Item
            </button>
          </div>
        </div>

        {/* ═══════════════ TABLE CARD ═══════════════ */}
        <div
          className="flex flex-col bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden"
          style={{ height: "calc(100vh - 268px)", minHeight: "420px" }}
        >
          {/* TOOLBAR */}
          <div className="flex-shrink-0 flex flex-col gap-3 border-b border-slate-200 bg-white px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            {/* LEFT */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">
                  Items Catalog
                </h2>

                <div className="hidden sm:inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Inventory
                  </span>
                </div>
              </div>

              <p className="mt-1 text-[12px] text-slate-400">
                {filtered.length === list.length ? (
                  <>
                    <span className="font-semibold text-slate-700">
                      {filtered.length}
                    </span>
                    {" total items available"}
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-violet-600">
                      {filtered.length}
                    </span>
                    {" of "}
                    <span className="font-semibold text-slate-700">
                      {list.length}
                    </span>
                    {search ? " items matching search" : " items"}
                  </>
                )}
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex flex-wrap items-center gap-2">
              {/* CATEGORY FILTER */}
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition-all hover:border-slate-300">
                <Filter className="h-3.5 w-3.5 text-slate-400" />

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent pr-1 text-[12px] font-medium text-slate-700 outline-none cursor-pointer"
                >
                  {categoryOptions.map((cat) => (
                    <option
                      key={cat}
                      value={cat === "All Categories" ? "" : cat}
                    >
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* CLEAR FILTER */}
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory("")}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-800"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear
                </button>
              )}

              {/* EXPORT */}
              <button className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[12px] font-medium text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900">
                <Download className="h-3.5 w-3.5" />
                Export
              </button>
            </div>
          </div>

          {/* SCROLLABLE TABLE */}
          <div className="flex-1 overflow-auto">
            <table
              className="w-full border-collapse"
              style={{ minWidth: "1100px" }}
            >
              <thead className="sticky top-0 z-20">
                <tr className="bg-slate-50 border-b border-slate-100">
                  {[
                    { label: "SKU", w: "9%", align: "left" },
                    { label: "Category", w: "13%", align: "left" },
                    { label: "Item details", w: "28%", align: "left" },
                    { label: "Make", w: "10%", align: "left" },
                    { label: "Mfg part no", w: "11%", align: "left" },
                    { label: "Qty", w: "6%", align: "center" },
                    { label: "UOM", w: "6%", align: "center" },
                    { label: "Base price", w: "9%", align: "right" },
                    { label: "Total price", w: "9%", align: "right" },
                    { label: "Actions", w: "8%", align: "center" },
                  ].map((col) => (
                    <th
                      key={col.label}
                      className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 whitespace-nowrap border-b border-slate-100"
                      style={{ width: col.w, textAlign: col.align }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* LOADING */}
                {loading && (
                  <tr>
                    <td colSpan={10} className="py-20">
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative">
                          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-slate-200 border-t-violet-500" />
                          <Package className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 text-violet-500" />
                        </div>
                        <p className="text-[13px] font-medium text-slate-400">
                          Loading items…
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

                {/* GROUPED CATEGORY ROWS */}
                {!loading &&
                  Object.entries(groupedByCategory).map(([category, items]) => {
                    const isOpen = expandedCategories[category] !== false;
                    const totalValue = items.reduce(
                      (sum, i) => sum + getTotalPrice(i),
                      0,
                    );

                    return (
                      <Fragment key={category}>
                        {/* CATEGORY HEADER */}
                        <tr
                          className="border-b border-slate-100 bg-slate-50/80 hover:bg-slate-100/60 cursor-pointer transition-colors"
                          onClick={() => toggleCategory(category)}
                        >
                          <td colSpan={10} className="px-4 py-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-5 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400">
                                  {isOpen ? (
                                    <ChevronDown className="w-3 h-3" />
                                  ) : (
                                    <ChevronRight className="w-3 h-3" />
                                  )}
                                </div>
                                <span className="text-[12px] font-semibold text-slate-700">
                                  {category}
                                </span>
                                <span className="text-[10px] font-medium text-slate-400 bg-white border border-slate-200 rounded-full px-2 py-0.5">
                                  {items.length} items
                                </span>
                              </div>
                              <span className="text-[12px] font-semibold text-slate-500 pr-1">
                                {formatAmount(totalValue)}
                              </span>
                            </div>
                          </td>
                        </tr>

                        {/* ITEMS */}
                        {isOpen && renderRows(items)}
                      </Fragment>
                    );
                  })}

                {/* EMPTY STATE */}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-20">
                      <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                          {search ? (
                            <AlertCircle className="w-8 h-8 text-slate-300" />
                          ) : (
                            <Package className="w-8 h-8 text-slate-300" />
                          )}
                        </div>
                        <div>
                          <p className="text-[15px] font-semibold text-slate-700">
                            {search ? "No items found" : "No items yet"}
                          </p>
                          <p className="text-[13px] text-slate-400 mt-1">
                            {search
                              ? "Try adjusting your search or filter."
                              : "Add your first item to get started."}
                          </p>
                        </div>
                        {!search ? (
                          <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-violet-700 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            Add first item
                          </button>
                        ) : (
                          <button
                            onClick={() => setSearch("")}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50"
                          >
                            <X className="w-4 h-4" />
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          {!loading && filtered.length > 0 && (
            <div className="flex-shrink-0 flex items-center justify-between px-5 py-2.5 border-t border-slate-100 bg-slate-50/60">
              <p className="text-[12px] text-slate-400">
                Showing{" "}
                <span className="font-medium text-slate-600">
                  {filtered.length}
                </span>
                {" of "}
                <span className="font-medium text-slate-600">
                  {list.length}
                </span>
                {" items"}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-slate-400">Per page:</span>
                <select className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[12px] font-medium text-slate-600 outline-none focus:border-violet-400">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <ItemModal
        open={showCreateModal}
        mode="create"
        item={null}
        onClose={() => setShowCreateModal(false)}
      />

      <ItemModal
        open={!!editingItem}
        mode="edit"
        item={editingItem}
        onClose={() => setEditingItem(null)}
      />

      {/* ═══════════════ IMPORT MODAL ═══════════════ */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] px-4">
          <div className="w-full max-w-md rounded-xl bg-white border border-slate-200 shadow-xl">
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-[15px] font-semibold text-slate-800">
                  Import items
                </h2>
                <p className="text-[12px] text-slate-400 mt-0.5">
                  Select category, type, then upload your Excel file.
                </p>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-1.5">
                  Category
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <Layers className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" />
                  <select
                    value={importCategory}
                    onChange={(e) => setImportCategory(e.target.value)}
                    className="w-full bg-transparent text-[13px] font-medium text-slate-700 outline-none"
                  >
                    <option value="">Select a category</option>

                    <option value="Application Software">
                      Application Software
                    </option>

                    <option value="Test Platform">Test Platform</option>

                    <option value="Fixture & Adapter">
                      Fixture &amp; Adapter
                    </option>

                    <option value="Instrumentation & Test Computer">
                      Instrumentation &amp; Test Computer
                    </option>
                    <option value="Application Engineering">
                      Application Engineering
                    </option>
                  </select>
                </div>
              </div>

              {/* <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-1.5">
                  Import type
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  <select
                    value={importType}
                    onChange={(e) => setImportType(e.target.value)}
                    className="w-full bg-transparent text-[13px] font-medium text-slate-700 outline-none"
                  >
                    <option value="flat">Simple list</option>
                    <option value="grouped">Grouped items</option>
                  </select>
                </div>
              </div> */}

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 mb-1.5">
                  Excel file
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-[13px] text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-violet-600 file:px-3 file:py-1.5 file:text-[12px] file:font-medium file:text-white hover:file:bg-violet-700 file:cursor-pointer"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
              <button
                onClick={() => setShowImportModal(false)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!importFile || !importCategory) {
                    alert("Please select a category and file.");
                    return;
                  }
                  try {
                    await dispatch(
                      importItems({
                        file: importFile,
                        category: importCategory,
                      }),
                    ).unwrap();
                    setShowImportModal(false);
                    setImportFile(null);
                    setImportCategory("");
                    // setImportType("flat");
                    dispatch(fetchItems());
                  } catch (err) {
                    console.error(err);
                    alert("Import failed. Please try again.");
                  }
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-violet-700 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

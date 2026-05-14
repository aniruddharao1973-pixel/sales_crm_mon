// // // src/features/items/ItemForm.jsx

// // import { useState, useEffect, useMemo } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { useNavigate, useParams } from "react-router-dom";
// // import { createItem, updateItem } from "./itemSlice";
// // import {
// //   ChevronLeft,
// //   Save,
// //   Package,
// //   Tag,
// //   Type,
// //   AlignLeft,
// //   IndianRupee,
// //   Sparkles,
// // } from "lucide-react";

// // export default function ItemForm() {
// //   const { id } = useParams();
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();

// //   const isEdit = Boolean(id);
// //   const { list, loading } = useSelector((state) => state.items);

// //   const existing = list.find((i) => i.id === id);

// //   const [form, setForm] = useState({
// //     sku: "",
// //     name: "",
// //     description: "",
// //     basePrice: "",

// //     // 🔥 NEW
// //     make: "",
// //     mfgPartNo: "",
// //     uom: "",
// //     defaultRemarks: "",
// //   });

// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     if (isEdit && existing) {
// //       setForm({
// //         sku: existing.sku || "",
// //         name: existing.name || "",
// //         description: existing.description || "",
// //         basePrice: existing.basePrice ?? "",

// //         // 🔥 NEW
// //         make: existing.make || "",
// //         mfgPartNo: existing.mfgPartNo || "",
// //         uom: existing.uom || "",
// //         defaultRemarks: existing.defaultRemarks || "",
// //       });
// //     }
// //   }, [isEdit, existing]);

// //   const updateField = (key, value) => {
// //     setForm((prev) => ({ ...prev, [key]: value }));
// //     if (error) setError("");
// //   };

// //   const validate = () => {
// //     if (!form.sku.trim()) return "SKU is required";
// //     if (!form.name.trim()) return "Item name is required";
// //     if (form.basePrice === "" || Number.isNaN(Number(form.basePrice))) {
// //       return "Price must be a valid number";
// //     }
// //     if (Number(form.basePrice) < 0) return "Price cannot be negative";
// //     return "";
// //   };

// //   const payload = useMemo(
// //     () => ({
// //       sku: form.sku.trim(),
// //       name: form.name.trim(),
// //       description: form.description.trim(),
// //       basePrice: form.basePrice === "" ? null : Number(form.basePrice),

// //       // 🔥 NEW
// //       make: form.make.trim(),
// //       mfgPartNo: form.mfgPartNo.trim(),
// //       uom: form.uom.trim(),
// //       defaultRemarks: form.defaultRemarks.trim(),
// //     }),
// //     [form],
// //   );

// //   const handleSubmit = async () => {
// //     const err = validate();
// //     if (err) {
// //       setError(err);
// //       return;
// //     }

// //     setError("");

// //     try {
// //       if (isEdit) {
// //         await dispatch(updateItem({ id, data: payload })).unwrap();
// //       } else {
// //         await dispatch(createItem(payload)).unwrap();
// //       }

// //       navigate("/items");
// //     } catch (err) {
// //       console.error(err);
// //       setError(err?.message || "Something went wrong while saving the item.");
// //     }
// //   };

// //   return (
// //     <div className="min-h-[calc(100vh-64px)] bg-slate-50">
// //       <div className="p-4 sm:p-6 space-y-6">
// //         {/* TOP BAR */}
// //         <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
// //           <div className="flex items-start gap-3">
// //             <button
// //               onClick={() => navigate(-1)}
// //               className="mt-1 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 transition"
// //               aria-label="Back"
// //             >
// //               <ChevronLeft className="w-4 h-4" />
// //             </button>

// //             <div>
// //               <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
// //                 <Package className="w-4 h-4" />
// //                 Item Master
// //               </div>
// //               <h1 className="mt-1 text-2xl font-bold text-slate-900">
// //                 {isEdit ? "Edit Item" : "Create Item"}
// //               </h1>
// //               <p className="mt-1 text-sm text-slate-500">
// //                 Manage master items used in quotations.
// //               </p>
// //             </div>
// //           </div>

// //           <div className="flex items-center gap-3">
// //             <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
// //               <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
// //                 Status
// //               </div>
// //               <div className="mt-1 text-sm font-semibold text-slate-900">
// //                 {isEdit ? "Editing existing item" : "New item draft"}
// //               </div>
// //             </div>

// //             <button
// //               onClick={handleSubmit}
// //               disabled={loading}
// //               className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 transition"
// //             >
// //               <Save className="w-4 h-4" />
// //               {loading ? "Saving..." : isEdit ? "Update Item" : "Create Item"}
// //             </button>
// //           </div>
// //         </div>

// //         {/* MAIN GRID */}
// //         <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 items-start">
// //           {/* LEFT */}
// //           <div className="space-y-6">
// //             {/* HEADER CARD */}
// //             <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5">
// //               <div className="flex items-start justify-between gap-4">
// //                 <div>
// //                   <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
// //                     <Sparkles className="w-4 h-4" />
// //                     Item Details
// //                   </div>
// //                   <h2 className="mt-2 text-xl font-bold text-slate-900">
// //                     {isEdit
// //                       ? "Update Product Master"
// //                       : "Add New Product Master"}
// //                   </h2>
// //                   <p className="mt-1 text-sm text-slate-500">
// //                     Keep SKU, name, and pricing consistent across quotations.
// //                   </p>
// //                 </div>

// //                 <div className="hidden sm:flex rounded-2xl bg-slate-50 px-4 py-3">
// //                   <div>
// //                     <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
// //                       Preview
// //                     </div>
// //                     <div className="mt-1 text-sm font-semibold text-slate-900">
// //                       {form.name || "Item Name"}
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* FORM CARD */}
// //             <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5">
// //               {error && (
// //                 <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
// //                   {error}
// //                 </div>
// //               )}
// //               <div className="space-y-6">
// //                 {/* === SECTION: BASIC INFO === */}
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                   {/* SKU */}
// //                   <Field>
// //                     <Label>SKU *</Label>
// //                     <div className="relative group">
// //                       <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition" />
// //                       <input
// //                         value={form.sku}
// //                         onChange={(e) => updateField("sku", e.target.value)}
// //                         className="input pl-10"
// //                         placeholder="e.g. SEN-001"
// //                       />
// //                     </div>
// //                     <p className="text-xs text-slate-400 mt-1">
// //                       Unique identifier (must be unique)
// //                     </p>
// //                   </Field>

// //                   {/* NAME */}
// //                   <Field>
// //                     <Label>Item Name *</Label>
// //                     <div className="relative group">
// //                       <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition" />
// //                       <input
// //                         value={form.name}
// //                         onChange={(e) => updateField("name", e.target.value)}
// //                         className="input pl-10"
// //                         placeholder="e.g. Industrial Sensor"
// //                       />
// //                     </div>
// //                     <p className="text-xs text-slate-400 mt-1">
// //                       Display name used in quotations
// //                     </p>
// //                   </Field>
// //                 </div>

// //                 {/* === SECTION: TECHNICAL INFO === */}
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //                   {/* MAKE */}
// //                   <Field>
// //                     <Label>Make</Label>
// //                     <input
// //                       value={form.make}
// //                       onChange={(e) => updateField("make", e.target.value)}
// //                       className="input"
// //                       placeholder="e.g. ABB / Siemens"
// //                     />
// //                   </Field>

// //                   {/* MFG PART NO */}
// //                   <Field>
// //                     <Label>Mfg Part No</Label>
// //                     <input
// //                       value={form.mfgPartNo}
// //                       onChange={(e) => updateField("mfgPartNo", e.target.value)}
// //                       className="input"
// //                       placeholder="e.g. TS-778"
// //                     />
// //                   </Field>

// //                   {/* UOM */}
// //                   <Field>
// //                     <Label>UOM</Label>
// //                     <input
// //                       value={form.uom}
// //                       onChange={(e) => updateField("uom", e.target.value)}
// //                       className="input"
// //                       placeholder="Nos / Kg / Meter"
// //                     />
// //                   </Field>

// //                   {/* DEFAULT REMARKS */}
// //                   <Field>
// //                     <Label>Default Remarks</Label>
// //                     <input
// //                       value={form.defaultRemarks}
// //                       onChange={(e) =>
// //                         updateField("defaultRemarks", e.target.value)
// //                       }
// //                       className="input"
// //                       placeholder="Standard / Urgent / Imported"
// //                     />
// //                   </Field>
// //                 </div>

// //                 {/* === SECTION: PRICING === */}
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
// //                   <Field>
// //                     <Label>Base Price</Label>
// //                     <div className="relative group max-w-xs">
// //                       <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition" />
// //                       <input
// //                         type="number"
// //                         min="0"
// //                         step="0.01"
// //                         value={form.basePrice}
// //                         onChange={(e) =>
// //                           updateField("basePrice", e.target.value)
// //                         }
// //                         className="input pl-10 text-right"
// //                         placeholder="0.00"
// //                       />
// //                     </div>
// //                     <p className="text-xs text-slate-400 mt-1">
// //                       Default price auto-filled in quotations
// //                     </p>
// //                   </Field>
// //                 </div>

// //                 {/* === SECTION: DESCRIPTION === */}
// //                 <div>
// //                   <Field>
// //                     <Label>Description</Label>
// //                     <div className="relative group">
// //                       <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition" />
// //                       <textarea
// //                         rows={5}
// //                         value={form.description}
// //                         onChange={(e) =>
// //                           updateField("description", e.target.value)
// //                         }
// //                         className="input pl-10 pt-3 min-h-[120px]"
// //                         placeholder="Optional description shown in quotation line items..."
// //                       />
// //                     </div>
// //                   </Field>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* RIGHT SIDEBAR */}
// //           <div className="xl:sticky xl:top-6 space-y-6">
// //             <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5">
// //               <h3 className="font-semibold text-slate-900">Live Preview</h3>
// //               <p className="mt-1 text-sm text-slate-500">
// //                 Quick snapshot of the item being saved.
// //               </p>

// //               <div className="mt-5 rounded-2xl bg-slate-50 p-4 space-y-3">
// //                 <PreviewRow label="SKU" value={form.sku || "-"} />
// //                 <PreviewRow label="Name" value={form.name || "-"} />

// //                 {/* 🔥 NEW */}
// //                 <PreviewRow label="Make" value={form.make || "-"} />
// //                 <PreviewRow label="Mfg PN" value={form.mfgPartNo || "-"} />
// //                 <PreviewRow label="UOM" value={form.uom || "-"} />

// //                 <PreviewRow
// //                   label="Price"
// //                   value={
// //                     form.basePrice === "" || form.basePrice === null
// //                       ? "-"
// //                       : `₹ ${Number(form.basePrice).toLocaleString("en-IN", {
// //                           minimumFractionDigits: 2,
// //                           maximumFractionDigits: 2,
// //                         })}`
// //                   }
// //                 />
// //               </div>
// //             </div>

// //             <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5">
// //               <h3 className="font-semibold text-slate-900">Tips</h3>
// //               <ul className="mt-3 space-y-3 text-sm text-slate-600">
// //                 <li className="flex gap-2">
// //                   <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
// //                   Keep SKU unique and readable.
// //                 </li>
// //                 <li className="flex gap-2">
// //                   <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
// //                   Price here becomes the default price in quotations.
// //                 </li>
// //                 <li className="flex gap-2">
// //                   <span className="mt-1 h-2 w-2 rounded-full bg-indigo-500" />
// //                   Description helps users select the right item faster.
// //                 </li>
// //               </ul>
// //             </div>

// //             <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-700 p-5 text-white shadow-sm">
// //               <h3 className="font-semibold">Save Ready</h3>
// //               <p className="mt-2 text-sm text-indigo-100">
// //                 {isEdit
// //                   ? "Update the master item and keep quotations in sync."
// //                   : "Create a clean master record for quotation use."}
// //               </p>

// //               <button
// //                 onClick={handleSubmit}
// //                 disabled={loading}
// //                 className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 disabled:opacity-60"
// //               >
// //                 <Save className="w-4 h-4" />
// //                 {loading ? "Saving..." : isEdit ? "Update Item" : "Create Item"}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // /* ================= UI HELPERS ================= */

// // function Field({ children, className = "" }) {
// //   return <div className={`space-y-2 ${className}`}>{children}</div>;
// // }

// // function Label({ children }) {
// //   return (
// //     <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
// //       {children}
// //     </label>
// //   );
// // }

// // function PreviewRow({ label, value }) {
// //   return (
// //     <div className="flex items-center justify-between gap-4">
// //       <span className="text-sm text-slate-500">{label}</span>
// //       <span className="text-sm font-semibold text-slate-900 text-right break-all">
// //         {value}
// //       </span>
// //     </div>
// //   );
// // }

// // // src/features/items/ItemForm.jsx

// // import { useState, useEffect, useMemo } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { useNavigate, useParams } from "react-router-dom";
// // import { createItem, updateItem, fetchItems } from "./itemSlice";
// // import {
// //   ChevronLeft,
// //   Save,
// //   Package,
// //   Tag,
// //   Type,
// //   AlignLeft,
// //   IndianRupee,
// //   Sparkles,
// //   Wrench,
// //   Hash,
// //   Ruler,
// //   FileText,
// //   CheckCircle2,
// //   AlertCircle,
// //   Info,
// // } from "lucide-react";

// // export default function ItemForm() {
// //   const { id } = useParams();
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();

// //   const isEdit = Boolean(id);
// //   const { list, loading } = useSelector((state) => state.items);

// //   function findItemRecursive(items, id) {
// //     for (const item of items) {
// //       if (item.id === id) return item;

// //       if (item.children?.length) {
// //         const found = findItemRecursive(item.children, id);
// //         if (found) return found;
// //       }
// //     }
// //     return null;
// //   }

// //   const existing = findItemRecursive(list, id);

// //   const [form, setForm] = useState({
// //     sku: "",
// //     name: "",
// //     description: "",
// //     basePrice: "",
// //     category: "", // ✅ ADD THIS
// //     make: "",
// //     mfgPartNo: "",
// //     uom: "",
// //     defaultRemarks: "",
// //   });

// //   const [error, setError] = useState("");
// //   const [touched, setTouched] = useState({});

// //   useEffect(() => {
// //     if (isEdit && existing) {
// //       setForm({
// //         sku: existing.sku || "",
// //         name: existing.name || "",
// //         description: existing.description || "",
// //         basePrice: existing.basePrice ?? "",
// //         category: existing.category || "", // ✅ ADD THIS
// //         make: existing.make || "",
// //         mfgPartNo: existing.mfgPartNo || "",
// //         uom: existing.uom || "",
// //         defaultRemarks: existing.defaultRemarks || "",
// //       });
// //     }
// //   }, [isEdit, existing]);

// //   const updateField = (key, value) => {
// //     setForm((prev) => ({ ...prev, [key]: value }));
// //     setTouched((prev) => ({ ...prev, [key]: true }));
// //     if (error) setError("");
// //   };

// //   const validate = () => {
// //     if (!form.sku.trim()) return "SKU is required";
// //     if (!form.name.trim()) return "Item name is required";
// //     if (form.basePrice === "" || Number.isNaN(Number(form.basePrice))) {
// //       return "Price must be a valid number";
// //     }
// //     if (Number(form.basePrice) < 0) return "Price cannot be negative";
// //     return "";
// //   };

// //   const payload = useMemo(
// //     () => ({
// //       sku: form.sku.trim(),
// //       name: form.name.trim(),
// //       description: form.description.trim(),
// //       basePrice: form.basePrice === "" ? null : Number(form.basePrice),
// //       category: form.category.trim(), // ✅ ADD THIS
// //       make: form.make.trim(),
// //       mfgPartNo: form.mfgPartNo.trim(),
// //       uom: form.uom.trim(),
// //       defaultRemarks: form.defaultRemarks.trim(),
// //     }),
// //     [form],
// //   );

// //   const handleSubmit = async () => {
// //     const err = validate();
// //     if (err) {
// //       setError(err);
// //       return;
// //     }

// //     setError("");

// //     try {
// //       if (isEdit) {
// //         await dispatch(updateItem({ id, data: payload })).unwrap();

// //         // ✅ IMPORTANT: rebuild tree after update
// //         await dispatch(fetchItems());
// //       } else {
// //         await dispatch(createItem(payload)).unwrap();

// //         // (optional but safe)
// //         await dispatch(fetchItems());
// //       }

// //       navigate("/items");
// //     } catch (err) {
// //       console.error(err);
// //       setError(err?.message || "Something went wrong while saving the item.");
// //     }
// //   };
// //   // Calculate form completion
// //   const requiredFields = ["sku", "name", "basePrice"];
// //   const completedRequired = requiredFields.filter((key) =>
// //     form[key]?.toString().trim(),
// //   ).length;
// //   const completionPercentage = Math.round(
// //     (completedRequired / requiredFields.length) * 100,
// //   );

// //   return (
// //     <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/20">
// //       <div className="p-4 sm:p-6 space-y-6">
// //         {/* TOP BAR */}
// //         <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
// //           <div className="flex items-start gap-4">
// //             <button
// //               onClick={() => navigate(-1)}
// //               className="mt-1 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all"
// //               aria-label="Back"
// //             >
// //               <ChevronLeft className="w-5 h-5" />
// //             </button>

// //             <div className="flex-1">
// //               <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
// //                 <Package className="w-4 h-4" />
// //                 Item Master
// //               </div>
// //               <h1 className="text-3xl font-bold text-slate-900 mb-2">
// //                 {isEdit ? "Edit Item" : "Create New Item"}
// //               </h1>
// //               <p className="text-sm text-slate-600 max-w-2xl">
// //                 Manage master items used across quotations. Keep SKU, pricing,
// //                 and specifications consistent.
// //               </p>
// //             </div>
// //           </div>

// //           <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3">
// //             {/* Progress Indicator */}
// //             <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm min-w-[180px]">
// //               <div className="flex items-center justify-between gap-3 mb-2">
// //                 <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
// //                   Completion
// //                 </div>
// //                 <span className="text-sm font-bold text-indigo-600">
// //                   {completionPercentage}%
// //                 </span>
// //               </div>
// //               <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
// //                 <div
// //                   className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500 rounded-full"
// //                   style={{ width: `${completionPercentage}%` }}
// //                 />
// //               </div>
// //             </div>

// //             <button
// //               onClick={handleSubmit}
// //               disabled={loading || completionPercentage < 100}
// //               className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none transition-all"
// //             >
// //               <Save className="w-4 h-4" />
// //               {loading ? "Saving..." : isEdit ? "Update Item" : "Create Item"}
// //             </button>
// //           </div>
// //         </div>

// //         {/* Error Alert */}
// //         {error && (
// //           <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 flex items-start gap-3 shadow-sm animate-shake">
// //             <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
// //             <div>
// //               <h3 className="font-semibold text-rose-900 text-sm mb-1">
// //                 Validation Error
// //               </h3>
// //               <p className="text-sm text-rose-700">{error}</p>
// //             </div>
// //           </div>
// //         )}

// //         {/* MAIN GRID */}
// //         <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6 items-start">
// //           {/* LEFT */}
// //           <div className="space-y-6">
// //             {/* BASIC INFORMATION CARD */}
// //             <div className="group overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
// //               {/* Header */}
// //               <div className="relative border-b border-slate-200 bg-gradient-to-r from-indigo-50 via-white to-blue-50 px-6 py-5 md:px-7">
// //                 <div className="flex items-center gap-4">
// //                   <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600 shadow-inner">
// //                     <Sparkles className="h-5 w-5" />
// //                   </div>

// //                   <div className="flex flex-col">
// //                     <h2 className="text-lg font-semibold tracking-tight text-slate-900">
// //                       Basic Information
// //                     </h2>
// //                     <p className="text-xs text-slate-500">
// //                       Core metadata used across inventory and quotations
// //                     </p>
// //                   </div>
// //                 </div>

// //                 <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
// //               </div>

// //               {/* Body */}
// //               <div className="space-y-9 p-7 md:p-8">
// //                 {/* GRID */}
// //                 <div className="grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
// //                   {/* SKU */}
// //                   <Field className="space-y-3.5">
// //                     <Label required className="mb-2.5">
// //                       SKU / Code
// //                     </Label>

// //                     <div className="relative w-full">
// //                       <InputWithIcon
// //                         icon={<Tag className="h-4 w-4" />}
// //                         value={form.sku}
// //                         onChange={(e) => updateField("sku", e.target.value)}
// //                         placeholder="e.g. SEN-001"
// //                         error={touched.sku && !form.sku.trim()}
// //                         className="h-12 md:h-14 w-full min-w-0 pl-14 pr-5 whitespace-nowrap overflow-hidden text-ellipsis focus:ring-2 focus:ring-indigo-500/20"
// //                       />

// //                       {touched.sku && !form.sku.trim() && (
// //                         <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-red-500">
// //                           Required
// //                         </span>
// //                       )}
// //                     </div>

// //                     <FieldHint>
// //                       Unique identifier (cannot be duplicated)
// //                     </FieldHint>
// //                   </Field>

// //                   {/* NAME */}
// //                   <Field className="space-y-3.5">
// //                     <Label required className="mb-2.5">
// //                       Item Name
// //                     </Label>

// //                     <div className="relative w-full">
// //                       <InputWithIcon
// //                         icon={<Type className="h-4 w-4" />}
// //                         value={form.name}
// //                         onChange={(e) => updateField("name", e.target.value)}
// //                         placeholder="e.g. Industrial Sensor"
// //                         error={touched.name && !form.name.trim()}
// //                         className="h-12 md:h-14 w-full min-w-0 pl-14 pr-5 whitespace-nowrap overflow-hidden text-ellipsis focus:ring-2 focus:ring-indigo-500/20"
// //                       />

// //                       {touched.name && !form.name.trim() && (
// //                         <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-red-500">
// //                           Required
// //                         </span>
// //                       )}
// //                     </div>

// //                     <FieldHint>Name visible in quotations & reports</FieldHint>
// //                   </Field>

// //                   {/* CATEGORY */}
// //                   <Field className="space-y-3.5">
// //                     <Label className="mb-2.5">Category</Label>

// //                     <div className="relative w-full">
// //                       <InputWithIcon
// //                         icon={<Tag className="h-4 w-4" />}
// //                         value={form.category}
// //                         onChange={(e) =>
// //                           updateField("category", e.target.value)
// //                         }
// //                         placeholder="e.g. Sensor / PLC / Camera"
// //                         className="h-12 md:h-14 w-full min-w-0 pl-14 pr-5 whitespace-nowrap overflow-hidden text-ellipsis focus:ring-2 focus:ring-indigo-500/20"
// //                       />
// //                     </div>

// //                     <FieldHint>Used for grouping and filtering</FieldHint>
// //                   </Field>
// //                 </div>

// //                 {/* DESCRIPTION */}
// //                 <Field className="space-y-2.5 pt-2">
// //                   <Label className="mb-1.5">Description</Label>

// //                   <div className="group relative">
// //                     <AlignLeft className="absolute left-3 top-3.5 h-4 w-4 text-slate-400 transition group-focus-within:text-indigo-500" />

// //                     <textarea
// //                       rows={4}
// //                       value={form.description}
// //                       onChange={(e) =>
// //                         updateField("description", e.target.value)
// //                       }
// //                       className="min-h-[130px] w-full resize-none rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-4 text-sm text-slate-700 placeholder:text-slate-400 transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
// //                       placeholder="Optional description shown in quotation line items..."
// //                     />

// //                     <div className="absolute bottom-2 right-3 text-[10px] text-slate-400">
// //                       {form.description?.length || 0}/250
// //                     </div>
// //                   </div>

// //                   <FieldHint>
// //                     Helps users quickly understand item purpose
// //                   </FieldHint>
// //                 </Field>
// //               </div>
// //             </div>

// //             {/* TECHNICAL SPECIFICATIONS CARD */}
// //             <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
// //               {/* Card Header */}
// //               <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50 px-6 py-5 md:px-7">
// //                 <div className="flex items-center gap-3">
// //                   <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600">
// //                     <Wrench className="h-5 w-5" />
// //                   </div>
// //                   <div>
// //                     <h2 className="text-lg font-bold text-slate-900">
// //                       Technical Specifications
// //                     </h2>
// //                     <p className="mt-0.5 text-sm text-slate-600">
// //                       Manufacturer and measurement details
// //                     </p>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Card Body */}
// //               <div className="p-7 md:p-8">
// //                 <div className="grid grid-cols-1 gap-x-10 gap-y-7 md:grid-cols-2">
// //                   {/* MAKE */}
// //                   <Field className="space-y-3.5">
// //                     <Label className="mb-2.5">Make / Brand</Label>
// //                     <InputWithIcon
// //                       icon={<Wrench className="h-4 w-4" />}
// //                       value={form.make}
// //                       onChange={(e) => updateField("make", e.target.value)}
// //                       placeholder="e.g. ABB / Siemens"
// //                       className="h-12 md:h-14 w-full min-w-0 pl-14 pr-5 whitespace-nowrap overflow-hidden text-ellipsis focus:ring-2 focus:ring-indigo-500/20"
// //                     />
// //                   </Field>

// //                   {/* MFG PART NO */}
// //                   <Field className="space-y-3.5">
// //                     <Label className="mb-2.5">Manufacturer Part No.</Label>
// //                     <InputWithIcon
// //                       icon={<Hash className="h-4 w-4" />}
// //                       value={form.mfgPartNo}
// //                       onChange={(e) => updateField("mfgPartNo", e.target.value)}
// //                       placeholder="e.g. TS-778"
// //                       className="h-12 md:h-14 w-full min-w-0 pl-14 pr-5 whitespace-nowrap overflow-hidden text-ellipsis focus:ring-2 focus:ring-indigo-500/20"
// //                     />
// //                   </Field>

// //                   {/* UOM */}
// //                   <Field className="space-y-3.5">
// //                     <Label className="mb-2.5">Unit of Measurement</Label>
// //                     <InputWithIcon
// //                       icon={<Ruler className="h-4 w-4" />}
// //                       value={form.uom}
// //                       onChange={(e) => updateField("uom", e.target.value)}
// //                       placeholder="e.g. Nos / Kg / Meter"
// //                       className="h-12 md:h-14 w-full min-w-0 pl-14 pr-5 whitespace-nowrap overflow-hidden text-ellipsis focus:ring-2 focus:ring-indigo-500/20"
// //                     />
// //                   </Field>

// //                   {/* DEFAULT REMARKS */}
// //                   <Field className="space-y-3.5">
// //                     <Label className="mb-2.5">Default Remarks</Label>
// //                     <InputWithIcon
// //                       icon={<FileText className="h-4 w-4" />}
// //                       value={form.defaultRemarks}
// //                       onChange={(e) =>
// //                         updateField("defaultRemarks", e.target.value)
// //                       }
// //                       placeholder="e.g. Standard / Urgent"
// //                       className="h-12 md:h-14 w-full min-w-0 pl-14 pr-5 whitespace-nowrap overflow-hidden text-ellipsis focus:ring-2 focus:ring-indigo-500/20"
// //                     />
// //                   </Field>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* PRICING CARD */}
// //             <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
// //               {/* Card Header */}
// //               <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-5 md:px-7">
// //                 <div className="flex items-center gap-3">
// //                   <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600">
// //                     <IndianRupee className="h-5 w-5" />
// //                   </div>
// //                   <div>
// //                     <h2 className="text-lg font-bold text-slate-900">
// //                       Pricing Information
// //                     </h2>
// //                     <p className="mt-0.5 text-sm text-slate-600">
// //                       Set default pricing for quotations
// //                     </p>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Card Body */}
// //               <div className="p-7 md:p-8">
// //                 <Field className="space-y-3.5">
// //                   <Label required className="mb-2.5">
// //                     Base Price
// //                   </Label>

// //                   <div className="max-w-sm">
// //                     <InputWithIcon
// //                       icon={<IndianRupee className="h-4 w-4" />}
// //                       type="number"
// //                       min="0"
// //                       step="0.01"
// //                       value={form.basePrice}
// //                       onChange={(e) => updateField("basePrice", e.target.value)}
// //                       placeholder="0.00"
// //                       className="h-12 md:h-14 w-full min-w-0 pr-5 text-right font-semibold focus:ring-2 focus:ring-indigo-500/20"
// //                       error={
// //                         touched.basePrice &&
// //                         (form.basePrice === "" || Number(form.basePrice) < 0)
// //                       }
// //                     />
// //                   </div>

// //                   <FieldHint>Default price auto-filled in quotations</FieldHint>

// //                   {form.basePrice && Number(form.basePrice) > 0 && (
// //                     <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
// //                       <div className="mb-1 text-xs font-semibold text-emerald-700">
// //                         Preview
// //                       </div>
// //                       <div className="text-2xl font-bold text-emerald-900">
// //                         ₹{" "}
// //                         {Number(form.basePrice).toLocaleString("en-IN", {
// //                           minimumFractionDigits: 2,
// //                           maximumFractionDigits: 2,
// //                         })}
// //                       </div>
// //                     </div>
// //                   )}
// //                 </Field>
// //               </div>
// //             </div>
// //           </div>

// //           {/* RIGHT SIDEBAR */}
// //           <div className="xl:sticky xl:top-6 space-y-6">
// //             {/* LIVE PREVIEW CARD */}
// //             <div className="rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
// //               <div className="bg-gradient-to-br from-slate-800 to-slate-900 px-6 py-5">
// //                 <div className="flex items-center gap-3">
// //                   <div className="p-2 rounded-xl bg-white/10">
// //                     <Package className="w-5 h-5 text-white" />
// //                   </div>
// //                   <div>
// //                     <h3 className="font-bold text-white">Live Preview</h3>
// //                     <p className="text-xs text-slate-300 mt-0.5">
// //                       Real-time item snapshot
// //                     </p>
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="p-5 space-y-4">
// //                 <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 p-4 border border-slate-200">
// //                   <div className="space-y-3">
// //                     <PreviewRow
// //                       icon={<Tag className="w-3.5 h-3.5" />}
// //                       label="SKU"
// //                       value={form.sku || "-"}
// //                       highlight={!form.sku}
// //                     />
// //                     <PreviewRow
// //                       icon={<Type className="w-3.5 h-3.5" />}
// //                       label="Name"
// //                       value={form.name || "-"}
// //                       highlight={!form.name}
// //                     />
// //                     <PreviewRow
// //                       icon={<Tag className="w-3.5 h-3.5" />}
// //                       label="Category"
// //                       value={form.category || "-"}
// //                     />
// //                     <div className="border-t border-slate-200 my-2"></div>
// //                     <PreviewRow
// //                       icon={<Wrench className="w-3.5 h-3.5" />}
// //                       label="Make"
// //                       value={form.make || "-"}
// //                     />
// //                     <PreviewRow
// //                       icon={<Hash className="w-3.5 h-3.5" />}
// //                       label="Mfg PN"
// //                       value={form.mfgPartNo || "-"}
// //                     />
// //                     <PreviewRow
// //                       icon={<Ruler className="w-3.5 h-3.5" />}
// //                       label="UOM"
// //                       value={form.uom || "-"}
// //                     />
// //                     <div className="border-t border-slate-200 my-2"></div>
// //                     <PreviewRow
// //                       icon={<IndianRupee className="w-3.5 h-3.5" />}
// //                       label="Price"
// //                       value={
// //                         form.basePrice === "" || form.basePrice === null
// //                           ? "-"
// //                           : `₹ ${Number(form.basePrice).toLocaleString(
// //                               "en-IN",
// //                               {
// //                                 minimumFractionDigits: 2,
// //                                 maximumFractionDigits: 2,
// //                               },
// //                             )}`
// //                       }
// //                       highlight={!form.basePrice}
// //                       isPrimary
// //                     />
// //                   </div>
// //                 </div>

// //                 {/* Completion Checklist */}
// //                 <div className="space-y-2">
// //                   <ChecklistItem
// //                     label="SKU entered"
// //                     completed={!!form.sku.trim()}
// //                   />
// //                   <ChecklistItem
// //                     label="Name entered"
// //                     completed={!!form.name.trim()}
// //                   />
// //                   <ChecklistItem
// //                     label="Category added"
// //                     completed={!!form.category.trim()}
// //                   />
// //                   <ChecklistItem
// //                     label="Price set"
// //                     completed={
// //                       form.basePrice !== "" && Number(form.basePrice) >= 0
// //                     }
// //                   />
// //                 </div>
// //               </div>
// //             </div>

// //             {/* TIPS CARD */}
// //             {/* <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm p-5">
// //               <div className="flex items-center gap-2 mb-4">
// //                 <Info className="w-5 h-5 text-amber-600" />
// //                 <h3 className="font-bold text-amber-900">Pro Tips</h3>
// //               </div>
// //               <ul className="space-y-3 text-sm text-amber-900">
// //                 <li className="flex gap-3">
// //                   <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
// //                   <span>Keep SKU unique and easy to search</span>
// //                 </li>
// //                 <li className="flex gap-3">
// //                   <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
// //                   <span>Base price becomes default in quotations</span>
// //                 </li>
// //                 <li className="flex gap-3">
// //                   <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
// //                   <span>Add detailed descriptions for clarity</span>
// //                 </li>
// //                 <li className="flex gap-3">
// //                   <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
// //                   <span>Technical specs improve quotation accuracy</span>
// //                 </li>
// //               </ul>
// //             </div> */}

// //             {/* ACTION CARD */}
// //             <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-6 text-white shadow-lg">
// //               <div className="flex items-center gap-2 mb-3">
// //                 <Save className="w-5 h-5" />
// //                 <h3 className="font-bold text-lg">Ready to Save?</h3>
// //               </div>
// //               <p className="text-sm text-indigo-100 mb-5">
// //                 {isEdit
// //                   ? "Update this master item and keep all quotations in sync."
// //                   : "Create a master record for consistent quotation use."}
// //               </p>

// //               <button
// //                 onClick={handleSubmit}
// //                 disabled={loading || completionPercentage < 100}
// //                 className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-indigo-700 hover:bg-indigo-50 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
// //               >
// //                 <Save className="w-4 h-4" />
// //                 {loading ? "Saving..." : isEdit ? "Update Item" : "Create Item"}
// //               </button>

// //               {completionPercentage < 100 && (
// //                 <p className="text-xs text-indigo-200 text-center mt-3">
// //                   Complete all required fields to save
// //                 </p>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // /* ================= UI COMPONENTS ================= */

// // function Field({ children, className = "" }) {
// //   return <div className={`space-y-2 ${className}`}>{children}</div>;
// // }

// // function Label({ children, required = false }) {
// //   return (
// //     <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600">
// //       {children}
// //       {required && <span className="text-rose-500">*</span>}
// //     </label>
// //   );
// // }

// // function FieldHint({ children }) {
// //   return (
// //     <p className="text-xs text-slate-500 flex items-center gap-1.5">
// //       <Info className="w-3 h-3" />
// //       {children}
// //     </p>
// //   );
// // }

// // function InputWithIcon({ icon, error, className = "", ...props }) {
// //   return (
// //     <div className="relative group">
// //       <div
// //         className={`absolute left-3 top-1/2 -translate-y-1/2 transition ${
// //           error
// //             ? "text-rose-500"
// //             : "text-slate-400 group-focus-within:text-indigo-500"
// //         }`}
// //       >
// //         {icon}
// //       </div>
// //       <input
// //         {...props}
// //         className={`input pl-10 ${error ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20" : ""} ${className}`}
// //       />
// //     </div>
// //   );
// // }

// // function PreviewRow({
// //   icon,
// //   label,
// //   value,
// //   highlight = false,
// //   isPrimary = false,
// // }) {
// //   return (
// //     <div className="flex items-center justify-between gap-3">
// //       <div className="flex items-center gap-2">
// //         <span className={`${highlight ? "text-rose-400" : "text-slate-400"}`}>
// //           {icon}
// //         </span>
// //         <span
// //           className={`text-xs font-medium ${highlight ? "text-rose-600" : "text-slate-600"}`}
// //         >
// //           {label}
// //         </span>
// //       </div>
// //       <span
// //         className={`text-sm font-bold text-right break-all ${
// //           isPrimary
// //             ? "text-indigo-600"
// //             : highlight
// //               ? "text-rose-500"
// //               : "text-slate-900"
// //         }`}
// //       >
// //         {value}
// //       </span>
// //     </div>
// //   );
// // }

// // function ChecklistItem({ label, completed }) {
// //   return (
// //     <div className="flex items-center gap-2 text-sm">
// //       <div
// //         className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
// //           completed
// //             ? "bg-emerald-100 text-emerald-600"
// //             : "bg-slate-100 text-slate-400"
// //         }`}
// //       >
// //         {completed && <CheckCircle2 className="w-3.5 h-3.5" />}
// //       </div>
// //       <span
// //         className={completed ? "text-slate-900 font-medium" : "text-slate-500"}
// //       >
// //         {label}
// //       </span>
// //     </div>
// //   );
// // }

// // src/features/items/ItemForm.jsx

// import { useState, useEffect, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import { createItem, updateItem, fetchItems } from "./itemSlice";
// import {
//   ChevronLeft,
//   Save,
//   Package,
//   Tag,
//   Type,
//   AlignLeft,
//   Sparkles,
//   Wrench,
//   Hash,
//   Ruler,
//   FileText,
//   CheckCircle2,
//   AlertCircle,
//   Info,
//   BadgeCheck,
//   Clock3,
//   Layers,
// } from "lucide-react";

// export default function ItemForm() {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const isEdit = Boolean(id);
//   const { list, loading } = useSelector((state) => state.items);

//   function findItemRecursive(items, targetId) {
//     for (const item of items) {
//       if (item.id === targetId) return item;

//       if (item.children?.length) {
//         const found = findItemRecursive(item.children, targetId);
//         if (found) return found;
//       }
//     }
//     return null;
//   }

//   const existing = findItemRecursive(list, id);

//   const [form, setForm] = useState({
//     sku: "",
//     name: "",
//     description: "",
//     basePrice: "",
//     category: "",
//     make: "",
//     mfgPartNo: "",
//     uom: "",
//     defaultRemarks: "",
//   });

//   const [error, setError] = useState("");
//   const [touched, setTouched] = useState({});

//   useEffect(() => {
//     if (isEdit && existing) {
//       setForm({
//         sku: existing.sku || "",
//         name: existing.name || "",
//         description: existing.description || "",
//         basePrice: existing.basePrice ?? "",
//         category: existing.category || "",
//         make: existing.make || "",
//         mfgPartNo: existing.mfgPartNo || "",
//         uom: existing.uom || "",
//         defaultRemarks: existing.defaultRemarks || "",
//       });
//     }
//   }, [isEdit, existing]);

//   const updateField = (key, value) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//     setTouched((prev) => ({ ...prev, [key]: true }));
//     if (error) setError("");
//   };

//   const validate = () => {
//     if (!form.sku.trim()) return "SKU is required";
//     if (!form.name.trim()) return "Item name is required";
//     if (form.basePrice === "" || Number.isNaN(Number(form.basePrice))) {
//       return "Price must be a valid number";
//     }
//     if (Number(form.basePrice) < 0) return "Price cannot be negative";
//     return "";
//   };

//   const payload = useMemo(
//     () => ({
//       sku: form.sku.trim(),
//       name: form.name.trim(),
//       description: form.description.trim(),
//       basePrice: form.basePrice === "" ? null : Number(form.basePrice),
//       category: form.category.trim(),
//       make: form.make.trim(),
//       mfgPartNo: form.mfgPartNo.trim(),
//       uom: form.uom.trim(),
//       defaultRemarks: form.defaultRemarks.trim(),
//     }),
//     [form],
//   );

//   const handleSubmit = async () => {
//     const err = validate();
//     if (err) {
//       setError(err);
//       return;
//     }

//     setError("");

//     try {
//       if (isEdit) {
//         await dispatch(updateItem({ id, data: payload })).unwrap();
//         await dispatch(fetchItems());
//       } else {
//         await dispatch(createItem(payload)).unwrap();
//         await dispatch(fetchItems());
//       }

//       navigate("/items");
//     } catch (err) {
//       console.error(err);
//       setError(err?.message || "Something went wrong while saving the item.");
//     }
//   };

//   const requiredFields = ["sku", "name", "basePrice"];
//   const completedRequired = requiredFields.filter((key) =>
//     form[key]?.toString().trim(),
//   ).length;
//   const completionPercentage = Math.round(
//     (completedRequired / requiredFields.length) * 100,
//   );

//   return (
//     <div className="min-h-[calc(100vh-64px)] bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.10),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.10),_transparent_22%),linear-gradient(to_bottom,_#f8fafc,_#f8fafc,_#eef2ff_120%)] px-3 py-4 sm:px-5 sm:py-5">
//       <div className="mx-auto w-full max-w-[1700px] space-y-5">
//         {/* HERO */}
//         <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/85 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
//           <div className="relative px-5 py-5 sm:px-6 lg:px-7">
//             <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(99,102,241,0.06),transparent_35%,rgba(16,185,129,0.05)_72%,transparent)]" />

//             <div className="relative flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
//               <div className="min-w-0">
//                 <button
//                   onClick={() => navigate(-1)}
//                   className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
//                 >
//                   <ChevronLeft className="h-4 w-4" />
//                   Back to Items
//                 </button>

//                 <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-700">
//                   <Sparkles className="h-3.5 w-3.5" />
//                   Item Master
//                 </div>

//                 <div className="flex items-start gap-4">
//                   <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-700 ring-1 ring-inset ring-indigo-100">
//                     <Package className="h-6 w-6" />
//                   </div>

//                   <div className="min-w-0">
//                     <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
//                       {isEdit ? "Edit Item" : "Create New Item"}
//                     </h1>
//                     <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-[15px]">
//                       Maintain clean master data with consistent SKU, pricing,
//                       and technical specifications for quotations and inventory.
//                     </p>

//                     <div className="mt-3 flex flex-wrap items-center gap-2">
//                       <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
//                         <BadgeCheck className="mr-1.5 h-3.5 w-3.5" />
//                         Master record
//                       </span>
//                       <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
//                         <Layers className="mr-1.5 h-3.5 w-3.5" />
//                         Quotations ready
//                       </span>
//                       <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
//                         <Clock3 className="mr-1.5 h-3.5 w-3.5" />
//                         Live validation
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex flex-col gap-3 sm:flex-row">
//                 <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
//                   <div className="mb-2 flex items-center justify-between gap-3">
//                     <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
//                       Completion
//                     </div>
//                     <span className="text-sm font-bold text-indigo-600">
//                       {completionPercentage}%
//                     </span>
//                   </div>
//                   <div className="h-2 w-[180px] overflow-hidden rounded-full bg-slate-100">
//                     <div
//                       className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
//                       style={{ width: `${completionPercentage}%` }}
//                     />
//                   </div>
//                 </div>

//                 <button
//                   onClick={handleSubmit}
//                   disabled={loading || completionPercentage < 100}
//                   className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 px-6 text-sm font-bold text-white shadow-[0_12px_30px_rgba(79,70,229,0.28)] transition hover:from-indigo-700 hover:via-indigo-700 hover:to-violet-700 hover:shadow-[0_16px_34px_rgba(79,70,229,0.34)] disabled:cursor-not-allowed disabled:opacity-60"
//                 >
//                   <Save className="h-4 w-4" />
//                   {loading
//                     ? "Saving..."
//                     : isEdit
//                       ? "Update Item"
//                       : "Create Item"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {error && (
//           <div className="rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 shadow-sm">
//             <div className="flex items-start gap-3">
//               <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-rose-600" />
//               <div>
//                 <h3 className="text-sm font-semibold text-rose-900">
//                   Validation Error
//                 </h3>
//                 <p className="mt-1 text-sm text-rose-700">{error}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* MAIN GRID */}
//         <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
//           {/* LEFT COLUMN */}
//           <div className="space-y-6">
//             {/* CORE DETAILS */}
//             <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_45px_rgba(15,23,42,0.05)]">
//               <div className="border-b border-slate-100 bg-[linear-gradient(135deg,rgba(99,102,241,0.08),rgba(255,255,255,0.95))] px-5 py-5 sm:px-6">
//                 <div className="flex items-start gap-4">
//                   <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-700 ring-1 ring-inset ring-indigo-100">
//                     <FileText className="h-6 w-6" />
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-bold tracking-tight text-slate-900">
//                       Core Information
//                     </h2>
//                     <p className="mt-1 text-sm text-slate-500">
//                       Primary item fields used across quotations and search.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-5 sm:p-6 lg:p-7">
//                 <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//                   <Field>
//                     <Label required>SKU / Code</Label>
//                     <InputWithIcon
//                       icon={<Tag className="h-4 w-4" />}
//                       value={form.sku}
//                       onChange={(e) => updateField("sku", e.target.value)}
//                       placeholder="e.g. SEN-001"
//                       error={touched.sku && !form.sku.trim()}
//                     />
//                     <FieldHint>Unique identifier for fast lookup.</FieldHint>
//                   </Field>

//                   <Field>
//                     <Label required>Item Name</Label>
//                     <InputWithIcon
//                       icon={<Type className="h-4 w-4" />}
//                       value={form.name}
//                       onChange={(e) => updateField("name", e.target.value)}
//                       placeholder="e.g. Industrial Sensor"
//                       error={touched.name && !form.name.trim()}
//                     />
//                     <FieldHint>Displayed in quotations and reports.</FieldHint>
//                   </Field>

//                   <Field>
//                     <Label>Category</Label>
//                     <InputWithIcon
//                       icon={<Tag className="h-4 w-4" />}
//                       value={form.category}
//                       onChange={(e) => updateField("category", e.target.value)}
//                       placeholder="e.g. Sensor / PLC / Camera"
//                     />
//                     <FieldHint>
//                       Used for grouping, filtering, and tree views.
//                     </FieldHint>
//                   </Field>

//                   <Field>
//                     <Label>Default Remarks</Label>
//                     <InputWithIcon
//                       icon={<FileText className="h-4 w-4" />}
//                       value={form.defaultRemarks}
//                       onChange={(e) =>
//                         updateField("defaultRemarks", e.target.value)
//                       }
//                       placeholder="e.g. Standard / Urgent"
//                     />
//                     <FieldHint>Common note for quotation line items.</FieldHint>
//                   </Field>
//                 </div>

//                 <div className="mt-5">
//                   <Field>
//                     <Label>Description</Label>
//                     <div className="relative">
//                       <AlignLeft className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400 transition group-focus-within:text-indigo-500" />
//                       <textarea
//                         rows={5}
//                         value={form.description}
//                         onChange={(e) =>
//                           updateField("description", e.target.value)
//                         }
//                         className="w-full resize-none rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10"
//                         placeholder="Optional description shown in quotation line items..."
//                       />
//                       <div className="absolute bottom-2.5 right-3 text-[10px] text-slate-400">
//                         {form.description?.length || 0}/250
//                       </div>
//                     </div>
//                     <FieldHint>
//                       Keep this concise but descriptive for sales teams.
//                     </FieldHint>
//                   </Field>
//                 </div>
//               </div>
//             </section>

//             {/* SPECIFICATIONS */}
//             <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_45px_rgba(15,23,42,0.05)]">
//               <div className="border-b border-slate-100 bg-[linear-gradient(135deg,rgba(59,130,246,0.08),rgba(255,255,255,0.95))] px-5 py-5 sm:px-6">
//                 <div className="flex items-start gap-4">
//                   <div className="rounded-2xl bg-blue-50 p-3 text-blue-700 ring-1 ring-inset ring-blue-100">
//                     <Wrench className="h-6 w-6" />
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-bold tracking-tight text-slate-900">
//                       Technical Specifications
//                     </h2>
//                     <p className="mt-1 text-sm text-slate-500">
//                       Manufacturer and measurement details for catalog accuracy.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-5 sm:p-6 lg:p-7">
//                 <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
//                   <Field>
//                     <Label>Make / Brand</Label>
//                     <InputWithIcon
//                       icon={<Wrench className="h-4 w-4" />}
//                       value={form.make}
//                       onChange={(e) => updateField("make", e.target.value)}
//                       placeholder="e.g. ABB / Siemens"
//                     />
//                   </Field>

//                   <Field>
//                     <Label>Manufacturer Part No.</Label>
//                     <InputWithIcon
//                       icon={<Hash className="h-4 w-4" />}
//                       value={form.mfgPartNo}
//                       onChange={(e) => updateField("mfgPartNo", e.target.value)}
//                       placeholder="e.g. TS-778"
//                     />
//                   </Field>

//                   <Field>
//                     <Label>Unit of Measurement</Label>
//                     <InputWithIcon
//                       icon={<Ruler className="h-4 w-4" />}
//                       value={form.uom}
//                       onChange={(e) => updateField("uom", e.target.value)}
//                       placeholder="e.g. Nos / Kg / Meter"
//                     />
//                   </Field>

//                   <Field>
//                     <Label>Reference</Label>
//                     <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-4">
//                       <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
//                         <Info className="h-4 w-4 text-slate-400" />
//                         Keep technical fields aligned with vendor specs.
//                       </div>
//                       <p className="mt-1 text-xs leading-5 text-slate-500">
//                         Clean technical metadata improves quotation quality and
//                         searchability.
//                       </p>
//                     </div>
//                   </Field>
//                 </div>
//               </div>
//             </section>

//             {/* PRICING */}
//             <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_45px_rgba(15,23,42,0.05)]">
//               <div className="border-b border-slate-100 bg-[linear-gradient(135deg,rgba(16,185,129,0.10),rgba(255,255,255,0.95))] px-5 py-5 sm:px-6">
//                 <div className="flex items-start gap-4">
//                   <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 ring-1 ring-inset ring-emerald-100">
//                     <Tag className="h-6 w-6" />
//                   </div>
//                   <div>
//                     <h2 className="text-xl font-bold tracking-tight text-slate-900">
//                       Pricing Information
//                     </h2>
//                     <p className="mt-1 text-sm text-slate-500">
//                       Default pricing used in quotations and internal planning.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-5 sm:p-6 lg:p-7">
//                 <Field>
//                   <Label required>Base Price</Label>

//                   <div className="max-w-sm">
//                     <InputWithIcon
//                       icon={<Tag className="h-4 w-4" />}
//                       type="number"
//                       min="0"
//                       step="0.01"
//                       value={form.basePrice}
//                       onChange={(e) => updateField("basePrice", e.target.value)}
//                       placeholder="0.00"
//                       error={
//                         touched.basePrice &&
//                         (form.basePrice === "" || Number(form.basePrice) < 0)
//                       }
//                       className="text-right font-semibold"
//                     />
//                   </div>

//                   <FieldHint>
//                     This becomes the default price in quotations.
//                   </FieldHint>

//                   {form.basePrice !== "" && Number(form.basePrice) >= 0 && (
//                     <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
//                       <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
//                         Live Preview
//                       </div>
//                       <div className="mt-2 text-3xl font-black tracking-tight text-emerald-900">
//                         {Number(form.basePrice).toLocaleString("en-IN", {
//                           minimumFractionDigits: 2,
//                           maximumFractionDigits: 2,
//                         })}
//                       </div>
//                     </div>
//                   )}
//                 </Field>
//               </div>
//             </section>
//           </div>

//           {/* RIGHT SIDEBAR */}
//           <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
//             <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_45px_rgba(15,23,42,0.05)]">
//               <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 px-5 py-5">
//                 <div className="flex items-center gap-3">
//                   <div className="rounded-2xl bg-white/10 p-2.5 text-white">
//                     <Package className="h-5 w-5" />
//                   </div>
//                   <div>
//                     <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
//                       Save Readiness
//                     </h3>
//                     <p className="mt-1 text-sm text-slate-400">
//                       Validation and action summary
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-4 p-5">
//                 <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
//                   <div className="mb-4 flex items-center justify-between">
//                     <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
//                       Completion
//                     </div>
//                     <div className="text-sm font-bold text-indigo-600">
//                       {completionPercentage}%
//                     </div>
//                   </div>

//                   <div className="h-2 overflow-hidden rounded-full bg-slate-100">
//                     <div
//                       className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
//                       style={{ width: `${completionPercentage}%` }}
//                     />
//                   </div>

//                   <div className="mt-4 space-y-2">
//                     <ChecklistItem
//                       label="SKU entered"
//                       completed={!!form.sku.trim()}
//                     />
//                     <ChecklistItem
//                       label="Name entered"
//                       completed={!!form.name.trim()}
//                     />
//                     <ChecklistItem
//                       label="Price set"
//                       completed={
//                         form.basePrice !== "" && Number(form.basePrice) >= 0
//                       }
//                     />
//                     <ChecklistItem
//                       label="Category added"
//                       completed={!!form.category.trim()}
//                     />
//                   </div>
//                 </div>

//                 <div className="rounded-[24px] border border-dashed border-slate-200 bg-white p-4">
//                   <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
//                     <Info className="h-4 w-4 text-slate-400" />
//                     Save will be enabled when the required fields are complete.
//                   </div>
//                   <p className="mt-1 text-xs leading-5 text-slate-500">
//                     Keep SKU, item name, and price accurate to ensure quotations
//                     remain consistent.
//                   </p>
//                 </div>
//               </div>
//             </section>

//             <section className="rounded-[28px] bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 p-6 text-white shadow-[0_14px_35px_rgba(79,70,229,0.24)]">
//               <div className="flex items-center gap-2">
//                 <Save className="h-5 w-5" />
//                 <h3 className="text-lg font-bold">Ready to save</h3>
//               </div>

//               <p className="mt-3 text-sm leading-6 text-indigo-100">
//                 {isEdit
//                   ? "Update this master item and keep linked quotations consistent."
//                   : "Create a master record for reliable reuse in quotations."}
//               </p>

//               <button
//                 onClick={handleSubmit}
//                 disabled={loading || completionPercentage < 100}
//                 className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-bold text-indigo-700 shadow-lg transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
//               >
//                 <Save className="h-4 w-4" />
//                 {loading ? "Saving..." : isEdit ? "Update Item" : "Create Item"}
//               </button>

//               {completionPercentage < 100 && (
//                 <p className="mt-3 text-center text-xs text-indigo-100">
//                   Complete all required fields to enable save.
//                 </p>
//               )}
//             </section>
//           </aside>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ================= UI COMPONENTS ================= */

// function Field({ children }) {
//   return <div className="space-y-2.5">{children}</div>;
// }

// function Label({ children, required = false }) {
//   return (
//     <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-slate-600">
//       {children}
//       {required && <span className="text-rose-500">*</span>}
//     </label>
//   );
// }

// function FieldHint({ children }) {
//   return (
//     <p className="flex items-start gap-1.5 text-xs text-slate-500">
//       <Info className="mt-0.5 h-3 w-3 flex-shrink-0" />
//       <span>{children}</span>
//     </p>
//   );
// }

// function InputWithIcon({ icon, error, className = "", ...props }) {
//   return (
//     <div className="group relative">
//       <div
//         className={`absolute left-3 top-1/2 -translate-y-1/2 transition ${
//           error
//             ? "text-rose-500"
//             : "text-slate-400 group-focus-within:text-indigo-500"
//         }`}
//       >
//         {icon}
//       </div>
//       <input
//         {...props}
//         className={`w-full rounded-2xl border bg-white py-3.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 ${
//           error
//             ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
//             : "border-slate-200"
//         } ${className}`}
//       />
//     </div>
//   );
// }

// function ChecklistItem({ label, completed }) {
//   return (
//     <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
//       <div
//         className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
//           completed
//             ? "bg-emerald-100 text-emerald-600"
//             : "bg-slate-100 text-slate-400"
//         }`}
//       >
//         {completed && <CheckCircle2 className="h-3.5 w-3.5" />}
//       </div>
//       <span
//         className={`text-sm ${
//           completed ? "font-medium text-slate-900" : "text-slate-500"
//         }`}
//       >
//         {label}
//       </span>
//     </div>
//   );
// }

// // src/features/items/ItemModal.jsx

// import { useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { createItem, updateItem, fetchItems } from "./itemSlice";
// import {
//   X,
//   Save,
//   AlertCircle,
//   Package,
//   Tag,
//   DollarSign,
//   Settings,
// } from "lucide-react";

// export default function ItemModal({
//   open,
//   mode = "create",
//   item = null,
//   onClose,
// }) {
//   const dispatch = useDispatch();
//   const { list, loading } = useSelector((state) => state.items);

//   const isEdit = mode === "edit";

//   const [form, setForm] = useState({
//     sku: "",
//     name: "",
//     description: "",
//     quantity: 1,
//     unitPrice: "",
//     basePrice: "",
//     pricingMode: "parent_only",
//     parentId: "",
//     category: "",
//     make: "",
//     mfgPartNo: "",
//     uom: "",
//     defaultRemarks: "",
//   });

//   const [error, setError] = useState("");

//   function findItemRecursive(items, targetId) {
//     for (const it of items || []) {
//       if (it.id === targetId) return it;
//       if (it.children?.length) {
//         const found = findItemRecursive(it.children, targetId);
//         if (found) return found;
//       }
//     }
//     return null;
//   }

//   const currentItem = useMemo(() => {
//     if (!item?.id) return null;
//     return findItemRecursive(list, item.id) || item;
//   }, [list, item]);

//   useEffect(() => {
//     if (!open) return;

//     if (isEdit && currentItem) {
//       setForm({
//         sku: currentItem.sku || "",
//         name: currentItem.name || "",
//         description: currentItem.description || "",
//         quantity: currentItem.quantity ?? 1,
//         unitPrice: currentItem.unitPrice ?? "",
//         basePrice: currentItem.basePrice ?? "",
//         pricingMode: currentItem.pricingMode || "parent_only",
//         parentId: currentItem.parentId || "",
//         category: currentItem.category || "",
//         make: currentItem.make || "",
//         mfgPartNo: currentItem.mfgPartNo || "",
//         uom: currentItem.uom || "",
//         defaultRemarks: currentItem.defaultRemarks || "",
//       });
//     } else {
//       setForm({
//         sku: "",
//         name: "",
//         description: "",
//         quantity: 1,
//         unitPrice: "",
//         basePrice: "",
//         pricingMode: "parent_only",
//         parentId: "",
//         category: "",
//         make: "",
//         mfgPartNo: "",
//         uom: "",
//         defaultRemarks: "",
//       });
//     }

//     setError("");
//   }, [open, isEdit, currentItem]);

//   useEffect(() => {
//     const qty = Number(form.quantity || 0);
//     const unit = Number(form.unitPrice || 0);

//     if (qty > 0 && unit >= 0) {
//       setForm((prev) => ({ ...prev, basePrice: qty * unit }));
//     }
//   }, [form.quantity, form.unitPrice]);

//   const updateField = (key, value) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//     if (error) setError("");
//   };

//   const validate = () => {
//     if (!form.sku.trim()) return "SKU is required";
//     if (!form.name.trim()) return "Item name is required";
//     if (form.basePrice === "" || Number.isNaN(Number(form.basePrice))) {
//       return "Total price is invalid";
//     }
//     if (Number(form.basePrice) < 0) return "Price cannot be negative";
//     return "";
//   };

//   const payload = useMemo(
//     () => ({
//       sku: form.sku.trim(),
//       name: form.name.trim(),
//       description: form.description.trim(),
//       quantity: Number(form.quantity || 1),
//       unitPrice: form.unitPrice === "" ? null : Number(form.unitPrice),
//       basePrice: form.basePrice === "" ? null : Number(form.basePrice),
//       pricingMode: form.pricingMode,
//       parentId: form.parentId || null,
//       category: form.category.trim(),
//       make: form.make.trim(),
//       mfgPartNo: form.mfgPartNo.trim(),
//       uom: form.uom.trim(),
//       defaultRemarks: form.defaultRemarks.trim(),
//     }),
//     [form],
//   );

//   const categoryOptions = useMemo(() => {
//     const normalizedMap = new Map();

//     (list || []).forEach((it) => {
//       if (!it.category) return;
//       const normalized = it.category.trim().replace(/\s+/g, " ").toLowerCase();
//       if (!normalizedMap.has(normalized)) {
//         normalizedMap.set(normalized, it.category.trim());
//       }
//     });

//     return Array.from(normalizedMap.values()).sort();
//   }, [list]);

//   const handleSubmit = async () => {
//     const err = validate();
//     if (err) {
//       setError(err);
//       return;
//     }

//     setError("");

//     try {
//       if (isEdit) {
//         await dispatch(
//           updateItem({ id: currentItem.id, data: payload }),
//         ).unwrap();
//       } else {
//         await dispatch(createItem(payload)).unwrap();
//       }

//       await dispatch(fetchItems());
//       onClose?.();
//     } catch (err) {
//       console.error(err);
//       setError(err?.message || "Something went wrong while saving item.");
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4">
//       <div className="w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col">
//         {/* Header */}
//         <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-100 bg-white">
//           <div className="flex items-center gap-3 min-w-0">
//             <div className="p-2 rounded-xl bg-blue-50">
//               <Package className="h-5 w-5 text-blue-600" />
//             </div>
//             <div className="min-w-0">
//               <h2 className="text-lg font-semibold text-slate-900">
//                 {isEdit ? "Edit Item" : "Create Item"}
//               </h2>
//               <p className="text-xs text-slate-500 truncate">
//                 {isEdit
//                   ? `Update ${currentItem?.name || "item"}`
//                   : "Create a new inventory item"}
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={onClose}
//             className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="flex-1 overflow-auto">
//           <div className="p-6 space-y-6">
//             {error && (
//               <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-sm text-red-800">
//                 <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
//                 <div className="flex-1">{error}</div>
//                 <button
//                   onClick={() => setError("")}
//                   className="text-red-600 hover:text-red-800"
//                 >
//                   <X className="h-4 w-4" />
//                 </button>
//               </div>
//             )}

//             {/* Basic Information */}
//             <section className="rounded-2xl border border-slate-200 overflow-hidden">
//               <div className="p-5 bg-slate-50 border-b border-slate-200">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-blue-100 rounded-lg">
//                     <Tag className="h-4 w-4 text-blue-700" />
//                   </div>
//                   <div>
//                     <h3 className="text-base font-semibold text-slate-900">
//                       Basic Information
//                     </h3>
//                     <p className="text-xs text-slate-500 mt-0.5">
//                       Enter core item details and identification
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-5">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       SKU <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={form.sku}
//                       onChange={(e) => updateField("sku", e.target.value)}
//                       placeholder="Enter SKU"
//                       className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Item Name <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={form.name}
//                       onChange={(e) => updateField("name", e.target.value)}
//                       placeholder="Enter item name"
//                       className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Category
//                     </label>
//                     <select
//                       value={form.category}
//                       onChange={(e) => updateField("category", e.target.value)}
//                       className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       <option value="">Select Category</option>
//                       {categoryOptions.map((category) => (
//                         <option key={category} value={category}>
//                           {category}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Pricing Mode
//                     </label>
//                     <select
//                       value={form.pricingMode}
//                       onChange={(e) =>
//                         updateField("pricingMode", e.target.value)
//                       }
//                       className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       <option value="parent_only">Parent Only</option>
//                       <option value="parent_with_children">
//                         Parent With Children
//                       </option>
//                     </select>
//                   </div>

//                   <div className="lg:col-span-2">
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Description
//                     </label>
//                     <textarea
//                       rows={3}
//                       value={form.description}
//                       onChange={(e) =>
//                         updateField("description", e.target.value)
//                       }
//                       placeholder="Enter description"
//                       className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {/* Pricing */}
//             <section className="rounded-2xl border border-slate-200 overflow-hidden">
//               <div className="p-5 bg-slate-50 border-b border-slate-200">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-emerald-100 rounded-lg">
//                     <DollarSign className="h-4 w-4 text-emerald-700" />
//                   </div>
//                   <div>
//                     <h3 className="text-base font-semibold text-slate-900">
//                       Pricing
//                     </h3>
//                     <p className="text-xs text-slate-500 mt-0.5">
//                       Configure pricing and quantity details
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-5">
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Quantity
//                     </label>
//                     <input
//                       type="number"
//                       min="1"
//                       value={form.quantity}
//                       onChange={(e) => updateField("quantity", e.target.value)}
//                       className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Unit Price
//                     </label>
//                     <input
//                       type="number"
//                       min="0"
//                       step="0.01"
//                       value={form.unitPrice}
//                       onChange={(e) => updateField("unitPrice", e.target.value)}
//                       placeholder="0.00"
//                       className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Total Price <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       readOnly
//                       value={form.basePrice}
//                       className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-emerald-50 font-semibold text-emerald-900"
//                     />
//                   </div>
//                 </div>

//                 {form.basePrice !== "" && (
//                   <div className="mt-5 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
//                     <div className="flex items-center justify-between gap-4">
//                       <div>
//                         <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">
//                           Calculated Total
//                         </p>
//                         <p className="text-2xl font-bold text-emerald-900 mt-1">
//                           ₹
//                           {Number(form.basePrice || 0).toLocaleString("en-IN", {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                           })}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         <p className="text-xs text-emerald-600">
//                           {form.quantity || 0} × ₹
//                           {Number(form.unitPrice || 0).toLocaleString("en-IN", {
//                             minimumFractionDigits: 2,
//                           })}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </section>

//             {/* Technical Specifications */}
//             <section className="rounded-2xl border border-slate-200 overflow-hidden">
//               <div className="p-5 bg-slate-50 border-b border-slate-200">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-violet-100 rounded-lg">
//                     <Settings className="h-4 w-4 text-violet-700" />
//                   </div>
//                   <div>
//                     <h3 className="text-base font-semibold text-slate-900">
//                       Technical Specifications
//                     </h3>
//                     <p className="text-xs text-slate-500 mt-0.5">
//                       Manufacturer and technical information
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="p-5">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Make
//                     </label>
//                     <input
//                       type="text"
//                       value={form.make}
//                       onChange={(e) => updateField("make", e.target.value)}
//                       placeholder="Enter make"
//                       className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       MFG Part No
//                     </label>
//                     <input
//                       type="text"
//                       value={form.mfgPartNo}
//                       onChange={(e) => updateField("mfgPartNo", e.target.value)}
//                       placeholder="Enter part number"
//                       className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       UOM
//                     </label>
//                     <input
//                       type="text"
//                       value={form.uom}
//                       onChange={(e) => updateField("uom", e.target.value)}
//                       placeholder="e.g., Pcs, Kg, Meter"
//                       className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-slate-700 mb-2">
//                       Default Remarks
//                     </label>
//                     <input
//                       type="text"
//                       value={form.defaultRemarks}
//                       onChange={(e) =>
//                         updateField("defaultRemarks", e.target.value)
//                       }
//                       placeholder="Enter default remarks"
//                       className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </section>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50">
//           <button
//             onClick={onClose}
//             className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
//           >
//             <Save className="h-4 w-4" />
//             {loading ? "Saving..." : "Save"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// src/features/items/ItemModal.jsx
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createItem, updateItem, fetchItems } from "./itemSlice";
import {
  X,
  Save,
  AlertCircle,
  Package,
  Tag,
  DollarSign,
  Settings,
  Layers,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const emptyForm = {
  sku: "",
  name: "",
  description: "",
  quantity: 1,
  unitPrice: "",
  basePrice: "",
  pricingMode: "parent_with_children",
  category: "",
  make: "",
  mfgPartNo: "",
  uom: "",
  defaultRemarks: "",
};

function findItemRecursive(items, targetId) {
  for (const it of items || []) {
    if (it.id === targetId) return it;
    if (it.children?.length) {
      const found = findItemRecursive(it.children, targetId);
      if (found) return found;
    }
  }
  return null;
}

function flattenItems(items, output = []) {
  for (const item of items || []) {
    output.push(item);
    if (item.children?.length) {
      flattenItems(item.children, output);
    }
  }
  return output;
}

export default function ItemModal({
  open,
  mode = "create",
  item = null,
  onClose,
}) {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.items);

  const isEdit = mode === "edit";
  const rootItems = Array.isArray(list) ? list : [];
  const allItems = useMemo(() => flattenItems(rootItems, []), [rootItems]);

  const [step, setStep] = useState("choose"); // choose | category | parent | form
  const [createType, setCreateType] = useState("root"); // root | sub
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedParentId, setSelectedParentId] = useState("");
  const [parentSearch, setParentSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const currentItem = useMemo(() => {
    if (!item?.id) return null;
    return findItemRecursive(rootItems, item.id) || item;
  }, [rootItems, item]);

  const parentItem = useMemo(() => {
    if (!currentItem?.parentId) return null;
    return findItemRecursive(rootItems, currentItem.parentId);
  }, [rootItems, currentItem]);

  const selectedParentItem = useMemo(() => {
    if (!selectedParentId) return null;
    return findItemRecursive(rootItems, selectedParentId);
  }, [rootItems, selectedParentId]);

  const categoryOptions = useMemo(() => {
    const normalizedMap = new Map();

    allItems.forEach((it) => {
      if (!it.category) return;
      const normalized = it.category.trim().replace(/\s+/g, " ").toLowerCase();

      if (!normalizedMap.has(normalized)) {
        normalizedMap.set(normalized, it.category.trim());
      }
    });

    return Array.from(normalizedMap.values()).sort();
  }, [allItems]);

  const filteredParentItems = useMemo(() => {
    const q = parentSearch.toLowerCase().trim();

    return rootItems.filter((it) => {
      if (selectedCategory && it.category !== selectedCategory) return false;

      if (!q) return true;

      return (
        it.name?.toLowerCase().includes(q) ||
        it.sku?.toLowerCase().includes(q) ||
        it.category?.toLowerCase().includes(q)
      );
    });
  }, [rootItems, parentSearch, selectedCategory]);

  const resetCreateState = () => {
    setStep("choose");
    setCreateType("root");
    setSelectedCategory("");
    setSelectedParentId("");
    setParentSearch("");
    setForm(emptyForm);
    setError("");
  };

  useEffect(() => {
    if (!open) return;

    setError("");

    if (isEdit) {
      if (!currentItem) return;

      setStep("form");
      setCreateType("root");
      setSelectedCategory("");
      setSelectedParentId("");
      setParentSearch("");
      setForm({
        sku: currentItem.sku || "",
        name: currentItem.name || "",
        description: currentItem.description || "",
        quantity: currentItem.quantity ?? 1,
        unitPrice: currentItem.unitPrice ?? "",
        basePrice: currentItem.basePrice ?? "",
        pricingMode: currentItem.pricingMode || "parent_only",
        category: currentItem.category || "",
        make: currentItem.make || "",
        mfgPartNo: currentItem.mfgPartNo || "",
        uom: currentItem.uom || "",
        defaultRemarks: currentItem.defaultRemarks || "",
      });
      setImagePreview(currentItem.imageUrl || "");
    } else {
      resetCreateState();
    }
  }, [open, isEdit, currentItem]);

  useEffect(() => {
    const qty = Number(form.quantity || 0);
    const unit = Number(form.unitPrice || 0);

    if (qty > 0 && unit >= 0) {
      setForm((prev) => ({ ...prev, basePrice: qty * unit }));
    }
  }, [form.quantity, form.unitPrice]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError("");
  };

  const validate = () => {
    if (createType !== "sub" && !form.sku.trim()) {
      return "SKU is required";
    }
    if (!form.name.trim()) return "Item name is required";
    if (!isEdit && !selectedCategory.trim()) return "Category is required";
    if (isEdit && !form.category.trim()) return "Category is required";
    if (
      createType !== "sub" &&
      (form.basePrice === "" || Number.isNaN(Number(form.basePrice)))
    ) {
      return "Total price is invalid";
    }

    if (createType !== "sub" && Number(form.basePrice) < 0) {
      return "Price cannot be negative";
    }

    if (!isEdit && createType === "sub" && !selectedParentId) {
      return "Please select a parent item";
    }

    return "";
  };

  const payload = useMemo(
    () => ({
      sku: form.sku.trim(),
      name: form.name.trim(),
      description: form.description
        .split(/[\n,]+/)
        .map((line) => line.trim())
        .filter(Boolean)
        .join("\n"),
      quantity: Number(form.quantity || 1),
      unitPrice: form.unitPrice === "" ? null : Number(form.unitPrice),
      basePrice: form.basePrice === "" ? null : Number(form.basePrice),
      pricingMode: form.pricingMode,
      category: form.category.trim(),
      make: form.make.trim(),
      mfgPartNo: form.mfgPartNo.trim(),
      uom: form.uom.trim(),
      defaultRemarks: form.defaultRemarks.trim(),
      parentId:
        !isEdit && createType === "sub"
          ? selectedParentId || null
          : !isEdit
            ? null
            : undefined,
    }),
    [form, isEdit, createType, selectedParentId],
  );

  const handleClose = () => {
    resetCreateState();
    onClose?.();
  };

  const goToCategoryStep = (type) => {
    setCreateType(type);

    setForm((prev) => ({
      ...prev,
      pricingMode: type === "sub" ? "parent_with_children" : "parent_only",
    }));

    setStep("category");
    setError("");
  };

  const handleSubmit = async () => {
    const err = validate();

    if (err) {
      setError(err);
      return;
    }

    setError("");

    try {
      if (isEdit) {
        const formData = new FormData();

        Object.entries({
          ...payload,
          parentId: undefined,
        }).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        });

        // ✅ image upload
        if (imageFile) {
          formData.append("image", imageFile);
        }

        await dispatch(
          updateItem({
            id: currentItem.id,
            data: formData,
          }),
        ).unwrap();
      } else {
        await dispatch(createItem(payload)).unwrap();
      }

      await dispatch(fetchItems());

      handleClose();
    } catch (err) {
      console.error(err);

      setError(err?.message || "Something went wrong while saving item.");
    }
  };

  if (!open) return null;

  if (!isEdit && step === "choose") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4">
        <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
          <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-violet-50">
                <Package className="h-5 w-5 text-violet-600" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-slate-900">
                  Add Item
                </h2>
                <p className="text-xs text-slate-500">
                  Choose what you want to create
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-6 space-y-3">
            <button
              onClick={() => goToCategoryStep("root")}
              className="w-full flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 hover:border-violet-300 hover:bg-violet-50 transition-all"
            >
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-900">New Item</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Create a root item
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-violet-500" />
            </button>

            <button
              onClick={() => goToCategoryStep("sub")}
              className="w-full flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 hover:border-violet-300 hover:bg-violet-50 transition-all"
            >
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-900">
                  New Sub Item
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Create under a parent item
                </p>
              </div>
              <Layers className="h-4 w-4 text-violet-500" />
            </button>
          </div>

          <div className="flex justify-end px-6 py-4 border-t border-slate-100 bg-slate-50">
            <button
              onClick={handleClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isEdit && step === "category") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4">
        <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
          <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-violet-50">
                <Tag className="h-5 w-5 text-violet-600" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-slate-900">
                  {createType === "sub" ? "Sub Item Category" : "Item Category"}
                </h2>
                <p className="text-xs text-slate-500">
                  Select a category before filling the form
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setForm((prev) => ({ ...prev, category: e.target.value }));
                }}
                className="w-full px-4 py-3 text-sm border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Selected Flow
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {createType === "sub" ? "New Sub Item" : "New Item"}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {createType === "sub"
                  ? "You will select the parent item next"
                  : "You will fill the form next"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50">
            <button
              onClick={() => setStep("choose")}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors inline-flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            <button
              onClick={() => {
                if (!selectedCategory) {
                  setError("Category is required");
                  return;
                }

                setForm((prev) => ({ ...prev, category: selectedCategory }));
                setError("");

                if (createType === "sub") {
                  setStep("parent");
                } else {
                  setStep("form");
                }
              }}
              disabled={!selectedCategory}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isEdit && step === "parent") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4">
        <div className="w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden">
          <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-violet-50">
                <Layers className="h-5 w-5 text-violet-600" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-slate-900">
                  Parent Item
                </h2>
                <p className="text-xs text-slate-500">
                  Search and select the root item for this sub item
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="rounded-xl border border-violet-200 bg-violet-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                Category
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {selectedCategory || "—"}
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={parentSearch}
                onChange={(e) => setParentSearch(e.target.value)}
                placeholder="Search parent by name, SKU, category..."
                className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div className="max-h-80 overflow-auto rounded-xl border border-slate-200">
              {filteredParentItems.length > 0 ? (
                filteredParentItems.map((parent) => (
                  <button
                    key={parent.id}
                    onClick={() => {
                      setSelectedParentId(parent.id);
                      setStep("form");
                      setError("");
                    }}
                    className="w-full text-left px-4 py-3 border-b border-slate-100 last:border-b-0 hover:bg-violet-50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {parent.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          SKU: {parent.sku || "—"} · Category:{" "}
                          {parent.category || "—"}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-6 text-sm text-slate-500">
                  No matching parent item found.
                </div>
              )}
            </div>

            {!filteredParentItems.length && (
              <div className="text-xs text-slate-500">
                Create a root item first if no parent exists yet.
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50">
            <button
              onClick={() => setStep("category")}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors inline-flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>

            <button
              onClick={() => {
                if (!selectedParentId) {
                  setError("Please select a parent item");
                  return;
                }
                setStep("form");
                setError("");
              }}
              disabled={!selectedParentId}
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4">
      <div className="w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-blue-50">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-slate-900">
                {isEdit
                  ? "Edit Item"
                  : createType === "sub"
                    ? "New Sub Item"
                    : "New Item"}
              </h2>
              <p className="text-xs text-slate-500 truncate">
                {isEdit
                  ? `Update ${currentItem?.name || "item"}`
                  : createType === "sub"
                    ? "Create a child item under a selected parent"
                    : "Create a new inventory item"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEdit && (
              <button
                onClick={() => {
                  if (createType === "sub") {
                    if (step === "form") {
                      setStep("parent");
                    } else {
                      setStep("parent");
                    }
                  } else if (step === "form") {
                    setStep("category");
                  } else {
                    setStep("choose");
                  }
                }}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors inline-flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            )}

            <button
              onClick={handleClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-sm text-red-800">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1">{error}</div>
                <button
                  onClick={() => setError("")}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {!isEdit && createType === "sub" && selectedParentItem && (
              <section className="rounded-2xl border border-slate-200 overflow-hidden">
                <div className="p-5 bg-slate-50 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-100 rounded-lg">
                      <Layers className="h-4 w-4 text-violet-700" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">
                        Parent Context
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        This sub item will be created under the selected parent
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="rounded-xl border border-violet-200 bg-violet-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                      Selected Parent
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {selectedParentItem.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      SKU: {selectedParentItem.sku || "—"} · Category:{" "}
                      {selectedParentItem.category || "—"}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* IMAGE */}
            <section className="rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-5 bg-slate-50 border-b border-slate-200">
                <h3 className="text-base font-semibold text-slate-900">
                  Item Image
                </h3>
              </div>

              <div className="p-5">
                <div className="flex items-start gap-5">
                  <div className="h-40 w-40 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={
                          imagePreview.startsWith("blob:")
                            ? imagePreview
                            : `http://localhost:5000${imagePreview}`
                        }
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          console.error(
                            "❌ EDIT MODAL IMAGE FAILED:",
                            e.target.src,
                          );
                        }}
                      />
                    ) : (
                      <span className="text-xs text-slate-400">No image</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
                      Change Image
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];

                          if (!file) return;

                          setImageFile(file);

                          setImagePreview(URL.createObjectURL(file));
                        }}
                      />
                    </label>

                    <p className="text-xs text-slate-400">
                      PNG, JPG, WEBP supported
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Basic Information */}
            <section className="rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-5 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Tag className="h-4 w-4 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      Basic Information
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Enter core item details and identification
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      SKU{" "}
                      {createType !== "sub" && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={form.sku}
                      onChange={(e) => updateField("sku", e.target.value)}
                      placeholder="Enter SKU"
                      className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Item Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="Enter item name"
                      className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>

                    {isEdit ? (
                      <select
                        value={form.category}
                        onChange={(e) =>
                          updateField("category", e.target.value)
                        }
                        className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Category</option>
                        {categoryOptions.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-700">
                        {selectedCategory || "—"}
                      </div>
                    )}
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Pricing Mode
                    </label>
                    <select
                      value={form.pricingMode}
                      onChange={(e) =>
                        updateField("pricingMode", e.target.value)
                      }
                      className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="parent_only">Parent Only</option>
                      <option value="parent_with_children">
                        Parent With Children
                      </option>
                    </select>
                  </div> */}

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) =>
                        updateField("description", e.target.value)
                      }
                      placeholder="Enter description"
                      className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Pricing */}
            <section className="rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-5 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      Pricing
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configure pricing and quantity details
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={form.quantity}
                      onChange={(e) => updateField("quantity", e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Unit Price
                    </label>
                    <input
                      type="text"
                      value={
                        form.unitPrice !== ""
                          ? Number(form.unitPrice).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                            })
                          : ""
                      }
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/,/g, "");
                        if (/^\d*$/.test(rawValue)) {
                          updateField("unitPrice", rawValue);
                        }
                      }}
                      placeholder="0"
                      className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Total Price <span className="text-red-500">*</span>
                    </label>

                    <input
                      type="text"
                      readOnly
                      value={
                        form.basePrice !== ""
                          ? Number(form.basePrice).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                            })
                          : ""
                      }
                      className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-emerald-50 font-semibold text-emerald-900"
                    />
                  </div>
                </div>

                {form.basePrice !== "" && (
                  <div className="mt-5 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">
                          Calculated Total
                        </p>
                        <p className="text-2xl font-bold text-emerald-900 mt-1">
                          ₹
                          {Number(form.basePrice || 0).toLocaleString("en-IN", {
                            maximumFractionDigits: 0,
                          })}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-emerald-600">
                          {form.quantity || 0} × ₹
                          {Number(form.unitPrice || 0).toLocaleString("en-IN", {
                            maximumFractionDigits: 0,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Technical Specifications */}
            <section className="rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-5 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-100 rounded-lg">
                    <Settings className="h-4 w-4 text-violet-700" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">
                      Technical Specifications
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Manufacturer and technical information
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Make
                    </label>
                    <input
                      type="text"
                      value={form.make}
                      onChange={(e) => updateField("make", e.target.value)}
                      placeholder="Enter make"
                      className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      MFG Part No
                    </label>
                    <input
                      type="text"
                      value={form.mfgPartNo}
                      onChange={(e) => updateField("mfgPartNo", e.target.value)}
                      placeholder="Enter part number"
                      className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      UOM
                    </label>
                    <input
                      type="text"
                      value={form.uom}
                      onChange={(e) => updateField("uom", e.target.value)}
                      placeholder="e.g., Pcs, Kg, Meter"
                      className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Default Remarks
                    </label>
                    <input
                      type="text"
                      value={form.defaultRemarks}
                      onChange={(e) =>
                        updateField("defaultRemarks", e.target.value)
                      }
                      placeholder="Enter default remarks"
                      className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div> */}
                </div>

                {isEdit && parentItem && (
                  <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Parent Item
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {parentItem.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      SKU: {parentItem.sku || "—"} · Category:{" "}
                      {parentItem.category || "—"}
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={handleClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="h-4 w-4" />
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

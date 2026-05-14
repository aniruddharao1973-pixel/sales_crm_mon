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
} from "lucide-react";

export default function ItemModal({
  open,
  mode = "create",
  item = null,
  onClose,
}) {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.items);

  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    sku: "",
    name: "",
    description: "",
    quantity: 1,
    unitPrice: "",
    basePrice: "",
    pricingMode: "parent_only",
    parentId: "",
    category: "",
    make: "",
    mfgPartNo: "",
    uom: "",
    defaultRemarks: "",
  });

  const [error, setError] = useState("");

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

  const currentItem = useMemo(() => {
    if (!item?.id) return null;
    return findItemRecursive(list, item.id) || item;
  }, [list, item]);

  useEffect(() => {
    if (!open) return;

    if (isEdit && currentItem) {
      setForm({
        sku: currentItem.sku || "",
        name: currentItem.name || "",
        description: currentItem.description || "",
        quantity: currentItem.quantity ?? 1,
        unitPrice: currentItem.unitPrice ?? "",
        basePrice: currentItem.basePrice ?? "",
        pricingMode: currentItem.pricingMode || "parent_only",
        parentId: currentItem.parentId || "",
        category: currentItem.category || "",
        make: currentItem.make || "",
        mfgPartNo: currentItem.mfgPartNo || "",
        uom: currentItem.uom || "",
        defaultRemarks: currentItem.defaultRemarks || "",
      });
    } else {
      setForm({
        sku: "",
        name: "",
        description: "",
        quantity: 1,
        unitPrice: "",
        basePrice: "",
        pricingMode: "parent_only",
        parentId: "",
        category: "",
        make: "",
        mfgPartNo: "",
        uom: "",
        defaultRemarks: "",
      });
    }

    setError("");
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
    if (!form.sku.trim()) return "SKU is required";
    if (!form.name.trim()) return "Item name is required";
    if (form.basePrice === "" || Number.isNaN(Number(form.basePrice))) {
      return "Total price is invalid";
    }
    if (Number(form.basePrice) < 0) return "Price cannot be negative";
    return "";
  };

  const payload = useMemo(
    () => ({
      sku: form.sku.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      quantity: Number(form.quantity || 1),
      unitPrice: form.unitPrice === "" ? null : Number(form.unitPrice),
      basePrice: form.basePrice === "" ? null : Number(form.basePrice),
      pricingMode: form.pricingMode,
      parentId: form.parentId || null,
      category: form.category.trim(),
      make: form.make.trim(),
      mfgPartNo: form.mfgPartNo.trim(),
      uom: form.uom.trim(),
      defaultRemarks: form.defaultRemarks.trim(),
    }),
    [form],
  );

  const categoryOptions = useMemo(() => {
    const normalizedMap = new Map();

    (list || []).forEach((it) => {
      if (!it.category) return;
      const normalized = it.category.trim().replace(/\s+/g, " ").toLowerCase();
      if (!normalizedMap.has(normalized)) {
        normalizedMap.set(normalized, it.category.trim());
      }
    });

    return Array.from(normalizedMap.values()).sort();
  }, [list]);

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setError("");

    try {
      if (isEdit) {
        await dispatch(
          updateItem({ id: currentItem.id, data: payload }),
        ).unwrap();
      } else {
        await dispatch(createItem(payload)).unwrap();
      }

      await dispatch(fetchItems());
      onClose?.();
    } catch (err) {
      console.error(err);
      setError(err?.message || "Something went wrong while saving item.");
    }
  };

  if (!open) return null;

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
                {isEdit ? "Edit Item" : "Create Item"}
              </h2>
              <p className="text-xs text-slate-500 truncate">
                {isEdit
                  ? `Update ${currentItem?.name || "item"}`
                  : "Create a new inventory item"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
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
                      SKU <span className="text-red-500">*</span>
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
                      Category
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => updateField("category", e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categoryOptions.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
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
                  </div>

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
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <DollarSign className="h-4 w-4 text-emerald-700" />
                  </div>
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
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.unitPrice}
                      onChange={(e) => updateField("unitPrice", e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Total Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      readOnly
                      value={form.basePrice}
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
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-emerald-600">
                          {form.quantity || 0} × ₹
                          {Number(form.unitPrice || 0).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
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

                  <div>
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
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
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

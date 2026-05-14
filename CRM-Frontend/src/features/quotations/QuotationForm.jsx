

// src/features/quotations/QuotationForm.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useDispatch, useSelector } from "react-redux";

import { fetchAccountsDropdown } from "../accounts/accountSlice";
import { fetchContactsDropdown } from "../contacts/contactSlice";
import { fetchDealsByAccount } from "../deals/dealSlice";
import { fetchItems } from "../items/itemSlice";
import { formatINR } from "./quotationUtils";
import API from "../../api/axios";

import {
  ChevronLeft,
  Download,
  FileText,
  CalendarDays,
  Percent,
  Package,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Layers,
  Building2,
  Users,
  ClipboardList,
  BadgeCheck,
  Calculator,
  Save,
  RefreshCw,
  MessageSquare,
} from "lucide-react";

import QuotationPdfDocument from "./pdf/QuotationPdfDocument";
import {
  createQuotation,
  fetchQuotationById,
  updateQuotation,
} from "./quotationSlice";

import toast from "react-hot-toast";
import { calcQuotationTotals, createQuotationNumber } from "./quotationUtils";

import QuotationDetailsSection from "./QuotationDetailsSection";
import QuotationItemsTable from "./QuotationItemsTable";
// import QuotationSummaryCard from "./QuotationSummaryCard";

/* ================= HELPER ================= */
function newLineItem() {
  return {
    itemId: "",
    sku: "",
    category: "",
    description: "",
    make: "",
    mfgPartNo: "",
    uom: "",
    remarks: "",
    qty: 1,
    price: 0,
    discount: 0,
    subItems: [],
    selectedSubItems: [],
  };
}

const DEFAULT_PAYMENT_TERMS = [
  "40% Advance along with Purchase Order",
  "40% Against proforma invoice before dispatch",
  "20% After successful installation & SAT",
];

const DEFAULT_DELIVERY_TERMS = [
  "Ex-Works Micrologic",
  "Freight, packing and forwarding extra",
  "Delivery schedule depends on customer approval and PO release",
];

const DEFAULT_IMPORTANT_NOTES = [
  "Maintenance spare parts are not included in this offer",
  "Software development/customization will be charged additionally if applicable",
];

function StatCard({ label, value, icon: Icon, tone = "slate" }) {
  const toneClasses = {
    slate:
      "border-slate-200 bg-white/95 text-slate-900 shadow-[0_10px_25px_rgba(15,23,42,0.05)]",
    indigo:
      "border-indigo-100 bg-gradient-to-br from-indigo-50 to-white text-indigo-700 shadow-[0_10px_25px_rgba(79,70,229,0.10)]",
    emerald:
      "border-emerald-100 bg-gradient-to-br from-emerald-50 to-white text-emerald-700 shadow-[0_10px_25px_rgba(16,185,129,0.10)]",
    amber:
      "border-amber-100 bg-gradient-to-br from-amber-50 to-white text-amber-700 shadow-[0_10px_25px_rgba(245,158,11,0.10)]",
  };

  return (
    <div
      className={`rounded-3xl border px-4 py-4 transition hover:-translate-y-0.5 ${toneClasses[tone] || toneClasses.slate}`}
    >
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
        {label}
      </div>
      <div className="mt-2 truncate text-lg font-bold tracking-tight">
        {value}
      </div>
    </div>
  );
}

function EmptyHint({ title, description, icon: Icon }) {
  return (
    <div className="flex items-start gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-4">
      <div className="mt-0.5 rounded-xl bg-white p-2.5 shadow-sm">
        {Icon ? <Icon className="h-4 w-4 text-slate-500" /> : null}
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-800">{title}</div>
        <div className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </div>
      </div>
    </div>
  );
}

function StatusChip({ active, children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] ${
        active
          ? "bg-indigo-600 text-white shadow-[0_10px_20px_rgba(79,70,229,0.20)]"
          : "border border-slate-200 bg-white text-slate-600"
      }`}
    >
      {children}
    </span>
  );
}

/* ========================================================= */

export default function QuotationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { dropdown: accounts } = useSelector((state) => state.accounts);
  const { dropdown: contacts } = useSelector((state) => state.contacts);
  const { list: itemsList } = useSelector((state) => state.items);
  const deals = useSelector((state) => state.deals.deals || []);
  const quotation = useSelector((state) => state.quotation?.selected);
  const { user: currentUser } = useSelector((state) => state.auth);

  const isEdit = Boolean(id);

  const [isSaving, setIsSaving] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [isSearchingLog, setIsSearchingLog] = useState(false);

  const [logContacts, setLogContacts] = useState([]);

  const formatAmount = (value) => {
    const amount = Number(value || 0);

    return formatINR(Math.round(amount)).replace(".00", "");
  };

  const [form, setForm] = useState({
    quotationType: "QUOTATION",
    quotationNumber: "",
    logId: "",
    accountId: "",
    accountName: "",
    dealId: "",
    contactIds: [],
    date: new Date().toISOString().slice(0, 10),
    validUntil: "",
    notes: "",
    terms: "",
    paymentTerms: DEFAULT_PAYMENT_TERMS,
    deliveryTerms: DEFAULT_DELIVERY_TERMS,
    importantNotes: DEFAULT_IMPORTANT_NOTES,
    headerDiscount: 0,
    refDocuments: "",
    techPropRef: "",
    items: [
      { 
        ...newLineItem(), 
        description: "P & F", 
        qty: 1, 
        price: 0,
        hsn: "998540",
        category: "" 
      },
      { 
        ...newLineItem(), 
        description: "I & C, Training", 
        qty: 1, 
        price: 0,
        hsn: "998732",
        make: "Micrologic",
        uom: "Nos",
        category: ""
      }
    ],
  });

  /* ================= FETCH ================= */

  useEffect(() => {
    dispatch(fetchItems());
    dispatch(fetchAccountsDropdown());
  }, [dispatch]);

  useEffect(() => {
    if (form.accountId) {
      dispatch(fetchDealsByAccount(form.accountId));
      dispatch(fetchContactsDropdown({ accountId: form.accountId }));
    } else {
      setForm((prev) => ({ ...prev, contactIds: [], dealId: "" }));
    }
  }, [form.accountId, dispatch]);

  useEffect(() => {
    if (id && quotation?.id !== id) {
      dispatch(fetchQuotationById(id));
    }
  }, [id, dispatch, quotation?.id]);

  useEffect(() => {
    if (quotation && id) {
      setForm({
        quotationNumber: quotation.quotationNo,

        // ADD THIS
        logId:
          quotation.logId ||
          quotation.dealLogId ||
          quotation.logID ||
          quotation.deal?.dealLogId ||
          "",
        accountId: quotation.accountId,
        accountName: quotation.accountName,
        dealId: quotation.dealId || "",
        contactIds: (quotation.contactIds || []).map((id) => String(id)),
        date: quotation.issueDate?.slice(0, 10),
        validUntil: quotation.validUntil?.slice(0, 10) || "",
        notes: quotation.notes || "",
        terms: quotation.terms || "",
         paymentTerms: quotation.paymentTerms?.length
          ? quotation.paymentTerms
          : DEFAULT_PAYMENT_TERMS,

        deliveryTerms: quotation.deliveryTerms?.length
          ? quotation.deliveryTerms
          : DEFAULT_DELIVERY_TERMS,

        importantNotes: quotation.importantNotes?.length
          ? quotation.importantNotes
          : DEFAULT_IMPORTANT_NOTES,
        headerDiscount: quotation.headerDiscount || 0,
        refDocuments: quotation.refDocuments || "",
        techPropRef: quotation.techPropRef || "",

        items: quotation.items.map((item) => ({
          itemId: item.itemId,
          sku: item.sku,
          category: item.category || "",
          description: item.description || "",
          make: item.make,
          mfgPartNo: item.mfgPartNo,
          uom: item.uom,
          remarks: item.remarks,

          qty: item.quantity,

          // ✅ FIX: DO NOT derive from subItems
          price: Number(item.price || 0),

          discount: item.discount,

          subItems: itemsList.find((p) => p.id === item.itemId)?.children || [],

          selectedSubItems: (item.subItems || []).map((sub) => ({
            id: sub.itemId || sub.id,
            name: sub.name,
            sku: sub.sku || "",
            category: sub.category || "",
            description: sub.description || "",
            remarks: sub.remarks || "",

            qty: Number(sub.quantity || 1),
            price: Number(sub.price || 0),
            discount: Number(sub.discount || 0),

            lineTotal:
              Number(sub.quantity || 1) *
              Number(sub.price || 0) *
              (1 - Number(sub.discount || 0) / 100),
          })),
        })),
        quotationType: quotation.quotationType || "QUOTATION",
      });

      dispatch(fetchDealsByAccount(quotation.accountId));
      dispatch(fetchContactsDropdown({ accountId: quotation.accountId }));
    }
  }, [quotation, id, itemsList, dispatch]);



  const handleSave = async () => {
    try {
      setIsSaving(true);
      if (!form.accountId) return toast.error("Select account");
      if (!form.dealId) return toast.error("Select deal");

      const validItems = form.items.filter((i) => i.itemId || i.description?.trim());

      if (!validItems.length) {
        return toast.error("Add at least one valid item");
      }

      // --- USER DISCOUNT LIMIT CHECK (ADDITIVE) ---
      if (currentUser?.role !== "ADMIN") {
        const maxLimit = currentUser?.maxDiscount || 0;

        // Build map of original discounts if editing
        const originalDiscountMap = {};
        if (isEdit && quotation) {
          quotation.items?.forEach((item) => {
            const key = item.itemId || `${item.sku}_${item.description}`;
            originalDiscountMap[key] = item.discount || 0;

            item.subItems?.forEach((sub) => {
              const sKey =
                sub.itemId || `SUB_${sub.name || sub.description}_${sub.sku}`;
              originalDiscountMap[sKey] = sub.discount || 0;
            });
          });

          const oldHeaderDiscount =
            quotation.subtotal > 0
              ? (quotation.discountTotal / quotation.subtotal) * 100
              : 0;
          originalDiscountMap["HEADER"] = oldHeaderDiscount;
        }

        // Check main items
        for (const item of validItems) {
          const key = item.itemId || `${item.sku}_${item.description}`;
          const existingDiscount = originalDiscountMap[key] || 0;
          const allowed = Number(existingDiscount) + Number(maxLimit);

          if (item.discount > allowed) {
            return toast.error(
              `Item "${item.description || item.sku}" discount (${item.discount}%) exceeds your limit of ${maxLimit}% (Existing: ${existingDiscount}%)`
            );
          }

          // Check sub-items
          const subs = item.selectedSubItems?.length
            ? item.selectedSubItems
            : item.subItems || [];

          for (const sub of subs) {
            const sKey = sub.itemId || sub.id || `SUB_${sub.name || sub.description}_${sub.sku}`;
            const sExistingDiscount = originalDiscountMap[sKey] || 0;
            const sAllowed = Number(sExistingDiscount) + Number(maxLimit);

            if (sub.discount > sAllowed) {
              return toast.error(
                `Sub-item "${sub.name || sub.description}" discount (${sub.discount}%) exceeds your limit of ${maxLimit}% (Existing: ${sExistingDiscount}%)`
              );
            }
          }
        }

        // Check header discount
        const existingHeaderDiscount = originalDiscountMap["HEADER"] || 0;
        const allowedHeader = Number(existingHeaderDiscount) + Number(maxLimit);

        if (form.headerDiscount > allowedHeader) {
          return toast.error(
            `Header discount (${form.headerDiscount}%) exceeds your limit of ${maxLimit}% (Existing: ${existingHeaderDiscount.toFixed(2)}%)`
          );
        }
      }
      // ---------------------------------

      const payload = {
        quotationNumber: form.quotationNumber,
        quotationType: form.quotationType,
        accountId: form.accountId,
        dealId: form.dealId,
        contactIds: form.contactIds,
        issueDate: form.date,
        validUntil: form.validUntil || null,
        notes: form.notes,
        terms: form.terms,
         paymentTerms: form.paymentTerms,
        deliveryTerms: form.deliveryTerms,
        importantNotes: form.importantNotes,
        refDocuments: form.refDocuments,
        techPropRef: form.techPropRef,

        items: validItems.map((item) => ({
          itemId: item.itemId,
          description: item.description || "",
          sku: item.sku || "",
          category: item.category || "",
          make: item.make || "",
          mfgPartNo: item.mfgPartNo || "",
          uom: item.uom || "",
          quantity: Number(item.qty || 1),
          price: Number(item.price || 0),
          discount: Number(item.discount || 0),
          remarks: item.remarks,

          subItems: (item.selectedSubItems?.length
            ? item.selectedSubItems
            : item.subItems || []
          ).map((sub) => ({
            itemId: sub.itemId || sub.id || null,
            sku: sub.sku || "",
            category: sub.category || "",
            name: sub.name || "",
            description: sub.description || "",
            make: sub.make || "",
            mfgPartNo: sub.mfgPartNo || "",
            uom: sub.uom || "",
            remarks: sub.remarks || "",
            quantity: Number(sub.qty || sub.quantity || 1),
            price: Number(sub.price || 0),
            discount: Number(sub.discount || 0),
          })),
        })),
      };

      if (isEdit) {
        await dispatch(updateQuotation({ id, data: payload })).unwrap();
        toast.success("Quotation updated");
        navigate("/quotations");
      } else {
        const res = await dispatch(createQuotation(payload)).unwrap();
        toast.success("Quotation created");
        navigate("/quotations");
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Save failed");
    } finally {
      setIsSaving(false);
    }
  };
  /* ================= TOTALS ================= */

  const totals = useMemo(() => calcQuotationTotals(form), [form]);

  const selectedAccountName = useMemo(() => {
    return (
      accounts.find((a) => a.id === form.accountId)?.accountName ||
      form.accountName ||
      ""
    );
  }, [accounts, form.accountId, form.accountName]);

  const contactSummary = useMemo(() => {
    if (!form.contactIds?.length) return "No contacts selected";
    if (form.contactIds.length === 1) return "1 contact selected";
    return `${form.contactIds.length} contacts selected`;
  }, [form.contactIds]);

  const lineCount = useMemo(() => {
    return (
      form.items?.filter((i) => i.itemId || i.description || i.price).length ||
      0
    );
  }, [form.items]);

  /* ================= HANDLERS ================= */

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateItem = (index, key, value) => {
    setForm((prev) => {
      const items = prev.items.map((item, i) => {
        if (i !== index) return item;

        const next = { ...item, [key]: value };

        if (key === "subItems") {
          next.subItems = value;
        }

        if (key === "itemId") {
          const product = itemsList.find((p) => p.id === value);

          if (product) {
            next.sku = product.sku || "";
            next.category = product.category || "";
            next.description = product.description || "";
            next.make = product.make || "";
            next.mfgPartNo = product.mfgPartNo || "";
            next.uom = product.uom || "";
            next.remarks =
              item.remarks !== undefined && item.remarks !== ""
                ? item.remarks
                : product.defaultRemarks || "";
            next.subItems = product.children || [];
            next.selectedSubItems = [];

            // IMPORTANT: keep parent/main item price always
            next.price = Number(product.basePrice || 0);

            // 🔥 DRIVER LOGIC: Filter out driver from sub-items and auto-add to main rows
            const driverSku = "SE1000001";
            if (
              next.category === "Instrumentation & Test Computer" &&
              (next.sku?.startsWith("AE") || next.sku?.startsWith("AP"))
            ) {
              next.subItems = next.subItems.filter((s) => s.sku !== driverSku);
              
              // Check if driver already exists in the whole list
              const hasDriver = items.some(
                (it) => (it.sku || "").trim().toUpperCase() === driverSku,
              );

              if (!hasDriver) {
                // 1. Try to find in children
                let driverData = product.children?.find(
                  (s) => s.sku === driverSku,
                );

                // 2. If not in children, try to find in global itemsList
                if (!driverData) {
                  driverData = itemsList.find(
                    (it) => (it.sku || "").trim().toUpperCase() === driverSku,
                  );
                }

                if (driverData) {
                  next._shouldAddDriver = driverData;
                } else {
                  // 3. Fallback: even if we can't find it, we MUST add it if user wants it
                  // We'll use hardcoded defaults but this shouldn't happen if itemsList is loaded
                  next._shouldAddDriver = {
                    id: "", // Leave empty so backend doesn't try to connect invalid ID
                    sku: driverSku,
                    name: "MTS Licensable Driver, Tool Monitor for the above",
                    basePrice: 2000,
                  };
                }
              }
            }
          } else {
            next.sku = "";
            next.category = "";
            next.description = "";
            next.make = "";
            next.mfgPartNo = "";
            next.uom = "";
            next.remarks = "";
            next.price = 0;
            next.subItems = [];
            next.selectedSubItems = [];
          }
        }

        if (["qty", "price", "discount"].includes(key)) {
          // ✅ Allow typing decimals by keeping string if it ends in a dot
          next[key] =
            typeof value === "string" && value.endsWith(".")
              ? value
              : value === ""
                ? ""
                : Number(value);
        }

        return next;
      });

      // Handle the _shouldAddDriver flag
      let finalItems = [...items];
      const driverToPush = items.find(it => it._shouldAddDriver)?._shouldAddDriver;
      if (driverToPush) {
        // Clean up flag
        finalItems = finalItems.map(it => {
          const { _shouldAddDriver, ...rest } = it;
          return rest;
        });
        
        const driverSku = "SE1000001";
        finalItems.push({
          ...newLineItem(),
          itemId: driverToPush.id || driverToPush.itemId,
          sku: driverSku,
          category: "Instrumentation & Test Computer",
          description: driverToPush.description || driverToPush.name,
          make: driverToPush.make || "MTS",
          uom: driverToPush.uom || "Nos",
          price: Number(driverToPush.basePrice || driverToPush.unitPrice || 0) > 0 
                 ? Number(driverToPush.basePrice || driverToPush.unitPrice) 
                 : 2000,
          qty: 1,
        });
      }

      // 🔥 AUTO-REMOVE DRIVER: If no computers remain after this update
      const driverSku = "SE1000001";
      const hasComputers = finalItems.some(
        (it) =>
          it.category === "Instrumentation & Test Computer" &&
          (it.sku?.startsWith("AE") || it.sku?.startsWith("AP")),
      );

      if (!hasComputers) {
        finalItems = finalItems.filter(
          (it) => (it.sku || "").trim().toUpperCase() !== driverSku,
        );
      }

      return { ...prev, items: finalItems };
    });
  };

  const toggleSubItem = (rowIndex, subItem) => {
    setForm((prev) => {
      const items = prev.items.map((item, i) => {
        if (i !== rowIndex) return item;

        const exists = item.selectedSubItems.find(
          (s) => s.id === (subItem.id || subItem.itemId),
        );

        const subId = subItem.id || subItem.itemId;

        let updatedSubs;

        if (exists) {
          updatedSubs = item.selectedSubItems.filter((s) => s.id !== subId);
        } else {
          updatedSubs = [
            ...item.selectedSubItems,
            {
              ...subItem,
              id: subId,
              sku: subItem.sku || "",
              category: subItem.category || "",
              qty: 1,
              price: subItem.basePrice || 0,
              discount: 0,
            },
          ];
        }
        return {
          ...item,
          selectedSubItems: updatedSubs,
        };
      });

      return { ...prev, items };
    });
  };

  const updateSubItem = (rowIndex, subId, key, value) => {
    setForm((prev) => {
      const items = prev.items.map((item, i) => {
        if (i !== rowIndex) return item;

        const updatedSubs = item.selectedSubItems.map((sub) =>
          sub.id === subId
            ? {
                ...sub,

                [key]: ["remarks", "description", "name"].includes(key)
                  ? value
                  : (typeof value === "string" && value.endsWith("."))
                    ? value
                    : (value === "" ? "" : Number(value)),
              }
            : sub,
        );

        // const total = updatedSubs.reduce(
        //   (sum, s) =>
        //     sum + (s.qty || 1) * (s.price || 0) * (1 - (s.discount || 0) / 100),
        //   0,
        // );

        // return {
        //   ...item,
        //   selectedSubItems: updatedSubs,
        //   price: total,
        // };
        return {
          ...item,
          selectedSubItems: updatedSubs,
        };
      });

      return { ...prev, items };
    });
  };

  const addItem = (prefilledItem = null) => {
    setForm((prev) => {
      let itemToAdd = prefilledItem
        ? {
            ...newLineItem(),
            ...prefilledItem,
          }
        : newLineItem();

      let extraItems = [];

      // 🔥 DRIVER LOGIC: Instrumentation Driver (SE1000001)
      const driverSku = "SE1000001";
      if (
        itemToAdd.category === "Instrumentation & Test Computer" &&
        (itemToAdd.sku?.startsWith("AE") || itemToAdd.sku?.startsWith("AP"))
      ) {
        // 1. Find driver data
        let driverData = itemToAdd.subItems?.find((s) => s.sku === driverSku);
        if (!driverData) {
          driverData = itemsList.find(
            (it) => (it.sku || "").trim().toUpperCase() === driverSku,
          );
        }

        // 2. Check if driver already exists as main row
        const hasDriver = prev.items.some(
          (i) => (i.sku || "").trim().toUpperCase() === driverSku,
        );

        if (!hasDriver) {
          const finalDriver = driverData || {
            id: "",
            sku: driverSku,
            name: "MTS Licensable Driver, Tool Monitor for the above",
            basePrice: 2000,
          };

          extraItems.push({
            ...newLineItem(),
            itemId: finalDriver.id || finalDriver.itemId,
            sku: driverSku,
            category: itemToAdd.category,
            description: finalDriver.description || finalDriver.name,
            make: finalDriver.make || "MTS",
            uom: finalDriver.uom || "Nos",
            price: Number(finalDriver.basePrice || finalDriver.unitPrice || 0) > 0 
                   ? Number(finalDriver.basePrice || finalDriver.unitPrice) 
                   : 2000,
            qty: 1,
            subItems: [],
            selectedSubItems: [],
          });
        }
      }

      return {
        ...prev,
        items: [...prev.items, itemToAdd, ...extraItems],
      };
    });
  };
  // 🔥 HANDLE SKU SEARCH (AUTO ADD ROW)
  const handleSkuSearch = async (sku) => {
    try {
      const res = await API.get(`/items/by-sku/${encodeURIComponent(sku)}`);
      const data = res.data;

      if (!data?.parent) {
        toast.error("SKU not found");
        return;
      }

      const parent = data.parent;
      const children = data.children || [];

      setForm((prev) => {
        const newItem = {
          itemId: parent.id,
          sku: parent.sku,
          category: parent.category || "",
          description: parent.description || "",
          make: parent.make || "",
          mfgPartNo: parent.mfgPartNo || "",
          uom: parent.uom || "",
          remarks: parent.defaultRemarks || "",
          qty: 1,
          price: Number(parent.basePrice || 0),
          discount: 0,
          subItems: children,
          selectedSubItems: [],
        };

        let extraItems = [];

        // 🔥 DRIVER LOGIC
        const driverSku = "SE1000001";
        if (
          newItem.category === "Instrumentation & Test Computer" &&
          (newItem.sku?.startsWith("AE") || newItem.sku?.startsWith("AP"))
        ) {
          // 1. Find driver data
          let driverData = newItem.subItems?.find((s) => s.sku === driverSku);
          if (!driverData) {
            driverData = itemsList.find(
              (it) => (it.sku || "").trim().toUpperCase() === driverSku,
            );
          }

          if (
            !prev.items.some(
              (i) => (i.sku || "").trim().toUpperCase() === driverSku,
            )
          ) {
            const finalDriver = driverData || {
              id: "",
              sku: driverSku,
              name: "MTS Licensable Driver, Tool Monitor for the above",
              basePrice: 2000,
            };

            extraItems.push({
              ...newLineItem(),
              itemId: finalDriver.id || finalDriver.itemId,
              sku: driverSku,
              category: newItem.category,
              description: finalDriver.description || finalDriver.name,
              make: finalDriver.make || "MTS",
              uom: finalDriver.uom || "Nos",
              price: Number(finalDriver.basePrice || finalDriver.unitPrice || 0) > 0 
                     ? Number(finalDriver.basePrice || finalDriver.unitPrice) 
                     : 2000,
              qty: 1,
              subItems: [],
              selectedSubItems: [],
            });
          }
        }

        return {
          ...prev,
          items: [...prev.items, newItem, ...extraItems],
        };
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch SKU");
    }
  };

  const handleLogIdSearch = async (logId, silent = false) => {
    if (isSearchingLog) return;
    try {
      setIsSearchingLog(true);
      if (!logId?.trim()) {
        toast.error("Enter Log ID");
        return;
      }

      const res = await API.get(
        `/deals/by-log-id/${encodeURIComponent(logId)}`,
      );

      const data = res.data;

      if (!data?.deal) {
        toast.error("Log ID not found");
        return;
      }

      const deal = data.deal;

      // 🔥 AUTHORIZATION CHECK: Only PIC or Admin can use this Log ID
      if (
        currentUser?.role !== "ADMIN" &&
        deal.personInCharge &&
        deal.personInCharge !== currentUser?.name
      ) {
        toast.error(
          `Unauthorized: This lead is assigned to ${deal.personInCharge}. Only they can create quotations for it.`,
        );
        setIsSearchingLog(false);
        return;
      }

      const account = data.account;
      const linkedContacts = data.contacts || [];

      // 🔥 RESTRICTION: One quotation per Log ID
      if (!isEdit && deal.quotations?.length > 0) {
        toast.error(`Quotation already exists for this Log ID (${deal.quotations[0].quotationNo})`);
        setIsSearchingLog(false);
        return;
      }

      // ONLY FETCH DEALS
      await dispatch(fetchDealsByAccount(account.id));

      // IMPORTANT
      setLogContacts(linkedContacts);

      setForm((prev) => ({
        ...prev,

        accountId: account.id,
        accountName: account.accountName,

        dealId: deal.id,

        contactIds: linkedContacts.map((c) => c.id),
      }));

      if (!silent) toast.success("Log ID loaded");
    } catch (err) {
      console.error(err);
      if (!silent) toast.error("Failed to fetch Log ID");
    } finally {
      setIsSearchingLog(false);
    }
  };

  // 🔥 NEW: Auto-fetch log contacts if logId exists on load
  useEffect(() => {
    const selectedDeal = deals.find((d) => String(d.id) === String(form.dealId));
    const activeLogId = form.logId || selectedDeal?.dealLogId;

    if (activeLogId && isEdit && !logContacts.length && !isSearchingLog) {
      handleLogIdSearch(activeLogId, true);
    }
  }, [form.logId, form.dealId, deals, isEdit, logContacts.length, isSearchingLog]);

  const handleClearLogLookup = () => {
    setLogContacts([]);

    setForm((prev) => ({
      ...prev,
      accountId: "",
      accountName: "",
      dealId: "",
      contactIds: [],
    }));
  };

  const removeItem = (index) => {
    setForm((prev) => {
      const driverSku = "SE1000001";
      const newItems = prev.items.filter((_, i) => i !== index);

      // 🔥 DRIVER AUTO-CLEANUP: If no computers remain, remove the driver too
      const hasComputers = newItems.some(
        (item) =>
          item.category === "Instrumentation & Test Computer" &&
          (item.sku?.startsWith("AE") || item.sku?.startsWith("AP")),
      );

      if (!hasComputers) {
        return {
          ...prev,
          items: newItems.filter(
            (item) =>
              (item.sku || "").trim().toUpperCase() !== driverSku,
          ),
        };
      }

      return {
        ...prev,
        items: newItems,
      };
    });
  };

  const autoSave = async (updatedItems = form.items) => {
    if (!id) return;

    try {
      await dispatch(
        updateQuotation({
          id,
          data: {
            accountId: form.accountId,
            dealId: form.dealId,
            issueDate: form.date,
            validUntil: form.validUntil || null,
            notes: form.notes,
            terms: form.terms,
            paymentTerms: form.paymentTerms,
            deliveryTerms: form.deliveryTerms,
            importantNotes: form.importantNotes,
            refDocuments: form.refDocuments,
            techPropRef: form.techPropRef,
            items: form.items.map((item) => ({
              itemId: item.itemId,
              // ✅ ADD THESE (THIS IS YOUR BUG FIX)
              description: item.description || "",
              sku: item.sku || "",
              category: item.category || "",
              make: item.make || "",
              mfgPartNo: item.mfgPartNo || "",
              uom: item.uom || "",
              quantity: Number(item.qty || 1),
              price: Number(item.price || 0),
              discount: Number(item.discount || 0),
              remarks: item.remarks,
              subItems: (item.selectedSubItems || []).map((sub) => ({
                itemId: sub.itemId || sub.id,

                sku: sub.sku || "",
                category: sub.category || "",

                name: sub.name || "",
                description: sub.description || "",

                make: sub.make || "",
                mfgPartNo: sub.mfgPartNo || "",
                uom: sub.uom || "",

                remarks: sub.remarks || "",

                quantity: Number(sub.qty || 1),
                price: Number(sub.price || 0),
                discount: Number(sub.discount || 0),
              })),
            })),
          },
        }),
      ).unwrap();

      toast.success("Synced");
    } catch (err) {
      toast.error("Sync failed");
    }
  };

  // const saveQuotation = async () => {
  //   try {
  //     if (!form.accountId) return alert("Select account");
  //     if (!form.dealId) return alert("Select deal");
  //     if (!form.items.length) return alert("Add items");

  //     const invalidItem = form.items.find((i) => !i.itemId);
  //     if (invalidItem) return alert("Please select an item for every row");

  //     setIsSaving(true);

  //     const payload = {
  //       quotationNumber: form.quotationNumber,
  //       accountId: form.accountId,
  //       dealId: form.dealId,
  //       contactIds: form.contactIds,
  //       issueDate: form.date,
  //       validUntil: form.validUntil || null,
  //       notes: form.notes,
  //       terms: form.terms,
  //       items: form.items.map((item) => ({
  //         itemId: item.itemId,
  //         // 🔥 ADD THESE
  //         sku: item.sku,
  //         description: item.description,
  //         category: item.category,
  //         make: item.make,
  //         mfgPartNo: item.mfgPartNo,
  //         uom: item.uom,
  //         remarks: item.remarks,
  //         quantity: Number(item.qty || 1),
  //         price: Number(item.price || 0),
  //         discount: Number(item.discount || 0),
  //         subItems: (item.selectedSubItems || []).map((sub) => ({
  //           itemId: sub.id,
  //           name: sub.name,
  //           description: sub.description || "",
  //           quantity: Number(sub.qty || 1),
  //           price: Number(sub.price || 0),
  //           discount: Number(sub.discount || 0),
  //         })),
  //       })),
  //     };

  //     let res;

  //     if (isEdit) {
  //       // 🔥 EDIT FLOW → UPDATE
  //       res = await dispatch(
  //         updateQuotation({
  //           id,
  //           data: payload,
  //         }),
  //       ).unwrap();
  //     } else {
  //       // 🔥 CREATE FLOW
  //       res = await dispatch(createQuotation(payload)).unwrap();

  //       setForm((prev) => ({
  //         ...prev,
  //         quotationNumber: res.quotationNo,
  //       }));
  //     }

  //     navigate("/quotations");
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to save");
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  /* ================= UI ================= */

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.10),_transparent_25%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.10),_transparent_22%),linear-gradient(to_bottom,_#f8fafc,_#f8fafc,_#eef2ff_120%)] px-3 py-2 sm:px-4">
      <div className="mx-auto flex h-full w-full max-w-[1700px] flex-col space-y-2">
        {/* HERO / TOP BAR */}
        <div className="flex-none overflow-hidden rounded-[20px] border border-slate-200 bg-white/80 shadow-sm backdrop-blur-md">
          <div className="px-5 py-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {/* LEFT */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h1 className="text-[17px] font-black tracking-tight text-slate-900">
                      {form.quotationType === "BUDGETARY"
                        ? "Budgetary Quotation"
                        : form.quotationType === "FIRM"
                          ? "Firm Quotation"
                          : "Quotation"}
                    </h1>
                    <span className="text-slate-300 font-light">—</span>
                    <span className="text-[14px] font-bold text-slate-500">
                      {isEdit ? "Edit Record" : "New Proposal"}
                    </span>
                  </div>
                  {isEdit && (
                    <div className="text-[11px] font-black uppercase tracking-wider text-indigo-600 mt-0.5">
                      {form.quotationNumber}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`inline-flex h-10 items-center gap-2 rounded-xl px-6 text-[13px] font-black uppercase tracking-wider text-white shadow-lg transition-all active:scale-95 ${
                    isSaving
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-slate-900 hover:bg-slate-800 shadow-slate-900/10"
                  }`}
                >
                  {isSaving ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  {isEdit ? "Update" : "Save Proposal"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* REJECTION FEEDBACK */}
        {(() => {
          const latestRejection = quotation?.approvals?.find(
            (a) => a.action === "REJECTED",
          );
          if (!latestRejection) return null;

          return (
            <div className="flex-none rounded-2xl border border-rose-100 bg-rose-50/50 p-3 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-500 text-white shadow-sm">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-700">
                    Rejection Feedback (Fix these items)
                  </span>
                  <p className="mt-0.5 text-xs font-bold leading-relaxed text-slate-800">
                    {latestRejection.comment || "No feedback provided"}
                  </p>
                  <div className="mt-1 text-[9px] font-semibold text-rose-600/60">
                    Rejected by {latestRejection.actedBy?.name} on{" "}
                    {new Date(latestRejection.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
          {/* DETAILS SECTION */}
          <QuotationDetailsSection
            form={form}
            updateField={updateField}
            accounts={accounts}
            deals={deals}
            contacts={logContacts.length ? logContacts : contacts}
            onLogIdSearch={handleLogIdSearch}
            onClearLogLookup={handleClearLogLookup}
            isEdit={isEdit}
          />

          {/* ITEMS TABLE */}
          <div className="flex flex-col">
            <QuotationItemsTable
              totals={totals}
              itemsList={itemsList}
              updateItem={updateItem}
              addItem={addItem}
              removeItem={removeItem}
              formItems={form.items}
              toggleSubItem={toggleSubItem}
              updateSubItem={updateSubItem}
              autoSave={autoSave}
              onSkuSearch={handleSkuSearch}
              isDisabled={!form.dealId && !isEdit}
              logSearchCompleted={!!form.dealId}
              resetItems={() =>
                setForm((prev) => ({
                  ...prev,
                  items: [],
                }))
              }
            />
          </div>

          {/* COMMERCIAL TERMS */}
          <div className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-[#f8fafc]/90 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-slate-200/70 bg-white/70 px-5 py-4">
              <div>
                <h3 className="text-[15px] font-semibold tracking-tight text-slate-900">
                  Commercial Terms & Conditions
                </h3>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Payment terms, delivery terms and important commercial notes
                </p>
              </div>

              <button
                type="button"
                onClick={() => setTermsModalOpen(true)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Edit Terms
              </button>
            </div>

            {/* BODY */}
            <div className="grid gap-5 p-5 lg:grid-cols-3">
              {/* PAYMENT */}
              <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4">
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Payment Terms
                  </h4>
                  <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Commercial Payment Flow
                  </p>
                </div>

                <ul className="space-y-2.5">
                  {form.paymentTerms?.map((term, idx) => (
                    <li
                      key={idx}
                      className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm leading-relaxed text-slate-700"
                    >
                      • {term}
                    </li>
                  ))}
                </ul>
              </div>

              {/* DELIVERY */}
              <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4">
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Price Basis & Delivery
                  </h4>
                  <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Delivery & Commercial Scope
                  </p>
                </div>

                <ul className="space-y-2.5">
                  {form.deliveryTerms?.map((term, idx) => (
                    <li
                      key={idx}
                      className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm leading-relaxed text-slate-700"
                    >
                      • {term}
                    </li>
                  ))}
                </ul>
              </div>

              {/* NOTES */}
              <div className="rounded-2xl border border-slate-200/70 bg-white/80 p-4">
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Important Notes
                  </h4>
                  <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                    Additional Commercial Notes
                  </p>
                </div>

                <ul className="space-y-2.5">
                  {form.importantNotes?.map((term, idx) => (
                    <li
                      key={idx}
                      className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm leading-relaxed text-slate-700"
                    >
                      • {term}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* TERMS MODAL */}
        {termsModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/20 p-4 backdrop-blur-[2px]">
            <div className="w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
              {/* HEADER */}
              <div className="flex items-center justify-between border-b border-slate-200 px-7 py-5">
                <div>
                  <h2 className="text-[20px] font-bold tracking-tight text-slate-900">
                    Commercial Terms & Conditions
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Configure quotation payment, delivery and commercial notes
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setTermsModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Close
                </button>
              </div>

              {/* BODY */}
              <div className="grid gap-5 bg-slate-50/40 p-6 lg:grid-cols-3">
                {[
                  {
                    title: "Payment Terms",
                    key: "paymentTerms",
                  },
                  {
                    title: "Price Basis & Delivery",
                    key: "deliveryTerms",
                  },
                  {
                    title: "Important Notes",
                    key: "importantNotes",
                  },
                ].map((section) => (
                  <div
                    key={section.key}
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    {/* CARD HEADER */}
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                          {section.title}
                        </h3>

                        <p className="mt-0.5 text-xs text-slate-500">
                          Add or edit entries
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            [section.key]: [...prev[section.key], ""],
                          }))
                        }
                        className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                      >
                        + Add
                      </button>
                    </div>

                    {/* TERMS */}
                    <div className="space-y-3">
                      {(form[section.key] || []).map((term, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-slate-200 bg-white"
                        >
                          <div className="flex items-start gap-2 p-2">
                            <textarea
                              rows={2}
                              value={term}
                              onChange={(e) => {
                                const updated = [...form[section.key]];
                                updated[idx] = e.target.value;

                                setForm((prev) => ({
                                  ...prev,
                                  [section.key]: updated,
                                }));
                              }}
                              placeholder="Enter value..."
                              className="min-h-[70px] flex-1 resize-none rounded-lg bg-transparent px-3 py-2 text-sm leading-relaxed text-slate-700 outline-none"
                            />

                            <button
                              type="button"
                              onClick={() => {
                                const updated = form[section.key].filter(
                                  (_, i) => i !== idx,
                                );

                                setForm((prev) => ({
                                  ...prev,
                                  [section.key]: updated,
                                }));
                              }}
                              className="rounded-lg px-3 py-2 text-xs font-semibold text-rose-500 transition hover:bg-rose-50"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* FOOTER */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-7 py-5">
                <button
                  type="button"
                  onClick={() => setTermsModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    toast.success("Commercial terms updated successfully");

                    setTermsModalOpen(false);
                  }}
                  className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckRow({ label, value, active }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2">
      <span className="text-sm text-slate-600">{label}</span>
      <span
        className={`text-sm font-semibold ${
          active ? "text-emerald-700" : "text-amber-600"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/90 p-3 shadow-sm">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-sm font-bold text-slate-900">
        {typeof value === "number"
          ? value.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 2,
            })
          : value}
      </div>
    </div>
  );
}

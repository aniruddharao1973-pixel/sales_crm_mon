// src/features/quotations/QuotationDetail.jsx

import { useEffect, useMemo, Fragment, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import QuotationPdfDocument from "./pdf/QuotationPdfDocument";
import PdfFlipbook from "./pdf/PdfFlipbook";
import { pdf } from "@react-pdf/renderer";
import { formatINR } from "./quotationUtils";
import {
  Download,
  Pencil,
  ChevronLeft,
  FileText,
  Building2,
  Package,
  Tag,
  Layers,
  MessageSquare,
  DollarSign,
  Receipt,
  PercentIcon,
  Calculator,
  RefreshCw,
  FileCheck,
  Hash,
  Eye,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";

import {
  fetchQuotationById,
  clearSelectedQuotation,
  submitQuotation,
  approveQuotation,
  rejectQuotation,
  reviseQuotation,
} from "./quotationSlice";

function QuotationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selected: data, loading } = useSelector((state) => state.quotation);

  const formatAmount = (value) => formatINR(value).replace(".00", "");

  const user = useSelector((state) => state.auth.user);

  const role = user?.role;
  const statusUpper = (data?.status || "").toUpperCase();

  const isTSE = role === "TSE";
  const isPowerUser = ["SUPER_ADMIN", "TSL", "MANAGER"].includes(role);
  const isKAM =
    role === "KAM" && user?.id === data?.account?.keyAccountManagerId;
  const isPIC =
    user?.name &&
    data?.deal?.personInCharge &&
    user.name.toLowerCase() === data.deal.personInCharge.toLowerCase();

  const canApprove = isPowerUser || isKAM;
  const canSubmit = isPowerUser || (isTSE && isPIC) || isKAM;
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState("");
  const [showReviseModal, setShowReviseModal] = useState(false);
  const [revisionReason, setRevisionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [showFlipbook, setShowFlipbook] = useState(false);
  const [flipbookBlob, setFlipbookBlob] = useState(null);
  // const [activePdf, setActivePdf] = useState(null);

  // console.log("PDF DATA →", data);

  /* ================= FETCH ================= */
  const handleOpenPreview = async () => {
    try {
      setActionLoading(true);
      const doc = (
        <QuotationPdfDocument
          quotation={{ ...data, items: sanitizedItems }}
          totals={totals || {}}
        />
      );
      const blob = await pdf(doc).toBlob();
      setFlipbookBlob(blob);
      setShowFlipbook(true);
    } catch (err) {
      console.error("Preview error:", err);
      toast.error("Failed to generate preview");
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewInBrowser = async () => {
    try {
      setActionLoading(true);
      const doc = (
        <QuotationPdfDocument
          quotation={{ ...data, items: sanitizedItems }}
          totals={totals || {}}
        />
      );
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error("PDF View error:", err);
      toast.error("Failed to open PDF in browser");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadPdf = async (type = "COMMERCIAL") => {
    try {
      setActionLoading(true);
      // Filename logic
      const typeLabel = type === "FIRM" ? "Firm Quotation" : (type.charAt(0) + type.slice(1).toLowerCase());
      const logId = data.deal?.dealLogId || "";
      const projectName = data.deal?.dealName || "";
      const revision =
        data.version != null
          ? `Rev ${data.version.toString().padStart(2, "0")}`
          : "Rev 01";

      const fileName = `${typeLabel} ${logId} ${projectName} ${revision}.pdf`
        .replace(/\s+/g, " ")
        .trim();

      const doc = (
        <QuotationPdfDocument
          quotation={{ ...data, items: sanitizedItems }}
          totals={totals || {}}
          proposalType={type}
          title={fileName}
        />
      );
      const blob = await pdf(doc).toBlob();

      // If FIRM, try "Save As" dialog first, otherwise direct download
      if (type === "FIRM") {
        if (window.showSaveFilePicker) {
          try {
            const handle = await window.showSaveFilePicker({
              suggestedName: fileName,
              types: [{
                description: 'PDF Document',
                accept: {'application/pdf': ['.pdf']},
              }],
            });
            const writable = await handle.createWritable();
            await writable.write(blob);
            await writable.close();
          } catch (err) {
            // If user cancels or error, we don't need to do anything unless it's a real error
            if (err.name !== 'AbortError') {
              throw err;
            }
          }
        } else {
          // Fallback to direct download
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      } else {
        // Use File object for better browser naming hints
        const file = new File([blob], fileName, { type: "application/pdf" });
        const url = URL.createObjectURL(file);
        window.open(url, "_blank");
      }
    } catch (err) {
      console.error("PDF Download error:", err);
      toast.error("Failed to download PDF");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    dispatch(fetchQuotationById(id));

    return () => {
      // dispatch(clearSelectedQuotation());
    };
  }, [dispatch, id]);

  const handleSubmit = async () => {
    try {
      setActionLoading(true);

      const res = await dispatch(submitQuotation(id)).unwrap();

      // 🔥 only redirect if ID changed (e.g. version upgrade)
      if (res?.id && res.id !== id) {
        navigate(`/quotations/${res.id}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Submit failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await dispatch(approveQuotation(id)).unwrap();
      // dispatch(fetchQuotationById(id)); // 🔥 REMOVE (slice updates state)
    } catch (err) {
      console.error(err);
      toast.error("Approval failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectComment.trim()) {
      toast.error("Rejection reason required");
      return;
    }

    try {
      setActionLoading(true);
      await dispatch(rejectQuotation({ id, comment: rejectComment })).unwrap();

      setShowRejectModal(false);
      setRejectComment("");

      // dispatch(fetchQuotationById(id)); // 🔥 REMOVE (slice updates state)
    } catch (err) {
      console.error(err);
      toast.error("Rejection failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevise = async () => {
    if (!revisionReason.trim()) {
      toast.error("Revision reason required");
      return;
    }

    try {
      setActionLoading(true);
      const res = await dispatch(
        reviseQuotation({ id, reason: revisionReason }),
      ).unwrap();

      setShowReviseModal(false);
      setRevisionReason("");

      toast.success("New revision created");
      navigate(`/quotations/${res.id}`);
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Revision failed");
    } finally {
      setActionLoading(false);
    }
  };

  /* ================= TOTALS ================= */
  const totals = useMemo(() => {
    if (!data) return null;

    const taxable = Math.max(
      Number(data.subtotal || 0) - Number(data.discountTotal || 0),
      0,
    );

    return {
      subtotal: Number(data.subtotal || 0),
      discount: Number(data.discountTotal || 0),
      taxable,
      grandTotal: taxable,
    };
  }, [data]);

  const stripJunk = (value) => {
    if (value == null) return value;
    return String(value)
      .normalize("NFKC")
      .replace(/\u00B9/g, "") // ¹ (misencoded ₹)
      .replace(/[\u00B2\u00B3\u2070-\u2079]/g, "") // other superscripts
      .trim();
  };

  const sanitizedItems = useMemo(() => {
    if (!data?.items) return [];
    return data.items.map((item) => ({
      ...item,
      description: stripJunk(item.description),
      price: stripJunk(item.price),
      sku: stripJunk(item.sku),
      subItems: (item.subItems || []).map((sub) => ({
        ...sub,
        description: stripJunk(sub.description),
        name: stripJunk(sub.name),
        price: stripJunk(sub.price),
        sku: stripJunk(sub.sku),
        mfgPartNo: stripJunk(sub.mfgPartNo),
      })),
    }));
  }, [data?.items]);

  const summaryItemDescriptions = ["P & F", "I & C, Training"];

  const regularItems = useMemo(() => {
    return (data?.items || []).filter(
      (item) => !summaryItemDescriptions.includes(item.description),
    );
  }, [data?.items]);

  const summaryItems = useMemo(() => {
    return (data?.items || []).filter((item) =>
      summaryItemDescriptions.includes(item.description),
    );
  }, [data?.items]);

  // const totalQuotationValue = useMemo(() => {
  //   return regularItems.reduce((sum, item) => {
  //     const qty = Number(item.quantity || 1);
  //     const price = Number(item.price || 0);
  //     const discount = Number(item.discount || 0);
  //     return sum + (qty * price * (1 - discount / 100));
  //   }, 0);
  // }, [regularItems]);

  const totalQuotationValue = useMemo(() => {
    return regularItems.reduce((sum, item) => {
      // ✅ PARENT TOTAL
      const parentTotal =
        Number(item.quantity || item.qty || 1) *
        Number(item.price || 0) *
        (1 - Number(item.discount || 0) / 100);

      // ✅ SUB ITEMS
      const subItems = item.selectedSubItems?.length
        ? item.selectedSubItems
        : item.subItems || [];

      const subTotal = subItems.reduce((subSum, sub) => {
        return (
          subSum +
          Number(sub.qty || sub.quantity || 1) *
            Number(sub.price || 0) *
            (1 - Number(sub.discount || 0) / 100)
        );
      }, 0);

      return sum + parentTotal + subTotal;
    }, 0);
  }, [regularItems]);

  const categoryGroupedItems = useMemo(() => {
    const grouped = regularItems.reduce((acc, item) => {
      const category = item.category || "Others";
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});

    // 🔥 SORT ITEMS WITHIN EACH CATEGORY (Put driver at the bottom)
    Object.values(grouped).forEach((items) => {
      items.sort((a, b) => {
        const getWeight = (it) => {
          const sku = (it.sku || "").toUpperCase();
          const desc = (it.description || "").toLowerCase();
          const name = (it.name || "").toLowerCase();

          // Match by SKU or keywords
          if (
            sku === "SE1000001" ||
            desc.includes("licensable driver") ||
            desc.includes("tool monitor") ||
            name.includes("licensable driver") ||
            name.includes("tool monitor")
          ) {
            return 1000000;
          }
          return 0;
        };
        return getWeight(a) - getWeight(b);
      });
    });

    return Object.entries(grouped);
  }, [regularItems]);

  const itemCount = data?.items?.length || 0;
  const categoryCount = useMemo(() => {
    const categories = new Set();
    (data?.items || []).forEach((item) => {
      if (item.category) categories.add(item.category);
      (item.subItems || []).forEach((sub) => {
        if (sub.category) categories.add(sub.category);
      });
    });
    return categories.size;
  }, [data]);

  /* ================= LOADING ================= */
  if (!data) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.10),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.10),_transparent_24%),linear-gradient(to_bottom,_#f8fafc,_#f8fafc,_#eef2ff_120%)] px-4">
        <div className="rounded-3xl border border-white/70 bg-white/85 px-8 py-10 text-center shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur">
          <RefreshCw className="mx-auto mb-4 h-12 w-12 animate-spin text-indigo-500" />
          <p className="font-medium text-slate-600">
            Loading quotation details...
          </p>
        </div>
      </div>
    );
  }

  /* ================= UI HELPERS ================= */
  const status = (data.status || "Draft").toString();
  const statusColor = getStatusColor(status);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f8fafc] px-3 py-4 sm:px-5 sm:py-5">
      <div className="mx-auto w-full max-w-[1700px] space-y-5">
        <div className="w-full space-y-5">
          {/* ================= OVERVIEW CARD ================= */}
          <div
            className="rounded-[24px] border border-white/10 shadow-[0_12px_40px_rgba(55,48,107,0.15)] overflow-visible"
            style={{
              background: "#37306B",
            }}
          >
            <div className="px-4 py-3 sm:px-5 sm:py-3">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* LEFT SIDE */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white/70 backdrop-blur-sm transition hover:bg-white/20 hover:text-white"
                  >
                    <ChevronLeft className="h-3 w-3" />
                    Back
                  </button>

                  <div className="h-8 w-px bg-white/10 mx-1" />


                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <h2
                        className="
        text-sm font-black tracking-tight text-white drop-shadow-sm
        sm:text-base
        lg:text-[20px]
        leading-tight
        break-words
      "
                      >
           

                        <span className="text-white/90">
                          {data.deal?.dealName || "—"}
                        </span>
                      </h2>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <div className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-[10px] font-bold text-white/80 backdrop-blur-sm">
                        <Hash className="h-3 w-3 text-indigo-300" />
                        {data.quotationNo}
                      </div>

                      <div
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] backdrop-blur-sm ${
                          statusUpper === "APPROVED"
                            ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300"
                            : statusUpper === "AUTHORIZED"
                              ? "border-sky-400/40 bg-sky-400/15 text-sky-300"
                              : statusUpper === "SUBMITTED"
                                ? "border-amber-400/40 bg-amber-400/15 text-amber-300"
                                : statusUpper === "REJECTED"
                                  ? "border-rose-400/40 bg-rose-400/15 text-rose-300"
                                  : "border-slate-400/30 bg-white/10 text-slate-300"
                        }`}
                      >
                        <span
                          className={`h-1 w-1 rounded-full animate-pulse ${
                            statusUpper === "AUTHORIZED" || statusUpper === "APPROVED"
                              ? "bg-emerald-400"
                              : statusUpper === "SUBMITTED"
                                ? "bg-amber-400"
                                : statusUpper === "REJECTED"
                                  ? "bg-rose-400"
                                  : "bg-slate-400"
                          }`}
                        />
                        {status}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE — ACTION BUTTONS */}
                <div className="flex flex-wrap items-center gap-3">
                  {(isPowerUser || role === "KAM" || role === "TSE") && (
                    <div className="relative group">
                      <button className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 text-xs font-black text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20">
                        <Download className="h-3.5 w-3.5 text-indigo-300" />
                        Proposal PDF
                      </button>

                      <div className="absolute right-0 top-full z-[9999] mt-3 w-80 overflow-hidden rounded-3xl border border-slate-200 bg-white opacity-0 invisible shadow-[0_20px_60px_rgba(15,23,42,0.18)] transition-all duration-200 group-hover:visible group-hover:opacity-100">
                        <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-white to-indigo-50 px-5 py-4">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                            Export Options
                          </p>
                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            Choose proposal format
                          </p>
                        </div>

                        <>
                          <button
                            onClick={() => handleDownloadPdf("COMMERCIAL")}
                            disabled={actionLoading}
                            className="w-full flex items-start gap-3 px-5 py-4 transition-all hover:bg-indigo-50/70 text-left disabled:opacity-50 border-b border-slate-50"
                          >
                            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 shadow-sm">
                              📄
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-sm font-semibold text-slate-900">
                                  Commercial Offer
                                </span>
                                <span className="text-[11px] font-medium text-indigo-500 uppercase tracking-wider">
                                  {actionLoading ? "..." : "Save PDF"}
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-slate-500">
                                Standard detailed proposal
                              </p>
                            </div>
                          </button>

                          <button
                            onClick={() => handleDownloadPdf("BUDGETARY")}
                            disabled={actionLoading}
                            className="w-full flex items-start gap-3 px-5 py-4 transition-all hover:bg-indigo-50/70 text-left disabled:opacity-50 border-b border-slate-50"
                          >
                            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-600 shadow-sm">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-sm font-semibold text-slate-900">
                                  Budgetary Proposal
                                </span>
                                <span className="text-[11px] font-medium text-amber-500 uppercase tracking-wider">
                                  {actionLoading ? "..." : "Save PDF"}
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-slate-500">
                                Ballpark price (No sub-items)
                              </p>
                            </div>
                          </button>

                          <button
                            onClick={() =>
                              handleDownloadPdf("COMMERCIAL_SUMMARY")
                            }
                            disabled={actionLoading}
                            className="w-full flex items-start gap-3 px-5 py-4 transition-all hover:bg-indigo-50/70 text-left disabled:opacity-50 border-b border-slate-50"
                          >
                            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shadow-sm">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-sm font-semibold text-slate-900">
                                  Quotation
                                </span>
                                <span className="text-[11px] font-medium text-blue-500 uppercase tracking-wider">
                                  {actionLoading ? "..." : "Save PDF"}
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-slate-500">
                                Summary proposal (No sub-items)
                              </p>
                            </div>
                          </button>

                          <button
                            onClick={() => handleDownloadPdf("FIRM")}
                            disabled={actionLoading}
                            className="w-full flex items-start gap-3 px-5 py-4 transition-all hover:bg-indigo-50/70 text-left disabled:opacity-50 border-b border-slate-50"
                          >
                            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shadow-sm">
                              <ShieldCheck className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-sm font-semibold text-slate-900">
                                  Firm Proposal
                                </span>
                                <span className="text-[11px] font-medium text-emerald-500 uppercase tracking-wider">
                                  {actionLoading ? "..." : "Save PDF"}
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-slate-500">
                                Binding technical offer
                              </p>
                            </div>
                          </button>

                          <button
                            onClick={handleOpenPreview}
                            className="w-full flex items-start gap-3 px-5 py-4 transition-all hover:bg-indigo-50/70 text-left"
                          >
                            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 shadow-sm">
                              <Eye className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-3">
                                <span className="text-sm font-semibold text-slate-900">
                                  Interactive Preview
                                </span>
                                <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider">
                                  3D Flip
                                </span>
                              </div>
                              <p className="mt-1 text-xs text-slate-500">
                                Immersive page-turn experience
                              </p>
                            </div>
                          </button>
                        </>
                      </div>
                    </div>
                  )}

                  {(statusUpper === "APPROVED" || statusUpper === "AUTHORIZED") && data?.isLatest && (
                    <button
                      onClick={() => {
                        setRevisionReason("");
                        setShowReviseModal(true);
                      }}
                      disabled={actionLoading}
                      className="inline-flex h-9 items-center gap-2 rounded-xl px-5 text-xs font-black text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                      style={{
                        background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                        boxShadow: "0 4px 16px rgba(99,102,241,0.40)",
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                      New Revision
                    </button>
                  )}

                  {(statusUpper === "DRAFT" || statusUpper === "REJECTED") && (
                    <button
                      onClick={handleSubmit}
                      disabled={actionLoading}
                      className="inline-flex h-9 items-center gap-2 rounded-xl px-5 text-xs font-black text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                      style={{
                        background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                        boxShadow: "0 4px 16px rgba(99,102,241,0.45)",
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                      {statusUpper === "REJECTED"
                        ? "Resubmit for Approval"
                        : "Release for Approval"}
                    </button>
                  )}

                  {canApprove && (statusUpper === "SUBMITTED" || (statusUpper === "APPROVED" && isPowerUser)) && (
                    <button
                      onClick={handleApprove}
                      disabled={actionLoading}
                      className="inline-flex h-9 items-center gap-2 rounded-xl px-5 text-xs font-black text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                      style={{
                        background: statusUpper === "APPROVED"
                          ? "linear-gradient(135deg, #0ea5e9, #0284c7)" // Sky blue for Authorize
                          : "linear-gradient(135deg, #10b981, #059669)", // Emerald for Approve
                        boxShadow: statusUpper === "APPROVED"
                          ? "0 4px 16px rgba(14,165,233,0.40)"
                          : "0 4px 16px rgba(16,185,129,0.40)",
                      }}
                    >
                      <FileCheck className="h-4 w-4" />
                      {statusUpper === "APPROVED" ? "Authorize" : "Approve"}
                    </button>
                  )}

                  {canApprove && statusUpper === "SUBMITTED" && (
                    <button
                      onClick={() => setShowRejectModal(true)}
                      disabled={actionLoading}
                      className="inline-flex h-9 items-center gap-2 rounded-xl px-5 text-xs font-black text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                      style={{
                        background: "linear-gradient(135deg, #f43f5e, #e11d48)",
                        boxShadow: "0 4px 16px rgba(244,63,94,0.40)",
                      }}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Reject
                    </button>
                  )}

                  {((isPowerUser && statusUpper !== "APPROVED") ||
                    ((isPIC || isKAM) && (statusUpper === "DRAFT" || statusUpper === "REJECTED"))) && (
                    <button
                      onClick={() => navigate(`/quotations/${id}/edit`)}
                      className="inline-flex h-9 items-center gap-2 rounded-xl bg-white/15 px-5 text-xs font-black text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/25 hover:scale-[1.02] active:scale-[0.98]"
                      style={{ border: "1px solid rgba(255,255,255,0.2)" }}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                  )}

                  {/* <button
                    onClick={() => dispatch(fetchQuotationById(id))}
                    disabled={loading}
                    className="inline-flex h-9 items-center gap-2 rounded-xl bg-white/15 px-5 text-xs font-black text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/25 hover:scale-[1.02] active:scale-[0.98]"
                    style={{ border: "1px solid rgba(255,255,255,0.2)" }}
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                    Refresh
                  </button> */}
                </div>
              </div>
            </div>
          </div>

          {/* ================= REJECTION BANNER ================= */}
          {(() => {
            const latestRejection = data.approvals?.find(
              (a) => a.action === "REJECTED",
            );
            if (!latestRejection) return null;

            const isCurrentRejected = statusUpper === "REJECTED";
            const showNote =
              isCurrentRejected ||
              statusUpper === "DRAFT" ||
              statusUpper === "SUBMITTED";

            if (!showNote) return null;

            return (
              <div className="rounded-[24px] border-2 border-rose-100 bg-rose-50/30 p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-200">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-xs font-black uppercase tracking-[0.15em] text-rose-600">
                        {isCurrentRejected
                          ? "Revision Rejected"
                          : "Previous Revision Feedback"}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                        <BadgeCheck className="h-3 w-3 text-rose-400" />
                        Rejected by {latestRejection.actedBy?.name} •{" "}
                        {new Date(
                          latestRejection.createdAt,
                        ).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="mt-2 text-[15px] font-bold text-slate-900 leading-relaxed">
                      {latestRejection.comment ||
                        "No specific feedback provided"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ================= METADATA SECTION ================= */}
          {(data.refDocuments || data.techPropRef) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                      Reference Documents
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      {data.refDocuments || "—"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                      Tech Proposal Ref
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                      {data.techPropRef || "—"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= ITEMS TABLE CARD ================= */}
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_40px_rgba(55,48,107,0.05)]">
            <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white px-6 py-4 md:flex-row md:items-center sm:px-7">
              {/* LEFT SIDE */}
              <div className="flex items-start gap-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#37306B] text-white shadow-lg shadow-[#37306B]/20">
                  <Package className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Line Items
                  </h2>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div className="ml-auto flex items-center gap-2">
                {/* TOTAL VALUE */}
                <div className="flex items-center gap-2 rounded-lg border border-[#37306B]/10 bg-white px-2.5 py-1.5 shadow-sm">
                  <div className="flex h-7 w-7 items-center justify-center rounded bg-[#37306B] text-white">
                    <FileText className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <div className="text-[8px] font-black uppercase tracking-[0.1em] text-[#37306B]/60">
                      Total Value
                    </div>
                    <div className="text-[13px] font-black leading-none text-[#37306B]">
                      {formatAmount(totals.grandTotal)}
                    </div>
                  </div>
                </div>

                {/* ACCOUNT */}
                <div className="flex max-w-[280px] items-center gap-2.5 rounded-xl border border-rose-100 bg-white px-3 py-2 shadow-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500 text-white shadow-sm">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] font-black uppercase tracking-[0.1em] text-rose-600/70">
                      Account
                    </div>
                    <div className="truncate text-[13px] font-black leading-tight text-slate-900">
                      {data.account?.accountName || "—"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div
                className="max-h-[400px] overflow-x-auto overflow-y-auto sm:max-h-[450px] lg:max-h-[560px]"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#94a3b8 #f1f5f9",
                  WebkitOverflowScrolling: "touch",
                }}
              >
                <table className="w-full text-[12px] leading-relaxed">
                  {/* THEAD */}
                  <thead className="sticky top-0 z-20">
                    <tr>
                      {[
                        { label: "Category", w: "90px", align: "center" },
                        { label: "SKU", w: "90px", align: "center" },
                        {
                          label: "Item Description",
                          w: "minmax(200px, 1fr)",
                          align: "left",
                        },
                        { label: "Make", w: "90px", align: "left" },
                        { label: "Mfg PN", w: "90px", align: "left" },
                        { label: "UOM", w: "45px", align: "left" },
                        { label: "Qty", w: "60px", align: "center" },
                        { label: "Unit Price", w: "100px", align: "right" },
                        { label: "Total Price", w: "100px", align: "right" },
                        { label: "Discount", w: "70px", align: "center" },
                        { label: "Final Price", w: "110px", align: "right" },
                        { label: "Remarks", w: "120px", align: "center" },
                      ].map(({ label, w, align }, i) => (
                        <th
                          key={label}
                          style={{ minWidth: w, width: w }}
                          className={`sticky top-0 z-40 bg-white px-5 py-4 text-${align} text-[10px] font-black uppercase tracking-[0.15em] text-[#37306B]/50 ${
                            i === 0 ? "pl-7" : ""
                          }`}
                        >
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {categoryGroupedItems &&
                      categoryGroupedItems.map(
                        ([categoryName, categoryItems], catIdx) => {
                          const isAltGroup = catIdx % 2 !== 0;

                          return (
                            <Fragment key={categoryName}>
                              {categoryItems.map((item) => {
                                const subItems = item.selectedSubItems?.length
                                  ? item.selectedSubItems
                                  : item.subItems || [];

                                return (
                                  <Fragment key={item.id}>
                                    {/* PARENT ROW */}
                                    <tr
                                      className={`group relative transition-all duration-200 ${
                                        isAltGroup
                                          ? "bg-indigo-50/10 hover:bg-indigo-50/20"
                                          : "bg-transparent hover:bg-slate-50/30"
                                      }`}
                                    >
                                      {categoryItems.indexOf(item) === 0 && (
                                        <td
                                          rowSpan={categoryItems.reduce(
                                            (acc, it) => {
                                              const subs = it.selectedSubItems
                                                ?.length
                                                ? it.selectedSubItems
                                                : it.subItems || [];
                                              const subItemRowCount =
                                                subs.reduce((sAcc, sub) => {
                                                  const hasDesc =
                                                    sub.description &&
                                                    sub.description
                                                      .replace(/\s+/g, " ")
                                                      .trim() !==
                                                      (sub.name || "")
                                                        .replace(/\s+/g, " ")
                                                        .trim();
                                                  return (
                                                    sAcc + (hasDesc ? 2 : 1)
                                                  );
                                                }, 0);
                                              return acc + 1 + subItemRowCount;
                                            },
                                            0,
                                          )}
                                          className={`px-5 py-4 align-middle text-center border-r border-slate-100 ${
                                            isAltGroup
                                              ? "bg-indigo-50/30"
                                              : "bg-slate-50/10"
                                          }`}
                                        >
                                          <div className="flex items-center justify-center">
                                            <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 leading-tight">
                                              {categoryName || "General"}
                                            </span>
                                          </div>
                                        </td>
                                      )}
                                      <td className="px-5 py-4 align-top text-left">
                                        <div className="flex items-start">
                                          <span className="font-mono text-[13px] font-bold tracking-tight text-slate-400">
                                            {item.sku || ""}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="px-5 py-4 align-middle">
                                        <div className="text-[14px] font-bold leading-relaxed text-slate-800">
                                          {item.description || "—"}
                                        </div>
                                      </td>
                                      <td className="px-5 py-4 align-middle text-left text-[13px] font-medium text-slate-500">
                                        {item.make || "—"}
                                      </td>
                                      <td className="px-5 py-4 align-middle text-left font-mono text-[11px] font-bold text-slate-400">
                                        {item.mfgPartNo || "—"}
                                      </td>
                                      <td className="px-5 py-4 align-middle text-left text-[13px] font-medium text-slate-500">
                                        {item.uom || "—"}
                                      </td>
                                      <td className="px-5 py-4 align-middle text-right">
                                        {item.quantity}
                                      </td>
                                      {/* UNIT PRICE */}
                                      <td className="px-5 py-4 align-middle text-right text-[13px] font-semibold text-slate-600">
                                        {item.price
                                          ? formatAmount(item.price)
                                          : "—"}
                                      </td>
                                      {/* TOTAL PRICE (Before Discount) */}
                                      <td className="px-5 py-4 align-middle text-right text-[13px] font-semibold text-slate-500 bg-slate-50/30">
                                        {formatAmount(
                                          (item.quantity || 1) *
                                            (item.price || 0),
                                        )}
                                      </td>
                                      <td className="px-5 py-4 align-middle text-right text-rose-500 font-bold">
                                        {item.discount > 0
                                          ? `${item.discount}%`
                                          : "—"}
                                      </td>
                                      {/* FINAL PRICE */}
                                      <td className="px-5 py-4 align-middle text-right font-black text-[#37306B] text-[15px]">
                                        {formatAmount(
                                          (item.quantity || 1) *
                                            (item.price || 0) *
                                            (1 - (item.discount || 0) / 100),
                                        )}
                                      </td>
                                      <td className="px-5 py-4 align-middle text-left text-[12px] font-medium text-slate-500 italic">
                                        {item.remarks || ""}
                                      </td>
                                    </tr>

                                    {/* SUB-ITEM ROWS */}
                                    {subItems.map((sub) => (
                                      <Fragment key={sub.id || sub.itemId}>
                                        <tr
                                          className={`transition-all duration-200 ${
                                            isAltGroup
                                              ? "bg-indigo-50/10 hover:bg-indigo-50/20"
                                              : "bg-transparent hover:bg-slate-50/50"
                                          }`}
                                        >
                                          {(() => {
                                            const hasDesc =
                                              sub.description &&
                                              sub.description
                                                .replace(/\s+/g, " ")
                                                .trim() !==
                                                (sub.name || "")
                                                  .replace(/\s+/g, " ")
                                                  .trim();
                                            return (
                                              <td
                                                rowSpan={hasDesc ? 2 : 1}
                                                className="px-5 py-4 align-top text-left border-r border-slate-50"
                                              >
                                                <div className="flex items-start">
                                                  <span className="font-mono text-[13px] font-bold text-slate-400">
                                                    {sub.sku || ""}
                                                  </span>
                                                </div>
                                              </td>
                                            );
                                          })()}
                                          <td className="px-5 py-4 align-top">
                                            <div className="text-[14px] font-medium text-slate-800 leading-relaxed">
                                              {sub.name || ""}
                                            </div>
                                          </td>
                                          <td className="px-5 py-4 align-middle text-left text-slate-600 text-[13px]">
                                            {item.category?.toLowerCase() ===
                                            "test platform"
                                              ? ""
                                              : sub.make || "—"}
                                          </td>
                                          <td className="px-5 py-4 align-middle text-left font-mono text-[11px] font-bold text-slate-400">
                                            {item.category?.toLowerCase() ===
                                            "test platform"
                                              ? ""
                                              : sub.mfgPartNo || "—"}
                                          </td>
                                          <td className="px-5 py-4 align-middle text-left text-slate-500 text-[13px]">
                                            {item.category?.toLowerCase() ===
                                            "test platform"
                                              ? ""
                                              : sub.uom || "—"}
                                          </td>
                                          <td className="px-5 py-4 align-middle text-right text-slate-700 font-bold text-[12px]">
                                            {item.category?.toLowerCase() ===
                                            "test platform"
                                              ? ""
                                              : sub.qty || sub.quantity || 0}
                                          </td>
                                          <td className="px-5 py-4 align-middle text-right text-slate-600 font-semibold text-[13px]">
                                            {item.category?.toLowerCase() ===
                                            "test platform"
                                              ? ""
                                              : formatAmount(sub.price || 0)}
                                          </td>
                                          {/* SUB-ITEM TOTAL PRICE */}
                                          <td className="px-5 py-4 align-middle text-right text-[13px] font-semibold text-slate-500 bg-slate-50/30">
                                            {item.category?.toLowerCase() ===
                                            "test platform"
                                              ? ""
                                              : formatAmount(
                                                  (sub.qty ||
                                                    sub.quantity ||
                                                    1) * (sub.price || 0),
                                                )}
                                          </td>
                                          <td className="px-5 py-4 align-middle text-right text-rose-500 font-bold text-[12px]">
                                            {item.category?.toLowerCase() ===
                                            "test platform"
                                              ? ""
                                              : sub.discount > 0
                                                ? `${sub.discount}%`
                                                : "—"}
                                          </td>
                                          <td className="px-5 py-4 align-middle text-right font-black text-[#37306B] text-[15px]">
                                            {item.category?.toLowerCase() ===
                                            "test platform"
                                              ? ""
                                              : formatAmount(
                                                  (sub.qty ||
                                                    sub.quantity ||
                                                    1) *
                                                    (sub.price || 0) *
                                                    (1 -
                                                      (sub.discount || 0) /
                                                        100),
                                                )}
                                          </td>
                                          <td className="px-5 py-4 align-middle text-left text-slate-500 text-[12px] italic">
                                            {sub.remarks || ""}
                                          </td>
                                        </tr>
                                        {sub.description &&
                                          sub.description
                                            .replace(/\s+/g, " ")
                                            .trim() !==
                                            (sub.name || "")
                                              .replace(/\s+/g, " ")
                                              .trim() && (
                                            <tr
                                              className={`border-b border-slate-50 transition-all duration-200 ${
                                                isAltGroup
                                                  ? "bg-indigo-50/10 hover:bg-indigo-50/20"
                                                  : "bg-transparent hover:bg-slate-50/50"
                                              }`}
                                            >
                                              {/* SKU cell is handled by rowSpan above */}
                                              <td className="px-5 pb-4 align-top">
                                                <div className="text-[12px] font-normal text-slate-500 leading-relaxed max-w-2xl whitespace-pre-wrap">
                                                  {sub.description}
                                                </div>
                                              </td>
                                              <td
                                                colSpan={9}
                                                className="px-5 py-0"
                                              ></td>
                                            </tr>
                                          )}
                                      </Fragment>
                                    ))}
                                  </Fragment>
                                );
                              })}
                            </Fragment>
                          );
                        },
                      )}
                    {/* SUMMARY ROWS */}
                    {/* TOTAL QUOTATION VALUE */}
                    <tr className="bg-slate-100/30 font-bold border-t border-slate-200">
                      <td colSpan={2} className="px-5 py-3"></td>
                      <td
                        colSpan={8}
                        className="px-5 py-3 text-left uppercase tracking-wider text-slate-500 text-[11px]"
                      >
                        Total Quotation Value
                      </td>
                      <td className="px-5 py-3 text-right text-slate-700 font-black">
                        {formatAmount(totalQuotationValue)}
                      </td>
                      <td></td>
                    </tr>

                    {/* P & F and I & C Training */}
                    {summaryItems.map((item) => {
                      const qty = Number(item.quantity || item.qty || 1);
                      const price = Number(item.price || 0);
                      const discount = Number(item.discount || 0);
                      const lineTotal = qty * price * (1 - discount / 100);

                      const isPF = item.description === "P & F";
                      const isIC = item.description === "I & C, Training";

                      return (
                        <tr
                          key={item.id || item.itemId}
                          className="bg-white/40 hover:bg-slate-50/50 transition-colors border-t border-slate-100/50"
                        >
                          <td className="px-5 py-3"></td>
                          <td className="px-5 py-3"></td>
                          <td className="px-5 py-3 text-left font-bold text-slate-800 text-[14px]">
                            {item.description}
                          </td>
                          <td className="px-5 py-3 text-left text-slate-700 text-[13px] font-semibold">
                            {isIC ? item.make : ""}
                          </td>
                          <td className="px-5 py-3"></td>
                          <td className="px-5 py-3 text-left text-slate-500 text-[13px] font-medium">
                            {isIC ? item.uom : ""}
                          </td>
                          <td className="px-5 py-3 text-right text-slate-700 text-[14px] font-medium">
                            {isIC ? qty : ""}
                          </td>
                          <td className="px-5 py-3 text-right text-slate-600 font-semibold text-[13px]">
                            {isIC && price > 0 ? formatAmount(price) : ""}
                          </td>
                          {/* SUMMARY TOTAL PRICE */}
                          <td className="px-5 py-3 text-right text-slate-500 font-semibold text-[13px] bg-slate-50/10">
                            {isIC && price > 0 ? formatAmount(qty * price) : ""}
                          </td>
                          <td className="px-5 py-3 text-right text-rose-500 font-bold text-[12px]">
                            {isIC && discount > 0 ? `${discount}%` : ""}
                          </td>
                          <td className="px-5 py-3 text-right font-black text-[#37306B] text-[15px]">
                            {formatAmount(lineTotal)}
                          </td>
                          <td className="px-5 py-3"></td>
                        </tr>
                      );
                    })}

                    {/* GRAND TOTAL ROW */}
                    <tr className="bg-[#37306B]/5 font-black text-[#37306B] border-t-2 border-[#37306B]/10">
                      <td colSpan={2} className="px-5 py-4"></td>
                      <td
                        colSpan={8}
                        className="px-5 py-4 text-left uppercase tracking-[0.2em] text-[11px]"
                      >
                        Grand Total
                      </td>
                      <td className="px-5 py-4 text-right text-lg tracking-tight">
                        {formatAmount(totals.grandTotal)}
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ENHANCED TOTAL SUMMARY */}
            <div className="border-t border-slate-200 bg-gradient-to-b from-slate-50 via-white to-slate-100/80 px-5 py-5 sm:px-6 lg:px-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                {/* RIGHT SIDE */}
                <div className="ml-auto flex w-full max-w-[430px] flex-col justify-start self-start">
                  <div className="sticky top-5 space-y-3">
                    {/* DISCOUNT */}
                    {totals.discount > 0 && (
                      <div className="group relative overflow-hidden rounded-2xl border border-rose-200/80 bg-gradient-to-r from-rose-50 via-white to-rose-50/40 px-5 py-4 shadow-[0_4px_14px_rgba(244,63,94,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(244,63,94,0.12)]">
                        <div className="absolute inset-y-0 left-0 w-1 rounded-full bg-gradient-to-b from-rose-400 to-rose-200" />

                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <div className="text-[11px] font-black uppercase tracking-[0.24em] text-rose-500">
                              Discount
                            </div>

                            <div className="mt-1 text-xs font-medium text-rose-400">
                              Applied reduction
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-lg font-black tracking-tight text-rose-600">
                              −{formatAmount(totals.discount)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SUMMARY FOOTER */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ================= COMMERCIAL TERMS ================= */}
      <div className="border-t border-slate-200 bg-[#f8fafc] px-5 py-6 sm:px-6 lg:px-7">
        <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
          {/* HEADER */}
          <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-[18px] font-black tracking-tight text-slate-900">
                Commercial Terms & Conditions
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Payment terms, delivery conditions and commercial notes
              </p>
            </div>
          </div>

          {/* BODY */}
          <div className="grid gap-5 p-6 lg:grid-cols-3">
            {/* PAYMENT TERMS */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
              <div className="mb-4">
                <h4 className="text-sm font-black uppercase tracking-[0.08em] text-[#37306B]">
                  Payment Terms
                </h4>

                <div className="mt-1 h-[2px] w-10 rounded-full bg-[#37306B]/20" />
              </div>

              <div className="space-y-2.5">
                {(data.paymentTerms || []).map((term, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-white px-4 py-3 text-[13px] font-medium leading-relaxed text-slate-700 shadow-sm"
                  >
                    • {term}
                  </div>
                ))}
              </div>
            </div>

            {/* DELIVERY TERMS */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
              <div className="mb-4">
                <h4 className="text-sm font-black uppercase tracking-[0.08em] text-[#37306B]">
                  Price Basis & Delivery
                </h4>

                <div className="mt-1 h-[2px] w-10 rounded-full bg-[#37306B]/20" />
              </div>

              <div className="space-y-2.5">
                {(data.deliveryTerms || []).map((term, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-white px-4 py-3 text-[13px] font-medium leading-relaxed text-slate-700 shadow-sm"
                  >
                    • {term}
                  </div>
                ))}
              </div>
            </div>

            {/* IMPORTANT NOTES */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
              <div className="mb-4">
                <h4 className="text-sm font-black uppercase tracking-[0.08em] text-[#37306B]">
                  Important Notes
                </h4>

                <div className="mt-1 h-[2px] w-10 rounded-full bg-[#37306B]/20" />
              </div>

              <div className="space-y-2.5">
                {(data.importantNotes || []).map((term, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-white px-4 py-3 text-[13px] font-medium leading-relaxed text-slate-700 shadow-sm"
                  >
                    • {term}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">
              Reject Quotation
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Please provide a reason for rejection
            </p>

            <textarea
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              placeholder="Enter rejection reason..."
              className="mt-4 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-rose-500"
              rows={4}
            />

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="rounded-xl border px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="rounded-xl bg-rose-600 px-5 py-2 text-sm font-bold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showReviseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-5">
              <RefreshCw className="h-6 w-6" />
            </div>

            <h3 className="text-xl font-black text-slate-900">
              Revise Quotation
            </h3>

            <p className="mt-2 text-sm font-medium text-slate-500 leading-relaxed">
              Creating a new revision will snapshot the current version and
              allow you to make updates. Please specify why this revision is
              being created.
            </p>

            <div className="mt-6">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">
                Revision History Reason
              </label>
              <textarea
                value={revisionReason}
                onChange={(e) => setRevisionReason(e.target.value)}
                placeholder="e.g. Price update, Added new items, Client request..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                rows={4}
              />
            </div>

            <div className="mt-7 flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setShowReviseModal(false)}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Discard
              </button>

              <button
                onClick={handleRevise}
                disabled={actionLoading || !revisionReason.trim()}
                className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-black text-white hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-200 transition-all active:scale-95"
              >
                {actionLoading ? "Creating Revision..." : "Confirm Revision"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3D Flipbook Modal */}
      {showFlipbook && flipbookBlob && (
        <PdfFlipbook
          pdfBlob={flipbookBlob}
          onClose={() => setShowFlipbook(false)}
          title={data?.quotationNo || "Quotation"}
        />
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-IN", { dateStyle: "medium" });
}

function getStatusColor(status) {
  const normalized = (status || "").toString().trim().toUpperCase();

  const colors = {
    DRAFT: "bg-slate-100 text-slate-700 border-slate-200",
    SUBMITTED: "bg-amber-100 text-amber-700 border-amber-200",
    APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    REJECTED: "bg-rose-100 text-rose-700 border-rose-200",
  };

  return colors[normalized] || "bg-slate-100 text-slate-700 border-slate-200";
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
        <span className="text-slate-400">{icon}</span>
        {label}
      </div>
      <div className="text-[14px] font-bold text-slate-900">{value || "-"}</div>
    </div>
  );
}

function MiniStat({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-3.5 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
        <span className="text-indigo-400">{icon}</span>
        {label}
      </div>
      <div className="mt-2 text-[15px] font-bold leading-tight text-slate-900">
        {value || "-"}
      </div>
    </div>
  );
}

function SummaryRow({ icon, label, value, small = false, highlight }) {
  const highlightColors = {
    rose: "text-rose-600",
    emerald: "text-emerald-600",
  };

  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <div className="flex items-center gap-2">
        {icon && <span className="text-slate-500">{icon}</span>}
        <span className={`text-slate-600 ${small ? "text-xs" : "text-sm"}`}>
          {label}
        </span>
      </div>
      <span
        className={`font-bold ${
          highlight ? highlightColors[highlight] : "text-slate-900"
        } ${small ? "text-sm" : "text-base"}`}
      >
        {value}
      </span>
    </div>
  );
}

function QuickStat({ icon, label, value, color = "indigo" }) {
  const colorClasses = {
    indigo: "from-indigo-500 to-indigo-600",
    emerald: "from-emerald-500 to-emerald-600",
    rose: "from-rose-500 to-rose-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-center gap-3">
        <div
          className={`rounded-xl bg-gradient-to-br ${colorClasses[color]} p-2.5 text-white shadow-sm`}
        >
          {icon}
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {label}
          </div>
          <div className="mt-1 text-sm font-bold text-slate-900">{value}</div>
        </div>
      </div>
    </div>
  );
}

export default QuotationDetail;

function Pill({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-600 shadow-sm">
      {icon}
      {label}
    </span>
  );
}

function MiniCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-sm font-bold text-slate-900">
        {value || "-"}
      </div>
    </div>
  );
}

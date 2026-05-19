// src/features/quotations/QuotationList.jsx

import { useEffect, useMemo, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  FileText,
  Search,
  BadgeCheck,
  Clock3,
  Trash2,
  Eye,
  TrendingUp,
  Calendar,
  Building2,
  Filter,
  Download,
  RefreshCw,
  X,
  Edit,
  Send,
  Layers,
  ChevronLeft,
  MessageSquare,
  History,
  Calculator,
} from "lucide-react";
import {
  fetchQuotations,
  deleteQuotation,
  fetchQuotationHistory,
  submitQuotation,
  clearQuotationHistory,
} from "./quotationSlice";
import { formatINR } from "./quotationUtils";

export default function QuotationList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { list, loading, history } = useSelector((state) => state.quotation);
  const { user } = useSelector((state) => state.auth);
  const isAdmin = ["SUPER_ADMIN", "TSL"].includes(user?.role);
  const isManager = user?.role === "MANAGER";
  // const [showQuotationModal, setShowQuotationModal] = useState(false);

  const formatAmount = (value) => {
    const amount = Number(value || 0);
    return formatINR(Math.round(amount)).replace(".00", "");
  };

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedRow, setExpandedRow] = useState(null);

  const handleCreateQuotation = () => {
    navigate("/quotations/new");
  };

  useEffect(() => {
    dispatch(fetchQuotations());
  }, [dispatch]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quotation?",
    );
    if (!confirmDelete) return;
    try {
      await dispatch(deleteQuotation(id)).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefresh = () => {
    dispatch(fetchQuotations());
  };

  const handleExpand = (quotationNo, e) => {
    e.stopPropagation();
    if (expandedRow === quotationNo) {
      setExpandedRow(null);
      dispatch({ type: "quotations/clearQuotationHistory" });
      return;
    }
    setExpandedRow(quotationNo);
    dispatch(fetchQuotationHistory(quotationNo));
  };

  const quotations = useMemo(() => {
    const q = search.trim().toLowerCase();
    let filtered = [...(list || [])]
      .filter((q) => q.isLatest)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (q) {
      filtered = filtered.filter((x) => {
        return (
          x.quotationNo?.toLowerCase().includes(q) ||
          x.account?.accountName?.toLowerCase().includes(q) ||
          x.status?.toLowerCase().includes(q)
        );
      });
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter(
        (x) => x.status?.toUpperCase() === statusFilter,
      );
    }

    return filtered;
  }, [search, list, statusFilter]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F8FAFC] px-8 py-10">
      <div className="mx-auto w-full max-w-[1500px] space-y-8">
        {/* ================= REFINED HEADER ================= */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1.5">
            <h1 className="text-[28px] font-black tracking-tight text-[#0F172A]">
              Quotation Records
            </h1>
            <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">
              Commercial Proposal Management
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative group w-full sm:w-[320px]">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-[#37306B] transition-colors" />
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search records..."
                className="h-[46px] w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-[13px] font-medium text-slate-700 outline-none transition-all focus:border-[#37306B]/30 focus:ring-[6px] focus:ring-[#37306B]/5 placeholder:text-slate-400 shadow-sm"
              />
            </div>

            {/* Dropdown */}
            <div className="relative w-full sm:w-[180px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-[46px] w-full appearance-none rounded-xl border border-slate-200 bg-white px-5 text-[13px] font-bold text-slate-600 outline-none transition-all focus:border-[#37306B]/30 focus:ring-[6px] focus:ring-[#37306B]/5 shadow-sm"
              >
                <option value="ALL">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                <svg
                  className="h-4 w-4 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex h-[46px] items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-5 text-[13px] font-black text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95 shadow-sm"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>

              <button
                onClick={handleCreateQuotation}
                className="flex h-[46px] items-center justify-center gap-2.5 rounded-xl bg-[#37306B] px-6 text-[13px] font-black text-white shadow-[0_10px_20px_rgba(55,48,107,0.2)] transition-all hover:bg-[#2D275A] active:scale-95"
              >
                <Plus className="h-4 w-4" />
                New Quotation
              </button>
            </div>
          </div>
        </div>

        {/* ================= EXECUTIVE TABLE ================= */}
        <div className="overflow-hidden rounded-[20px] border border-slate-200/60 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          <div className="max-h-[680px] overflow-auto scrollbar-none">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead className="sticky top-0 z-20 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
                <tr>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[350px]">
                    Quotation Details
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[200px]">
                    Account
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[280px]">
                    Project Deal & PIC
                  </th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[140px]">
                    Date
                  </th>
                  <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[160px]">
                    Grand Total
                  </th>
                  <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[180px]">
                    Status & Activity
                  </th>
                  <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 w-[100px]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {loading && (
                  <tr>
                    <td colSpan={7} className="py-32 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-10 w-10 rounded-full border-[3px] border-[#37306B]/10 border-t-[#37306B] animate-spin" />
                        <span className="text-[13px] font-bold text-slate-400">
                          Loading records...
                        </span>
                      </div>
                    </td>
                  </tr>
                )}

                {!loading &&
                  quotations.map((q) => {
                    const latestApproval = q.approvals?.[0];
                    const pic = q.deal?.personInCharge;
                    const isOwnKAM =
                      user?.role === "KAM" &&
                      q.account?.keyAccountManagerId === user?.id;
                    const isPIC =
                      q.deal?.personInCharge &&
                      q.deal.personInCharge.toLowerCase() ===
                        user?.name?.toLowerCase();
                    const isPowerUser = [
                      "SUPER_ADMIN",
                      "TSL",
                      "MANAGER",
                    ].includes(user?.role);

                    return (
                      <Fragment key={q.id}>
                        <tr
                          onClick={() => navigate(`/quotations/${q.id}`)}
                          className="group cursor-pointer hover:bg-[#F8FAFC]/80 transition-all duration-200"
                        >
                          <td className="px-6 py-6">
                            <div className="flex items-center gap-4">
                              <button
                                onClick={(e) => handleExpand(q.quotationNo, e)}
                                className={`flex h-7 w-7 items-center justify-center rounded-lg border text-slate-400 transition-all active:scale-90 ${expandedRow === q.quotationNo ? "border-[#37306B]/20 bg-[#37306B]/5 text-[#37306B]" : "border-slate-200 hover:border-slate-300"}`}
                              >
                                <svg
                                  className={`h-3 w-3 transition-transform duration-300 ${expandedRow === q.quotationNo ? "rotate-180" : ""}`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>

                              <div className="space-y-1">
                                <div className="flex items-center gap-2.5">
                                  <span className="text-[14px] font-black text-[#1E293B] leading-none whitespace-nowrap">
                                    {q.quotationNo}
                                  </span>
                                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[9px] font-black text-slate-500 uppercase tracking-wider">
                                    V{q.version}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-6">
                            <span className="block truncate text-[14px] font-bold text-slate-600 leading-tight">
                              {q.account?.accountName || "—"}
                            </span>
                          </td>

                          <td className="px-6 py-6">
                            <div className="space-y-1">
                              <span className="block truncate text-[14px] font-bold text-slate-600 leading-tight">
                                {q.deal?.dealName || "—"}
                              </span>
                              {pic && (
                                <div className="flex items-center gap-1.5">
                                  <div className="h-1 w-1 rounded-full bg-indigo-400" />
                                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                    PIC: {pic}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-6 whitespace-nowrap">
                            <span className="text-[12px] font-bold text-slate-500 whitespace-nowrap">
                              {q.issueDate
                                ? new Date(q.issueDate).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )
                                : "—"}
                            </span>
                          </td>

                          <td className="px-6 py-6 text-right">
                            <span className="text-[15px] font-black text-[#37306B] tabular-nums tracking-tight">
                              {formatAmount(q.grandTotal || 0)}
                            </span>
                          </td>

                          <td className="px-6 py-6 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <StatusBadge status={q.status?.toUpperCase()} />
                              {latestApproval && (
                                <div className="flex flex-col items-center">
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                    {latestApproval.action === "SUBMITTED"
                                      ? "Release Requested"
                                      : latestApproval.action === "RESUBMITTED"
                                        ? "Resubmitted"
                                        : latestApproval.action === "APPROVED"
                                          ? "Approved by KAM"
                                          : latestApproval.action === "REJECTED"
                                            ? "Rejected by KAM"
                                            : latestApproval.action}
                                  </span>
                                  <span className="mt-1 text-[10px] font-bold text-slate-500">
                                    {latestApproval.actedBy?.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-6 text-center">
                            <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/quotations/${q.id}`);
                                }}
                                className="p-2 text-slate-400 hover:text-[#37306B] transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/quotations/${q.id}/edit`);
                                }}
                                disabled={
                                  isPowerUser
                                    ? q.status?.toUpperCase() === "APPROVED"
                                    : isOwnKAM || isPIC
                                      ? ["SUBMITTED", "APPROVED"].includes(
                                          q.status?.toUpperCase(),
                                        )
                                      : true // Disable for anyone else
                                }
                                className="p-2 text-slate-400 hover:text-emerald-600 disabled:opacity-20 transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              {isAdmin && (
                                <button
                                  onClick={(e) => handleDelete(q.id, e)}
                                  className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>

                        {expandedRow === q.quotationNo && (
                          <tr className="bg-slate-50/20">
                            <td
                              colSpan={7}
                              className="px-8 py-6 border-b border-slate-100"
                            >
                              <div className="ml-12 max-w-2xl rounded-[18px] border border-slate-200/60 bg-white shadow-xl shadow-slate-200/40 overflow-hidden animate-fadeIn">
                                <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                                  <div className="flex items-center gap-2.5">
                                    <History className="h-3.5 w-3.5 text-[#37306B]" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#37306B]">
                                      Revision Audit Log
                                    </span>
                                  </div>
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {history.length} Version
                                    {history.length !== 1 ? "s" : ""} Traceable
                                  </span>
                                </div>
                                <div className="divide-y divide-slate-50">
                                  {history.map((h) => (
                                    <div
                                      key={h.id}
                                      className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors"
                                    >
                                      <div className="flex items-center gap-5">
                                        <span
                                          className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-black ${h.isLatest ? "bg-[#37306B] text-white shadow-lg shadow-[#37306B]/20" : "bg-slate-100 text-slate-400"}`}
                                        >
                                          {h.version}
                                        </span>
                                        <div>
                                          <div className="flex items-center gap-2.5">
                                            <span className="text-[13px] font-black text-slate-800">
                                              Revision{" "}
                                              {h.version
                                                .toString()
                                                .padStart(2, "0")}
                                            </span>
                                            {h.isLatest && (
                                              <span className="text-[8px] font-black px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-700 uppercase tracking-widest">
                                                Active
                                              </span>
                                            )}
                                          </div>
                                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                                            {new Date(
                                              h.createdAt,
                                            ).toLocaleDateString("en-IN", {
                                              day: "numeric",
                                              month: "short",
                                              year: "numeric",
                                            })}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-6">
                                        <span className="text-[14px] font-black text-slate-700 tabular-nums">
                                          {formatINR(h.grandTotal)}
                                        </span>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/quotations/${h.id}`);
                                          }}
                                          className="text-[10px] font-black text-[#37306B] hover:text-[#2D275A] border-b border-transparent hover:border-[#37306B] transition-all tracking-widest"
                                        >
                                          VIEW DETAILS
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}

                {!loading && quotations.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-40 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                          <FileText className="h-10 w-10 text-slate-300" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[15px] font-black text-slate-900">
                            No proposals found
                          </p>
                          <p className="text-[13px] font-bold text-slate-400">
                            Refine your search or filters to see more results.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSearch("");
                            setStatusFilter("ALL");
                          }}
                          className="mt-4 text-[11px] font-black text-[#37306B] uppercase tracking-widest hover:underline decoration-2 underline-offset-4"
                        >
                          Reset Dashboard Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = (status || "DRAFT").toUpperCase();
  const config = {
    DRAFT: { bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-400" },
    SUBMITTED: {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      dot: "bg-indigo-500",
    },
    APPROVED: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      dot: "bg-emerald-500",
    },
    REJECTED: { bg: "bg-rose-50", text: "text-rose-600", dot: "bg-rose-500" },
  }[normalized] || {
    bg: "bg-slate-100",
    text: "text-slate-500",
    dot: "bg-slate-400",
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.bg} border border-transparent`}
    >
      <div className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      <span
        className={`text-[10px] font-black uppercase tracking-wider ${config.text}`}
      >
        {normalized}
      </span>
    </div>
  );
}

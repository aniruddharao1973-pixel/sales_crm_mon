
// src/features/deals/DealList.jsx
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDeals,
  deleteDeal,
  bulkDeleteDeals,
  importDeals,
  fetchPipelineStats,
} from "./dealSlice";
import { STAGE_COLORS, STATUS_COLORS, DEAL_STATUSES, formatDate, formatLabel } from "../../constants";

import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  DocumentTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowsUpDownIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
  CheckIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import {
  BriefcaseIcon as BriefcaseSolid,
  CheckCircleIcon as CheckCircleSolid,
} from "@heroicons/react/24/solid";

// Sort columns configuration
const SORT_COLUMNS = [
  { key: "dealLogId", label: "Lead Log ID" },
  { key: "createdAt", label: "Logged On" },
  { key: "dealName", label: "Lead Name" },
  { key: "accountName", label: "Account Name" },
  { key: "contactName", label: "Contact Name" },
  { key: "productGroup", label: "Product Group" },
  { key: "stage", label: "Stage" },
  { key: "status", label: "Status" },
  { key: "owner", label: "Owner" },
  { key: "closingDate", label: "Closing Date" },
];

const parseLeadLogId = (logId) => {
  if (!logId) return { year: 0, number: 0 };
  const match = logId.match(/FY(\d+)\.(\d+)/);
  if (match) {
    return { year: parseInt(match[1]), number: parseInt(match[2]) };
  }
  return { year: 0, number: 0 };
};

// Sort Dropdown Component
const SortDropdown = ({ isOpen, onClose, sortConfig, onSortChange }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-full sm:w-80 max-w-[95vw] bg-white rounded-2xl border border-[#3B2E7E]/10 shadow-2xl shadow-[#3B2E7E]/10 z-50 overflow-hidden">
        <div className="px-5 py-4 border-b border-[#3B2E7E]/10 bg-gradient-to-r from-[#3B2E7E]/5 to-transparent">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Sort Options
            </h3>
            <button
              onClick={() =>
                onSortChange({ column: "dealLogId", order: "desc" })
              }
              className="text-xs text-[#3B2E7E] hover:text-[#2A1F5C] font-semibold transition-colors"
            >
              Reset Default
            </button>
          </div>
        </div>
        <div className="p-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Sort By Column
          </label>
          <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
            {SORT_COLUMNS.map((col) => (
              <button
                key={col.key}
                onClick={() => onSortChange({ ...sortConfig, column: col.key })}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-xl transition-all ${
                  sortConfig.column === col.key
                    ? "bg-[#3B2E7E]/10 text-[#3B2E7E] font-semibold shadow-sm"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{col.label}</span>
                {sortConfig.column === col.key && (
                  <CheckCircleSolid className="w-5 h-5 text-[#3B2E7E]" />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="px-4 pb-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Sort Order
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onSortChange({ ...sortConfig, order: "asc" })}
              className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                sortConfig.order === "asc"
                  ? "bg-gradient-to-r from-[#3B2E7E] to-[#2A1F5C] text-white shadow-lg shadow-[#3B2E7E]/30"
                  : "bg-white text-slate-700 border-2 border-slate-200 hover:border-[#3B2E7E]/30 hover:bg-[#3B2E7E]/5"
              }`}
            >
              <BarsArrowUpIcon className="w-5 h-5" />
              Ascending
            </button>
            <button
              onClick={() => onSortChange({ ...sortConfig, order: "desc" })}
              className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                sortConfig.order === "desc"
                  ? "bg-gradient-to-r from-[#3B2E7E] to-[#2A1F5C] text-white shadow-lg shadow-[#3B2E7E]/30"
                  : "bg-white text-slate-700 border-2 border-slate-200 hover:border-[#3B2E7E]/30 hover:bg-[#3B2E7E]/5"
              }`}
            >
              <BarsArrowDownIcon className="w-5 h-5" />
              Descending
            </button>
          </div>
        </div>
        <div className="px-4 py-4 border-t border-[#3B2E7E]/10 bg-[#3B2E7E]/5">
          <button
            onClick={onClose}
            className="w-full px-5 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#3B2E7E] to-[#2A1F5C] rounded-xl hover:shadow-lg hover:shadow-[#3B2E7E]/30 transition-all"
          >
            Apply Sorting
          </button>
        </div>
      </div>
    </>
  );
};

// Sortable Column Header
const SortableHeader = ({
  label,
  columnKey,
  sortConfig,
  onSort,
  className = "",
}) => {
  const isActive = sortConfig.column === columnKey;

  return (
    <th className={`px-4 py-3.5 text-left ${className}`}>
      <button
        onClick={() => onSort(columnKey)}
        className={`inline-flex items-center gap-1.5 transition-colors group/sort ${
          isActive ? "text-[#3B2E7E]" : "text-slate-500 hover:text-slate-800"
        }`}
      >
        <span className="text-[11px] font-bold uppercase tracking-wider">
          {label}
        </span>
        <span className="flex flex-col -space-y-1">
          <ChevronUpIcon
            className={`w-3 h-3 ${
              isActive && sortConfig.order === "asc"
                ? "text-[#3B2E7E]"
                : "text-slate-300 group-hover/sort:text-slate-400"
            }`}
          />
          <ChevronDownIcon
            className={`w-3 h-3 ${
              isActive && sortConfig.order === "desc"
                ? "text-[#3B2E7E]"
                : "text-slate-300 group-hover/sort:text-slate-400"
            }`}
          />
        </span>
      </button>
    </th>
  );
};

// Row Action Menu
const RowActionMenu = ({ deal, currentUser, onDelete, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`p-2 rounded-xl transition-all duration-200 ${
          isOpen
            ? "bg-[#3B2E7E]/10 text-[#3B2E7E]"
            : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        }`}
      >
        <EllipsisVerticalIcon className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/50 z-50 overflow-hidden py-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(`/deals/${deal.id}`);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-[#3B2E7E]/5 hover:text-[#3B2E7E] transition-colors"
            >
              <EyeIcon className="w-4.5 h-4.5 text-slate-400" />
              View Details
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(`/deals/${deal.id}/edit`);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
            >
              <PencilSquareIcon className="w-4.5 h-4.5 text-slate-400" />
              Edit Lead
            </button>
            {currentUser?.role !== "SALES_REP" && (
              <>
                <div className="border-t border-slate-100 my-1.5" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(deal);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <TrashIcon className="w-4.5 h-4.5" />
                  Delete Lead
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const DealList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { deals, pagination, loading, pipelineStats } = useSelector(
    (s) => s.deals,
  );
  const { user: currentUser } = useSelector((s) => s.auth);

  const fileInputRef = useRef(null);
  const currentPageRef = useRef([]);
  const [importing, setImporting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [selectedIds, setSelectedIds] = useState([]);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const searchInputRef = useRef(null);

  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    column: "dealLogId",
    order: "desc",
  });
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    name: "",
  });
  const [deleting, setDeleting] = useState(false);
  const [bulkDeleteModal, setBulkDeleteModal] = useState({
    open: false,
    count: 0,
  });

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.length === deals.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(deals.map((d) => d.id));
    }
  }, [deals, selectedIds]);

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }, []);

  const handleBulkDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(bulkDeleteDeals(selectedIds)).unwrap();
      toast.success(`Successfully deleted ${selectedIds.length} deals`);
      setSelectedIds([]);
      setBulkDeleteModal({ open: false, count: 0 });
    } catch (err) {
      toast.error(err || "Failed to delete deals");
    } finally {
      setDeleting(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    dispatch(
      fetchDeals({
        page,
        limit,
        sortBy: sortConfig.column,
        sortOrder: sortConfig.order,
        search: debouncedSearch || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
      }),
    );
  }, [dispatch, page, limit, sortConfig, debouncedSearch, statusFilter]);

  useEffect(() => {
    dispatch(fetchPipelineStats());
  }, [dispatch, debouncedSearch]);

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const res = await dispatch(importDeals(file)).unwrap();
      if (res.data?.errors?.length > 0) {
        toast.error(`Import finished with ${res.data.errors.length} errors`);
      }
      toast.success(
        `Import complete! Created: ${res.data?.created}, Updated: ${res.data?.updated}, Skipped: ${res.data?.skipped}`,
      );
    } catch (err) {
      toast.error(err || "Failed to import deals");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const sortedDeals = useMemo(() => {
    if (!deals || deals.length === 0) return [];

    return [...deals].sort((a, b) => {
      const { column, order } = sortConfig;
      let comparison = 0;

      switch (column) {
        case "dealLogId": {
          const aLog = parseLeadLogId(a.dealLogId);
          const bLog = parseLeadLogId(b.dealLogId);
          comparison =
            aLog.year !== bLog.year
              ? aLog.year - bLog.year
              : aLog.number - bLog.number;
          break;
        }
        case "dealName":
          comparison = (a.dealName || "").localeCompare(b.dealName || "");
          break;
        case "accountName":
          comparison = (a.account?.accountName || "").localeCompare(
            b.account?.accountName || "",
          );
          break;
        case "contactName": {
          const nameA = a.contact
            ? `${a.contact.firstName || ""} ${a.contact.lastName || ""}`.trim()
            : "";
          const nameB = b.contact
            ? `${b.contact.firstName || ""} ${b.contact.lastName || ""}`.trim()
            : "";
          comparison = nameA.localeCompare(nameB);
          break;
        }
        case "productGroup":
          comparison = (a.productGroup || "").localeCompare(
            b.productGroup || "",
          );
          break;
        case "stage":
          comparison = (a.stage || "").localeCompare(b.stage || "");
          break;
        case "owner":
          comparison = (a.owner?.name || "").localeCompare(
            b.owner?.name || "",
          );
          break;
        case "createdAt":
        case "closingDate": {
          const dateA = a[column] ? new Date(a[column]).getTime() : 0;
          const dateB = b[column] ? new Date(b[column]).getTime() : 0;
          comparison = dateA - dateB;
          break;
        }
        default:
          comparison = 0;
      }

      return order === "asc" ? comparison : -comparison;
    });
  }, [deals, sortConfig]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteDeal(deleteModal.id)).unwrap();
      toast.success("Lead deleted successfully");
      setDeleteModal({ open: false, id: null, name: "" });
    } catch (err) {
      toast.error(err || "Failed to delete deal");
    } finally {
      setDeleting(false);
    }
  };

  const handleColumnSort = (columnKey) => {
    setSortConfig((prev) => ({
      column: columnKey,
      order:
        prev.column === columnKey && prev.order === "desc" ? "asc" : "desc",
    }));
    setPage(1);
  };

  const handleSortChange = (newConfig) => {
    setSortConfig(newConfig);
    setPage(1);
  };

  const resetSort = () => {
    setSortConfig({ column: "dealLogId", order: "desc" });
    setPage(1);
  };

  const clearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  const fetchAllDealsForExport = async () => {
    try {
      currentPageRef.current = deals;
      const res = await dispatch(
        fetchDeals({
          page: 1,
          limit: 100000,
          sortBy: sortConfig.column,
          sortOrder: sortConfig.order,
          search: debouncedSearch || undefined,
        }),
      ).unwrap();

      const allData = res?.data || res || [];

      dispatch(
        fetchDeals({
          page,
          limit,
          sortBy: sortConfig.column,
          sortOrder: sortConfig.order,
          search: debouncedSearch || undefined,
        }),
      );

      return allData;
    } catch (err) {
      toast.error("Failed to fetch deals for export");
      return [];
    }
  };

  const prepareExportData = (data) => {
    return data.map((deal) => ({
      "Lead Log ID": deal.dealLogId,
      "Logged On": formatDate(deal.createdAt),
      "Lead Name": deal.dealName,
      "Account Name": deal.account?.accountName || "",
      "Product Group": deal.productGroup || "",
      Stage: formatLabel(deal.stage),
      Status: formatLabel(deal.status),
      "Lead Owner": deal.owner?.name || "",
      "Person In Charge": deal.personInCharge || "",
      Weightage: deal.weightage || "",
      "Closing Date": formatDate(deal.closingDate),
      Amount: deal.amount || "",
      "Expected Revenue": deal.expectedRevenue || "",
      Probability: deal.probability || "",
      "Contact Name": deal.contact
        ? `${deal.contact.firstName || ""} ${deal.contact.lastName || ""}`
        : "",
      "Contact Email": deal.contact?.email || "",
    }));
  };

  const exportCSV = async () => {
    const allDeals = await fetchAllDealsForExport();
    const data = prepareExportData(allDeals);
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `deals_export_${Date.now()}.csv`);
    setShowExportDropdown(false);
  };

  const exportExcel = async () => {
    const allDeals = await fetchAllDealsForExport();
    const data = prepareExportData(allDeals);
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
    saveAs(blob, `deals_export_${Date.now()}.xlsx`);
    setShowExportDropdown(false);
  };

  const isDefaultSort = sortConfig.column === "dealLogId" && sortConfig.order === "desc";
  const getCurrentSortLabel = () => {
    const col = SORT_COLUMNS.find((c) => c.key === sortConfig.column);
    const orderLabel = sortConfig.order === "asc" ? "↑" : "↓";
    return col ? `${col.label} ${orderLabel}` : "";
  };
  const hasActiveFilters = !isDefaultSort || debouncedSearch || statusFilter !== "all";

  const wonLeads = pipelineStats ? pipelineStats.won : "—";
  const negotiationLeads = pipelineStats ? pipelineStats.negotiation : "—";
  const proposalLeads = pipelineStats ? pipelineStats.proposal : "—";

  return (
    <div className="flex flex-col h-full">
      {/* Header & Stats Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Leads
            <span className="text-sm font-medium px-2 py-0.5 bg-slate-100 text-slate-500 rounded-lg">
              {pagination?.total || sortedDeals.length}
            </span>
          </h1>
          <p className="text-xs text-slate-500">Manage and track your sales leads and opportunities</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3 py-2 bg-gradient-to-br from-[#3B2E7E] to-[#2A1F5C] rounded-xl text-white shadow-sm shadow-[#3B2E7E]/20">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <BriefcaseSolid className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-purple-200 leading-none mb-0.5">Total</p>
              <p className="text-sm font-bold leading-none">{pagination?.total || sortedDeals.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 bg-white border border-emerald-100 rounded-xl shadow-sm shadow-emerald-50">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <CheckCircleSolid className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 leading-none mb-0.5">Won</p>
              <p className="text-sm font-bold text-emerald-600 leading-none">{wonLeads}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 bg-white border border-amber-100 rounded-xl shadow-sm shadow-amber-50">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
              <FireIcon className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 leading-none mb-0.5">Negot.</p>
              <p className="text-sm font-bold text-amber-600 leading-none">{negotiationLeads}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 bg-white border border-violet-100 rounded-xl shadow-sm shadow-violet-50">
            <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
              <DocumentTextIcon className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 leading-none mb-0.5">Props.</p>
              <p className="text-sm font-bold text-violet-600 leading-none">{proposalLeads}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-[#3B2E7E]/10 shadow-sm shadow-[#3B2E7E]/5 flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-[#3B2E7E]/10 flex-shrink-0 bg-slate-50/50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1 min-w-0">
              {/* Search Bar */}
              <div className="relative w-full sm:w-[300px]">
                <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search leads..."
                  className="w-full pl-10 pr-10 py-2 text-sm bg-white border border-slate-200 rounded-xl placeholder-slate-400 text-slate-900 focus:border-[#3B2E7E] focus:ring-2 focus:ring-[#3B2E7E]/10 outline-none transition-all"
                />
                {searchQuery && (
                  <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="relative group w-full sm:w-[160px]">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`w-full appearance-none pl-9 pr-8 py-2 text-sm font-semibold rounded-xl border transition-all cursor-pointer outline-none ${statusFilter !== "all" ? "bg-[#3B2E7E]/10 text-[#3B2E7E] border-[#3B2E7E]/30 ring-1 ring-[#3B2E7E]/10" : "bg-white text-slate-600 border-slate-200 hover:border-[#3B2E7E]/30"}`}
                >
                  <option value="all">All Status</option>
                  {DEAL_STATUSES.map((status) => (
                    <option key={status} value={status}>{formatLabel(status)}</option>
                  ))}
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <div className={`w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${statusFilter !== "all" ? STATUS_COLORS[statusFilter]?.dot || "bg-[#3B2E7E]" : "bg-slate-300"}`} />
                </div>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${statusFilter !== "all" ? "text-[#3B2E7E]" : "text-slate-400"}`} />
                </div>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <div className="relative">
                <button onClick={() => setShowSortDropdown(!showSortDropdown)} className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-xl border transition-all ${showSortDropdown || !isDefaultSort ? "bg-[#3B2E7E]/10 text-[#3B2E7E] border-[#3B2E7E]/30" : "bg-white text-slate-600 border-slate-200 hover:border-[#3B2E7E]/30"}`}>
                  <ArrowsUpDownIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Sort</span>
                </button>
                <SortDropdown isOpen={showSortDropdown} onClose={() => setShowSortDropdown(false)} sortConfig={sortConfig} onSortChange={handleSortChange} />
              </div>

              <div className="relative">
                <button onClick={() => setShowExportDropdown(!showExportDropdown)} disabled={!deals.length} className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-white text-slate-600 border border-slate-200 rounded-xl hover:border-[#3B2E7E]/30 transition-all disabled:opacity-40">
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
                {showExportDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowExportDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                      <button onClick={() => {
                        const data = prepareExportData(sortedDeals);
                        const worksheet = XLSX.utils.json_to_sheet(data);
                        const workbook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
                        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
                        const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
                        saveAs(blob, `deals_page_export_${Date.now()}.xlsx`);
                        setShowExportDropdown(false);
                      }} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#3B2E7E]/5 hover:text-[#3B2E7E]">📊 Current Page (Excel)</button>
                      <button onClick={exportExcel} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#3B2E7E]/5 hover:text-[#3B2E7E]">📊 All Data (Excel)</button>
                      <div className="border-t border-slate-200 my-1" />
                      <button onClick={exportCSV} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#3B2E7E]/5 hover:text-[#3B2E7E]">📄 All Data (CSV)</button>
                    </div>
                  </>
                )}
              </div>

              {(currentUser?.role === "ADMIN" || currentUser?.role === "MANAGER") && (
                <>
                  <input type="file" accept=".xlsx, .xls" className="hidden" ref={fileInputRef} onChange={handleImport} />
                  <button onClick={() => fileInputRef.current?.click()} disabled={importing} className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-white text-slate-600 border border-slate-200 rounded-xl hover:border-[#3B2E7E]/30 transition-all disabled:opacity-50">
                    {importing ? <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" /> : <ArrowUpTrayIcon className="w-4 h-4" />}
                    <span className="hidden sm:inline">{importing ? "Importing..." : "Import"}</span>
                  </button>
                </>
              )}

              <button onClick={() => navigate("/deals/new")} className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#3B2E7E] to-[#2A1F5C] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#3B2E7E]/25 transition-all flex-shrink-0">
                <PlusIcon className="w-4 h-4" />
                <span className="hidden sm:inline">New Lead</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="px-4 py-3 bg-gradient-to-r from-[#3B2E7E]/10 to-purple-50 border-b border-[#3B2E7E]/10 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#3B2E7E] to-[#2A1F5C] rounded-lg text-white font-bold text-sm shadow-lg shadow-[#3B2E7E]/30">{selectedIds.length}</div>
                <p className="text-sm font-bold text-[#3B2E7E]">{selectedIds.length} {selectedIds.length === 1 ? "lead" : "leads"} selected</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setSelectedIds([])} className="px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-white/50 rounded-lg">Deselect</button>
                <button onClick={() => setBulkDeleteModal({ open: true, count: selectedIds.length })} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700"><TrashIcon className="w-4 h-4" /> Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* Table Container */}
        <div className="flex-1 overflow-auto min-h-0 bg-white">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 opacity-30 blur-sm animate-pulse" />
                  <div className="w-12 h-12 border-4 border-purple-200/40 rounded-full" />
                  <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-purple-600 border-r-violet-500 animate-spin" />
                  <div className="absolute inset-2 rounded-full bg-white/70 backdrop-blur-sm" />
                </div>
                <p className="text-sm font-medium text-slate-500">Loading leads...</p>
              </div>
            </div>
          ) : sortedDeals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-gradient-to-br from-[#3B2E7E]/10 to-purple-100 rounded-2xl flex items-center justify-center mb-4">
                {debouncedSearch ? <MagnifyingGlassIcon className="w-8 h-8 text-[#3B2E7E]" /> : <BriefcaseSolid className="w-8 h-8 text-[#3B2E7E]" />}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">{debouncedSearch ? "No leads found" : "No leads yet"}</h3>
              <p className="text-sm text-slate-500 mb-4 text-center max-w-xs">{debouncedSearch ? `No results for "${debouncedSearch}"` : "Get started by creating your first lead"}</p>
              <button onClick={debouncedSearch ? clearSearch : () => navigate("/deals/new")} className={`inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${debouncedSearch ? "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50" : "bg-gradient-to-r from-[#3B2E7E] to-[#2A1F5C] text-white shadow-lg shadow-[#3B2E7E]/25"}`}>
                {debouncedSearch ? <><XMarkIcon className="w-4 h-4 mr-1.5" /> Clear Search</> : <><PlusIcon className="w-4 h-4 mr-1.5" /> Create Lead</>}
              </button>
            </div>
          ) : (
            <table className="w-full min-w-[1000px] border-separate border-spacing-0">
              <thead className="sticky top-0 z-20">
                <tr className="bg-slate-50 border-b border-[#3B2E7E]/10 shadow-[0_1px_0_0_rgba(59,46,126,0.1)]">
                  <th className="px-4 py-4 text-center w-12 bg-slate-50 first:rounded-tl-xl">
                    <input type="checkbox" checked={deals.length > 0 && selectedIds.length === deals.length} onChange={toggleSelectAll} className="w-4 h-4 rounded border-slate-300 text-[#3B2E7E] focus:ring-[#3B2E7E]/20" />
                  </th>
                  <SortableHeader label="Log ID" columnKey="dealLogId" sortConfig={sortConfig} onSort={handleColumnSort} className="min-w-[110px] bg-slate-50" />
                  <SortableHeader label="Lead Name" columnKey="dealName" sortConfig={sortConfig} onSort={handleColumnSort} className="min-w-[180px] bg-slate-50" />
                  <SortableHeader label="Account" columnKey="accountName" sortConfig={sortConfig} onSort={handleColumnSort} className="min-w-[150px] bg-slate-50" />
                  <SortableHeader label="Contact" columnKey="contactName" sortConfig={sortConfig} onSort={handleColumnSort} className="min-w-[150px] bg-slate-50" />
                  <SortableHeader label="Stage" columnKey="stage" sortConfig={sortConfig} onSort={handleColumnSort} className="min-w-[140px] bg-slate-50" />
                  <SortableHeader label="Status" columnKey="status" sortConfig={sortConfig} onSort={handleColumnSort} className="min-w-[140px] bg-slate-50" />
                  <SortableHeader label="Owner" columnKey="owner" sortConfig={sortConfig} onSort={handleColumnSort} className="min-w-[120px] hidden md:table-cell bg-slate-50" />
                  <SortableHeader label="Product" columnKey="productGroup" sortConfig={sortConfig} onSort={handleColumnSort} className="min-w-[110px] hidden lg:table-cell bg-slate-50" />
                  <SortableHeader label="Closing" columnKey="closingDate" sortConfig={sortConfig} onSort={handleColumnSort} className="min-w-[100px] hidden xl:table-cell bg-slate-50" />
                  <th className="px-3 py-4 text-right w-14 bg-slate-50 last:rounded-tr-xl"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedDeals.map((deal, index) => {
                  const stageColor = STAGE_COLORS[deal.stage] || { bg: "bg-slate-50", text: "text-slate-700", dot: "bg-slate-500" };
                  return (
                    <tr key={deal.id} onClick={() => navigate(`/deals/${deal.id}`)} className={`cursor-pointer transition-all duration-150 group hover:bg-[#3B2E7E]/5 ${index % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selectedIds.includes(deal.id)} onChange={() => toggleSelect(deal.id)} className="w-4 h-4 rounded border-slate-300 text-[#3B2E7E] focus:ring-[#3B2E7E]/20" /></td>
                      <td className="px-4 py-3"><span className="inline-flex px-2 py-0.5 rounded-md bg-gradient-to-r from-[#3B2E7E]/10 to-purple-100 text-xs font-mono font-bold text-[#3B2E7E]">{deal.dealLogId}</span></td>
                      <td className="px-4 py-3"><span className="text-sm font-semibold text-slate-900 group-hover:text-[#3B2E7E] transition-colors">{deal.dealName}</span></td>
                      <td className="px-4 py-3">{deal.account?.accountName ? <Link to={`/accounts/${deal.account.id}`} onClick={(e) => e.stopPropagation()} className="text-sm text-slate-600 hover:text-[#3B2E7E] hover:underline">{deal.account.accountName}</Link> : <span className="text-sm text-slate-300">—</span>}</td>
                      <td className="px-4 py-3">{deal.contact ? <Link to={`/contacts/${deal.contact.id}`} onClick={(e) => e.stopPropagation()} className="text-sm text-slate-600 hover:text-[#3B2E7E] hover:underline">{`${deal.contact.firstName || ""} ${deal.contact.lastName || ""}`.trim()}</Link> : <span className="text-sm text-slate-300">—</span>}</td>
                      <td className="px-4 py-3"><span className={`inline-flex items-center text-xs font-bold transition-all duration-300 ${stageColor.text}`}><span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${stageColor.dot}`} />{formatLabel(deal.stage)}</span></td>
                      <td className="px-4 py-3">{deal.status ? <span className={`inline-flex items-center text-xs font-bold transition-all duration-300 ${STATUS_COLORS[deal.status]?.text || "text-slate-700"}`}><span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${STATUS_COLORS[deal.status]?.dot || "bg-slate-500"}`} />{formatLabel(deal.status)}</span> : <span className="text-sm text-slate-300">—</span>}</td>
                      <td className="px-4 py-3 hidden md:table-cell">{deal.owner?.name ? <span className="text-sm text-slate-600">{deal.owner.name}</span> : <span className="text-sm text-slate-300">—</span>}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">{deal.productGroup ? <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{formatLabel(deal.productGroup)}</span> : <span className="text-sm text-slate-300">—</span>}</td>
                      <td className="px-4 py-3 hidden xl:table-cell">{deal.closingDate ? <span className="text-sm text-slate-500">{formatDate(deal.closingDate)}</span> : <span className="text-sm text-slate-300">—</span>}</td>
                      <td className="px-3 py-3 text-right" onClick={(e) => e.stopPropagation()}><RowActionMenu deal={deal} currentUser={currentUser} onDelete={(d) => setDeleteModal({ open: true, id: d.id, name: d.dealName })} onNavigate={navigate} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        {!loading && sortedDeals.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#3B2E7E]/10 bg-slate-50/50 flex-shrink-0">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-slate-600">
                <span className="font-semibold text-slate-800">{(page - 1) * limit + 1}</span>
                <span className="text-slate-400"> – </span>
                <span className="font-semibold text-slate-800">{Math.min(page * limit, pagination?.total || 0)}</span>
                <span className="text-slate-400"> of </span>
                <span className="font-semibold text-slate-800">{pagination?.total || 0}</span>
              </span>
              <div className="flex items-center gap-1.5 border-l border-slate-300 pl-3">
                <label className="text-xs text-slate-500">Rows:</label>
                <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none">
                  {[10, 20, 50].map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>

            {pagination?.pages > 1 && (
              <div className="flex items-center gap-1">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 flex items-center justify-center text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-[#3B2E7E]/5 disabled:opacity-40"><ChevronLeftIcon className="w-4 h-4" /></button>
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                    .filter(p => pagination.pages <= 7 || p === 1 || p === pagination.pages || Math.abs(p - page) <= 1)
                    .map((p, idx, arr) => (
                      <div key={p} className="flex items-center">
                        {idx > 0 && p - arr[idx - 1] > 1 && <span className="px-1 text-slate-300">…</span>}
                        <button onClick={() => setPage(p)} className={`w-8 h-8 text-sm font-semibold rounded-lg transition-all ${page === p ? "bg-gradient-to-r from-[#3B2E7E] to-[#2A1F5C] text-white" : "text-slate-600 hover:bg-[#3B2E7E]/10"}`}>{p}</button>
                      </div>
                    ))}
                </div>
                <button onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="w-8 h-8 flex items-center justify-center text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-[#3B2E7E]/5 disabled:opacity-40"><ChevronRightIcon className="w-4 h-4" /></button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteModal({ open: false, id: null, name: "" })} />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><ExclamationTriangleIcon className="w-7 h-7 text-red-600" /></div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Lead</h3>
              <p className="text-sm text-slate-600 mb-6">Are you sure you want to delete <span className="font-semibold">&ldquo;{deleteModal.name}&rdquo;</span>?<br/><span className="text-xs text-red-500">This cannot be undone.</span></p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteModal({ open: false, id: null, name: "" })} className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
                <button onClick={handleDelete} disabled={deleting} className="flex-1 bg-red-600 text-white px-4 py-2.5 text-sm font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50">{deleting ? "Deleting..." : "Delete"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {bulkDeleteModal.open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setBulkDeleteModal({ open: false, count: 0 })} />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><ExclamationTriangleIcon className="w-7 h-7 text-red-600" /></div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Multiple Leads</h3>
              <p className="text-sm text-slate-600 mb-6">Are you sure you want to delete <span className="font-bold text-red-600">{bulkDeleteModal.count}</span> deals?<br/><span className="text-xs text-red-500">This cannot be undone.</span></p>
              <div className="flex gap-3">
                <button onClick={() => setBulkDeleteModal({ open: false, count: 0 })} className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200">Cancel</button>
                <button onClick={handleBulkDelete} disabled={deleting} className="flex-1 bg-red-600 text-white px-4 py-2.5 text-sm font-semibold rounded-xl hover:bg-red-700 disabled:opacity-50">{deleting ? "Deleting..." : "Delete All"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealList;

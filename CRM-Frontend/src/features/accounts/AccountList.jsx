// src/features/accounts/AccountList.jsx
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchAccounts,
  deleteAccount,
  importAccounts,
  restoreAccount,
} from "./accountSlice";
import { useDebounce } from "../../hooks/useDebounce";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import {
  BuildingOffice2Icon as BuildingOffice2Solid,
  FireIcon as FireSolid,
  StarIcon as StarSolid,
} from "@heroicons/react/24/solid";

// Lifecycle badge styles
const LIFECYCLE_STYLES = {
  ACTIVE: "bg-emerald-50 text-emerald-600",
  INACTIVE: "bg-yellow-50 text-yellow-700",
  PROSPECT: "bg-blue-50 text-blue-600",
  DEACTIVATED: "bg-red-50 text-red-600",
};

const formatLabel = (str) => {
  if (!str) return "";
  return str
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const AccountList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accounts, pagination, loading } = useSelector((s) => s.accounts);
  const { user: currentUser } = useSelector((s) => s.auth);

  const fileInputRef = useRef(null);
  const searchInputRef = useRef(null);
  const currentPageAccountsRef = useRef([]);
  const [importing, setImporting] = useState(false);
  const [search, setSearch] = useState("");
  const [lifecycle, setLifecycle] = useState("");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    name: "",
  });

  const debouncedSearch = useDebounce(search);

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const res = await dispatch(importAccounts(file)).unwrap();
      if (res.errors && res.errors.length > 0) {
        toast.error(`Import finished with ${res.errors.length} errors`);
        console.error("Import errors:", res.errors);
      }
      toast.success(
        `Import complete! Created: ${res.created}, Updated: ${res.updated}, Skipped: ${res.skipped}`,
      );
    } catch (err) {
      toast.error(err || "Failed to import accounts");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    dispatch(
      fetchAccounts({
        page,
        limit: 10,
        search: debouncedSearch,
        lifecycle,
      }),
    );
  }, [dispatch, page, debouncedSearch, lifecycle]);

  const [restoreModal, setRestoreModal] = useState({
    open: false,
    id: null,
    name: "",
  });

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteAccount(deleteModal.id)).unwrap();
      toast.success("Account deleted successfully");
      setDeleteModal({ open: false, id: null, name: "" });
    } catch (err) {
      toast.error(err || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const handleRestore = async () => {
    try {
      await dispatch(restoreAccount(restoreModal.id)).unwrap();
      toast.success("Account restored successfully");
      setRestoreModal({ open: false, id: null, name: "" });
    } catch (err) {
      toast.error(err || "Failed to restore");
    }
  };

  const clearSearch = () => {
    setSearch("");
    setPage(1);
    searchInputRef.current?.focus();
  };

  // const fetchAllAccountsForExport = async () => {
  //   try {
  //     const res = await dispatch(
  //       fetchAccounts({
  //         page: 1,
  //         limit: 100000, // large number to fetch all
  //         search: debouncedSearch,
  //         lifecycle,
  //       }),
  //     ).unwrap();

  //     return res?.data || res || [];
  //   } catch (err) {
  //     toast.error("Failed to fetch data for export");
  //     return [];
  //   }
  // };

  const fetchAllAccountsForExport = async () => {
    try {
      // ✅ backup current page data
      currentPageAccountsRef.current = accounts;

      const res = await dispatch(
        fetchAccounts({
          page: 1,
          limit: 100000,
          search: debouncedSearch,
          lifecycle,
        }),
      ).unwrap();

      const allData = res?.data || res || [];

      // ✅ restore original page silently
      dispatch(
        fetchAccounts({
          page,
          limit: 10,
          search: debouncedSearch,
          lifecycle,
        }),
      );

      return allData;
    } catch (err) {
      toast.error("Failed to fetch data for export");
      return [];
    }
  };

  const prepareExportData = (data) => {
    const rows = [];

    data.forEach((a) => {
      const deals = a.deals && a.deals.length ? a.deals : [null];

      deals.forEach((d) => {
        rows.push({
          "Account Name": a.accountName || "",
          Industry: a.industry || "",
          Owner: a.owner?.name || "",
          Phone: a.phone || "",
          // Lifecycle: a.lifecycle || "",
          Status: a.lifecycle || "",

          Contacts: a._count?.contacts || 0,
          "Deals Count": a._count?.deals || 0,

          "Deal Name": d?.dealName || "",
          "Deal Stage": d?.stage || "",
          "Deal Value": d?.amount || "",
          "Deal Owner": d?.owner?.name || "",

          Revenue: a.annualRevenue || "",
          Employees: a.employees || "",

          "Created Date": a.createdAt
            ? new Date(a.createdAt).toLocaleDateString()
            : "",
          "Last Updated": a.updatedAt
            ? new Date(a.updatedAt).toLocaleDateString()
            : "",
        });
      });
    });

    return rows;
  };

  const exportCurrentPageCSV = () => {
    const data = prepareExportData(accounts);

    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `accounts_page_${page}_${Date.now()}.csv`);

    setShowExportDropdown(false);
  };

  const exportCurrentPageExcel = () => {
    const data = prepareExportData(accounts);

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Accounts");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `accounts_page_${page}_${Date.now()}.xlsx`);

    setShowExportDropdown(false);
  };

  const exportCSV = async () => {
    const allAccounts = await fetchAllAccountsForExport();
    const data = prepareExportData(allAccounts);

    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    saveAs(blob, `accounts_export_${Date.now()}.csv`);
    setShowExportDropdown(false);
  };

  const exportExcel = async () => {
    const allAccounts = await fetchAllAccountsForExport();
    const data = prepareExportData(allAccounts);

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Accounts");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `accounts_export_${Date.now()}.xlsx`);
    setShowExportDropdown(false);
  };

  // Calculate stats
  const totalContacts = accounts.reduce(
    (sum, a) => sum + (a._count?.contacts || 0),
    0,
  );

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header & Stats Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Accounts
            <span className="text-sm font-medium px-2 py-0.5 bg-slate-100 text-slate-500 rounded-lg">
              {pagination?.total || accounts.length}
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Manage and track your customer accounts
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Compact Total Accounts */}
          <div className="flex items-center gap-2.5 px-3 py-2 bg-gradient-to-br from-[#3B2E7E] to-[#2A1F5C] rounded-xl text-white shadow-sm shadow-[#3B2E7E]/20">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <BuildingOffice2Solid className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-purple-200 leading-none mb-0.5">
                Accounts
              </p>
              <p className="text-sm font-bold leading-none">
                {pagination?.total || accounts.length}
              </p>
            </div>
          </div>

          {/* Compact Total Contacts */}
          <div className="flex items-center gap-2.5 px-3 py-2 bg-white border border-emerald-100 rounded-xl shadow-sm shadow-emerald-50">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <UserGroupIcon className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 leading-none mb-0.5">
                Contacts
              </p>
              <p className="text-sm font-bold text-emerald-600 leading-none">
                {totalContacts}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-[#3B2E7E]/10 shadow-sm shadow-[#3B2E7E]/5 flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-[#3B2E7E]/10 flex-shrink-0 bg-slate-50/50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left side: Search & Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64 lg:w-80">
                <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search accounts..."
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-xl placeholder-slate-400 text-slate-900 focus:border-[#3B2E7E] focus:ring-4 focus:ring-[#3B2E7E]/5 outline-none transition-all shadow-sm"
                />
                {search && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Status Tabs */}
              <div className="flex items-center p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
                {[
                  { label: "All", value: "" },
                  { label: "Active", value: "ACTIVE" },
                  { label: "Prospect", value: "PROSPECT" },
                  { label: "Inactive", value: "INACTIVE" },
                  { label: "Deactivated", value: "DEACTIVATED" },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => {
                      setLifecycle(tab.value);
                      setPage(1);
                    }}
                    className={`px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                      lifecycle === tab.value
                        ? "bg-[#3B2E7E] text-white shadow-md shadow-[#3B2E7E]/20"
                        : "text-slate-500 hover:text-[#3B2E7E] hover:bg-slate-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right side: Actions */}
            <div className="flex items-center gap-2 self-end lg:self-auto">
              {/* Export */}
              {currentUser?.role !== "TSE" && (
                <div className="relative">
                  <button
                    onClick={() => setShowExportDropdown(!showExportDropdown)}
                    disabled={!accounts.length}
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 text-sm font-bold bg-white text-slate-600 border border-slate-200 rounded-xl hover:border-[#3B2E7E]/30 transition-all disabled:opacity-40 shadow-sm"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" />
                    <span className="hidden xl:inline">Export</span>
                  </button>

                  {showExportDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowExportDropdown(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                        <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border-b border-slate-100">
                          Full Dataset
                        </div>
                        <button
                          onClick={exportExcel}
                          className="block w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#3B2E7E]/5 hover:text-[#3B2E7E]"
                        >
                          📊 Export All - Excel
                        </button>
                        <button
                          onClick={exportCSV}
                          className="block w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#3B2E7E]/5 hover:text-[#3B2E7E]"
                        >
                          📄 Export All - CSV
                        </button>
                        <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border-y border-slate-100">
                          Current View
                        </div>
                        <button
                          onClick={exportCurrentPageExcel}
                          className="block w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#3B2E7E]/5 hover:text-[#3B2E7E]"
                        >
                          📊 Export Page - Excel
                        </button>
                        <button
                          onClick={exportCurrentPageCSV}
                          className="block w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#3B2E7E]/5 hover:text-[#3B2E7E]"
                        >
                          📄 Export Page - CSV
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Import */}
              {["SUPER_ADMIN", "TSL"].includes(currentUser?.role) && (
                <>
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImport}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={importing}
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 text-sm font-bold bg-white text-slate-600 border border-slate-200 rounded-xl hover:border-[#3B2E7E]/30 transition-all disabled:opacity-50 shadow-sm"
                  >
                    {importing ? (
                      <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowUpTrayIcon className="w-4 h-4" />
                    )}
                    <span className="hidden xl:inline">
                      {importing ? "Importing..." : "Import"}
                    </span>
                  </button>
                </>
              )}

              <div className="w-px h-6 bg-slate-200 mx-1" />

              {/* New Account */}
              {!["TSE", "KAM"].includes(currentUser?.role) && (
                <button
                  onClick={() => navigate("/accounts/new")}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#3B2E7E] to-[#2A1F5C] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#3B2E7E]/30 active:scale-[0.98] transition-all shadow-md shadow-[#3B2E7E]/20"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">New Account</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table Container - This is the part that scrolls */}
        <div className="flex-1 overflow-auto min-h-0 bg-white max-h-[calc(100vh-280px)]">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-[#3B2E7E]/20 rounded-full" />
                  <div className="absolute top-0 left-0 w-12 h-12 border-4 border-[#3B2E7E] border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-sm font-medium text-slate-500">
                  Loading accounts...
                </p>
              </div>
            </div>
          ) : accounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-gradient-to-br from-[#3B2E7E]/10 to-purple-100 rounded-2xl flex items-center justify-center mb-4">
                {debouncedSearch ? (
                  <MagnifyingGlassIcon className="w-8 h-8 text-[#3B2E7E]" />
                ) : (
                  <BuildingOffice2Solid className="w-8 h-8 text-[#3B2E7E]" />
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {debouncedSearch ? "No accounts found" : "No accounts yet"}
              </h3>
              <p className="text-sm text-slate-500 mb-4 text-center max-w-xs">
                {debouncedSearch
                  ? `No results for "${debouncedSearch}"`
                  : "Get started by creating your first account"}
              </p>
              {debouncedSearch ? (
                <button
                  onClick={clearSearch}
                  className="inline-flex items-center px-4 py-2 bg-white text-slate-700 text-sm font-semibold rounded-xl border border-slate-200 hover:bg-slate-50"
                >
                  <XMarkIcon className="w-4 h-4 mr-1.5" />
                  Clear Search
                </button>
              ) : (
                !["TSE", "KAM"].includes(currentUser?.role) && (
                  <button
                    onClick={() => navigate("/accounts/new")}
                    className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-[#3B2E7E] to-[#2A1F5C] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#3B2E7E]/25"
                  >
                    <PlusIcon className="w-4 h-4 mr-1.5" />
                    Create Account
                  </button>
                )
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block">
                <table className="w-full min-w-[900px]">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-white border-b border-[#3B2E7E]/10">
                      <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3.5">
                        Account
                      </th>
                      <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3.5">
                        Phone
                      </th>
                      <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3.5">
                        Industry
                      </th>
                      <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3.5">
                        Owner
                      </th>
                      <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3.5">
                        KAM
                      </th>
                      <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3.5">
                        Contacts
                      </th>
                      <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3.5">
                        Deals
                      </th>
                      <th className="text-left text-[11px] font-bold text-slate-500 uppercase px-5 py-3.5">
                        Status
                      </th>
                      <th className="text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider px-5 py-3.5">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {accounts.map((account, index) => {
                      return (
                        <tr
                          key={account.id}
                          onClick={() => navigate(`/accounts/${account.id}`)}
                          className={`cursor-pointer transition-all duration-150 group hover:bg-[#3B2E7E]/5 ${
                            index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                          }`}
                        >
                          {/* Account Name */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {/* <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B2E7E] to-[#5A4A9C] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#3B2E7E]/20">
                                <span className="text-sm font-bold text-white">
                                  {account.accountName?.charAt(0)?.toUpperCase() || "A"}
                                </span>
                              </div> */}
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900 group-hover:text-[#3B2E7E] transition-colors truncate">
                                  {account.accountName}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Phone */}
                          <td
                            className="px-5 py-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {account.phone ? (
                              <a
                                href={`tel:${account.phone}`}
                                className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-[#3B2E7E] transition-colors"
                              >
                                <PhoneIcon className="w-3.5 h-3.5 text-slate-400" />
                                {account.phone}
                              </a>
                            ) : (
                              <span className="text-sm text-slate-300">—</span>
                            )}
                          </td>

                          {/* Industry */}
                          <td className="px-5 py-4">
                            {account.industry ? (
                              <span className="text-sm text-slate-600">
                                {formatLabel(account.industry)}
                              </span>
                            ) : (
                              <span className="text-sm text-slate-300">—</span>
                            )}
                          </td>

                          {/* Owner */}
                          <td className="px-5 py-4">
                            {account.owner?.name ? (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-600 truncate">
                                  {account.owner.name}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-slate-300">—</span>
                            )}
                          </td>

                          {/* Key Account Manager */}
                          <td className="px-5 py-4">
                            {account.keyAccountManager?.name ? (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-slate-600 truncate">
                                  {account.keyAccountManager.name}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-slate-300">—</span>
                            )}
                          </td>

                          {/* Contacts */}
                          <td className="px-5 py-4 text-left">
                            <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2.5 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg">
                              {account._count?.contacts || 0}
                            </span>
                          </td>

                          {/* Deals */}
                          <td className="px-5 py-4 text-left">
                            <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2.5 text-xs font-bold text-slate-700 bg-slate-100 rounded-lg">
                              {account._count?.deals || 0}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            {account.lifecycle && (
                              <span
                                className={`px-2 py-1 text-xs rounded-lg ${LIFECYCLE_STYLES[account.lifecycle]}`}
                              >
                                {formatLabel(account.lifecycle)}
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td
                            className="px-5 py-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() =>
                                  navigate(`/accounts/${account.id}`)
                                }
                                className="p-2 text-slate-400 hover:text-[#3B2E7E] hover:bg-[#3B2E7E]/10 rounded-lg transition-all"
                                title="View"
                              >
                                <EyeIcon className="w-4 h-4" />
                              </button>
                              {account.lifecycle !== "DEACTIVATED" &&
                                !["TSE", "KAM"].includes(currentUser?.role) && (
                                  <button
                                    onClick={() =>
                                      navigate(`/accounts/${account.id}/edit`)
                                    }
                                    className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                    title="Edit"
                                  >
                                    <PencilSquareIcon className="w-4 h-4" />
                                  </button>
                                )}
                              {["SUPER_ADMIN", "TSL"].includes(
                                currentUser?.role,
                              ) &&
                                account.lifecycle !== "DEACTIVATED" && (
                                  <button
                                    onClick={() =>
                                      setDeleteModal({
                                        open: true,
                                        id: account.id,
                                        name: account.accountName,
                                      })
                                    }
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                    title="Delete"
                                  >
                                    <TrashIcon className="w-4 h-4" />
                                  </button>
                                )}
                              {account.lifecycle === "DEACTIVATED" &&
                                ["SUPER_ADMIN", "TSL"].includes(
                                  currentUser?.role,
                                ) && (
                                  <button
                                    onClick={() =>
                                      setRestoreModal({
                                        open: true,
                                        id: account.id,
                                        name: account.accountName,
                                      })
                                    }
                                    className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                    title="Restore"
                                  >
                                    ♻️
                                  </button>
                                )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="lg:hidden divide-y divide-slate-100">
                {accounts.map((account) => {
                  return (
                    <div
                      key={account.id}
                      className="p-4 hover:bg-[#3B2E7E]/5 transition-colors"
                    >
                      {/* Header Row */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B2E7E] to-[#5A4A9C] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#3B2E7E]/20">
                            <span className="text-sm font-bold text-white">
                              {account.accountName?.charAt(0)?.toUpperCase() ||
                                "A"}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <Link
                              to={`/accounts/${account.id}`}
                              className="text-sm font-semibold text-slate-900 hover:text-[#3B2E7E] transition-colors"
                            >
                              {account.accountName}
                            </Link>
                            {/* {account.accountNumber && (
                              <p className="text-xs text-slate-400 mt-0.5">
                                #{account.accountNumber}
                              </p>
                            )} */}
                          </div>
                        </div>
                      </div>

                      {/* Info Row */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 mb-3">
                        {account.phone && (
                          <a
                            href={`tel:${account.phone}`}
                            className="inline-flex items-center gap-1 hover:text-[#3B2E7E]"
                          >
                            <PhoneIcon className="w-3.5 h-3.5" />
                            {account.phone}
                          </a>
                        )}
                        {account.industry && (
                          <span>{formatLabel(account.industry)}</span>
                        )}
                        {account.owner?.name && (
                          <span className="text-slate-400">
                            Owner: {account.owner.name}
                          </span>
                        )}
                      </div>

                      {/* Footer Row */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <span className="font-bold text-slate-700">
                              {account._count?.contacts || 0}
                            </span>
                            contacts
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <span className="font-bold text-slate-700">
                              {account._count?.deals || 0}
                            </span>
                            deals
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => navigate(`/accounts/${account.id}`)}
                            className="p-2 text-slate-400 hover:text-[#3B2E7E] hover:bg-[#3B2E7E]/10 rounded-lg transition-all"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          {account.lifecycle !== "DEACTIVATED" &&
                            !["TSE", "KAM"].includes(currentUser?.role) && (
                              <button
                                onClick={() =>
                                  navigate(`/accounts/${account.id}/edit`)
                                }
                                className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                              >
                                <PencilSquareIcon className="w-4 h-4" />
                              </button>
                            )}
                          {["SUPER_ADMIN", "TSL"].includes(currentUser?.role) &&
                            account.lifecycle !== "DEACTIVATED" && (
                              <button
                                onClick={() =>
                                  setDeleteModal({
                                    open: true,
                                    id: account.id,
                                    name: account.accountName,
                                  })
                                }
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            )}
                          {account.lifecycle === "DEACTIVATED" &&
                            ["SUPER_ADMIN", "TSL"].includes(
                              currentUser?.role,
                            ) && (
                              <button
                                onClick={() =>
                                  setRestoreModal({
                                    open: true,
                                    id: account.id,
                                    name: account.accountName,
                                  })
                                }
                                className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                              >
                                ♻️
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Pagination Footer */}
        {!loading && accounts.length > 0 && pagination?.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#3B2E7E]/10 bg-slate-50/50 flex-shrink-0">
            <p className="text-sm text-slate-600">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {(page - 1) * 10 + 1}
              </span>
              {" – "}
              <span className="font-semibold text-slate-800">
                {Math.min(page * 10, pagination.total)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {pagination.total}
              </span>
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-[#3B2E7E]/5 hover:text-[#3B2E7E] hover:border-[#3B2E7E]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>

              <div className="hidden sm:flex items-center gap-1 mx-1">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (pagination.pages <= 5) return true;
                    if (p === 1 || p === pagination.pages) return true;
                    return Math.abs(p - page) <= 1;
                  })
                  .map((p, idx, arr) => {
                    const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                    return (
                      <div key={p} className="flex items-center">
                        {showEllipsis && (
                          <span className="px-1 text-slate-300">…</span>
                        )}
                        <button
                          onClick={() => setPage(p)}
                          className={`w-8 h-8 text-sm font-semibold rounded-lg transition-all ${
                            page === p
                              ? "bg-gradient-to-r from-[#3B2E7E] to-[#2A1F5C] text-white shadow-md shadow-[#3B2E7E]/25"
                              : "text-slate-600 hover:bg-[#3B2E7E]/10 hover:text-[#3B2E7E]"
                          }`}
                        >
                          {p}
                        </button>
                      </div>
                    );
                  })}
              </div>

              <span className="sm:hidden text-sm text-slate-600 px-2 font-medium">
                {page} / {pagination.pages}
              </span>

              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination.pages, p + 1))
                }
                disabled={page === pagination.pages}
                className="w-8 h-8 flex items-center justify-center text-slate-500 bg-white border border-slate-200 rounded-lg hover:bg-[#3B2E7E]/5 hover:text-[#3B2E7E] hover:border-[#3B2E7E]/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() =>
                setDeleteModal({ open: false, id: null, name: "" })
              }
            />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ExclamationTriangleIcon className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Delete Account
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-slate-800">
                    &ldquo;{deleteModal.name}&rdquo;
                  </span>
                  ?
                  <br />
                  <span className="text-xs text-red-500 mt-1 inline-block">
                    This will remove all associated contacts and deals.
                  </span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setDeleteModal({ open: false, id: null, name: "" })
                  }
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Restore Modal */}
      {restoreModal.open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() =>
                setRestoreModal({ open: false, id: null, name: "" })
              }
            />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  ♻️
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Restore Account
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                  Are you sure you want to restore{" "}
                  <span className="font-semibold text-slate-800">
                    “{restoreModal.name}”
                  </span>
                  ?
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setRestoreModal({ open: false, id: null, name: "" })
                  }
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRestore}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl"
                >
                  Restore
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountList;

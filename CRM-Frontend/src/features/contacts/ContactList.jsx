

// src/features/contacts/ContactList.jsx
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchContacts, deleteContact, importContacts } from "./contactSlice";
import { useDebounce } from "../../hooks/useDebounce";
import { formatLabel } from "../../constants";
import Avatar from "../../components/Avatar";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
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
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
import SendCampaignModal from "../email/components/SendCampaignModal";
import CampaignInbox from "../email/components/CampaignInbox";
import EmailTemplateManager from "../email/components/EmailTemplateManager";

// Lead Source Colors
const LEAD_SOURCE_COLORS = {
  WEBSITE: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  REFERRAL: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  LINKEDIN: { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-500" },
  COLD_CALL: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-500",
  },
  TRADE_SHOW: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-500",
  },
  ADVERTISEMENT: {
    bg: "bg-pink-50",
    text: "text-pink-700",
    dot: "bg-pink-500",
  },
  EMAIL_CAMPAIGN: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    dot: "bg-indigo-500",
  },
  PARTNER: { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-500" },
  OTHER: { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-500" },
};

const ContactList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { contacts, pagination, loading } = useSelector((s) => s.contacts);
  const { user: currentUser } = useSelector((s) => s.auth);

  const fileInputRef = useRef(null);
  const currentPageRef = useRef([]);
  const [importing, setImporting] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    name: "",
  });
  const [selectedContacts, setSelectedContacts] = useState([]);

  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const debouncedSearch = useDebounce(search);

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const res = await dispatch(importContacts(file)).unwrap();
      if (res.data?.errors?.length > 0) {
        toast.error(`Import finished with ${res.data.errors.length} errors`);
      }
      toast.success(
        `Import complete! Created: ${res.data?.created}, Updated: ${res.data?.updated}, Skipped: ${res.data?.skipped}`,
      );
    } catch (err) {
      toast.error(err || "Failed to import contacts");
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    dispatch(fetchContacts({ page, limit: 10, search: debouncedSearch }));
  }, [dispatch, page, debouncedSearch]);

  const fetchAllContactsForExport = async () => {
    try {
      // ✅ backup current page data
      currentPageRef.current = contacts;

      const res = await dispatch(
        fetchContacts({
          page: 1,
          limit: 100000, // triggers deals in backend
          search: debouncedSearch,
        }),
      ).unwrap();

      const allData = res?.data || res || [];

      // ✅ restore original page immediately (prevent 164 issue)
      setTimeout(() => {
        dispatch(
          fetchContacts({
            page,
            limit: 10,
            search: debouncedSearch,
          }),
        );
      }, 0);

      return allData;
    } catch (err) {
      toast.error("Failed to fetch data for export");
      return [];
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteContact(deleteModal.id)).unwrap();
      toast.success("Contact deleted successfully");
      setDeleteModal({ open: false, id: null, name: "" });
    } catch (err) {
      toast.error(err || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  const clearFilters = () => {
    setSearch("");
    setPage(1);
  };

  const hasFilters = search;

  const prepareExportData = (data) => {
    const rows = [];

    data.forEach((c) => {
      const deals = c.deals && c.deals.length ? c.deals : [null];

      deals.forEach((d) => {
        rows.push({
          "Contact Name": `${c.firstName || ""} ${c.lastName || ""}`,
          Email: c.email || "",
          Phone: c.phone || "",
          Mobile: c.mobile || "",
          Title: c.title || "",
          Department: c.department || "",

          "Account Name": c.account?.accountName || "",
          Owner: c.owner?.name || "",
          "Lead Source": c.leadSource || "",

          "Deals Count": c._count?.deals || 0,
          "Deal Name": d?.dealName || "",
          "Deal Stage": d?.stage || "",
          "Deal Value": d?.amount || "",

          City: c.mailingCity || "",
          State: c.mailingState || "",
          Country: c.mailingCountry || "",

          "Created Date": c.createdAt
            ? new Date(c.createdAt).toLocaleDateString()
            : "",
          "Last Updated": c.updatedAt
            ? new Date(c.updatedAt).toLocaleDateString()
            : "",
        });
      });
    });

    return rows;
  };

  const exportCSV = async () => {
    const allContacts = await fetchAllContactsForExport();
    const data = prepareExportData(allContacts);

    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `contacts_export_${Date.now()}.csv`);

    setShowExportDropdown(false);
  };

  const exportExcel = async () => {
    const allContacts = await fetchAllContactsForExport();
    const data = prepareExportData(allContacts);

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, `contacts_export_${Date.now()}.xlsx`);

    setShowExportDropdown(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header & Stats Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Contacts
            <span className="text-sm font-medium px-2 py-0.5 bg-slate-100 text-slate-500 rounded-lg">
              {pagination?.total || contacts.length}
            </span>
          </h1>
          <p className="text-xs text-slate-500">Manage and track your customer contacts</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Main Actions */}
          <button
            onClick={() => setShowCampaignModal(true)}
            disabled={!selectedContacts.length}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-40 transition-all shadow-sm"
          >
            <EnvelopeIcon className="w-4 h-4" />
            Campaign
          </button>

          <button
            onClick={() => setShowInbox(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-900 transition-all shadow-sm"
          >
            Inbox
          </button>

          <div className="w-px h-6 bg-slate-200 mx-1" />

          {/* New Contact */}
          {!["TSE", "KAM"].includes(currentUser?.role) && (
            <button
              onClick={() => navigate("/contacts/new")}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#3B2E7E] to-[#2A1F5C] text-white text-xs font-bold rounded-xl hover:shadow-lg hover:shadow-[#3B2E7E]/30 transition-all shadow-md shadow-[#3B2E7E]/20"
            >
              <PlusIcon className="w-4 h-4" />
              New Contact
            </button>
          )}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-[#3B2E7E]/10 shadow-sm shadow-[#3B2E7E]/5 flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-[#3B2E7E]/10 flex-shrink-0 bg-slate-50/50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left side: Search */}
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-full max-w-md">
                <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search contacts..."
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-xl placeholder-slate-400 text-slate-900 focus:border-[#3B2E7E] focus:ring-4 focus:ring-[#3B2E7E]/5 outline-none transition-all shadow-sm"
                />
                {search && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setPage(1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Right side: Filter & Actions */}
            <div className="flex items-center gap-2 self-end lg:self-auto">
              {/* EXPORT */}
              {currentUser?.role !== "TSE" && (
                <div className="relative">
                  <button
                    onClick={() => setShowExportDropdown(!showExportDropdown)}
                    disabled={!contacts.length}
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
                        <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border-b border-slate-100">Full Dataset</div>
                        <button onClick={exportExcel} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#3B2E7E]/5 hover:text-[#3B2E7E]">📊 Export All - Excel</button>
                        <button onClick={exportCSV} className="block w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#3B2E7E]/5 hover:text-[#3B2E7E]">📄 Export All - CSV</button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* TEMPLATE */}
              <button
                onClick={() => setShowTemplateManager(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 text-sm font-bold bg-white text-slate-600 border border-slate-200 rounded-xl hover:border-[#3B2E7E]/30 transition-all shadow-sm"
              >
                Templates
              </button>

              {/* IMPORT */}
              {["SUPER_ADMIN", "TSL"].includes(currentUser?.role) && (
                <>
                  <input type="file" accept=".xlsx, .xls" className="hidden" ref={fileInputRef} onChange={handleImport} />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={importing}
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 text-sm font-bold bg-white text-slate-600 border border-slate-200 rounded-xl hover:border-[#3B2E7E]/30 transition-all disabled:opacity-50 shadow-sm"
                  >
                    {importing ? <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" /> : <ArrowUpTrayIcon className="w-4 h-4" />}
                    <span className="hidden xl:inline">{importing ? "Importing..." : "Import"}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Table Content - This is the part that scrolls */}
        <div className="flex-1 overflow-auto min-h-0 bg-white max-h-[calc(100vh-280px)]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Loading contacts...</p>
            </div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <UserIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No contacts found
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {hasFilters
                ? "Try adjusting your search"
                : "Get started by creating your first contact"}
            </p>
            {!hasFilters && !["TSE", "KAM"].includes(currentUser?.role) && (
              <button
                onClick={() => navigate("/contacts/new")}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-900 to-indigo-950 text-white text-sm font-medium rounded-lg hover:from-purple-800 hover:to-indigo-900 transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-1.5" />
                Create Contact
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-white border-b border-gray-200">
                    <th className="px-4 py-4 text-left">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedContacts(contacts.map((c) => c.id));
                          } else {
                            setSelectedContacts([]);
                          }
                        }}
                      />
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Account
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Owner
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Lead Source
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Deals
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {contacts.map((contact) => {
                    const sourceColor = LEAD_SOURCE_COLORS[
                      contact.leadSource
                    ] || {
                      bg: "bg-gray-50",
                      text: "text-gray-700",
                      dot: "bg-gray-500",
                    };

                    return (
                      <tr
                        key={contact.id}
                        className="hover:bg-gray-50/50 transition-colors duration-150"
                      >
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedContacts.includes(contact.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedContacts([
                                  ...selectedContacts,
                                  contact.id,
                                ]);
                              } else {
                                setSelectedContacts(
                                  selectedContacts.filter(
                                    (id) => id !== contact.id,
                                  ),
                                );
                              }
                            }}
                          />
                        </td>
                        {/* Contact Name with Avatar */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div>
                              <Link
                                to={`/contacts/${contact.id}`}
                                className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                              >
                                {contact.firstName} {contact.lastName}
                              </Link>
                              {contact.title && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {contact.title}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {contact.email ? (
                            <div className="flex items-center gap-2">
                              <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                              <a
                                href={`mailto:${contact.email}`}
                                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                              >
                                {contact.email}
                              </a>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>

                        {/* Phone */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {contact.phone ? (
                            <div className="flex items-center gap-2">
                              <PhoneIcon className="w-4 h-4 text-gray-400" />
                              <a
                                href={`tel:${contact.phone}`}
                                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                              >
                                {contact.phone}
                              </a>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>

                        {/* Account */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {contact.account ? (
                            <div className="flex items-center gap-2">
                              <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                              <Link
                                to={`/accounts/${contact.account.id}`}
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                              >
                                {contact.account.accountName}
                              </Link>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>

                        {/* Owner */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {contact.owner?.name ? (
                            <span className="text-sm text-gray-600">
                              {contact.owner.name}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>



                        {/* Lead Source */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {contact.leadSource ? (
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sourceColor.bg} ${sourceColor.text}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${sourceColor.dot}`}
                              />
                              {formatLabel(contact.leadSource)}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">—</span>
                          )}
                        </td>

                        {/* Deals Count */}
                        <td className="px-6 py-4 whitespace-nowrap text-left">
                          <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                            {contact._count?.deals || 0}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() =>
                                navigate(`/contacts/${contact.id}`)
                              }
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                              title="View Contact"
                            >
                              <EyeIcon className="w-4 h-4" />
                            </button>
                            {!["TSE", "KAM"].includes(currentUser?.role) && (
                              <button
                                onClick={() =>
                                  navigate(`/contacts/${contact.id}/edit`)
                                }
                                className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
                                title="Edit Contact"
                              >
                                <PencilSquareIcon className="w-4 h-4" />
                              </button>
                            )}
                            {["SUPER_ADMIN", "TSL"].includes(currentUser?.role) && (
                              <button
                                onClick={() =>
                                  setDeleteModal({
                                    open: true,
                                    id: contact.id,
                                    name: `${contact.firstName} ${contact.lastName}`,
                                  })
                                }
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                title="Delete Contact"
                              >
                                <TrashIcon className="w-4 h-4" />
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

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-gray-200">
              {contacts.map((contact) => {
                const sourceColor = LEAD_SOURCE_COLORS[contact.leadSource] || {
                  bg: "bg-gray-50",
                  text: "text-gray-700",
                  dot: "bg-gray-500",
                };

                return (
                  <div key={contact.id} className="p-4 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <Link
                            to={`/contacts/${contact.id}`}
                            className="font-semibold text-gray-900 hover:text-blue-600"
                          >
                            {contact.firstName} {contact.lastName}
                          </Link>
                          {contact.title && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              {contact.title}
                            </p>
                          )}
                        </div>
                      </div>
                      </div>

                    {/* Details */}
                    <div className="space-y-2">
                      {contact.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                          <a
                            href={`mailto:${contact.email}`}
                            className="hover:text-blue-600"
                          >
                            {contact.email}
                          </a>
                        </div>
                      )}
                      {contact.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <PhoneIcon className="w-4 h-4 text-gray-400" />
                          <a
                            href={`tel:${contact.phone}`}
                            className="hover:text-blue-600"
                          >
                            {contact.phone}
                          </a>
                        </div>
                      )}
                      {contact.account && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <BuildingOfficeIcon className="w-4 h-4 text-gray-400" />
                          <Link
                            to={`/accounts/${contact.account.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {contact.account.accountName}
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        {contact.leadSource && (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sourceColor.bg} ${sourceColor.text}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${sourceColor.dot}`}
                            />
                            {formatLabel(contact.leadSource)}
                          </span>
                        )}
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                          {contact._count?.deals || 0} deals
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => navigate(`/contacts/${contact.id}`)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        {!["TSE", "KAM"].includes(currentUser?.role) && (
                          <button
                            onClick={() =>
                              navigate(`/contacts/${contact.id}/edit`)
                            }
                            className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          >
                            <PencilSquareIcon className="w-5 h-5" />
                          </button>
                        )}
                        {["SUPER_ADMIN", "TSL"].includes(currentUser?.role) && (
                          <button
                            onClick={() =>
                              setDeleteModal({
                                open: true,
                                id: contact.id,
                                name: `${contact.firstName} ${contact.lastName}`,
                              })
                            }
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <TrashIcon className="w-5 h-5" />
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

      {/* Pagination */}
      {!loading && contacts.length > 0 && pagination?.pages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50 flex-shrink-0">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">{(page - 1) * 10 + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(page * 10, pagination.total)}
            </span>{" "}
            of <span className="font-medium">{pagination.total}</span>{" "}
            contacts
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-1" />
              Previous
            </button>
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .filter((p) => {
                  if (pagination.pages <= 7) return true;
                  if (p === 1 || p === pagination.pages) return true;
                  if (Math.abs(p - page) <= 1) return true;
                  return false;
                })
                .map((p, idx, arr) => {
                  const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                  return (
                    <div key={p} className="flex items-center">
                      {showEllipsis && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                          page === p
                            ? "bg-gradient-to-r from-purple-900 to-indigo-950 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {p}
                      </button>
                    </div>
                  );
                })}
            </div>
            <button
              onClick={() =>
                setPage((p) => Math.min(pagination.pages, p + 1))
              }
              disabled={page === pagination.pages}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRightIcon className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 transition-opacity"
              onClick={() =>
                setDeleteModal({ open: false, id: null, name: "" })
              }
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Contact
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-gray-900">
                      "{deleteModal.name}"
                    </span>
                    ? This action cannot be undone and will remove all
                    associated data.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() =>
                    setDeleteModal({ open: false, id: null, name: "" })
                  }
                  disabled={deleting}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Contact"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* SEND CAMPAIGN MODAL */}
      {showCampaignModal && (
        <SendCampaignModal
          contacts={contacts.filter((c) => selectedContacts.includes(c.id))}
          onClose={() => setShowCampaignModal(false)}
        />
      )}

      {/* CAMPAIGN INBOX */}
      {showInbox && <CampaignInbox onClose={() => setShowInbox(false)} />}

      {/* TEMPLATE MANAGER */}
      {showTemplateManager && (
        <EmailTemplateManager onClose={() => setShowTemplateManager(false)} />
      )}
      </div>
    </div>
  );
};

export default ContactList;

// // src/features/deals/DealForm.jsx
// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   createDeal,
//   updateDeal,
//   fetchDeal,
//   clearCurrentDeal,
// } from "./dealSlice";
// import { fetchUsers } from "../auth/authSlice";
// import { fetchAccountsDropdown } from "../accounts/accountSlice";
// import { fetchContactsDropdown } from "../contacts/contactSlice";
// import Spinner from "../../components/Spinner";
// import toast from "react-hot-toast";
// import {
//   ArrowLeftIcon,
//   CurrencyDollarIcon,
//   BuildingOfficeIcon,
//   UserCircleIcon,
//   CalendarDaysIcon,
//   ChartBarIcon,
//   DocumentTextIcon,
//   TagIcon,
//   ArrowTrendingUpIcon,
//   BriefcaseIcon,
//   SparklesIcon,
//   ShieldCheckIcon,
//   InformationCircleIcon,
//   CheckIcon,
//   ClipboardDocumentListIcon,
//   UserIcon,
//   PhoneIcon,
//   BanknotesIcon,
//   FlagIcon,
//   RocketLaunchIcon,
// } from "@heroicons/react/24/outline";
// import {
//   CurrencyDollarIcon as CurrencyDollarSolid,
// } from "@heroicons/react/24/solid";

// /* ═══════════════════ CONSTANTS ═══════════════════ */

// const STAGES = [
//   "RFQ",
//   "VISIT_MEETING",
//   "PREVIEW",
//   "REGRETTED",
//   "TECHNICAL_PROPOSAL",
//   "COMMERCIAL_PROPOSAL",
//   "REVIEW_FEEDBACK",
//   "MOVED_TO_PURCHASE",
//   "NEGOTIATION",
//   "CLOSED_WON",
//   "CLOSED_LOST",
//   "CLOSED_LOST_TO_COMPETITION",
// ];

// const STAGE_COLORS = {
//   RFQ: "bg-gray-100 text-gray-700 border-gray-300",
//   VISIT_MEETING: "bg-blue-100 text-blue-700 border-blue-300",
//   PREVIEW: "bg-indigo-100 text-indigo-700 border-indigo-300",
//   REGRETTED: "bg-red-100 text-red-700 border-red-300",
//   TECHNICAL_PROPOSAL: "bg-purple-100 text-purple-700 border-purple-300",
//   COMMERCIAL_PROPOSAL: "bg-yellow-100 text-yellow-700 border-yellow-300",
//   REVIEW_FEEDBACK: "bg-orange-100 text-orange-700 border-orange-300",
//   MOVED_TO_PURCHASE: "bg-cyan-100 text-cyan-700 border-cyan-300",
//   NEGOTIATION: "bg-amber-100 text-amber-700 border-amber-300",
//   CLOSED_WON: "bg-green-100 text-green-700 border-green-300",
//   CLOSED_LOST: "bg-red-100 text-red-700 border-red-300",
//   CLOSED_LOST_TO_COMPETITION: "bg-rose-100 text-rose-700 border-rose-300",
// };

// const PRODUCT_GROUPS = [
//   "MTS_PRO",
//   "MTS_STANDARD",
//   "FACTEYES",
//   "MTS_ASSEMBLY",
// ];

// const WEIGHTAGES = [
//   "PROBABILITY",
//   "BALLPARK_OFFER",
//   "BUDGETARY_OFFER",
//   "DETAIL_L1",
//   "DETAIL_L2",
//   "FIRM_AFTER_PRICE_FINALIZATION",
//   "TECHNICAL_ONLY",
// ];

// const initialForm = {
//   dealName: "",
//   amount: "",
//   expectedRevenue: "",
//   closingDate: "",
//   stage: "RFQ",
//   dealOwnerId: "",
//   personInCharge: "",
//   accountId: "",
//   contactId: "",
//   productGroup: "",
//   weightage: "",
//   nextStep: "",
//   description: "",
// };

// /* ═══════════════════ REUSABLE SUB‑COMPONENTS ═══════════════════ */

// const SectionHeader = ({ icon: Icon, title, subtitle, color = "blue" }) => {
//   const colors = {
//     blue: "from-blue-500 to-indigo-600",
//     green: "from-green-500 to-emerald-600",
//     purple: "from-purple-500 to-violet-600",
//     amber: "from-amber-500 to-orange-600",
//     gray: "from-gray-500 to-gray-600",
//   };

//   return (
//     <div className="flex items-center gap-3 mb-5">
//       <div
// src/features/deals/DealForm.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  createDeal,
  updateDeal,
  fetchDeal,
  clearCurrentDeal,
} from "./dealSlice";
import { fetchUsers } from "../auth/authSlice";
import { fetchAccountsDropdown } from "../accounts/accountSlice";
import { fetchContactsDropdown } from "../contacts/contactSlice";
import Spinner from "../../components/Spinner";
import toast from "react-hot-toast";
import { DEAL_STATUSES, formatLabel } from "../../constants";
import {
  ArrowLeftIcon,
  CurrencyRupeeIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  DocumentTextIcon,
  TagIcon,
  ArrowTrendingUpIcon,
  BriefcaseIcon,
  SparklesIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  CheckIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  BanknotesIcon,
  FlagIcon,
  RocketLaunchIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon as CheckCircleSolid,
  SparklesIcon as SparklesSolid,
} from "@heroicons/react/24/solid";

/* ═══════════════════ CONSTANTS ═══════════════════ */

const STAGES = [
  { id: "RFQ", label: "RFQ", color: "slate" },
  { id: "VISIT_MEETING", label: "Visit/Meeting", color: "blue" },
  { id: "PREVIEW", label: "Preview", color: "indigo" },
  { id: "REGRETTED", label: "Regretted", color: "red" },
  { id: "TECHNICAL_PROPOSAL", label: "Technical Proposal", color: "purple" },
  { id: "COMMERCIAL_PROPOSAL", label: "Commercial Proposal", color: "amber" },
  { id: "REVIEW_FEEDBACK", label: "Review/Feedback", color: "orange" },
  { id: "MOVED_TO_PURCHASE", label: "Moved to Purchase", color: "cyan" },
  { id: "NEGOTIATION", label: "Negotiation", color: "yellow" },
  { id: "CLOSED_WON", label: "Closed Won", color: "emerald" },
  { id: "CLOSED_LOST", label: "Closed Lost", color: "rose" },
  {
    id: "CLOSED_LOST_TO_COMPETITION",
    label: "Lost to Competition",
    color: "red",
  },
];

const STAGE_COLORS = {
  slate: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-300",
    ring: "ring-slate-400",
    dot: "bg-slate-500",
  },
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-300",
    ring: "ring-blue-400",
    dot: "bg-blue-500",
  },
  indigo: {
    bg: "bg-indigo-100",
    text: "text-indigo-700",
    border: "border-indigo-300",
    ring: "ring-indigo-400",
    dot: "bg-indigo-500",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-300",
    ring: "ring-purple-400",
    dot: "bg-purple-500",
  },
  amber: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-300",
    ring: "ring-amber-400",
    dot: "bg-amber-500",
  },
  orange: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-300",
    ring: "ring-orange-400",
    dot: "bg-orange-500",
  },
  cyan: {
    bg: "bg-cyan-100",
    text: "text-cyan-700",
    border: "border-cyan-300",
    ring: "ring-cyan-400",
    dot: "bg-cyan-500",
  },
  yellow: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-300",
    ring: "ring-yellow-400",
    dot: "bg-yellow-500",
  },
  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-300",
    ring: "ring-emerald-400",
    dot: "bg-emerald-500",
  },
  rose: {
    bg: "bg-rose-100",
    text: "text-rose-700",
    border: "border-rose-300",
    ring: "ring-rose-400",
    dot: "bg-rose-500",
  },
  red: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-300",
    ring: "ring-red-400",
    dot: "bg-red-500",
  },
};

const PRODUCT_GROUPS = [
  {
    id: "MTS_PRO",
    label: "MTS Pro",
    icon: "🚀",
    description: "Premium solution",
  },
  {
    id: "MTS_STANDARD",
    label: "MTS Standard",
    icon: "📦",
    description: "Standard package",
  },
  {
    id: "FACTEYES",
    label: "Facteyes",
    icon: "👁️",
    description: "Vision system",
  },
  {
    id: "MTS_ASSEMBLY",
    label: "MTS Assembly",
    icon: "🔧",
    description: "Assembly line",
  },
];

const WEIGHTAGES = [
  { id: "PROBABILITY", label: "Probability", percentage: "10%" },
  { id: "BALLPARK_OFFER", label: "Ballpark Offer", percentage: "25%" },
  { id: "BUDGETARY_OFFER", label: "Budgetary Offer", percentage: "40%" },
  { id: "DETAIL_L1", label: "Detail L1", percentage: "60%" },
  { id: "DETAIL_L2", label: "Detail L2", percentage: "75%" },
  {
    id: "FIRM_AFTER_PRICE_FINALIZATION",
    label: "Firm After Price",
    percentage: "90%",
  },
  { id: "TECHNICAL_ONLY", label: "Technical Only", percentage: "—" },
];

const STATUS_OPTIONS = DEAL_STATUSES.map((s) => ({
  id: s,
  label: formatLabel(s),
}));

const initialForm = {
  dealName: "",
  amount: "",
  expectedRevenue: "",
  closingDate: "",
  stage: "RFQ",
  dealOwnerId: "",
  personInCharge: "",
  accountId: "",
  contactId: "",
  productGroup: "",
  weightage: "",
  nextStep: "",
  description: "",
  status: "IN_PROGRESS",
};

/* ═══════════════════ CUSTOM DROPDOWN COMPONENT ═══════════════════ */

const CustomDropdown = ({
  label,
  icon: Icon,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  required,
  hint,
  disabled,
  searchable = true,
  name,
  error,
  getOptionValue: customGetOptionValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [dropdownStyle, setDropdownStyle] = useState({});

  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Get display label for an option
  const getOptionLabel = useCallback((opt) => {
    if (!opt) return "";
    return (
      opt.name ||
      opt.accountName ||
      opt.label ||
      `${opt.firstName || ""} ${opt.lastName || ""}`.trim()
    );
  }, []);

  const getOptionValue = useCallback(
    (opt) => {
      if (!opt) return "";
      if (customGetOptionValue) return customGetOptionValue(opt);
      return opt.id;
    },
    [customGetOptionValue],
  );

  // Find selected option
  const selectedOption = options.find((opt) => getOptionValue(opt) === value);

  // Filter options based on search
  const filteredOptions = options.filter((opt) =>
    getOptionLabel(opt).toLowerCase().includes(search.toLowerCase()),
  );

  // Calculate and update dropdown position
  const updateDropdownPosition = useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    const dropdownHeight = 340;

    const showAbove = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

    setDropdownStyle({
      position: "fixed",
      left: triggerRect.left,
      width: triggerRect.width,
      top: showAbove
        ? triggerRect.top - dropdownHeight - 4
        : triggerRect.bottom + 4,
      maxHeight: dropdownHeight,
      zIndex: 99999,
    });
  }, [filteredOptions.length]);

  // Handle opening/closing
  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();

      // Focus search input
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 10);

      // Update position on scroll/resize
      const handlePositionUpdate = () => updateDropdownPosition();
      window.addEventListener("scroll", handlePositionUpdate, true);
      window.addEventListener("resize", handlePositionUpdate);

      return () => {
        window.removeEventListener("scroll", handlePositionUpdate, true);
        window.removeEventListener("resize", handlePositionUpdate);
      };
    }
  }, [isOpen, updateDropdownPosition]);

  // Handle click outside - check both trigger and dropdown
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      const clickedTrigger = triggerRef.current?.contains(event.target);
      const clickedDropdown = dropdownRef.current?.contains(event.target);

      if (!clickedTrigger && !clickedDropdown) {
        setIsOpen(false);
        setSearch("");
        setHighlightedIndex(0);
      }
    };

    // Use mousedown for immediate response
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Handle option selection
  const handleSelect = useCallback(
    (opt) => {
      const newValue = getOptionValue(opt);
      onChange({ target: { name, value: newValue } });
      setIsOpen(false);
      setSearch("");
      setHighlightedIndex(0);
    },
    [getOptionValue, name, onChange],
  );

  // Handle clear
  const handleClear = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      onChange({ target: { name, value: "" } });
    },
    [name, onChange],
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e) => {
      if (disabled) return;

      switch (e.key) {
        case "Enter":
          e.preventDefault();
          if (isOpen && filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex]);
          } else if (!isOpen) {
            setIsOpen(true);
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex((prev) =>
              prev < filteredOptions.length - 1 ? prev + 1 : 0,
            );
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (isOpen) {
            setHighlightedIndex((prev) =>
              prev > 0 ? prev - 1 : filteredOptions.length - 1,
            );
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSearch("");
          setHighlightedIndex(0);
          break;
        case "Tab":
          setIsOpen(false);
          setSearch("");
          break;
        default:
          break;
      }
    },
    [disabled, isOpen, filteredOptions, highlightedIndex, handleSelect],
  );

  // Render option content based on type
  const renderOptionContent = useCallback(
    (opt, isSelected) => {
      // For accounts
      if (opt.accountName) {
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B2E7E] to-[#5A4A9C] flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
              {opt.accountName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm truncate ${isSelected ? "font-bold text-[#3B2E7E]" : "font-medium text-slate-800"}`}
              >
                {opt.accountName}
              </p>
              {opt.industry && (
                <p className="text-xs text-slate-500 truncate">
                  {opt.industry}
                </p>
              )}
            </div>
          </div>
        );
      }

      // For contacts
      if (opt.firstName) {
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
              {opt.firstName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm truncate ${isSelected ? "font-bold text-[#3B2E7E]" : "font-medium text-slate-800"}`}
              >
                {opt.firstName} {opt.lastName || ""}
              </p>
              {opt.email && (
                <p className="text-xs text-slate-500 truncate">{opt.email}</p>
              )}
            </div>
          </div>
        );
      }

      // For users (deal owner)
      if (opt.name && !opt.label) {
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-sm">
              {opt.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm truncate ${isSelected ? "font-bold text-[#3B2E7E]" : "font-medium text-slate-800"}`}
              >
                {opt.name}
              </p>
              {opt.email && (
                <p className="text-xs text-slate-500 truncate">{opt.email}</p>
              )}
            </div>
          </div>
        );
      }

      // For product groups (with emoji icon)
      if (opt.icon) {
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">
              {opt.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm truncate ${isSelected ? "font-bold text-[#3B2E7E]" : "font-medium text-slate-800"}`}
              >
                {opt.label}
              </p>
              {opt.description && (
                <p className="text-xs text-slate-500 truncate">
                  {opt.description}
                </p>
              )}
            </div>
          </div>
        );
      }

      // For weightages (with percentage badge)
      if (opt.percentage) {
        return (
          <div className="flex items-center justify-between w-full gap-3">
            <span
              className={`text-sm ${isSelected ? "font-bold text-[#3B2E7E]" : "font-medium text-slate-800"}`}
            >
              {opt.label}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0 ${
                opt.percentage === "—"
                  ? "bg-slate-100 text-slate-500"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {opt.percentage}
            </span>
          </div>
        );
      }

      // Default fallback
      return (
        <span
          className={`text-sm ${isSelected ? "font-bold text-[#3B2E7E]" : "font-medium text-slate-800"}`}
        >
          {getOptionLabel(opt)}
        </span>
      );
    },
    [getOptionLabel],
  );

  // Render selected value in trigger
  const renderSelectedValue = useCallback(() => {
    if (!selectedOption) {
      return (
        <span className="text-sm font-semibold text-slate-800 truncate">
          {value || placeholder}
        </span>
      );
    }

    // For accounts
    if (selectedOption.accountName) {
      return (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#3B2E7E] to-[#5A4A9C] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {selectedOption.accountName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-slate-800 truncate">
            {selectedOption.accountName}
          </span>
        </div>
      );
    }

    // For contacts
    if (selectedOption.firstName) {
      return (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {selectedOption.firstName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-slate-800 truncate">
            {selectedOption.firstName} {selectedOption.lastName || ""}
          </span>
        </div>
      );
    }

    // For users
    if (selectedOption.name && !selectedOption.label) {
      return (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {selectedOption.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-slate-800 truncate">
            {selectedOption.name}
          </span>
        </div>
      );
    }

    // For product groups
    if (selectedOption.icon) {
      return (
        <div className="flex items-center gap-2.5">
          <span className="text-lg">{selectedOption.icon}</span>
          <span className="text-sm font-semibold text-slate-800 truncate">
            {selectedOption.label}
          </span>
        </div>
      );
    }

    // For weightages
    if (selectedOption.percentage) {
      return (
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-semibold text-slate-800 truncate">
            {selectedOption.label}
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
            {selectedOption.percentage}
          </span>
        </div>
      );
    }

    // Default
    return (
      <span className="text-sm font-semibold text-slate-800 truncate">
        {getOptionLabel(selectedOption)}
      </span>
    );
  }, [selectedOption, placeholder, getOptionLabel]);

  // Dropdown content to render in portal
  const dropdownContent = isOpen ? (
    <div
      ref={dropdownRef}
      style={dropdownStyle}
      className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
    >
      {/* Search Input */}
      {searchable && options.length > 4 && (
        <div className="p-3 border-b border-slate-100 flex-shrink-0">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setHighlightedIndex(0);
              }}
              placeholder="Type to search..."
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B2E7E]/20 focus:border-[#3B2E7E] focus:bg-white transition-all"
              onKeyDown={handleKeyDown}
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  searchInputRef.current?.focus();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200 transition-colors"
              >
                <XMarkIcon className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Options List */}
      <div className="overflow-y-auto flex-1 overscroll-contain">
        {filteredOptions.length > 0 ? (
          <div className="py-2">
            {filteredOptions.map((opt, index) => {
              const optValue = getOptionValue(opt);
              const isSelected = optValue === value;
              const isHighlighted = index === highlightedIndex;

              return (
                <button
                  key={optValue}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150
                    ${isHighlighted ? "bg-[#3B2E7E]/5" : ""}
                    ${isSelected ? "bg-[#3B2E7E]/10" : ""}
                    hover:bg-[#3B2E7E]/5
                  `}
                >
                  <div className="flex-1 min-w-0">
                    {renderOptionContent(opt, isSelected)}
                  </div>
                  {isSelected && (
                    <CheckCircleSolid className="w-5 h-5 text-[#3B2E7E] flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="py-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <MagnifyingGlassIcon className="w-7 h-7 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-500">
              {search ? `No results for "${search}"` : "No options available"}
            </p>
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-sm text-[#3B2E7E] font-medium mt-2 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
        {Icon && <Icon className="w-3.5 h-3.5 text-[#3B2E7E]" />}
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>

      {/* Trigger Button */}
      <div ref={triggerRef}>
        <button
          type="button"
          onClick={() => {
            if (!disabled) {
              setIsOpen(!isOpen);
              if (!isOpen) {
                setHighlightedIndex(0);
                setSearch("");
              }
            }
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`
            w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border-2 text-left
            transition-all duration-200 bg-white
            ${
              isOpen
                ? "border-[#3B2E7E] ring-4 ring-[#3B2E7E]/10 shadow-md"
                : error
                  ? "border-rose-300 hover:border-rose-400"
                  : "border-slate-200 hover:border-[#3B2E7E]/40 hover:shadow-sm"
            }
            ${disabled ? "bg-slate-50 cursor-not-allowed opacity-60" : "cursor-pointer"}
          `}
        >
          <div className="flex-1 min-w-0 overflow-hidden">
            {renderSelectedValue()}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {value && !disabled && (
              <span
                role="button"
                tabIndex={-1}
                onClick={handleClear}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <XMarkIcon className="w-4 h-4 text-slate-400 hover:text-slate-600" />
              </span>
            )}
            <ChevronUpDownIcon
              className={`w-5 h-5 transition-colors ${isOpen ? "text-[#3B2E7E]" : "text-slate-400"}`}
            />
          </div>
        </button>
      </div>

      {/* Hint / Error */}
      {hint && !error && (
        <p className="flex items-center gap-1.5 text-xs text-slate-400">
          <InformationCircleIcon className="w-3.5 h-3.5 flex-shrink-0" />
          {hint}
        </p>
      )}
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-rose-500 font-medium">
          <ExclamationCircleIcon className="w-3.5 h-3.5 flex-shrink-0" />
          {error}
        </p>
      )}

      {/* Portal for Dropdown */}
      {createPortal(dropdownContent, document.body)}
    </div>
  );
};

/* ═══════════════════ REUSABLE SUB‑COMPONENTS ═══════════════════ */

const SectionCard = ({
  icon: Icon,
  title,
  subtitle,
  children,
  gradient = "purple",
}) => {
  const gradients = {
    purple: "from-[#3B2E7E] to-[#2A1F5C]",
    emerald: "from-emerald-500 to-emerald-600",
    amber: "from-amber-500 to-amber-600",
    rose: "from-rose-500 to-rose-600",
    sky: "from-sky-500 to-sky-600",
    slate: "from-slate-500 to-slate-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-[#3B2E7E]/10 shadow-sm shadow-[#3B2E7E]/5 overflow-hidden">
      <div className="px-6 py-5 border-b border-[#3B2E7E]/10 bg-gradient-to-r from-[#3B2E7E]/5 to-transparent">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradients[gradient]} flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

const FormInput = ({
  label,
  icon: Icon,
  required,
  hint,
  error,
  prefix,
  suffix,
  ...props
}) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
      {Icon && <Icon className="w-3.5 h-3.5 text-[#3B2E7E]" />}
      {label}
      {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative group">
      {prefix && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-semibold pointer-events-none">
          {prefix}
        </span>
      )}
      <input
        {...props}
        className={`
          w-full rounded-xl border-2 bg-white text-sm text-slate-800 font-medium
          placeholder:text-slate-400 placeholder:font-normal
          transition-all duration-200
          focus:outline-none focus:ring-4 focus:ring-[#3B2E7E]/10 focus:border-[#3B2E7E]
          disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed disabled:border-slate-200
          ${prefix ? "pl-9" : "pl-4"} ${suffix ? "pr-12" : "pr-4"} py-3.5
          ${
            error
              ? "border-rose-300 focus:ring-rose-100 focus:border-rose-400"
              : "border-slate-200 hover:border-[#3B2E7E]/40"
          }
        `}
      />
      {suffix && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
    {hint && !error && (
      <p className="flex items-center gap-1.5 text-xs text-slate-400">
        <InformationCircleIcon className="w-3.5 h-3.5 flex-shrink-0" />
        {hint}
      </p>
    )}
    {error && (
      <p className="flex items-center gap-1.5 text-xs text-rose-500 font-medium">
        <ExclamationCircleIcon className="w-3.5 h-3.5 flex-shrink-0" />
        {error}
      </p>
    )}
  </div>
);

/* ═══════════════════ STAGE SELECTOR ═══════════════════ */

const StageSelector = ({ value, onChange }) => {
  const currentIndex = STAGES.findIndex((s) => s.id === value);

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="relative">
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#3B2E7E] to-[#5A4A9C] rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / STAGES.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-slate-500">Start</span>
          <span className="text-xs font-semibold text-[#3B2E7E]">
            Stage {currentIndex + 1} of {STAGES.length}
          </span>
          <span className="text-xs text-slate-500">Close</span>
        </div>
      </div>

      {/* Stage Chips */}
      <div className="flex flex-wrap gap-2">
        {STAGES.map((stage, index) => {
          const isActive = value === stage.id;
          const isPast = index < currentIndex;
          const colors = STAGE_COLORS[stage.color];

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() =>
                onChange({ target: { name: "stage", value: stage.id } })
              }
              className={`
                relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold
                border-2 transition-all duration-200
                ${
                  isActive
                    ? `${colors.bg} ${colors.text} ${colors.border} ring-4 ring-offset-1 ${colors.ring}/20 shadow-sm`
                    : isPast
                      ? "bg-slate-50 text-slate-500 border-slate-200"
                      : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }
              `}
            >
              {isActive && (
                <span
                  className={`w-2 h-2 rounded-full ${colors.dot} animate-pulse`}
                />
              )}
              {isPast && <CheckIcon className="w-3.5 h-3.5 text-emerald-500" />}
              {stage.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ═══════════════════ FORM PROGRESS ═══════════════════ */

const FormProgress = ({ form }) => {
  const fields = [
    { key: "dealName", label: "Lead Name", icon: SparklesIcon },
    { key: "accountId", label: "Account", icon: BuildingOfficeIcon },
    { key: "amount", label: "Amount", icon: CurrencyRupeeIcon },
    { key: "closingDate", label: "Closing Date", icon: CalendarDaysIcon },
    { key: "stage", label: "Stage", icon: FlagIcon },
    { key: "productGroup", label: "Product Group", icon: TagIcon },
  ];

  const filled = fields.filter((f) => form[f.key]).length;
  const pct = Math.round((filled / fields.length) * 100);

  return (
    <div className="bg-gradient-to-br from-[#3B2E7E] to-[#2A1F5C] rounded-2xl p-6 text-white relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-200">
            Form Progress
          </h4>
          <div className="flex items-center gap-2">
            {pct === 100 && (
              <SparklesSolid className="w-4 h-4 text-amber-400" />
            )}
            <span
              className={`text-2xl font-extrabold ${pct === 100 ? "text-emerald-400" : "text-white"}`}
            >
              {pct}%
            </span>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden mb-6">
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${
              pct === 100
                ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                : "bg-gradient-to-r from-white/80 to-white"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Field Checklist */}
        <div className="space-y-3">
          {fields.map((f) => {
            const done = Boolean(form[f.key]);
            return (
              <div key={f.key} className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    done
                      ? "bg-emerald-400/20 text-emerald-400"
                      : "bg-white/10 text-white/40"
                  }`}
                >
                  {done ? (
                    <CheckIcon className="w-4 h-4" />
                  ) : (
                    <f.icon className="w-3.5 h-3.5" />
                  )}
                </div>
                <span
                  className={`text-sm font-medium transition-all ${
                    done ? "text-white" : "text-white/50"
                  }`}
                >
                  {f.label}
                </span>
                {done && (
                  <CheckCircleSolid className="w-4 h-4 text-emerald-400 ml-auto" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════ CURRENT STAGE CARD ═══════════════════ */

const CurrentStageCard = ({ stage }) => {
  const currentStage = STAGES.find((s) => s.id === stage);
  const colors = currentStage
    ? STAGE_COLORS[currentStage.color]
    : STAGE_COLORS.slate;

  const getMessage = () => {
    switch (stage) {
      case "CLOSED_WON":
        return "🎉 Congratulations on closing!";
      case "CLOSED_LOST":
        return "Next one's a winner!";
      case "CLOSED_LOST_TO_COMPETITION":
        return "Learn and come back stronger!";
      case "NEGOTIATION":
        return "Final stretch!";
      case "MOVED_TO_PURCHASE":
        return "Almost there!";
      case "RFQ":
        return "Good luck!";
      default:
        return "Keep moving forward!";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#3B2E7E]/10 p-5 shadow-sm">
      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
        Current Stage
      </h4>
      <div
        className={`inline-flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 ${colors.bg} ${colors.text} ${colors.border}`}
      >
        <span
          className={`w-2.5 h-2.5 rounded-full ${colors.dot} animate-pulse`}
        />
        <span className="font-bold text-sm">
          {currentStage?.label || stage.replaceAll("_", " ")}
        </span>
      </div>
      <p className="text-xs text-slate-500 mt-3">{getMessage()}</p>
    </div>
  );
};

/* ═══════════════════ TIPS CARD ═══════════════════ */

// const TipsCard = () => (
//   <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/50 p-5">
//     <div className="flex items-center gap-2 mb-3">
//       <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
//         <SparklesSolid className="w-4 h-4 text-amber-600" />
//       </div>
//       <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">
//         Pro Tips
//       </h4>
//     </div>
//     <ul className="space-y-2.5 text-xs text-amber-700">
//       <li className="flex items-start gap-2">
//         <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
//         Link leads to accounts for better tracking
//       </li>
//       <li className="flex items-start gap-2">
//         <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
//         Set realistic closing dates
//       </li>
//       <li className="flex items-start gap-2">
//         <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
//         Update stages as you progress
//       </li>
//     </ul>
//   </div>
// );

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */

const DealForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { deal, detailLoading } = useSelector((s) => s.deals);
  const { users, user } = useSelector((s) => s.auth);
  const { dropdown: accounts, loading: accountsLoading } = useSelector((s) => s.accounts);
  const { dropdown: contacts } = useSelector((s) => s.contacts);

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  /* ── load ── */
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAccountsDropdown());
    if (isEdit) dispatch(fetchDeal(id));
    return () => dispatch(clearCurrentDeal());
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (form.accountId) {
      dispatch(fetchContactsDropdown({ accountId: form.accountId }));
    }
  }, [dispatch, form.accountId]);

  /* ── prefill ── */
  useEffect(() => {
    if (isEdit && deal) {
      setForm({
        ...initialForm,
        ...deal,
        stage: (deal.stage || "RFQ").toUpperCase(),
        personInCharge: deal.personInCharge || "",
        closingDate: deal.closingDate?.slice(0, 10),
      });
      if (deal.accountId) {
        dispatch(fetchContactsDropdown({ accountId: deal.accountId }));
      }
    } else if (user) {
      setForm((prev) => ({ ...prev, dealOwnerId: user.id }));
    }
  }, [deal, isEdit, user, dispatch]);

  /* ── change ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "accountId" && value !== prev.accountId
        ? { contactId: "" }
        : {}),
    }));
  };

  /* ── submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ validation (moved inside submit)
    if (!form.dealName) {
      toast.error("Lead name is required");
      return;
    }

    if (!form.accountId) {
      toast.error("Account is required");
      return;
    }

    if (!form.closingDate) {
      toast.error("Closing date is required");
      return;
    }

    setSubmitting(true);

    try {
      let payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, v || null]),
      );

      // ✅ enforce owner for SALES_REP (security fix)
      if (user?.role === "SALES_REP") {
        payload.dealOwnerId = user.id;
      }

      if (isEdit) {
        await dispatch(updateDeal({ id, ...payload })).unwrap();
        toast.success("Lead updated successfully");
      } else {
        await dispatch(createDeal(payload)).unwrap();
        toast.success("Lead created successfully");
      }

      navigate("/deals");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && detailLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-sm text-slate-500 mt-4">Loading lead...</p>
        </div>
      </div>
    );
  }

  /* ═══════════════════ RENDER ═══════════════════ */

  return (
    <div className="max-w-7xl mx-auto pb-10">
      {/* ─── HEADER ─── */}
      <div className="relative bg-gradient-to-b from-[#3B2E7E] to-[#2A1F5C] rounded-3xl p-8 mb-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-300 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        {/* Decorative Circles */}
        <div className="absolute top-6 right-6 w-20 h-20 border border-white/10 rounded-full" />
        <div className="absolute top-10 right-10 w-12 h-12 border border-white/10 rounded-full" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/deals")}
              className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all border border-white/10"
            >
              <ArrowLeftIcon className="w-5 h-5 text-white" />
            </button>

            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                  isEdit
                    ? "bg-gradient-to-br from-amber-400 to-orange-500"
                    : "bg-white/20 backdrop-blur-sm"
                }`}
              >
                {isEdit ? (
                  <CurrencyRupeeIcon className="w-7 h-7 text-white" />
                ) : (
                  <RocketLaunchIcon className="w-7 h-7 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {isEdit ? "Edit Lead" : "Create New Lead"}
                </h1>
                <p className="text-purple-200 mt-1">
                  {isEdit
                    ? `Updating ${deal?.dealLogId || "lead"}`
                    : "Fill in the details to create a new lead"}
                </p>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/deals")}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl text-sm font-semibold transition-all border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="deal-form"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#3B2E7E] rounded-xl text-sm font-semibold hover:bg-purple-50 shadow-lg shadow-[#2A1F5C]/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#3B2E7E] border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4" />
                  {isEdit ? "Update Lead" : "Create Lead"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ─── FORM GRID ─── */}
      <form
        id="deal-form"
        onSubmit={handleSubmit}
        className="grid lg:grid-cols-4 gap-8"
      >
        {/* ══════ LEFT COLUMN (3/4) ══════ */}
        <div className="lg:col-span-3 space-y-8">
          {/* ── DEAL INFO SECTION ── */}
          <SectionCard
            icon={BriefcaseIcon}
            title="Deal Information"
            subtitle="Basic details about the deal"
            gradient="purple"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              {isEdit && (
                <FormInput
                  label="Lead Log ID"
                  icon={ClipboardDocumentListIcon}
                  value={deal?.dealLogId || ""}
                  disabled
                  hint="Auto-generated identifier"
                />
              )}

              <FormInput
                name="dealName"
                label="Lead Name"
                icon={SparklesIcon}
                value={form.dealName}
                onChange={handleChange}
                required
                placeholder="Enter lead name"
                hint="Give this lead a descriptive name"
              />

              <CustomDropdown
                name="dealOwnerId"
                label="Deal Owner"
                icon={ShieldCheckIcon}
                value={form.dealOwnerId}
                onChange={handleChange}
                disabled={user?.role === "SALES_REP"}
                options={
                  user?.role === "SALES_REP"
                    ? [{ id: user.id, name: user.name }]
                    : users
                }
                placeholder="Select owner"
              />



              <CustomDropdown
                name="personInCharge"
                label="Person In Charge"
                icon={UserIcon}
                value={form.personInCharge}
                onChange={handleChange}
                options={users}
                getOptionValue={(opt) => opt.name}
                placeholder="Select person in charge"
                hint="Only this person can create quotations"
              />

              <CustomDropdown
                name="status"
                label="Deal Status"
                icon={FlagIcon}
                value={form.status}
                onChange={handleChange}
                options={STATUS_OPTIONS}
                placeholder="Select status"
              />
            </div>
          </SectionCard>

          {/* ── ACCOUNT & CONTACT ── */}
          <SectionCard
            icon={BuildingOfficeIcon}
            title="Account & Contact"
            subtitle="Link this deal to an account and contact"
            gradient="purple"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <CustomDropdown
                name="accountId"
                label="Account"
                icon={BuildingOfficeIcon}
                value={form.accountId}
                onChange={handleChange}
                options={accounts}
                required
                placeholder={accountsLoading ? "Loading..." : "Search and select account..."}
                hint="Contacts will load based on selected account"
              />

              <CustomDropdown
                name="contactId"
                label="Contact"
                icon={UserCircleIcon}
                value={form.contactId}
                onChange={handleChange}
                options={contacts}
                disabled={!form.accountId}
                placeholder={
                  form.accountId
                    ? "Search and select contact..."
                    : "Select an account first"
                }
                hint={
                  !form.accountId
                    ? "Choose an account to see contacts"
                    : undefined
                }
              />
            </div>
          </SectionCard>

          {/* ── FINANCIALS ── */}
          <SectionCard
            icon={BanknotesIcon}
            title="Financial Details"
            subtitle="Deal value and revenue expectations"
            gradient="emerald"
          >
            <div className="grid sm:grid-cols-3 gap-6">
              <FormInput
                name="amount"
                label="Lead Amount"
                icon={CurrencyRupeeIcon}
                type="number"
                value={form.amount}
                onChange={handleChange}
                placeholder="0"
                prefix="₹"
                hint="Total value of the lead"
              />

              <FormInput
                name="expectedRevenue"
                label="Expected Revenue"
                icon={ArrowTrendingUpIcon}
                type="number"
                value={form.expectedRevenue}
                onChange={handleChange}
                placeholder="0"
                prefix="₹"
                hint="Projected revenue"
              />

              <FormInput
                name="closingDate"
                label="Closing Date"
                icon={CalendarDaysIcon}
                type="date"
                value={form.closingDate}
                onChange={handleChange}
                required
                hint="Expected close date"
              />
            </div>
          </SectionCard>

          {/* ── STAGE SELECTOR ── */}
          <SectionCard
            icon={FlagIcon}
            title="Pipeline Stage"
            subtitle="Current position in your sales pipeline"
            gradient="amber"
          >
            <StageSelector value={form.stage} onChange={handleChange} />
          </SectionCard>

          {/* ── CLASSIFICATION ── */}
          <SectionCard
            icon={TagIcon}
            title="Classification"
            subtitle="Categorize and prioritize this deal"
            gradient="purple"
          >
            <div className="grid sm:grid-cols-3 gap-6">
              <CustomDropdown
                name="productGroup"
                label="Product Group"
                icon={TagIcon}
                value={form.productGroup}
                onChange={handleChange}
                options={PRODUCT_GROUPS}
                placeholder="Select product"
              />

              <CustomDropdown
                name="weightage"
                label="Weightage"
                icon={ChartBarIcon}
                value={form.weightage}
                onChange={handleChange}
                options={WEIGHTAGES}
                placeholder="Select weightage"
                hint="Deal probability level"
              />

              <FormInput
                name="nextStep"
                label="Next Step"
                icon={ArrowTrendingUpIcon}
                value={form.nextStep}
                onChange={handleChange}
                placeholder="e.g., Schedule demo"
                hint="Next action for this deal"
              />
            </div>
          </SectionCard>

          {/* ── DESCRIPTION ── */}
          <SectionCard
            icon={DocumentTextIcon}
            title="Additional Notes"
            subtitle="Any extra information about this deal"
            gradient="slate"
          >
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <DocumentTextIcon className="w-3.5 h-3.5 text-[#3B2E7E]" />
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="Add any notes, context, or special requirements for this deal..."
                className="w-full rounded-xl border-2 border-slate-200 bg-white text-sm text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal px-4 py-3.5 transition-all duration-200 hover:border-[#3B2E7E]/40 focus:outline-none focus:ring-4 focus:ring-[#3B2E7E]/10 focus:border-[#3B2E7E] resize-none"
              />
            </div>
          </SectionCard>

          {/* ── MOBILE ACTIONS ── */}
          <div className="flex lg:hidden items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate("/deals")}
              className="flex-1 px-6 py-3.5 border-2 border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#3B2E7E] to-[#2A1F5C] text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-[#3B2E7E]/30 transition-all duration-200 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4" />
                  {isEdit ? "Update" : "Create"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* ══════ RIGHT SIDEBAR (1/4) ══════ */}
        <div className="space-y-6">
          {/* Form Progress */}
          <FormProgress form={form} />

          {/* Current Stage */}
          <CurrentStageCard stage={form.stage} />

          {/* Tips Card */}
          {/* <TipsCard /> */}
        </div>
      </form>
    </div>
  );
};

export default DealForm;


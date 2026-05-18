// src/features/accounts/AccountForm.jsx

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  createAccount,
  updateAccount,
  fetchAccount,
  clearCurrentAccount,
  fetchAccountsDropdown,
} from "./accountSlice";
import { fetchUsers } from "../auth/authSlice";
import { INDUSTRIES, ACCOUNT_TYPES } from "../../constants";
import Spinner from "../../components/Spinner";
import ImageUpload from "../../components/ImageUpload";
import toast from "react-hot-toast";
import {
  ArrowLeftIcon,
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  UserIcon,
  PhoneIcon,
  GlobeAltIcon,
  MapPinIcon,
  CheckIcon,
  // DocumentDuplicateIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  CurrencyRupeeIcon,
  UsersIcon,
  StarIcon,
  TagIcon,
  DocumentTextIcon,
  SparklesIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  BriefcaseIcon,
  PhotoIcon,
  // TruckIcon,
  CreditCardIcon,
  LinkIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon as CheckCircleSolid,
  SparklesIcon as SparklesSolid,
  BuildingOffice2Icon as BuildingOffice2Solid,
} from "@heroicons/react/24/solid";

/* ═══════════════════ CONSTANTS ═══════════════════ */

const INDUSTRY_OPTIONS = INDUSTRIES.map((i) => ({
  id: i,
  label: i,
  icon: "🏢",
}));

const TYPE_OPTIONS = ACCOUNT_TYPES.map((t) => ({
  id: t,
  label: t.replace(/_/g, " "),
  color:
    t === "CUSTOMER"
      ? "emerald"
      : t === "PROSPECT"
        ? "blue"
        : t === "PARTNER"
          ? "purple"
          : "slate",
}));


const initialForm = {
  accountName: "",
  accountOwnerId: "",
  keyAccountManagerId: "",
  parentAccountId: "",
  accountType: "",
  industry: "",
  annualRevenue: "",
  employees: "",
  phone: "",
  website: "",
  ownership: "",
  image: "",
  lifecycle: "PROSPECT", // ✅ ADD THIS
  billingStreet: "",
  billingCity: "",
  billingState: "",
  billingPincode: "",
  billingCountry: "",
  // shippingStreet: "",
  // shippingCity: "",
  // shippingState: "",
  // shippingPincode: "",
  // shippingCountry: "",
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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [dropdownStyle, setDropdownStyle] = useState({});

  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const getOptionLabel = useCallback((opt) => {
    if (!opt) return "";
    return opt.name || opt.accountName || opt.label || "";
  }, []);

  const getOptionValue = useCallback((opt) => {
    if (!opt) return "";
    return opt.id;
  }, []);

  const selectedOption = options.find((opt) => getOptionValue(opt) === value);

  const filteredOptions = options.filter((opt) =>
    getOptionLabel(opt).toLowerCase().includes(search.toLowerCase()),
  );

  const updateDropdownPosition = useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const dropdownHeight = Math.min(340, filteredOptions.length * 60 + 70);

    const showAbove =
      spaceBelow < dropdownHeight && triggerRect.top > spaceBelow;

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

  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      setTimeout(() => searchInputRef.current?.focus(), 10);

      const handlePositionUpdate = () => updateDropdownPosition();
      window.addEventListener("scroll", handlePositionUpdate, true);
      window.addEventListener("resize", handlePositionUpdate);

      return () => {
        window.removeEventListener("scroll", handlePositionUpdate, true);
        window.removeEventListener("resize", handlePositionUpdate);
      };
    }
  }, [isOpen, updateDropdownPosition]);

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

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

  const handleClear = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      onChange({ target: { name, value: "" } });
    },
    [name, onChange],
  );

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

  const renderOptionContent = useCallback(
    (opt, isSelected) => {
      // For accounts (parent account)
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

      // For users (account owner)
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


      // For account types (with color badge)
      if (opt.color && !opt.stars) {
        const colorClasses = {
          emerald: "bg-emerald-100 text-emerald-700",
          blue: "bg-blue-100 text-blue-700",
          purple: "bg-purple-100 text-purple-700",
          slate: "bg-slate-100 text-slate-700",
        };
        return (
          <div className="flex items-center justify-between w-full gap-3">
            <span
              className={`text-sm ${isSelected ? "font-bold text-[#3B2E7E]" : "font-medium text-slate-800"}`}
            >
              {opt.label}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${colorClasses[opt.color]}`}
            >
              {opt.label}
            </span>
          </div>
        );
      }

      // For industries (with icon)
      if (opt.icon) {
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl flex-shrink-0">
              {opt.icon}
            </div>
            <span
              className={`text-sm ${isSelected ? "font-bold text-[#3B2E7E]" : "font-medium text-slate-800"}`}
            >
              {opt.label}
            </span>
          </div>
        );
      }

      // Default
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

  const renderSelectedValue = useCallback(() => {
    if (!selectedOption) {
      return <span className="text-slate-400 text-sm">{placeholder}</span>;
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


    // For account types
    if (selectedOption.color && !selectedOption.stars) {
      const colorClasses = {
        emerald: "bg-emerald-100 text-emerald-700",
        blue: "bg-blue-100 text-blue-700",
        purple: "bg-purple-100 text-purple-700",
        slate: "bg-slate-100 text-slate-700",
      };
      return (
        <div className="flex items-center gap-2.5">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-md ${colorClasses[selectedOption.color]}`}
          >
            {selectedOption.label}
          </span>
        </div>
      );
    }

    // For industries
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

    // Default
    return (
      <span className="text-sm font-semibold text-slate-800 truncate">
        {getOptionLabel(selectedOption)}
      </span>
    );
  }, [selectedOption, placeholder, getOptionLabel]);

  const dropdownContent = isOpen ? (
    <div
      ref={dropdownRef}
      style={dropdownStyle}
      className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
    >
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
      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
        {Icon && <Icon className="w-3.5 h-3.5 text-[#3B2E7E]" />}
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>

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
  action,
}) => {
  const gradients = {
    purple: "from-[#3B2E7E] to-[#2A1F5C]",
    emerald: "from-emerald-500 to-emerald-600",
    amber: "from-amber-500 to-amber-600",
    rose: "from-rose-500 to-rose-600",
    sky: "from-sky-500 to-sky-600",
    slate: "from-slate-500 to-slate-600",
    indigo: "from-indigo-500 to-indigo-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-[#3B2E7E]/10 shadow-sm shadow-[#3B2E7E]/5 overflow-hidden">
      <div className="px-6 py-4 border-b border-[#3B2E7E]/10 bg-gradient-to-r from-[#3B2E7E]/5 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradients[gradient]} flex items-center justify-center shadow-lg`}
            >
              <Icon className="w-4.5 h-4.5 text-white" />
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
          {action}
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

/* ═══════════════════ FORM PROGRESS ═══════════════════ */

const FormProgress = ({ form }) => {
  const fields = [
    { key: "accountName", label: "Account Name", icon: BuildingOffice2Icon },
    { key: "accountOwnerId", label: "Account Owner", icon: UserIcon },
    { key: "accountType", label: "Account Type", icon: TagIcon },
    { key: "industry", label: "Industry", icon: BriefcaseIcon },
    { key: "phone", label: "Phone", icon: PhoneIcon },
    { key: "billingCity", label: "Billing Address", icon: MapPinIcon },
  ];

  const filled = fields.filter((f) => form[f.key]).length;
  const pct = Math.round((filled / fields.length) * 100);

  return (
    <div className="bg-gradient-to-br from-[#3B2E7E] to-[#2A1F5C] rounded-2xl p-6 text-white relative overflow-hidden">
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

/* ═══════════════════ ACCOUNT TYPE PREVIEW CARD ═══════════════════ */

const AccountPreviewCard = ({ form }) => {
  const typeOption = TYPE_OPTIONS.find((t) => t.id === form.accountType);

  const typeColors = {
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
  };


  return (
    <div className="bg-white rounded-2xl border border-[#3B2E7E]/10 p-5 shadow-sm">
      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
        Account Preview
      </h4>

      <div className="flex items-center gap-4 mb-4">
        {form.image ? (
          <img
            src={form.image}
            alt="Account"
            className="w-14 h-14 rounded-xl object-cover border-2 border-slate-100"
          />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#3B2E7E] to-[#5A4A9C] flex items-center justify-center text-white text-xl font-bold shadow-lg">
            {form.accountName?.charAt(0)?.toUpperCase() || "A"}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-800 truncate">
            {form.accountName || "Account Name"}
          </p>
          <p className="text-xs text-slate-500 truncate">
            {form.industry || "Industry not set"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {typeOption && (
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border ${typeColors[typeOption.color]}`}
          >
            {typeOption.label}
          </span>
        )}
      </div>

      {(form.phone || form.website) && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
          {form.phone && (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <PhoneIcon className="w-3.5 h-3.5 text-slate-400" />
              {form.phone}
            </div>
          )}
          {form.website && (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <GlobeAltIcon className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{form.website}</span>
            </div>
          )}
        </div>
      )}
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
//         Add a company logo for easy identification
//       </li>
//       <li className="flex items-start gap-2">
//         <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
//         Link to parent accounts for hierarchy
//       </li>
//       <li className="flex items-start gap-2">
//         <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
//         Complete address for shipping accuracy
//       </li>
//     </ul>
//   </div>
// );

/* ═══════════════════ ADDRESS COPY CHECKBOX ═══════════════════ */

// const CopyAddressCheckbox = ({ checked, onChange }) => (
//   <label className="inline-flex items-center gap-3 cursor-pointer group">
//     <div className="relative">
//       <input
//         type="checkbox"
//         checked={checked}
//         onChange={onChange}
//         className="sr-only peer"
//       />
//       <div
//         className={`
//         w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center
//         ${
//           checked
//             ? "bg-[#3B2E7E] border-[#3B2E7E]"
//             : "bg-white border-slate-300 group-hover:border-[#3B2E7E]/50"
//         }
//       `}
//       >
//         {checked && <CheckIcon className="w-4 h-4 text-white" />}
//       </div>
//     </div>
//     <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors flex items-center gap-2">
//       <DocumentDuplicateIcon className="w-4 h-4 text-slate-400" />
//       Copy from billing address
//     </span>
//   </label>
// );

/* ═══════════════════ MAIN COMPONENT ═══════════════════ */

const AccountForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { account, detailLoading } = useSelector((s) => s.accounts);
  const { users, user } = useSelector((s) => s.auth);
  const { dropdown: accountDropdown } = useSelector((s) => s.accounts);

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  // const [copyBilling, setCopyBilling] = useState(false);

  /* ── load ── */
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAccountsDropdown());
    if (isEdit) dispatch(fetchAccount(id));
    return () => dispatch(clearCurrentAccount());
  }, [dispatch, id, isEdit]);

  /* ── prefill ── */
  useEffect(() => {
    if (isEdit && account) {
      const formData = {};
      Object.keys(initialForm).forEach((key) => {
        formData[key] = account[key] ?? "";
      });
      setForm(formData);
    } else if (!isEdit && user) {
      setForm((prev) => ({ ...prev, accountOwnerId: user.id }));
    }
  }, [account, isEdit, user]);

  /* ── copy billing ── */
  // useEffect(() => {
  //   if (copyBilling) {
  //     setForm((prev) => ({
  //       ...prev,
  //       shippingStreet: prev.billingStreet,
  //       shippingCity: prev.billingCity,
  //       shippingState: prev.billingState,
  //       shippingPincode: prev.billingPincode,
  //       shippingCountry: prev.billingCountry,
  //     }));
  //   }
  // }, [
  //   copyBilling,
  //   form.billingStreet,
  //   form.billingCity,
  //   form.billingState,
  //   form.billingPincode,
  //   form.billingCountry,
  // ]);

  const fetchAddressFromPincode = async (pincode) => {
    if (!pincode || pincode.length !== 6) return;

    try {
      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );
      const data = await res.json();

      if (data[0]?.Status === "Success") {
        const postOffice = data[0].PostOffice[0];

        setForm((prev) => ({
          ...prev,
          billingCity: postOffice.District || "",
          billingState: postOffice.State || "",
          billingCountry: "India",
        }));
      } else {
        console.warn("Invalid pincode");
      }
    } catch (err) {
      console.error("Pincode fetch error:", err);
    }
  };

  /* ── change ── */
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (imageData) => {
    setForm((prev) => ({ ...prev, image: imageData }));
  };

  /* ── submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {};
      Object.entries(form).forEach(([key, val]) => {
        payload[key] = val === "" ? null : val;
      });
      payload.accountName = form.accountName;
      payload.accountOwnerId = form.accountOwnerId || user.id;

      if (isEdit) {
        await dispatch(updateAccount({ id, ...payload })).unwrap();
        toast.success("Account updated successfully");
      } else {
        await dispatch(createAccount(payload)).unwrap();
        toast.success("Account created successfully");
      }
      navigate("/accounts");
    } catch (err) {
      toast.error(err || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && detailLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-sm text-slate-500 mt-4">Loading account...</p>
        </div>
      </div>
    );
  }

  /* ═══════════════════ RENDER ═══════════════════ */

  return (
    <div className="w-full mx-auto p-4 sm:p-6 pb-10">
      {/* ─── HEADER ─── */}
      <div className="relative bg-gradient-to-b from-[#3B2E7E] to-[#2A1F5C] rounded-3xl p-3 lg:p-4 mb-6 mx-0 lg:mx-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-300 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        {/* Decorative Circles */}
        <div className="absolute top-4 right-4 w-16 h-16 border border-white/10 rounded-full" />
        <div className="absolute top-8 right-8 w-10 h-10 border border-white/10 rounded-full" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/accounts")}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all border border-white/10"
            >
              <ArrowLeftIcon className="w-4.5 h-4.5 text-white" />
            </button>

            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                  isEdit
                    ? "bg-gradient-to-br from-amber-400 to-orange-500"
                    : "bg-white/20 backdrop-blur-sm"
                }`}
              >
                {isEdit ? (
                  <BuildingOffice2Icon className="w-6 h-6 text-white" />
                ) : (
                  <RocketLaunchIcon className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-extrabold text-white tracking-tight">
                  {isEdit ? "Edit Account" : "Create New Account"}
                </h1>
                <p className="text-[11px] font-bold text-purple-200 uppercase tracking-wider mt-0.5">
                  {isEdit
                    ? `Updating ${account?.accountName || "account"}`
                    : "Add a new business account"}
                </p>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/accounts")}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl text-sm font-semibold transition-all border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="account-form"
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
                  {isEdit ? "Update Account" : "Create Account"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ─── FORM GRID ─── */}
      <form
        id="account-form"
        onSubmit={handleSubmit}
        className="grid lg:grid-cols-4 gap-8 mx-0 lg:mx-8"
      >
        {/* ══════ LEFT COLUMN (3/4) ══════ */}
        <div className="lg:col-span-3 space-y-6">
          {/* ── ACCOUNT LOGO ── */}
          <SectionCard
            icon={PhotoIcon}
            title="Account Logo"
            subtitle="Upload your company logo (optional)"
            gradient="purple"
          >
            <ImageUpload
              value={form.image}
              onChange={handleImageChange}
              label="Company Logo"
              shape="square"
            />
          </SectionCard>

          {/* ── BASIC INFORMATION ── */}
          <SectionCard
            icon={BuildingOffice2Icon}
            title="Basic Information"
            subtitle="Primary account details"
            gradient="purple"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <FormInput
                name="accountName"
                label="Account Name"
                icon={SparklesIcon}
                value={form.accountName}
                onChange={handleChange}
                required
                placeholder="Enter account name"
                hint="The official name of the business"
              />

              <CustomDropdown
                name="accountOwnerId"
                label="Account Owner"
                icon={ShieldCheckIcon}
                value={form.accountOwnerId}
                onChange={handleChange}
                required
                disabled={!["SUPER_ADMIN", "TSL", "MANAGER"].includes(user?.role)}
                options={
                  !["SUPER_ADMIN", "TSL", "MANAGER"].includes(user?.role)
                    ? [{ id: user.id, name: user.name }]
                    : users
                }
                placeholder="Select owner"
                hint="Person responsible for this account"
              />

              <CustomDropdown
                name="keyAccountManagerId"
                label="Key Account Manager"
                icon={UsersIcon}
                value={form.keyAccountManagerId || ""}
                onChange={handleChange}
                options={users.filter((u) => ["KAM", "MANAGER"].includes(u.role))}
                placeholder="Select manager"
                hint="Key Account Manager for this account"
              />

              <CustomDropdown
                name="parentAccountId"
                label="Parent Account"
                icon={LinkIcon}
                value={form.parentAccountId}
                onChange={handleChange}
                options={accountDropdown.filter((a) => a.id !== id)}
                placeholder="Select parent account"
                hint="Link to a parent organization"
              />

              <CustomDropdown
                name="accountType"
                label="Account Type"
                icon={TagIcon}
                value={form.accountType}
                onChange={handleChange}
                options={TYPE_OPTIONS}
                placeholder="Select type"
              />

              <CustomDropdown
                name="industry"
                label="Industry"
                icon={BriefcaseIcon}
                value={form.industry}
                onChange={handleChange}
                options={INDUSTRY_OPTIONS}
                placeholder="Select industry"
              />


              <CustomDropdown
                name="lifecycle"
                label="Account Status"
                icon={ShieldCheckIcon}
                value={form.lifecycle}
                onChange={handleChange}
                options={[
                  { id: "ACTIVE", label: "Active" },
                  { id: "INACTIVE", label: "Inactive" },
                  { id: "PROSPECT", label: "Prospect" },
                  { id: "DEACTIVATED", label: "Deactivated" },
                ]}
                placeholder="Select status"
                hint="Current lifecycle stage of account"
              />
            </div>
          </SectionCard>

          {/* ── BUSINESS DETAILS ── */}
          <SectionCard
            icon={ChartBarIcon}
            title="Business Details"
            subtitle="Financial and contact information"
            gradient="emerald"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <FormInput
                name="annualRevenue"
                label="Annual Revenue"
                icon={CurrencyRupeeIcon}
                type="number"
                value={form.annualRevenue}
                onChange={handleChange}
                placeholder="0"
                prefix="₹"
                hint="Yearly revenue in INR"
              />

              <FormInput
                name="employees"
                label="Number of Employees"
                icon={UsersIcon}
                type="number"
                value={form.employees}
                onChange={handleChange}
                placeholder="e.g., 50"
              />

              <FormInput
                name="phone"
                label="Phone"
                icon={PhoneIcon}
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
              />

              <FormInput
                name="website"
                label="Website"
                icon={GlobeAltIcon}
                value={form.website}
                onChange={handleChange}
                placeholder="https://example.com"
              />

              <div className="sm:col-span-2">
                <FormInput
                  name="ownership"
                  label="Ownership"
                  icon={BuildingOfficeIcon}
                  value={form.ownership}
                  onChange={handleChange}
                  placeholder="e.g., Private, Public, Partnership"
                  hint="Company ownership structure"
                />
              </div>
            </div>
          </SectionCard>

          {/* ── BILLING ADDRESS ── */}
          <SectionCard
            icon={CreditCardIcon}
            title="Billing Address"
            subtitle="Primary billing location"
            gradient="amber"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <FormInput
                  name="billingStreet"
                  label="Street Address"
                  icon={MapPinIcon}
                  value={form.billingStreet}
                  onChange={handleChange}
                  placeholder="Enter street address"
                />
              </div>

              <FormInput
                name="billingCity"
                label="City"
                value={form.billingCity}
                onChange={handleChange}
                placeholder="Enter city"
              />

              <FormInput
                name="billingState"
                label="State"
                value={form.billingState}
                onChange={handleChange}
                placeholder="Enter state"
              />

              <FormInput
                name="billingPincode"
                label="Pincode"
                value={form.billingPincode}
                onChange={(e) => {
                  handleChange(e);

                  const pin = e.target.value.replace(/\D/g, ""); // only numbers
                  if (pin.length === 6) {
                    fetchAddressFromPincode(pin);
                  }
                }}
                placeholder="Enter pincode"
              />

              <FormInput
                name="billingCountry"
                label="Country"
                value={form.billingCountry}
                onChange={handleChange}
                placeholder="Enter country"
              />
            </div>
          </SectionCard>

          {/* ── SHIPPING ADDRESS ── */}
          {/* <SectionCard
            icon={TruckIcon}
            title="Shipping Address"
            subtitle="Product delivery location"
            gradient="sky"
            action={
              <CopyAddressCheckbox
                checked={copyBilling}
                onChange={(e) => setCopyBilling(e.target.checked)}
              />
            }
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <FormInput
                  name="shippingStreet"
                  label="Street Address"
                  icon={MapPinIcon}
                  value={form.shippingStreet}
                  onChange={handleChange}
                  placeholder="Enter street address"
                  disabled={copyBilling}
                />
              </div>

              <FormInput
                name="shippingCity"
                label="City"
                value={form.shippingCity}
                onChange={handleChange}
                placeholder="Enter city"
                disabled={copyBilling}
              />

              <FormInput
                name="shippingState"
                label="State"
                value={form.shippingState}
                onChange={handleChange}
                placeholder="Enter state"
                disabled={copyBilling}
              />

              <FormInput
                name="shippingPincode"
                label="Pincode"
                value={form.shippingPincode}
                onChange={handleChange}
                placeholder="Enter pincode"
                disabled={copyBilling}
              />

              <FormInput
                name="shippingCountry"
                label="Country"
                value={form.shippingCountry}
                onChange={handleChange}
                placeholder="Enter country"
                disabled={copyBilling}
              />
            </div>
          </SectionCard> */}

          {/* ── MOBILE ACTIONS ── */}
          <div className="flex lg:hidden items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate("/accounts")}
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

          {/* Account Preview */}
          <AccountPreviewCard form={form} />

          {/* Tips Card */}
          {/* <TipsCard /> */}
        </div>
      </form>
    </div>
  );
};

export default AccountForm;
// // src/features/accounts/AccountForm.jsx

// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate, useParams, Link } from "react-router-dom";
// import {
//   createAccount,
//   updateAccount,
//   fetchAccount,
//   clearCurrentAccount,
//   fetchAccountsDropdown,
// } from "./accountSlice";
// import { fetchUsers } from "../auth/authSlice";
// import { INDUSTRIES, ACCOUNT_TYPES } from "../../constants";
// import Spinner from "../../components/Spinner";
// import ImageUpload from "../../components/ImageUpload";
// import toast from "react-hot-toast";
// import {
//   ArrowLeftIcon,
//   BuildingOffice2Icon,
//   UserIcon,
//   PhoneIcon,
//   GlobeAltIcon,
//   MapPinIcon,
//   ChevronRightIcon,
//   CheckIcon,
//   DocumentDuplicateIcon,
// } from "@heroicons/react/24/outline";

// const initialForm = {
//   accountName: "",
//   accountOwnerId: "",
//   parentAccountId: "",
//   accountType: "",
//   industry: "",
//   annualRevenue: "",
//   employees: "",
//   rating: "",
//   phone: "",
//   website: "",
//   ownership: "",
//   image: "",
//   billingStreet: "",
//   billingCity: "",
//   billingState: "",
//   billingPincode: "",
//   billingCountry: "",
//   shippingStreet: "",
//   shippingCity: "",
//   shippingState: "",
//   shippingPincode: "",
//   shippingCountry: "",
// };

// // Reusable Form Components
// const FormSection = ({ title, subtitle, icon: Icon, children }) => (
//   <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//     <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
//       <div className="flex items-center gap-3">
//         {Icon && (
//           <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
//             <Icon className="w-4 h-4 text-indigo-600" />
//           </div>
//         )}
//         <div>
//           <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
//           {subtitle && (
//             <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
//           )}
//         </div>
//       </div>
//     </div>
//     <div className="p-5">{children}</div>
//   </div>
// );

// const FormField = ({
//   label,
//   required,
//   children,
//   className = "",
//   hint,
// }) => (
//   <div className={className}>
//     <label className="block text-sm font-medium text-gray-700 mb-1.5">
//       {label}
//       {required && <span className="text-red-500 ml-0.5">*</span>}
//     </label>
//     {children}
//     {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
//   </div>
// );

// const Input = ({
//   name,
//   value,
//   onChange,
//   type = "text",
//   placeholder,
//   required,
//   icon: Icon,
//   ...props
// }) => (
//   <div className="relative">
//     {Icon && (
//       <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//     )}
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       required={required}
//       className={`
//         w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg
//         placeholder:text-gray-400
//         focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
//         transition-all duration-200
//         ${Icon ? "pl-10" : ""}
//       `}
//       {...props}
//     />
//   </div>
// );

// const Select = ({
//   name,
//   value,
//   onChange,
//   options,
//   placeholder,
//   required,
//   disabled,
// }) => (
//   <select
//     name={name}
//     value={value}
//     onChange={onChange}
//     required={required}
//     disabled={disabled}
//     className="w-full px-3 py-2.5 text-sm bg-white border border-gray-300 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
//   >
//     <option value="">{placeholder}</option>
//     {options.map((opt) => (
//       <option key={opt.value} value={opt.value}>
//         {opt.label}
//       </option>
//     ))}
//   </select>
// );

// const AccountForm = () => {
//   const { id } = useParams();
//   const isEdit = Boolean(id);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { account, detailLoading } = useSelector((s) => s.accounts);
//   const { users, user } = useSelector((s) => s.auth);
//   const { dropdown: accountDropdown } = useSelector((s) => s.accounts);

//   const [form, setForm] = useState(initialForm);
//   const [submitting, setSubmitting] = useState(false);
//   const [copyBilling, setCopyBilling] = useState(false);

//   useEffect(() => {
//     dispatch(fetchUsers());
//     dispatch(fetchAccountsDropdown());
//     if (isEdit) dispatch(fetchAccount(id));
//     return () => dispatch(clearCurrentAccount());
//   }, [dispatch, id, isEdit]);

//   useEffect(() => {
//     if (isEdit && account) {
//       const formData = {};
//       Object.keys(initialForm).forEach((key) => {
//         formData[key] = account[key] ?? "";
//       });
//       setForm(formData);
//     } else if (!isEdit && user) {
//       setForm((prev) => ({ ...prev, accountOwnerId: user.id }));
//     }
//   }, [account, isEdit, user]);

//   useEffect(() => {
//     if (copyBilling) {
//       setForm((prev) => ({
//         ...prev,
//         shippingStreet: prev.billingStreet,
//         shippingCity: prev.billingCity,
//         shippingState: prev.billingState,
//         shippingPincode: prev.billingPincode,
//         shippingCountry: prev.billingCountry,
//       }));
//     }
//   }, [copyBilling, form.billingStreet, form.billingCity, form.billingState, form.billingPincode, form.billingCountry]);

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleImageChange = (imageData) => {
//     setForm((prev) => ({ ...prev, image: imageData }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const payload = {};
//       Object.entries(form).forEach(([key, val]) => {
//         payload[key] = val === "" ? null : val;
//       });
//       payload.accountName = form.accountName;
//       payload.accountOwnerId = form.accountOwnerId || user.id;

//       if (isEdit) {
//         await dispatch(updateAccount({ id, ...payload })).unwrap();
//         toast.success("Account updated successfully");
//       } else {
//         await dispatch(createAccount(payload)).unwrap();
//         toast.success("Account created successfully");
//       }
//       navigate("/accounts");
//     } catch (err) {
//       toast.error(err || "Something went wrong");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (isEdit && detailLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <div className="w-8 h-8 border-[3px] border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
//           <p className="text-sm text-gray-500 mt-3">Loading account...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto">
//       {/* Breadcrumb */}
//       <nav className="flex items-center gap-2 text-sm mb-6">
//         <Link
//           to="/accounts"
//           className="text-gray-500 hover:text-gray-700 transition-colors"
//         >
//           Accounts
//         </Link>
//         <ChevronRightIcon className="w-4 h-4 text-gray-400" />
//         <span className="text-gray-900 font-medium">
//           {isEdit ? "Edit Account" : "New Account"}
//         </span>
//       </nav>

//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate("/accounts")}
//             className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
//           >
//             <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
//           </button>
//           <div>
//             <h1 className="text-xl font-bold text-gray-900">
//               {isEdit ? "Edit Account" : "Create New Account"}
//             </h1>
//             <p className="text-sm text-gray-500 mt-0.5">
//               {isEdit
//                 ? "Update account information"
//                 : "Add a new business account to your CRM"}
//             </p>
//           </div>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Account Logo */}
//         <FormSection
//           title="Account Logo"
//           subtitle="Upload your company logo (optional)"
//           icon={BuildingOffice2Icon}
//         >
//           <ImageUpload
//             value={form.image}
//             onChange={handleImageChange}
//             label="Company Logo"
//             shape="square"
//           />
//         </FormSection>

//         {/* Basic Information */}
//         <FormSection
//           title="Basic Information"
//           subtitle="Primary account details"
//           icon={BuildingOffice2Icon}
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <FormField label="Account Name" required>
//               <Input
//                 name="accountName"
//                 value={form.accountName}
//                 onChange={handleChange}
//                 placeholder="Enter account name"
//                 required
//               />
//             </FormField>

//             <FormField label="Account Owner" required>
//               <Select
//                 name="accountOwnerId"
//                 value={form.accountOwnerId}
//                 onChange={handleChange}
//                 placeholder="Select owner"
//                 required
//                 disabled={user?.role === "SALES_REP"}
//                 options={
//                   user?.role === "SALES_REP"
//                     ? [{ value: user.id, label: user.name }]
//                     : users.map((u) => ({ value: u.id, label: u.name }))
//                 }
//               />
//             </FormField>

//             <FormField label="Parent Account">
//               <Select
//                 name="parentAccountId"
//                 value={form.parentAccountId}
//                 onChange={handleChange}
//                 placeholder="Select parent account"
//                 options={accountDropdown
//                   .filter((a) => a.id !== id)
//                   .map((a) => ({ value: a.id, label: a.accountName }))}
//               />
//             </FormField>

//             <FormField label="Account Type">
//               <Select
//                 name="accountType"
//                 value={form.accountType}
//                 onChange={handleChange}
//                 placeholder="Select type"
//                 options={ACCOUNT_TYPES.map((t) => ({
//                   value: t,
//                   label: t.replace(/_/g, " "),
//                 }))}
//               />
//             </FormField>

//             <FormField label="Industry">
//               <Select
//                 name="industry"
//                 value={form.industry}
//                 onChange={handleChange}
//                 placeholder="Select industry"
//                 options={INDUSTRIES.map((i) => ({ value: i, label: i }))}
//               />
//             </FormField>

//             <FormField label="Rating">
//               <Select
//                 name="rating"
//                 value={form.rating}
//                 onChange={handleChange}
//                 placeholder="Select rating"
//                 options={ACCOUNT_RATINGS.map((r) => ({ value: r, label: r }))}
//               />
//             </FormField>
//           </div>
//         </FormSection>

//         {/* Business Details */}
//         <FormSection
//           title="Business Details"
//           subtitle="Financial and contact information"
//           icon={GlobeAltIcon}
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <FormField label="Annual Revenue" hint="Enter amount in INR">
//               <Input
//                 name="annualRevenue"
//                 type="number"
//                 value={form.annualRevenue}
//                 onChange={handleChange}
//                 placeholder="e.g., 10000000"
//               />
//             </FormField>

//             <FormField label="Number of Employees">
//               <Input
//                 name="employees"
//                 type="number"
//                 value={form.employees}
//                 onChange={handleChange}
//                 placeholder="e.g., 50"
//               />
//             </FormField>

//             <FormField label="Phone">
//               <Input
//                 name="phone"
//                 value={form.phone}
//                 onChange={handleChange}
//                 placeholder="+91 98765 43210"
//                 icon={PhoneIcon}
//               />
//             </FormField>

//             <FormField label="Website">
//               <Input
//                 name="website"
//                 value={form.website}
//                 onChange={handleChange}
//                 placeholder="https://example.com"
//                 icon={GlobeAltIcon}
//               />
//             </FormField>

//             <FormField label="Ownership" className="md:col-span-2">
//               <Input
//                 name="ownership"
//                 value={form.ownership}
//                 onChange={handleChange}
//                 placeholder="e.g., Private, Public, Partnership"
//               />
//             </FormField>
//           </div>
//         </FormSection>

//         {/* Billing Address */}
//         <FormSection
//           title="Billing Address"
//           subtitle="Primary billing location"
//           icon={MapPinIcon}
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <FormField label="Street Address" className="md:col-span-2">
//               <Input
//                 name="billingStreet"
//                 value={form.billingStreet}
//                 onChange={handleChange}
//                 placeholder="Enter street address"
//               />
//             </FormField>

//             <FormField label="City">
//               <Input
//                 name="billingCity"
//                 value={form.billingCity}
//                 onChange={handleChange}
//                 placeholder="Enter city"
//               />
//             </FormField>

//             <FormField label="State">
//               <Input
//                 name="billingState"
//                 value={form.billingState}
//                 onChange={handleChange}
//                 placeholder="Enter state"
//               />
//             </FormField>

//             <FormField label="Pincode">
//               <Input
//                 name="billingPincode"
//                 value={form.billingPincode}
//                 onChange={handleChange}
//                 placeholder="Enter pincode"
//               />
//             </FormField>

//             <FormField label="Country">
//               <Input
//                 name="billingCountry"
//                 value={form.billingCountry}
//                 onChange={handleChange}
//                 placeholder="Enter country"
//               />
//             </FormField>
//           </div>
//         </FormSection>

//         {/* Shipping Address */}
//         <FormSection
//           title="Shipping Address"
//           subtitle="Product delivery location"
//           icon={MapPinIcon}
//         >
//           {/* Copy Checkbox */}
//           <div className="mb-5">
//             <label className="inline-flex items-center gap-3 cursor-pointer group">
//               <div className="relative">
//                 <input
//                   type="checkbox"
//                   checked={copyBilling}
//                   onChange={(e) => setCopyBilling(e.target.checked)}
//                   className="sr-only peer"
//                 />
//                 <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:border-indigo-600 peer-checked:bg-indigo-600 transition-all duration-200">
//                   {copyBilling && (
//                     <CheckIcon className="w-3.5 h-3.5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
//                   )}
//                 </div>
//               </div>
//               <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors flex items-center gap-1.5">
//                 <DocumentDuplicateIcon className="w-4 h-4 text-gray-400" />
//                 Copy from billing address
//               </span>
//             </label>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             <FormField label="Street Address" className="md:col-span-2">
//               <Input
//                 name="shippingStreet"
//                 value={form.shippingStreet}
//                 onChange={handleChange}
//                 placeholder="Enter street address"
//               />
//             </FormField>

//             <FormField label="City">
//               <Input
//                 name="shippingCity"
//                 value={form.shippingCity}
//                 onChange={handleChange}
//                 placeholder="Enter city"
//               />
//             </FormField>

//             <FormField label="State">
//               <Input
//                 name="shippingState"
//                 value={form.shippingState}
//                 onChange={handleChange}
//                 placeholder="Enter state"
//               />
//             </FormField>

//             <FormField label="Pincode">
//               <Input
//                 name="shippingPincode"
//                 value={form.shippingPincode}
//                 onChange={handleChange}
//                 placeholder="Enter pincode"
//               />
//             </FormField>

//             <FormField label="Country">
//               <Input
//                 name="shippingCountry"
//                 value={form.shippingCountry}
//                 onChange={handleChange}
//                 placeholder="Enter country"
//               />
//             </FormField>
//           </div>
//         </FormSection>

//         {/* Actions */}
//         <div className="flex items-center justify-end gap-3 pt-4 pb-8">
//           <button
//             type="button"
//             onClick={() => navigate("/accounts")}
//             className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={submitting}
//             className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
//           >
//             {submitting ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                 Saving...
//               </>
//             ) : isEdit ? (
//               "Update Account"
//             ) : (
//               "Create Account"
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AccountForm;

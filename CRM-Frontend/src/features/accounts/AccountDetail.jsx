// src/features/accounts/AccountDetail.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchAccount, clearCurrentAccount } from "./accountSlice";
import { formatCurrency, formatLabel, formatDate } from "../../constants";
import Spinner from "../../components/Spinner";
import Avatar from "../../components/Avatar";
import {
  BuildingOffice2Icon,
  PencilSquareIcon,
  PhoneIcon,
  GlobeAltIcon,
  UserGroupIcon,
  UserIcon,
  CurrencyRupeeIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  MapPinIcon,
  BriefcaseIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  ChevronRightIcon,
  PlusIcon,
  CalendarDaysIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "lucide-react";

// ── Helper Components ──

const SectionCard = ({
  title,
  subtitle,
  action,
  children,
  className = "",
  noPadding = false,
}) => (
  <div
    className={`bg-white rounded-2xl shadow-sm shadow-[#3B2E7E]/5 border border-[#3B2E7E]/10 overflow-hidden ${className}`}
  >
    {(title || action) && (
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#3B2E7E]/10 bg-gradient-to-r from-[#3B2E7E]/5 to-white">
        <div>
          <h2 className="text-base font-bold text-slate-800">{title}</h2>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
    )}
    <div className={noPadding ? "" : "p-6"}>{children}</div>
  </div>
);

const InfoItem = ({
  icon: Icon,
  label,
  value,
  isLink,
  href,
  external,
  iconBg = "bg-[#3B2E7E]/10",
  iconColor = "text-[#3B2E7E]",
}) => {
  if (!value || value === "—") return null;

  const content = (
    <div className="group flex items-center gap-4 p-4 rounded-xl hover:bg-[#3B2E7E]/5 transition-all duration-200">
      <div
        className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}
      >
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
          {label}
        </p>
        {isLink ? (
          <span className="text-sm font-semibold text-[#3B2E7E] hover:text-[#2A1F5C] flex items-center gap-1.5 transition-colors">
            {value}
            {external && <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />}
          </span>
        ) : (
          <p className="text-sm font-semibold text-slate-800 truncate">
            {value}
          </p>
        )}
      </div>
    </div>
  );

  if (isLink && href) {
    return external ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    ) : (
      <Link to={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
};

const StatCard = ({ icon: Icon, label, value, variant = "primary" }) => {
  const variants = {
    primary: "from-[#3B2E7E] to-[#2A1F5C] shadow-[#3B2E7E]/30",
    secondary: "from-[#4A3A8C] to-[#3B2E7E] shadow-[#3B2E7E]/30",
    tertiary: "from-[#5A4A9C] to-[#4A3A8C] shadow-[#3B2E7E]/30",
    quaternary: "from-[#6A5AAC] to-[#5A4A9C] shadow-[#3B2E7E]/30",
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-[#3B2E7E]/10 hover:shadow-lg hover:shadow-[#3B2E7E]/10 transition-all duration-300">
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${variants[variant]} flex items-center justify-center mb-4 shadow-lg`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-2xl font-bold text-slate-800 truncate">
        {value || "—"}
      </p>
      <p className="text-xs font-medium text-slate-500 mt-1">{label}</p>
    </div>
  );
};

const DealCard = ({ deal }) => {
  const getStageStyles = (stage) => {
    const styles = {
      qualification: {
        bg: "bg-sky-100",
        text: "text-sky-700",
        dot: "bg-sky-500",
      },
      proposal: {
        bg: "bg-amber-100",
        text: "text-amber-700",
        dot: "bg-amber-500",
      },
      negotiation: {
        bg: "bg-purple-100",
        text: "text-purple-700",
        dot: "bg-purple-500",
      },
      closed_won: {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        dot: "bg-emerald-500",
      },
      closed_lost: {
        bg: "bg-rose-100",
        text: "text-rose-700",
        dot: "bg-rose-500",
      },
    };
    return (
      styles[stage] || {
        bg: "bg-slate-100",
        text: "text-slate-700",
        dot: "bg-slate-500",
      }
    );
  };

  const stageStyles = getStageStyles(deal.stage);

  return (
    <Link
      to={`/deals/${deal.id}`}
      className="group block p-5 rounded-xl bg-gradient-to-br from-[#3B2E7E]/5 to-white border border-[#3B2E7E]/10 hover:border-[#3B2E7E]/30 hover:shadow-lg hover:shadow-[#3B2E7E]/10 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B2E7E] to-[#2A1F5C] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#3B2E7E]/30">
            <CurrencyRupeeIcon className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0 pt-1">
            <p className="text-sm font-bold text-slate-800 truncate group-hover:text-[#3B2E7E] transition-colors">
              {deal.dealName}
            </p>
            <p className="text-xs text-slate-500 mt-1">{deal.owner?.name}</p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${stageStyles.bg} ${stageStyles.text}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${stageStyles.dot}`}
                ></span>
                {formatLabel(deal.stage)}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-bold text-slate-800">
            {formatCurrency(deal.amount)}
          </p>
          <div className="flex items-center gap-1 mt-1 text-slate-400 group-hover:text-[#3B2E7E] transition-colors">
            <span className="text-xs font-medium">View</span>
            <ChevronRightIcon className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
};

const ContactCard = ({ contact }) => (
  <Link
    to={`/contacts/${contact.id}`}
    className="group flex items-center gap-4 p-4 rounded-xl border border-[#3B2E7E]/10 hover:border-[#3B2E7E]/30 hover:shadow-lg hover:shadow-[#3B2E7E]/10 hover:bg-[#3B2E7E]/5 transition-all duration-300"
  >
    <div className="relative">
      <Avatar
        name={contact.firstName}
        secondName={contact.lastName}
        size="md"
        image={contact.image}
        className="!rounded-xl"
      />
      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white"></div>
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-bold text-slate-800 truncate group-hover:text-[#3B2E7E] transition-colors">
        {contact.firstName} {contact.lastName || ""}
      </p>
      <p className="text-xs text-slate-500 truncate mt-0.5">
        {contact.email || contact.title || "—"}
      </p>
    </div>
    <ChevronRightIcon className="w-5 h-5 text-slate-400 group-hover:text-[#3B2E7E] group-hover:translate-x-1 transition-all flex-shrink-0" />
  </Link>
);

const AddressCard = ({ title, icon: Icon, address, variant = "primary" }) => {
  const variants = {
    primary: "from-[#3B2E7E] to-[#2A1F5C] shadow-[#3B2E7E]/30",
    secondary: "from-emerald-500 to-emerald-600 shadow-emerald-200/50",
  };

  if (!address) return null;

  return (
    <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-[#3B2E7E]/5 to-purple-50/50 border border-[#3B2E7E]/10">
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${variants[variant]} flex items-center justify-center flex-shrink-0 shadow-lg`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="min-w-0 flex-1 pt-1">
        <p className="text-xs font-semibold text-[#3B2E7E] uppercase tracking-wide mb-2">
          {title}
        </p>
        <p className="text-sm font-medium text-slate-700 leading-relaxed">
          {address}
        </p>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-[#3B2E7E] hover:text-[#2A1F5C] mt-2 transition-colors"
        >
          View on Map
          <ArrowTopRightOnSquareIcon className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

const EmptyState = ({ icon: Icon, title, action, onAction }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B2E7E]/10 to-purple-100 flex items-center justify-center mx-auto mb-4">
      <Icon className="w-8 h-8 text-[#3B2E7E]" />
    </div>
    <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
    {action && (
      <button
        onClick={onAction}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#3B2E7E] hover:text-[#2A1F5C] mt-3 transition-colors"
      >
        <PlusIcon className="w-4 h-4" />
        {action}
      </button>
    )}
  </div>
);


const LIFECYCLE_BADGES = {
  PROSPECT: "bg-sky-100 text-sky-700 border-sky-200",
  ACTIVE: "bg-emerald-100 text-emerald-700 border-emerald-200",
  INACTIVE: "bg-amber-100 text-amber-700 border-amber-200",
  DEACTIVATED: "bg-rose-100 text-rose-700 border-rose-200",
};

const AccountDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { account, detailLoading } = useSelector((s) => s.accounts);

  useEffect(() => {
    dispatch(fetchAccount(id));
    return () => dispatch(clearCurrentAccount());
  }, [dispatch, id]);

  if (detailLoading || !account) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-sm text-slate-500 mt-4">
            Loading account details...
          </p>
        </div>
      </div>
    );
  }

  const billingAddress = [
    account.billingStreet,
    account.billingCity,
    account.billingState,
    account.billingPincode,
    account.billingCountry,
  ]
    .filter(Boolean)
    .join(", ");

  const totalDealsValue =
    account.deals?.reduce((sum, deal) => sum + (deal.amount || 0), 0) || 0;

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        <nav className="flex items-center gap-2 text-sm">
          <Link
            to="/accounts"
            className="flex items-center gap-2 text-slate-500 hover:text-[#3B2E7E] transition-colors font-medium"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Accounts
          </Link>
          <ChevronRightIcon className="w-4 h-4 text-slate-300" />
          <span className="text-slate-800 font-semibold truncate max-w-[200px]">
            {account.accountName}
          </span>
        </nav>

        {/* Quick Actions removed as per user request */}
      </div>

      {/* Hero Header Section */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-[#3B2E7E]/5 border border-[#3B2E7E]/10 overflow-hidden mb-8">
        <div className="relative bg-gradient-to-br from-[#3B2E7E] to-[#2A1F5C] p-8 lg:p-10 overflow-hidden">
          {/* Background Patterns */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-300 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="ring-4 ring-white/20 rounded-2xl p-1 bg-white/10 backdrop-blur-md shadow-2xl group-hover:scale-105 transition-transform duration-300">
                  {account.image ? (
                    <img
                      src={account.image}
                      alt={account.accountName}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                      <BuildingOffice2Icon className="w-12 h-12 text-white" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                    {account.accountName}
                  </h1>
                  {account.lifecycle && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${LIFECYCLE_BADGES[account.lifecycle]}`}>
                      {account.lifecycle}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {account.accountNumber && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-xs font-mono text-white/90 backdrop-blur-sm border border-white/10">
                      #{account.accountNumber}
                    </span>
                  )}
                  {account.industry && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-xs font-bold uppercase tracking-wide text-white/90 backdrop-blur-sm border border-white/10">
                      <ChartBarIcon className="w-3.5 h-3.5" />
                      {account.industry}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-6 mt-4">
                  {account.owner?.name && (
                    <p className="text-purple-100 text-sm flex items-center gap-2 font-medium">
                      <UserIcon className="w-4 h-4 opacity-70" />
                      Owned by <span className="text-white font-bold">{account.owner.name}</span>
                    </p>
                  )}
                  {account.keyAccountManager?.name && (
                    <p className="text-purple-100 text-sm flex items-center gap-2 font-medium">
                      <StarIcon className="w-4 h-4 opacity-70" />
                      KAM: <span className="text-white font-bold">{account.keyAccountManager.name}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {account.phone && (
                <a
                  href={`tel:${account.phone}`}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl backdrop-blur-sm transition-all border border-white/10"
                >
                  <PhoneIcon className="w-4 h-4" />
                  Call
                </a>
              )}
              {account.website && (
                <a
                  href={
                    account.website.startsWith("http")
                      ? account.website
                      : `https://${account.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-xl backdrop-blur-sm transition-all border border-white/10"
                >
                  <GlobeAltIcon className="w-4 h-4" />
                  Website
                </a>
              )}
              {account.lifecycle !== "DEACTIVATED" && (
                <button
                  onClick={() => navigate(`/accounts/${id}/edit`)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#3B2E7E] text-sm font-bold rounded-xl hover:bg-purple-50 active:scale-[0.98] transition-all shadow-xl shadow-[#2A1F5C]/40"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                  Edit Account
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Primary Content Column (Left) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Stats Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard
              icon={PhoneIcon}
              label="Phone"
              value={account.phone || "—"}
              variant="primary"
            />
            <StatCard
              icon={GlobeAltIcon}
              label="Website"
              value={account.website ? account.website.replace(/^https?:\/\//, "") : "—"}
              variant="secondary"
            />
            <StatCard
              icon={UserGroupIcon}
              label="Employees"
              value={account.employees?.toLocaleString("en-IN") || "—"}
              variant="tertiary"
            />
            <StatCard
              icon={CurrencyRupeeIcon}
              label="Annual Revenue"
              value={formatCurrency(account.annualRevenue) || "—"}
              variant="quaternary"
            />
          </div>

          {/* Deals Pipeline Section */}
          <SectionCard
            title="Deals Pipeline"
            subtitle={`Total Pipeline Value: ${formatCurrency(totalDealsValue)}`}
            action={
              <button
                onClick={() => navigate(`/deals/new?accountId=${id}`)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#3B2E7E] to-[#2A1F5C] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-[#3B2E7E]/30 transition-all"
              >
                <PlusIcon className="w-4 h-4" />
                New Deal
              </button>
            }
          >
            {account.deals?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {account.deals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            ) : (
              <EmptyState icon={CurrencyRupeeIcon} title="No deals associated" action="Create a deal" onAction={() => navigate(`/deals/new?accountId=${id}`)} />
            )}
          </SectionCard>

          {/* Contacts Section */}
          <SectionCard
            title="Contacts"
            subtitle="People associated with this account"
            action={
              <button
                onClick={() => navigate(`/contacts/new?accountId=${id}`)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#3B2E7E]/20 text-[#3B2E7E] text-sm font-semibold rounded-xl hover:bg-[#3B2E7E]/5 transition-all"
              >
                <PlusIcon className="w-4 h-4" />
                Add Contact
              </button>
            }
          >
            {account.contacts?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {account.contacts.map((contact) => (
                  <ContactCard key={contact.id} contact={contact} />
                ))}
              </div>
            ) : (
              <EmptyState icon={UserGroupIcon} title="No contacts found" action="Add your first contact" onAction={() => navigate(`/contacts/new?accountId=${id}`)} />
            )}
          </SectionCard>
        </div>

        {/* Sidebar Column (Right) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Account Details Information */}
          <SectionCard title="Account Information" noPadding>
            <div className="grid grid-cols-1 divide-y divide-[#3B2E7E]/10">
              <div className="p-2">
                <InfoItem icon={BriefcaseIcon} label="Account Type" value={formatLabel(account.accountType)} iconBg="bg-rose-100" iconColor="text-rose-600" />
                <InfoItem icon={ChartBarIcon} label="Industry" value={account.industry} iconBg="bg-emerald-100" iconColor="text-emerald-600" />
              </div>
              <div className="p-2">
                <InfoItem icon={BuildingOfficeIcon} label="Ownership" value={account.ownership} iconBg="bg-sky-100" iconColor="text-sky-600" />
                {account.parentAccount && (
                  <InfoItem icon={LinkIcon} label="Parent Account" value={account.parentAccount.accountName} isLink href={`/accounts/${account.parentAccount.id}`} iconBg="bg-purple-100" iconColor="text-purple-600" />
                )}
              </div>
            </div>
          </SectionCard>

          {/* Address Section */}
          {billingAddress && (
            <SectionCard title="Location Details">
              <AddressCard title="Billing Address" icon={MapPinIcon} address={billingAddress} variant="primary" />
            </SectionCard>
          )}

          {/* Activity Timeline */}
          <SectionCard title="Activity Timeline">
            <div className="relative">
              <div className="absolute left-5 top-6 bottom-6 w-px bg-gradient-to-b from-[#3B2E7E] via-[#3B2E7E]/30 to-transparent"></div>
              <div className="space-y-6">
                <div className="relative flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B2E7E] to-[#2A1F5C] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#3B2E7E]/30 z-10">
                    <CalendarDaysIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="pt-1">
                    <p className="text-sm font-semibold text-slate-800">Created</p>
                    <p className="text-xs text-slate-500 mt-0.5">{formatDate(account.createdAt)}</p>
                    {account.createdBy?.name && <p className="text-xs text-slate-400 mt-1">by {account.createdBy.name}</p>}
                  </div>
                </div>
                <div className="relative flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-200/50 z-10">
                    <ClockIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="pt-1">
                    <p className="text-sm font-semibold text-slate-800">Last Modified</p>
                    <p className="text-xs text-slate-500 mt-0.5">{formatDate(account.updatedAt)}</p>
                    {account.modifiedBy?.name && <p className="text-xs text-slate-400 mt-1">by {account.modifiedBy.name}</p>}
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Hierarchy / Child Accounts */}
          {account.childAccounts?.length > 0 && (
            <SectionCard title={`Child Accounts (${account.childAccounts.length})`}>
              <div className="space-y-2">
                {account.childAccounts.map((child) => (
                  <Link
                    key={child.id}
                    to={`/accounts/${child.id}`}
                    className="group flex items-center gap-4 p-4 rounded-xl border border-[#3B2E7E]/10 hover:border-[#3B2E7E]/30 hover:shadow-lg hover:bg-[#3B2E7E]/5 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B2E7E]/20 to-purple-100 flex items-center justify-center">
                      <BuildingOfficeIcon className="w-5 h-5 text-[#3B2E7E]" />
                    </div>
                    <span className="text-sm font-semibold text-slate-800 group-hover:text-[#3B2E7E] transition-colors flex-1 truncate">
                      {child.accountName}
                    </span>
                    <ChevronRightIcon className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </SectionCard>
          )}

 
        </div>
      </div>
    </div>
  );
};

export default AccountDetail;

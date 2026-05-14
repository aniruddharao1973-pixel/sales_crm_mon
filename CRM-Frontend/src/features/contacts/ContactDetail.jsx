

// src/features/contacts/ContactDetail.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchContact, clearCurrentContact } from "./contactSlice";
import { formatCurrency, formatDate, formatLabel } from "../../constants";
import Spinner from "../../components/Spinner";
import Avatar from "../../components/Avatar";
import {
  PencilSquareIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  DevicePhoneMobileIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  UserIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ClockIcon,
  PlusIcon,
  CurrencyRupeeIcon,
  ChevronRightIcon,
  ArrowTopRightOnSquareIcon,
  EllipsisHorizontalIcon,
  ShareIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";

const InfoItem = ({
  icon: Icon,
  label,
  value,
  isLink,
  to,
  iconBg = "bg-[#3B2E7E]/10",
  iconColor = "text-[#3B2E7E]",
}) => {
  if (!value) return null;

  return (
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
          <Link
            to={to}
            className="text-sm font-semibold text-[#3B2E7E] hover:text-[#2A1F5C] transition-colors"
          >
            {value}
          </Link>
        ) : (
          <p className="text-sm font-semibold text-slate-800 truncate">
            {value}
          </p>
        )}
      </div>
    </div>
  );
};

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

const StatCard = ({ icon: Icon, label, value, variant = "primary" }) => {
  const variants = {
    primary: "from-[#3B2E7E] to-[#2A1F5C] shadow-[#3B2E7E]/30",
    secondary: "from-[#4A3A8C] to-[#3B2E7E] shadow-[#3B2E7E]/30",
    tertiary: "from-[#5A4A9C] to-[#4A3A8C] shadow-[#3B2E7E]/30",
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-[#3B2E7E]/10 hover:shadow-lg hover:shadow-[#3B2E7E]/10 transition-all duration-300">
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${variants[variant]} flex items-center justify-center mb-4 shadow-lg`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-xs font-medium text-slate-500 mt-1">{label}</p>
    </div>
  );
};

const ContactDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { contact, detailLoading } = useSelector((s) => s.contacts);

  useEffect(() => {
    dispatch(fetchContact(id));
    return () => dispatch(clearCurrentContact());
  }, [dispatch, id]);

  if (detailLoading || !contact) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-sm text-slate-500 mt-4">
            Loading contact details...
          </p>
        </div>
      </div>
    );
  }

  const fullName = `${contact.salutation ? contact.salutation + " " : ""}${contact.firstName} ${contact.lastName || ""}`.trim();

  const mailingAddress = [
    contact.mailingFlat,
    contact.mailingStreet || contact.account?.billingStreet,
    contact.mailingCity || contact.account?.billingCity,
    contact.mailingState || contact.account?.billingState,
    contact.mailingZip || contact.account?.billingPincode,
    contact.mailingCountry || contact.account?.billingCountry,
  ]
    .filter(Boolean)
    .join(", ");

  const totalDealsValue =
    contact.deals?.reduce((sum, deal) => sum + (deal.amount || 0), 0) || 0;

  return (
    <div className="max-w-8xl">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        <nav className="flex items-center gap-2 text-sm">
          <Link
            to="/contacts"
            className="flex items-center gap-2 text-slate-500 hover:text-[#3B2E7E] transition-colors font-medium"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Contacts
          </Link>
          <ChevronRightIcon className="w-4 h-4 text-slate-300" />
          <span className="text-slate-800 font-semibold truncate max-w-[200px]">
            {fullName}
          </span>
        </nav>

        {/* Quick Actions removed as per user request */}
      </div>

      {/* Hero Header Card */}
      <div className="relative bg-gradient-to-b from-[#3B2E7E] to-[#2A1F5C] rounded-3xl p-8 mb-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-300 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-pink-300 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-6 right-6 w-20 h-20 border border-white/10 rounded-full"></div>
        <div className="absolute top-10 right-10 w-12 h-12 border border-white/10 rounded-full"></div>
        <div className="absolute bottom-6 left-1/4 w-16 h-16 border border-white/5 rounded-full"></div>

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="ring-4 ring-white/20 rounded-2xl p-1 bg-white/10 backdrop-blur-sm">
                <Avatar
                  name={contact.firstName}
                  secondName={contact.lastName}
                  size="xl"
                  image={contact.image}
                  className="!rounded-xl !w-20 !h-20 !text-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-400 rounded-lg border-3 border-[#2A1F5C] flex items-center justify-center shadow-lg">
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {fullName}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                {contact.title && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-sm font-medium text-white/90 backdrop-blur-sm border border-white/10">
                    <BriefcaseIcon className="w-4 h-4" />
                    {contact.title}
                  </span>
                )}
                {contact.account && (
                  <Link
                    to={`/accounts/${contact.account?.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 text-sm font-medium text-white hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10"
                  >
                    <BuildingOfficeIcon className="w-4 h-4" />
                    {contact.account?.accountName}
                    <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
              {contact.email && (
                <p className="text-purple-200 text-sm mt-3 flex items-center gap-2">
                  <EnvelopeIcon className="w-4 h-4" />
                  {contact.email}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl backdrop-blur-sm transition-all duration-200 border border-white/10"
              >
                <PhoneIcon className="w-4 h-4" />
                Call
              </a>
            )}
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl backdrop-blur-sm transition-all duration-200 border border-white/10"
              >
                <EnvelopeIcon className="w-4 h-4" />
                Email
              </a>
            )}
            <button
              onClick={() => navigate(`/contacts/${id}/edit`)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white text-[#3B2E7E] text-sm font-semibold rounded-xl hover:bg-purple-50 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#2A1F5C]/30"
            >
              <PencilSquareIcon className="w-4 h-4" />
              Edit Contact
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={CurrencyRupeeIcon}
          label="Total Deal Value"
          value={formatCurrency(totalDealsValue)}
          variant="primary"
        />
        <StatCard
          icon={BriefcaseIcon}
          label="Active Deals"
          value={contact.deals?.length || 0}
          variant="secondary"
        />
        <StatCard
          icon={CalendarDaysIcon}
          label="Days Since Created"
          value={Math.floor(
            (new Date() - new Date(contact.createdAt)) / (1000 * 60 * 60 * 24),
          )}
          variant="tertiary"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact Information */}
          <SectionCard
            title="Contact Information"
            subtitle="Primary contact details and information"
            noPadding
          >
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#3B2E7E]/10">
              <div className="p-2">
                <InfoItem
                  icon={EnvelopeIcon}
                  label="Email"
                  value={contact.email}
                  iconBg="bg-rose-100"
                  iconColor="text-rose-600"
                />
                <InfoItem
                  icon={PhoneIcon}
                  label="Phone"
                  value={contact.phone}
                  iconBg="bg-emerald-100"
                  iconColor="text-emerald-600"
                />
                <InfoItem
                  icon={DevicePhoneMobileIcon}
                  label="Mobile"
                  value={contact.mobile}
                  iconBg="bg-sky-100"
                  iconColor="text-sky-600"
                />
              </div>
              <div className="p-2">
                <InfoItem
                  icon={BuildingOfficeIcon}
                  label="Department"
                  value={contact.department}
                  iconBg="bg-amber-100"
                  iconColor="text-amber-600"
                />
                <InfoItem
                  icon={BriefcaseIcon}
                  label="Title"
                  value={contact.title}
                  iconBg="bg-purple-100"
                  iconColor="text-purple-600"
                />
                <InfoItem
                  icon={UserIcon}
                  label="Owner"
                  value={contact.owner?.name}
                  iconBg="bg-[#3B2E7E]/10"
                  iconColor="text-[#3B2E7E]"
                />

              </div>
            </div>

            {contact.leadSource && (
              <div className="mx-6 mb-6 p-4 rounded-xl bg-gradient-to-r from-[#3B2E7E]/10 to-purple-50 border border-[#3B2E7E]/10">
                <p className="text-xs font-semibold text-[#3B2E7E] uppercase tracking-wide mb-2">
                  Lead Source
                </p>
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white text-sm font-semibold text-slate-700 shadow-sm border border-[#3B2E7E]/10">
                  {formatLabel(contact.leadSource)}
                </span>
              </div>
            )}
          </SectionCard>

          {/* Address */}
          {mailingAddress && (
            <SectionCard
              title="Mailing Address"
              subtitle="Primary mailing location"
            >
              <div className="flex items-start gap-4 p-5 rounded-xl bg-gradient-to-br from-[#3B2E7E]/5 to-purple-50/50 border border-[#3B2E7E]/10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3B2E7E] to-[#2A1F5C] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#3B2E7E]/30">
                  <MapPinIcon className="w-6 h-6 text-white" />
                </div>
                <div className="pt-1">
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                    {mailingAddress}
                  </p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(mailingAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#3B2E7E] hover:text-[#2A1F5C] mt-2 transition-colors"
                  >
                    View on Map
                    <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </SectionCard>
          )}

          {/* Description */}
          {contact.description && (
            <SectionCard
              title="Description"
              subtitle="Additional notes and details"
            >
              <div className="prose prose-sm prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {contact.description}
                </p>
              </div>
            </SectionCard>
          )}

          {/* Deals */}
          <SectionCard
            title="Associated Deals"
            subtitle={`${contact.deals?.length || 0} deals worth ${formatCurrency(totalDealsValue)}`}
            action={
              <button
                onClick={() =>
                  navigate(
                    `/deals/new?accountId=${contact.accountId}&contactId=${contact.id}`,
                  )
                }
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#3B2E7E] to-[#2A1F5C] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-[#3B2E7E]/30 transition-all duration-200"
              >
                <PlusIcon className="w-4 h-4" />
                New Deal
              </button>
            }
          >
            {contact.deals?.length > 0 ? (
              <div className="space-y-4">
                {contact.deals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3B2E7E]/10 to-purple-100 flex items-center justify-center mx-auto mb-4">
                  <CurrencyRupeeIcon className="w-8 h-8 text-[#3B2E7E]" />
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-1">
                  No deals yet
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  Create the first deal for this contact
                </p>
                <button
                  onClick={() =>
                    navigate(
                      `/deals/new?accountId=${contact.accountId}&contactId=${contact.id}`,
                    )
                  }
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#3B2E7E] hover:text-[#2A1F5C] transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  Create Deal
                </button>
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Account Card */}
          {contact.account && (
            <div className="bg-gradient-to-br from-[#3B2E7E] to-[#2A1F5C] rounded-2xl p-5 text-white shadow-xl shadow-[#3B2E7E]/30 relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>

              <h3 className="relative text-xs font-semibold uppercase tracking-wider text-purple-200 mb-4">
                Associated Account
              </h3>
              <Link
                to={`/accounts/${contact.account.id}`}
                className="relative group flex items-center gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm border border-white/10"
              >
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-[#3B2E7E] font-bold text-lg shadow-lg">
                  {contact.account.accountName?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    {contact.account.accountName}
                  </p>
                  <p className="text-xs text-purple-200 mt-0.5">
                    Click to view account
                  </p>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-purple-200 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm shadow-[#3B2E7E]/5 border border-[#3B2E7E]/10 p-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-rose-50 transition-all duration-200 group border border-transparent hover:border-rose-100"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-200/50">
                    <EnvelopeIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-rose-600 transition-colors">
                      Send Email
                    </p>
                    <p className="text-xs text-slate-500 truncate max-w-[150px]">
                      {contact.email}
                    </p>
                  </div>
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-emerald-50 transition-all duration-200 group border border-transparent hover:border-emerald-100"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200/50">
                    <PhoneIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">
                      Call Contact
                    </p>
                    <p className="text-xs text-slate-500">{contact.phone}</p>
                  </div>
                </a>
              )}
              {contact.mobile && (
                <a
                  href={`tel:${contact.mobile}`}
                  className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-sky-50 transition-all duration-200 group border border-transparent hover:border-sky-100"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-200/50">
                    <DevicePhoneMobileIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-sky-600 transition-colors">
                      Call Mobile
                    </p>
                    <p className="text-xs text-slate-500">{contact.mobile}</p>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Timeline / Audit Info */}
          <div className="bg-white rounded-2xl shadow-sm shadow-[#3B2E7E]/5 border border-[#3B2E7E]/10 p-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Activity Timeline
            </h3>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-5 top-6 bottom-6 w-px bg-gradient-to-b from-[#3B2E7E] via-[#3B2E7E]/30 to-transparent"></div>

              <div className="space-y-6">
                <div className="relative flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B2E7E] to-[#2A1F5C] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#3B2E7E]/30 z-10">
                    <CalendarDaysIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="pt-1">
                    <p className="text-sm font-semibold text-slate-800">
                      Created
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatDate(contact.createdAt)}
                    </p>
                    {contact.createdBy?.name && (
                      <p className="text-xs text-slate-400 mt-1">
                        by {contact.createdBy.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-200/50 z-10">
                    <ClockIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="pt-1">
                    <p className="text-sm font-semibold text-slate-800">
                      Last Modified
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatDate(contact.updatedAt)}
                    </p>
                    {contact.modifiedBy?.name && (
                      <p className="text-xs text-slate-400 mt-1">
                        by {contact.modifiedBy.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

 
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;

// src/features/deals/DealDetail.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { fetchDeal, updateDeal, clearCurrentDeal } from "./dealSlice";
import SendEmailModal from "../email/components/SendEmailModal";
import EmailTemplateManager from "../email/components/EmailTemplateManager";
import EmailLogs from "../email/components/EmailLogs";
import { fetchMe } from "../auth/authSlice";
import NotesModal from "./components/NotesModal";
import StageHistoryModal from "./components/StageHistoryModal";
import StageModal from "./components/StageModal";
import {
  STAGE_COLORS,
  PROGRESS_STAGES,
  PIPELINE_STAGES,
  STATUS_COLORS,
  formatCurrency,
  formatDate,
  formatLabel,
} from "../../constants";
import Spinner from "../../components/Spinner";
import {
  CurrencyRupeeIcon,
  PencilSquareIcon,
  ArrowLeftIcon,
  BuildingOfficeIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  BriefcaseIcon,
  TagIcon,
  UserIcon,
  EnvelopeIcon,
  ArrowRightIcon,
  SparklesIcon,
  FlagIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ShareIcon,
  EllipsisVerticalIcon,
  StarIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon as CheckCircleSolid,
  StarIcon as StarSolid,
} from "@heroicons/react/24/solid";

/* ────────────────────── helpers ────────────────────── */

const getStageIndex = (stage) => PROGRESS_STAGES.indexOf(stage);

const getStageIcon = (stage) => {
  if (stage === "CLOSED_WON") return CheckCircleSolid;
  if (stage === "CLOSED_LOST" || stage === "CLOSED_LOST_TO_COMPETITION")
    return XCircleIcon;
  return null;
};

const getProbabilityColor = (prob) => {
  if (prob >= 75) return "text-emerald-600";
  if (prob >= 50) return "text-amber-600";
  if (prob >= 25) return "text-orange-600";
  return "text-rose-600";
};

const getProbabilityBg = (prob) => {
  if (prob >= 75) return "bg-emerald-500";
  if (prob >= 50) return "bg-amber-500";
  if (prob >= 25) return "bg-orange-500";
  return "bg-rose-500";
};

const getTimeSince = (date) => {
  if (!date) return "";
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

const detectEmailProvider = (email) => {
  if (!email) return "SMTP";
  const domain = email.split("@")[1]?.toLowerCase();
  if (domain.includes("gmail.com")) return "GOOGLE";
  if (
    domain.includes("outlook.com") ||
    domain.includes("hotmail.com") ||
    domain.includes("live.com")
  ) {
    return "MICROSOFT";
  }
  return "SMTP";
};

/* ────────────────── Info Row Component ────────────────── */

const InfoRow = ({
  icon: Icon,
  label,
  children,
  iconBg = "bg-[#3B2E7E]/10",
  iconColor = "text-[#3B2E7E]",
}) => {
  const hasValue = children && children !== "—" && children !== "-";
  
  return (
    <div className="group flex items-center gap-4 p-3 rounded-xl hover:bg-[#3B2E7E]/5 transition-all duration-200">
      <div
        className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}
      >
        <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <div className={`text-sm font-semibold truncate ${!hasValue ? "text-slate-300 italic" : "text-slate-800"}`}>
          {hasValue ? children : "—"}
        </div>
      </div>
    </div>
  );
};

/* ────────────────── Stat Card Component ────────────────── */

const StatCard = ({
  icon: Icon,
  label,
  value,
  subtext,
  variant = "primary",
}) => {
  const variants = {
    primary: "from-[#3B2E7E] to-[#2A1F5C] shadow-[#3B2E7E]/30",
    emerald: "from-emerald-500 to-emerald-600 shadow-emerald-200",
    amber: "from-amber-500 to-amber-600 shadow-amber-200",
    sky: "from-sky-500 to-sky-600 shadow-sky-200",
  };

  return (
    <div className="bg-white rounded-xl border border-[#3B2E7E]/10 p-3.5 hover:shadow-lg hover:shadow-[#3B2E7E]/10 transition-all duration-300">
      <div className="flex items-center justify-between mb-2.5">
        <div
          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${variants[variant]} flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        {subtext && (
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{subtext}</span>
        )}
      </div>
      <p className="text-xl font-bold text-slate-800 truncate">{value}</p>
      <p className="text-[11px] font-medium text-slate-500 mt-0.5">{label}</p>
    </div>
  );
};

/* ════════════════════ MAIN COMPONENT ════════════════════ */

const DealDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { deal, detailLoading } = useSelector((s) => s.deals);
  const { user } = useSelector((state) => state.auth);

  const emailProvider = user?.emailProvider || detectEmailProvider(user?.email);

  const [tab, setTab] = useState("overview");
  const [stageModal, setStageModal] = useState({
    open: false,
    stage: null,
    description: "",
  });
  const [updatingStage, setUpdatingStage] = useState(false);
  const [hoveredStage, setHoveredStage] = useState(null);
  const [showSendEmail, setShowSendEmail] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showEmailLogs, setShowEmailLogs] = useState(false);

  const API = import.meta.env.VITE_API_BASE_URL;

  const connectGmail = async () => {
    const res = await fetch(`${API}/email/connect/google`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    window.location.href = data.url;
  };

  const connectOutlook = async () => {
    const res = await fetch(`${API}/email/connect/outlook`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    window.location.href = data.url;
  };

  const [notesModal, setNotesModal] = useState({
    open: false,
    historyId: null,
    description: "",
  });

  const [stageHistoryModal, setStageHistoryModal] = useState({
    open: false,
    stage: null,
    data: [],
  });

  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    dispatch(fetchDeal(id));
    dispatch(fetchMe());
    return () => dispatch(clearCurrentDeal());
  }, [dispatch, id]);

  const handleStageChange = async () => {
    try {
      setUpdatingStage(true);

      await dispatch(
        updateDeal({
          id,
          stage: stageModal.stage,
          description: stageModal.description,
        }),
      ).unwrap();

      setStageModal({ open: false, stage: null, description: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStage(false);
    }
  };

  if (detailLoading || !deal) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-5">
          {/* Loader */}
          <div className="relative w-16 h-16">
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 blur-md opacity-40 animate-pulse" />

            {/* Spinning ring */}
            <div className="w-16 h-16 rounded-full border-4 border-transparent border-t-purple-500 border-r-violet-500 animate-spin" />

            {/* Inner soft circle */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-100 to-white opacity-70" />
          </div>

          {/* Text */}
          <p className="text-sm font-medium text-slate-600 animate-pulse">
            Loading lead details...
          </p>
        </div>
      </div>
    );
  }

  const currentIdx = getStageIndex(deal.stage);
  const probability = deal.probability ?? 0;
  const isClosed =
    deal.stage === "CLOSED_WON" ||
    deal.stage === "CLOSED_LOST" ||
    deal.stage === "CLOSED_LOST_TO_COMPETITION";

  // ✅ GROUP STAGE HISTORY (NEW)
  const groupedHistory = Object.values(
    (deal.stageHistory || []).reduce((acc, item) => {
      if (!acc[item.stage]) acc[item.stage] = [];
      acc[item.stage].push(item);
      return acc;
    }, {}),
  );

  const tabs = [
    { key: "overview", label: "Overview", icon: DocumentTextIcon },
    { key: "timeline", label: "Timeline", icon: ClockIcon },
    { key: "history", label: "Stage History", icon: ChartBarIcon },
  ];

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ════════════════════ RENDER ════════════════════ */

  return (
    <div className=" mx-auto space-y-6 pb-10">
      {/* ───────────── BREADCRUMB ───────────── */}
      <nav className="flex items-center gap-2 text-sm">
        <Link
          to="/deals"
          className="text-slate-500 hover:text-[#3B2E7E] transition-colors font-medium"
        >
          Leads
        </Link>
        <ArrowRightIcon className="w-4 h-4 text-slate-300" />
        <span className="text-slate-800 font-semibold truncate">
          {deal.dealName}
        </span>
      </nav>

      {/* ───────────── HERO HEADER ───────────── */}
      <div className="relative bg-gradient-to-b from-[#433877] to-[#463b79] rounded-3xl p-3 lg:p-4 mb-6 mx-0 lg:mx-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-300 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        {/* Decorative Circles */}
        <div className="absolute top-6 right-6 w-20 h-20 border border-white/10 rounded-full" />
        <div className="absolute top-10 right-10 w-12 h-12 border border-white/10 rounded-full" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/deals")}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all border border-white/10"
            >
              <ArrowLeftIcon className="w-4.5 h-4.5 text-white" />
            </button>

            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                  isClosed && deal.stage === "CLOSED_WON"
                    ? "bg-gradient-to-br from-emerald-400 to-emerald-600"
                    : isClosed
                      ? "bg-gradient-to-br from-rose-400 to-rose-600"
                      : "bg-white/20 backdrop-blur-sm"
                }`}
              >
                <span className="text-white text-lg font-bold">₹</span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
                    {deal.dealName}
                  </h1>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${STAGE_COLORS[deal.stage]?.bg || "bg-slate-100"} ${STAGE_COLORS[deal.stage]?.text || "text-slate-700"} border border-white/20 shadow-sm`}
                  >
                    {formatLabel(deal.stage)}
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${STATUS_COLORS[deal.status]?.bg || "bg-slate-100"} ${STATUS_COLORS[deal.status]?.text || "text-slate-700"} border border-white/20 shadow-sm`}
                  >
                    {formatLabel(deal.status)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-purple-200">
                  <span className="font-mono text-xs bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                    {deal.dealLogId}
                  </span>
                  <span>•</span>
                  <span className="font-bold text-white">
                    {formatCurrency(deal.amount)}
                  </span>
                  {deal.closingDate && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <CalendarDaysIcon className="w-4 h-4" />
                        {formatDate(deal.closingDate)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* <div className="flex items-center gap-2 flex-wrap">
            <button className="p-2.5 rounded-xl hover:bg-white/10 transition-colors text-white border border-white/10">
              <ShareIcon className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-xl hover:bg-white/10 transition-colors text-white border border-white/10">
              <StarIcon className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-xl hover:bg-white/10 transition-colors text-white border border-white/10">
              <EllipsisVerticalIcon className="w-5 h-5" />
            </button>
          </div> */}
        </div>
      </div>

      {/* ───────────── STAT CARDS ───────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={() => <span className="text-white text-lg font-bold">₹</span>}
          label="Lead Value"
          value={formatCurrency(deal.amount)}
          variant="emerald"
        />
        <StatCard
          icon={ArrowTrendingUpIcon}
          label="Probability"
          value={`${probability}%`}
          subtext={
            probability >= 75 ? "High" : probability >= 50 ? "Medium" : "Low"
          }
          variant="primary"
        />
        <StatCard
          icon={CalendarDaysIcon}
          label="Closing Date"
          value={formatDate(deal.closingDate)}
          subtext={getTimeSince(deal.createdAt)}
          variant="sky"
        />
        <StatCard
          icon={ChartBarIcon}
          label="Current Stage"
          value={formatLabel(deal.stage)}
          subtext={`Step ${currentIdx + 1} of ${PROGRESS_STAGES.length}`}
          variant="amber"
        />
      </div>

      {/* ───────────── ACTION BUTTONS ───────────── */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          disabled={!user?.emailProvider}
          onClick={() => {
            if (!user?.emailProvider) {
              alert("Please connect your email provider first");
              return;
            }
            if (!deal.contact?.email) {
              alert("Contact email not available for this deal");
              return;
            }
            setShowSendEmail(true);
          }}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            user?.emailProvider
              ? "bg-white border-2 border-slate-200 text-slate-700 hover:border-[#3B2E7E]/30 hover:bg-[#3B2E7E]/5"
              : "bg-slate-100 text-slate-400 cursor-not-allowed border-2 border-slate-200"
          }`}
        >
          <EnvelopeIcon className="w-4 h-4" />
          Send Email
        </button>

        {!user?.emailAccessToken && (
          <>
            {emailProvider === "GOOGLE" && (
              <button
                onClick={connectGmail}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-all"
              >
                Connect Gmail
              </button>
            )}
            {emailProvider === "MICROSOFT" && (
              <button
                onClick={connectOutlook}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-sky-600 text-white hover:bg-sky-700 transition-all"
              >
                Connect Outlook
              </button>
            )}
            {emailProvider === "SMTP" && (
              <button
                onClick={() => navigate("/settings/email")}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-slate-700 text-white hover:bg-slate-800 transition-all"
              >
                Configure SMTP
              </button>
            )}
          </>
        )}

        <button
          onClick={() => setShowEmailLogs(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:border-[#3B2E7E]/30 hover:bg-[#3B2E7E]/5 transition-all"
        >
          <ClockIcon className="w-4 h-4" />
          Email Logs
        </button>

        <button
          onClick={() => setShowTemplates(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:border-[#3B2E7E]/30 hover:bg-[#3B2E7E]/5 transition-all"
        >
          <DocumentTextIcon className="w-4 h-4" />
          Templates
        </button>

        {user?.role !== "KAM" && (
          <button
            onClick={() => navigate(`/deals/${id}/edit`)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#3B2E7E] to-[#2A1F5C] text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-[#3B2E7E]/30 transition-all"
          >
            <PencilSquareIcon className="w-4 h-4" />
            Edit Lead
          </button>
        )}
      </div>

      {/* ───────────── PIPELINE / STAGE BAR ───────────── */}
      <div className="bg-white border border-[#3B2E7E]/10 rounded-2xl p-6 shadow-sm shadow-[#3B2E7E]/5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B2E7E] to-[#2A1F5C] flex items-center justify-center shadow-lg shadow-[#3B2E7E]/30">
              <FlagIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Lead Pipeline
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Track progress through sales stages
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500">
              Probability
            </span>
            <div className="w-32 h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProbabilityBg(probability)}`}
                style={{ width: `${probability}%` }}
              />
            </div>
            <span
              className={`text-sm font-bold ${getProbabilityColor(probability)}`}
            >
              {probability}%
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-y-3 gap-x-1.5 p-3">
          {PROGRESS_STAGES.map((stage, idx) => {
            const isActive = deal.stage === stage;
            const isPast = idx < currentIdx;
            const StageIcon = getStageIcon(stage);
            const pipelineInfo = PIPELINE_STAGES.find((p) => p.key === stage);
            const stageColor =
              STAGE_COLORS[stage] || "bg-slate-50 text-slate-700";

            return (
              <div key={stage} className="flex items-center">
                <button
                  disabled={updatingStage}
                  onClick={() =>
                    setStageModal({
                      open: true,
                      stage,
                      description: "",
                    })
                  }
                  onMouseEnter={() => setHoveredStage(stage)}
                  onMouseLeave={() => setHoveredStage(null)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap border-2 ${
                    isActive
                      ? `${stageColor} ring-4 ring-offset-1 ring-current/20 shadow-sm scale-105`
                      : isPast
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-700"
                  } ${updatingStage ? "opacity-60 cursor-not-allowed" : "cursor-pointer"} ${
                    hoveredStage === stage && !isActive
                      ? "ring-4 ring-[#3B2E7E]/20"
                      : ""
                  }`}
                >
                  {isPast && (
                    <CheckCircleSolid className="w-4 h-4 text-emerald-500" />
                  )}
                  {StageIcon && isActive && <StageIcon className="w-4 h-4" />}
                  {pipelineInfo?.label || formatLabel(stage)}
                </button>

                {idx < PROGRESS_STAGES.length - 1 && (
                  <ArrowRightIcon
                    className={`w-3.5 h-3.5 mx-1 flex-shrink-0 ${isPast ? "text-emerald-300" : "text-slate-300"}`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {updatingStage && (
          <div className="flex items-center gap-2 mt-4 text-xs text-[#3B2E7E] font-medium">
            <div className="w-3.5 h-3.5 border-2 border-[#3B2E7E] border-t-transparent rounded-full animate-spin" />
            Updating stage...
          </div>
        )}
      </div>

      {/* ───────────── TABS ───────────── */}
      <div className="bg-white border border-[#3B2E7E]/10 rounded-2xl shadow-sm shadow-[#3B2E7E]/5 overflow-visible">
        <div className="flex border-b border-[#3B2E7E]/10 bg-gradient-to-r from-[#3B2E7E]/5 to-transparent">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all border-b-2 -mb-px ${
                  tab === t.key
                    ? "border-[#3B2E7E] text-[#3B2E7E] bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-white/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* ═══════════ OVERVIEW TAB ═══════════ */}
          {tab === "overview" && (
            <div className="grid lg:grid-cols-3 gap-6">
              {/* LEFT COLUMN */}
              <div className="lg:col-span-2 space-y-6">
                {/* Deal Info */}
                <div className="bg-white rounded-2xl border border-[#3B2E7E]/10 overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#3B2E7E]/10 bg-gradient-to-r from-[#3B2E7E]/5 to-transparent">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3B2E7E] to-[#2A1F5C] flex items-center justify-center shadow-lg">
                        <BriefcaseIcon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                        Lead Information
                      </h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid sm:grid-cols-2 gap-2">
                      <div>
                        <InfoRow
                          icon={TagIcon}
                          label="Product Group"
                          iconBg="bg-violet-100"
                          iconColor="text-violet-600"
                        >
                          {formatLabel(deal.productGroup) || "—"}
                        </InfoRow>
                        <InfoRow
                          icon={ChartBarIcon}
                          label="Weightage"
                          iconBg="bg-amber-100"
                          iconColor="text-amber-600"
                        >
                          {formatLabel(deal.weightage) || "—"}
                        </InfoRow>
                        <InfoRow
                          icon={FlagIcon}
                          label="Status"
                          iconBg={STATUS_COLORS[deal.status]?.bg || "bg-slate-100"}
                          iconColor={STATUS_COLORS[deal.status]?.text || "text-slate-700"}
                        >
                          {formatLabel(deal.status)}
                        </InfoRow>
                        <InfoRow
                          icon={CalendarDaysIcon}
                          label="Closing Date"
                          iconBg="bg-sky-100"
                          iconColor="text-sky-600"
                        >
                          {formatDate(deal.closingDate)}
                        </InfoRow>
                      </div>
                      <div>
                        <InfoRow
                          icon={UserIcon}
                          label="Person In Charge"
                          iconBg="bg-rose-100"
                          iconColor="text-rose-600"
                        >
                          {deal.personInCharge || "—"}
                        </InfoRow>
                        <InfoRow
                          icon={ArrowTrendingUpIcon}
                          label="Next Step"
                          iconBg="bg-emerald-100"
                          iconColor="text-emerald-600"
                        >
                          {deal.nextStep || "—"}
                        </InfoRow>
                        <InfoRow
                          icon={ShieldCheckIcon}
                          label="Lead Type"
                          iconBg="bg-[#3B2E7E]/10"
                          iconColor="text-[#3B2E7E]"
                        >
                          {formatLabel(deal.dealType) || "—"}
                        </InfoRow>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {deal.description && (
                  <div className="bg-white rounded-2xl border border-[#3B2E7E]/10 overflow-hidden">
                    <div className="px-6 py-4 border-b border-[#3B2E7E]/10 bg-gradient-to-r from-[#3B2E7E]/5 to-transparent">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-lg">
                          <DocumentTextIcon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                          Description
                        </h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {deal.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl border border-[#3B2E7E]/10 overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#3B2E7E]/10 bg-gradient-to-r from-[#3B2E7E]/5 to-transparent">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3B2E7E] to-[#2A1F5C] flex items-center justify-center shadow-lg">
                        <ClockIcon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                        Recent Activity
                      </h3>
                    </div>
                  </div>
                  <div className="p-4">
                    {deal.stageHistory?.length > 0 ? (
                      <div className="space-y-2">
                        {deal.stageHistory.slice(0, 5).map((h, i) => (
                          <div
                            key={h.id}
                            className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#3B2E7E]/5 to-purple-50/50 rounded-xl border border-[#3B2E7E]/10 hover:shadow-md hover:shadow-[#3B2E7E]/10 transition-all"
                          >
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center ${STAGE_COLORS[h.stage] || "bg-slate-100"}`}
                            >
                              <SparklesIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-900">
                                Moved to{" "}
                                <span className="text-[#3B2E7E]">
                                  {formatLabel(h.stage)}
                                </span>
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {h.changedBy?.name} • {formatDate(h.createdAt)}
                              </p>
                            </div>
                            {i === 0 && (
                              <span className="px-2.5 py-1 rounded-lg bg-[#3B2E7E] text-white text-xs font-bold">
                                Latest
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <ClockIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                        <p className="text-sm text-slate-400 italic">
                          No activity yet
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT SIDEBAR */}
              <div className="space-y-6">
                {/* Account */}
                {deal.account && (
                  <div className="bg-white rounded-2xl border border-[#3B2E7E]/10 p-5">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <BuildingOfficeIcon className="w-4 h-4 text-[#3B2E7E]" />
                      Account
                    </h3>
                    <Link
                      to={`/accounts/${deal.account.id}`}
                      className="group flex items-center gap-3 p-4 bg-gradient-to-br from-[#3B2E7E]/5 to-purple-50/50 rounded-xl border border-[#3B2E7E]/10 hover:shadow-lg hover:shadow-[#3B2E7E]/10 transition-all"
                    >
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#3B2E7E] to-[#5A4A9C] flex items-center justify-center shadow-lg shadow-[#3B2E7E]/30">
                        <BuildingOfficeIcon className="w-6 h-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900 group-hover:text-[#3B2E7E] transition-colors truncate">
                          {deal.account.accountName}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          View Account
                          <ArrowTopRightOnSquareIcon className="w-3 h-3" />
                        </p>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Contact */}
                {deal.contact && (
                  <div className="bg-white rounded-2xl border border-[#3B2E7E]/10 p-5">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <UserCircleIcon className="w-4 h-4 text-[#3B2E7E]" />
                      Contact
                    </h3>
                    <Link
                      to={`/contacts/${deal.contact.id}`}
                      className="group flex items-center gap-3 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 hover:shadow-lg hover:shadow-emerald-100 transition-all"
                    >
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
                        <span className="text-sm font-bold text-white">
                          {deal.contact.firstName?.[0]}
                          {deal.contact.lastName?.[0]}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
                          {deal.contact.firstName} {deal.contact.lastName}
                        </p>
                        {deal.contact.email && (
                          <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                            <EnvelopeIcon className="w-3 h-3" />
                            {deal.contact.email}
                          </p>
                        )}
                      </div>
                    </Link>
                  </div>
                )}

                {/* Owner */}
                {deal.owner && (
                  <div className="bg-white rounded-2xl border border-[#3B2E7E]/10 p-5">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-[#3B2E7E]" />
                      Deal Owner
                    </h3>
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-200">
                        <span className="text-sm font-bold text-white">
                          {deal.owner.name?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {deal.owner.name}
                        </p>
                        {deal.owner.email && (
                          <p className="text-xs text-slate-500">
                            {deal.owner.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}



                {/* Summary Card */}
                <div className="bg-gradient-to-br from-[#3B2E7E] to-[#2A1F5C] rounded-2xl p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                  <div className="relative">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-purple-200 mb-4">
                      Deal Summary
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-purple-200">Value</span>
                        <span className="text-lg font-bold">
                          {formatCurrency(deal.amount)}
                        </span>
                      </div>
                      <div className="h-px bg-white/20" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-purple-200">
                          Probability
                        </span>
                        <span className="text-lg font-bold">
                          {probability}%
                        </span>
                      </div>
                      <div className="h-px bg-white/20" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-purple-200">
                          Weighted Value
                        </span>
                        <span className="text-lg font-bold">
                          {formatCurrency(
                            ((deal.amount || 0) * probability) / 100,
                          )}
                        </span>
                      </div>
                      <div className="h-px bg-white/20" />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-purple-200">
                          Stage Changes
                        </span>
                        <span className="text-lg font-bold">
                          {deal.stageHistory?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════ TIMELINE TAB ═══════════ */}
          {tab === "timeline" && (
            <div className="max-w-3xl mx-auto">
              {deal.stageHistory?.length > 0 ? (
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#3B2E7E] via-[#3B2E7E]/30 to-transparent" />

                  <div className="space-y-4">
                    {deal.stageHistory.map((h, idx) => {
                      const isFirst = idx === 0;
                      const isWon = h.stage === "CLOSED_WON";
                      const isLost =
                        h.stage === "CLOSED_LOST" ||
                        h.stage === "CLOSED_LOST_TO_COMPETITION";

                      return (
                        <div
                          key={h.id}
                          className="relative flex gap-4 pl-2 group"
                        >
                          <div
                            className={`relative z-10 w-10 h-10 rounded-xl border-2 flex items-center justify-center flex-shrink-0 mt-4 transition-all ${
                              isFirst
                                ? "border-[#3B2E7E] bg-[#3B2E7E] shadow-lg shadow-[#3B2E7E]/30"
                                : isWon
                                  ? "border-emerald-500 bg-emerald-500 shadow-lg shadow-emerald-200"
                                  : isLost
                                    ? "border-rose-500 bg-rose-500 shadow-lg shadow-rose-200"
                                    : "border-slate-300 bg-white group-hover:border-[#3B2E7E]"
                            }`}
                          >
                            {isFirst ? (
                              <StarSolid className="w-4 h-4 text-white" />
                            ) : isWon ? (
                              <CheckCircleSolid className="w-4 h-4 text-white" />
                            ) : isLost ? (
                              <XCircleIcon className="w-4 h-4 text-white" />
                            ) : (
                              <div className="w-2.5 h-2.5 bg-slate-300 rounded-full group-hover:bg-[#3B2E7E] transition-colors" />
                            )}
                          </div>

                          <div
                            className={`flex-1 p-5 mb-2 rounded-xl border transition-all ${
                              isFirst
                                ? "bg-[#3B2E7E]/5 border-[#3B2E7E]/20 shadow-sm"
                                : "bg-white border-slate-100 hover:shadow-md hover:border-[#3B2E7E]/20"
                            }`}
                          >
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${STAGE_COLORS[h.stage]}`}
                                >
                                  {formatLabel(h.stage)}
                                </span>
                                {isFirst && (
                                  <span className="px-2.5 py-1 rounded-lg bg-[#3B2E7E] text-white text-xs font-bold">
                                    Current
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-slate-400 font-medium">
                                {formatDate(h.createdAt)}
                              </span>
                            </div>

                            <p className="text-sm text-slate-600 mt-3">
                              Stage changed to{" "}
                              <span className="font-bold text-slate-900">
                                {formatLabel(h.stage)}
                              </span>
                            </p>
                            {h.description && (
                              <p className="text-xs text-slate-500 mt-2 bg-slate-50 border rounded-lg p-2">
                                {h.description}
                              </p>
                            )}

                            {h.changedBy?.name && (
                              <div className="flex items-center gap-2 mt-3">
                                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#3B2E7E] to-[#5A4A9C] flex items-center justify-center shadow-sm">
                                  <span className="text-[10px] font-bold text-white">
                                    {h.changedBy.name[0]}
                                  </span>
                                </div>
                                <span className="text-xs text-slate-500 font-medium">
                                  {h.changedBy.name}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <ClockIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-semibold">
                    No timeline events yet
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Stage changes will appear here
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ═══════════ HISTORY TABLE TAB ═══════════ */}
          {tab === "history" && (
            <div>
              {deal.stageHistory?.length > 0 ? (
                <div className="w-full overflow-x-auto rounded-xl border border-[#3B2E7E]/10">
                  <table className="min-w-[700px] w-full text-sm">
                    <thead>
                      <tr className="bg-[#3B2E7E]/8 text-center border-b border-[#3B2E7E]/10">
                        <th className="px-4 py-3 text-sm font-extrabold uppercase tracking-wide text-[#2A1F5C]">
                          No.
                        </th>
                        <th className="px-4 py-3 text-sm font-extrabold uppercase tracking-wide text-[#2A1F5C]">
                          Changed By
                        </th>
                        <th className="px-4 py-3 text-sm font-extrabold uppercase tracking-wide text-[#2A1F5C]">
                          Timestamp
                        </th>
                        <th className="px-4 py-3 text-sm font-extrabold uppercase tracking-wide text-[#2A1F5C]">
                          Notes
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {groupedHistory.map((group, groupIdx) => {
                        const stage = group[0].stage;

                        return (
                          <>
                            {/* ✅ GROUP HEADER */}
                            <tr className="bg-[#3B2E7E]/5">
                              <td colSpan={5} className="px-4 py-2">
                                <div className="flex items-center justify-between">
                                  <button
                                    onClick={() =>
                                      setStageHistoryModal({
                                        open: true,
                                        stage,
                                        data: group,
                                      })
                                    }
                                    className={`px-4 py-2 rounded-lg text-sm font-extrabold uppercase tracking-wider shadow-sm border border-[#3B2E7E]/20 ${STAGE_COLORS[stage]} hover:scale-105 hover:shadow-md transition`}
                                  >
                                    {formatLabel(stage)}
                                  </button>

                                  <span className="text-xs text-slate-500">
                                    {group.length} update
                                    {group.length > 1 ? "s" : ""}
                                  </span>
                                </div>
                              </td>
                            </tr>

                            {/* ✅ NORMAL ROWS */}
                            {group.map((h, idx) => (
                              <tr
                                key={h.id}
                                className="hover:bg-[#3B2E7E]/5 transition-colors"
                              >
                                <td className="px-4 py-2 text-xs text-slate-400">
                                  {idx + 1}
                                </td>

                                <td className="px-4 py-2">
                                  {h.changedBy?.name}
                                </td>

                                <td className="px-4 py-2">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-800">
                                      {formatDate(h.createdAt)}
                                    </span>
                                    <span className="text-[11px] text-slate-400">
                                      {new Date(h.createdAt).toLocaleTimeString(
                                        "en-IN",
                                        {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        },
                                      )}
                                    </span>
                                  </div>
                                </td>

                                <td className="px-4 py-2 text-xs">
                                  {h.description ? (
                                    <button
                                      onClick={() =>
                                        setNotesModal({
                                          open: true,
                                          historyId: h.id,
                                          description: h.description || "",
                                        })
                                      }
                                      className="text-[#3B2E7E] font-medium hover:underline"
                                    >
                                      Notes
                                    </button>
                                  ) : (
                                    <span className="text-slate-300">—</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16">
                  <ChartBarIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-semibold">
                    No stage history recorded
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    Changes will be tracked here
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* GLOBAL TOOLTIP (fixed, no clipping) */}
      {hoveredStage?.startsWith("note-") &&
        typeof window !== "undefined" &&
        window.innerWidth >= 768 && (
          <div
            className="fixed z-[9999] w-80 bg-white border border-slate-200 rounded-xl shadow-2xl p-4"
            style={{
              top: tooltipPosition.y,
              left: tooltipPosition.x,
            }}
          >
            <p className="text-xs text-slate-500 mb-2 font-semibold">
              Notes Preview
            </p>

            <div className="text-sm text-slate-700 max-h-48 overflow-y-auto">
              {
                deal.stageHistory.find((x) => `note-${x.id}` === hoveredStage)
                  ?.description
              }
            </div>

            <div className="text-[10px] text-slate-400 mt-2 border-t pt-2">
              Click to edit →
            </div>
          </div>
        )}

      {/* MODALS */}
      {showSendEmail && (
        <SendEmailModal deal={deal} onClose={() => setShowSendEmail(false)} />
      )}
      {showTemplates && (
        <EmailTemplateManager onClose={() => setShowTemplates(false)} />
      )}
      {showEmailLogs && (
        <EmailLogs dealId={deal.id} onClose={() => setShowEmailLogs(false)} />
      )}
      <StageModal
        open={stageModal.open}
        stageModal={stageModal}
        setStageModal={setStageModal}
        updatingStage={updatingStage}
        handleStageChange={handleStageChange}
        dealStage={deal.stage}
        onClose={() =>
          setStageModal({
            open: false,
            stage: null,
            description: "",
          })
        }
      />
      <StageHistoryModal
        open={stageHistoryModal.open}
        stage={stageHistoryModal.stage}
        data={stageHistoryModal.data}
        setNotesModal={setNotesModal}
        getTimeSince={getTimeSince}
        onClose={() =>
          setStageHistoryModal({
            open: false,
            stage: null,
            data: [],
          })
        }
      />
      <NotesModal
        open={notesModal.open}
        onClose={() =>
          setNotesModal({
            open: false,
            historyId: null,
            description: "",
          })
        }
        notesModal={notesModal}
        setNotesModal={setNotesModal}
        API={API}
        dispatch={dispatch}
        fetchDeal={fetchDeal}
        dealId={id}
      />
    </div>
  );
};

export default DealDetail;

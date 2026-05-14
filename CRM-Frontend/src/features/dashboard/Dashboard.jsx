// // src\features\dashboard\Dashboard.jsx
// import { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   fetchDashboardAnalytics,
//   fetchDealsByStage,
//   fetchMonthlyTrend,
//   fetchTopPerformers,
//   fetchDealsBySource,
//   fetchDealMomentum,
// } from "../analytics/analyticsSlice";
// import InfoTooltip from "../deals/InfoTooltip";
// import DealMomentumInfo from "../deals/DealMomentumInfo";

// import Spinner from "../../components/Spinner";
// import StatCard from "./components/StatCard";
// import StageChart from "./components/StageChart";
// import MonthlyTrendChart from "./components/MonthlyTrendChart";
// import TopPerformers from "./components/TopPerformers";
// import DealsClosingSoon from "./components/DealsClosingSoon";
// import WinRateGauge from "./components/WinRateGauge";
// import LeadSourceChart from "./components/LeadSourceChart";

// import {
//   BuildingOffice2Icon,
//   UserGroupIcon,
//   ClipboardDocumentListIcon,
//   TrophyIcon,
//   ChartBarIcon,
//   ArrowTrendingUpIcon,
// } from "@heroicons/react/24/outline";
// import DealRiskPanel from "../analytics/DealRiskPanel";

// const LiveTime = () => {
//   const [time, setTime] = useState(new Date());

//   useEffect(() => {
//     const sync = () => {
//       setTime(new Date());
//       setTimeout(sync, 1000 - (Date.now() % 1000));
//     };
//     const t = setTimeout(sync, 1000 - (Date.now() % 1000));
//     return () => clearTimeout(t);
//   }, []);

//   const pad = (n) => String(n).padStart(2, "0");
//   const h = time.getHours();
//   const h12 = pad(h % 12 || 12);
//   const ampm = h >= 12 ? "PM" : "AM";
//   const m = pad(time.getMinutes());

//   return { h12, ampm, m };
// };

// const DateTimeWidget = () => {
//   const [time, setTime] = useState(new Date());

//   useEffect(() => {
//     const sync = () => {
//       setTime(new Date());
//       setTimeout(sync, 1000 - (Date.now() % 1000));
//     };
//     const t = setTimeout(sync, 1000 - (Date.now() % 1000));
//     return () => clearTimeout(t);
//   }, []);

//   const pad = (n) => String(n).padStart(2, "0");
//   const h = time.getHours();
//   const h12 = pad(h % 12 || 12);
//   const ampm = h >= 12 ? "PM" : "AM";
//   const m = pad(time.getMinutes());
//   const day = time.toLocaleDateString("en-IN", { weekday: "long" });
//   const dateFull = time.toLocaleDateString("en-IN", {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   });

//   return (
//     <div className="hidden sm:flex flex-col items-end gap-0.5 pl-5 border-l-2 border-indigo-500">
//       <span className="text-[10px] font-medium tracking-widest uppercase text-gray-400">
//         {day}
//       </span>
//       <div className="flex items-baseline gap-1">
//         <span className="text-[26px] font-semibold text-gray-900 tabular-nums tracking-tight leading-none">
//           {h12}:{m}
//         </span>
//         <span className="text-[12px] font-semibold text-indigo-500">
//           {ampm}
//         </span>
//       </div>
//       <span className="text-[12px] text-gray-400">{dateFull}</span>
//     </div>
//   );
// };

// const Dashboard = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const hasFetched = useRef(false);

//   const {
//     dashboard,
//     dealsByStage,
//     monthlyTrend,
//     topPerformers,
//     dealsBySource,
//     dealMomentum,
//     dashboardLoading,
//   } = useSelector((s) => s.analytics);

//   useEffect(() => {
//     if (!hasFetched.current) {
//       hasFetched.current = true;
//       dispatch(fetchDashboardAnalytics());
//       dispatch(fetchDealsByStage());
//       dispatch(fetchMonthlyTrend(6));
//       dispatch(fetchTopPerformers(5));
//       dispatch(fetchDealsBySource());
//       dispatch(fetchDealMomentum());
//     }
//   }, [dispatch]);

//   if (dashboardLoading && !dashboard) {
//     return <Spinner className="py-20" size="lg" />;
//   }

//   const summary = dashboard?.summary || {};
//   const performance = dashboard?.performance || {};

//   return (
//     <div className="space-y-6 sm:space-y-7 lg:space-y-8">
//       {/* ── Page Header ── */}
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
//             Overview
//           </p>
//           <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
//             Dashboard
//           </h1>
//           <p className="text-sm text-gray-400 mt-1">
//             Your CRM activity and performance at a glance.
//           </p>
//         </div>
//         <DateTimeWidget />
//       </div>

//       {/* ── Primary Stat Cards ── */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <StatCard
//           title="Total Deals"
//           value={summary.totalDeals || 0}
//           subtitle="All deals"
//           icon={ClipboardDocumentListIcon}
//           color="blue"
//           onClick={() => navigate("/deals")}
//         />
//         <StatCard
//           title="Open Deals"
//           value={summary.openDeals || 0}
//           subtitle="Active deals"
//           icon={ChartBarIcon}
//           color="purple"
//           onClick={() => navigate("/deals")}
//         />
//         <StatCard
//           title="Closed Deals"
//           value={summary.closedDeals || 0}
//           subtitle="Completed deals"
//           icon={TrophyIcon}
//           color="green"
//           onClick={() => navigate("/deals?stage=CLOSED_WON")}
//         />
//         <StatCard
//           title="This Month"
//           value={summary.thisMonthDeals || 0}
//           subtitle="New deals created"
//           icon={ArrowTrendingUpIcon}
//           color="amber"
//         />
//       </div>

//       {/* ── Secondary Stat Cards ── */}
//       <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {[
//           {
//             value: summary.totalAccounts || 0,
//             label: "Accounts",
//             icon: BuildingOffice2Icon,
//             iconBg: "bg-blue-50",
//             iconColor: "text-blue-500",
//             onClick: () => navigate("/accounts"),
//             clickable: true,
//           },
//           {
//             value: summary.totalContacts || 0,
//             label: "Contacts",
//             icon: UserGroupIcon,
//             iconBg: "bg-violet-50",
//             iconColor: "text-violet-500",
//             onClick: () => navigate("/contacts"),
//             clickable: true,
//           },
//           {
//             value: performance.wonDeals || 0,
//             label: "Won Deals",
//             icon: TrophyIcon,
//             iconBg: "bg-emerald-50",
//             iconColor: "text-emerald-500",
//             clickable: false,
//           },
//           {
//             value: `${performance.winRate || 0}%`,
//             label: "Win Rate",
//             icon: ChartBarIcon,
//             iconBg: "bg-amber-50",
//             iconColor: "text-amber-500",
//             clickable: false,
//           },
//         ].map(
//           ({
//             value,
//             label,
//             icon: Icon,
//             iconBg,
//             iconColor,
//             onClick,
//             clickable,
//           }) => (
//             <div
//               key={label}
//               onClick={clickable ? onClick : undefined}
//               className={`bg-white border border-gray-200 rounded-2xl px-4 py-4 sm:px-5 shadow-sm transition-all duration-200 ${
//                 clickable
//                   ? "cursor-pointer hover:shadow-md hover:border-gray-300"
//                   : ""
//               }`}
//             >
//               <div className="flex items-center gap-3">
//                 <div
//                   className={`w-9 h-9 sm:w-10 sm:h-10 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}
//                 >
//                   <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor}`} />
//                 </div>
//                 <div>
//                   <p className="text-xl sm:text-2xl font-bold text-gray-900 tabular-nums leading-tight">
//                     {value}
//                   </p>
//                   <p className="text-xs text-gray-400 font-medium mt-0.5">
//                     {label}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ),
//         )}
//       </div>

//       {/* ── Deal Momentum Panel ── */}
//       <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-visible">
//         {/* Panel header */}
//         <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-gray-100">
//           <div className="flex items-center gap-2.5">
//             <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
//               <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
//                 <path
//                   d="M9 2L3 9h5l-1 5 6-7H8l1-5z"
//                   fill="white"
//                   strokeLinejoin="round"
//                 />
//               </svg>
//             </div>
//             <div>
//               <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest leading-none mb-0.5">
//                 Prioritized
//               </p>
//               <h2 className="text-sm font-semibold text-gray-900 leading-none">
//                 Deal Momentum
//               </h2>
//             </div>
//           </div>
//           <span className="text-xs text-gray-400 font-medium hidden sm:block">
//             Focus on these first
//           </span>
//         </div>

//         {/* Deal rows */}
//         <div className="divide-y divide-gray-50">
//           {dealMomentum?.slice(0, 5).map((deal, idx) => (
//             <div
//               key={deal.dealId}
//               onClick={() => navigate(`/deals/${deal.dealId}`)}
//               className="flex items-center gap-4 px-5 sm:px-6 py-3.5 hover:bg-gray-50/70 transition-colors duration-150 cursor-pointer group"
//             >
//               {/* Rank */}
//               <span
//                 className={`text-xs font-bold w-4 text-center flex-shrink-0 ${
//                   idx === 0 ? "text-indigo-600" : "text-gray-300"
//                 }`}
//               >
//                 {idx + 1}
//               </span>

//               {/* Deal info */}
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-semibold text-gray-800 truncate leading-tight group-hover:text-gray-900 transition-colors">
//                   {deal.dealName}
//                 </p>
//                 <div className="flex items-center gap-1.5 mt-1 flex-wrap">
//                   <span className="text-[11px] text-gray-400">
//                     {deal.account}
//                   </span>
//                   <span className="text-gray-200">·</span>
//                   <span
//                     className={`text-[10px] font-semibold px-2 py-0.5 rounded-full leading-none ${
//                       idx === 0
//                         ? "bg-indigo-50 text-indigo-600"
//                         : idx === 1
//                           ? "bg-violet-50 text-violet-500"
//                           : "bg-gray-100 text-gray-500"
//                     }`}
//                   >
//                     {deal.stage.replace(/_/g, " ")}
//                   </span>
//                 </div>
//               </div>

//               {/* Score + tooltip */}
//               <div className="flex items-center gap-2 flex-shrink-0">
//                 <div className="flex flex-col items-end">
//                   <span
//                     className={`text-base font-bold leading-none ${
//                       idx === 0 ? "text-indigo-600" : "text-gray-400"
//                     }`}
//                   >
//                     {deal.momentumScore}
//                   </span>
//                   <span className="text-[10px] text-gray-400 leading-none text-right mt-0.5">
//                     {deal.reason}
//                   </span>
//                 </div>
//                 <InfoTooltip
//                   position="right"
//                   content={<DealMomentumInfo deal={deal} />}
//                 />
//               </div>
//             </div>
//           ))}

//           {!dealMomentum?.length && (
//             <div className="py-12 text-center">
//               <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
//                 <ChartBarIcon className="w-5 h-5 text-gray-400" />
//               </div>
//               <p className="text-sm text-gray-400 font-medium">
//                 No priority deals found
//               </p>
//               <p className="text-xs text-gray-300 mt-1">
//                 Check back once deals are active
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── Charts Row 1: Trend + Win Rate ── */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
//         <div className="lg:col-span-2">
//           <MonthlyTrendChart data={monthlyTrend} />
//         </div>
//         <div>
//           <WinRateGauge
//             winRate={performance.winRate || 0}
//             wonDeals={performance.wonDeals || 0}
//             lostDeals={performance.lostDeals || 0}
//             openDeals={summary.openDeals || 0}
//           />
//         </div>
//       </div>

//       {/* ── Charts Row 2: Stage + Lead Source ── */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//         <StageChart data={dealsByStage} />
//         <LeadSourceChart data={dealsBySource} />
//       </div>

//       {/* ── Bottom Row ── */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//         <DealsClosingSoon deals={dashboard?.dealsClosingThisMonth || []} />
//         <TopPerformers data={topPerformers} />
//         <DealRiskPanel level="HIGH" />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

// src\features\dashboard\Dashboard.jsx
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchDashboardAnalytics,
  fetchDealsByStage,
  fetchMonthlyTrend,
  fetchTopPerformers,
  fetchDealsBySource,
  fetchDealMomentum,
} from "../analytics/analyticsSlice";
import InfoTooltip from "../deals/InfoTooltip";
import DealMomentumInfo from "../deals/DealMomentumInfo";

import Spinner from "../../components/Spinner";
import StatCard from "./components/StatCard";
import StageChart from "./components/StageChart";
import MonthlyTrendChart from "./components/MonthlyTrendChart";
import TopPerformers from "./components/TopPerformers";
import DealsClosingSoon from "./components/DealsClosingSoon";
import WinRateGauge from "./components/WinRateGauge";
import LeadSourceChart from "./components/LeadSourceChart";
import QuotationStatusCards from "./components/QuotationStatusCards";
import QuotationLifecycleChart from "./components/QuotationLifecycleChart";
import QuotationValueTrend from "./components/QuotationValueTrend";

import {
  fetchQuotationStatusSummary,
  fetchQuotationLifecycle,
  fetchQuotationValueTrend,
} from "../quotations/quotationSlice";

import {
  BuildingOffice2Icon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  TrophyIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";
import DealRiskPanel from "../analytics/DealRiskPanel";

/* ─────────────────────────────────────────
   DateTimeWidget — Design D (no seconds)
───────────────────────────────────────── */
const DateTimeWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const sync = () => {
      setTime(new Date());
      setTimeout(sync, 1000 - (Date.now() % 1000));
    };
    const t = setTimeout(sync, 1000 - (Date.now() % 1000));
    return () => clearTimeout(t);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");
  const h = time.getHours();
  const h12 = pad(h % 12 || 12);
  const ampm = h >= 12 ? "PM" : "AM";
  const m = pad(time.getMinutes());
  const day = time.toLocaleDateString("en-IN", { weekday: "long" });
  const dateFull = time.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="hidden sm:flex flex-col items-end gap-0.5 pl-4 border-l-2 border-indigo-500 shrink-0">
      <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">
        {day}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="text-[26px] font-bold text-gray-900 tabular-nums tracking-tight leading-none">
          {h12}:{m}
        </span>
        <span className="text-[12px] font-bold text-indigo-500">{ampm}</span>
      </div>
      <span className="text-[11px] text-gray-400 font-medium">{dateFull}</span>
    </div>
  );
};

/* ─────────────────────────────────────────
   Mini secondary stat card
 ───────────────────────────────────────── */
const MiniStatCard = ({
  value,
  label,
  icon: Icon,
  iconBg,
  iconColor,
  onClick,
  clickable,
}) => (
  <div
    onClick={clickable ? onClick : undefined}
    className={`
      group relative bg-white border border-slate-200/60 rounded-2xl px-4 py-4
      transition-all duration-300 overflow-hidden
      ${clickable ? "cursor-pointer hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5" : ""}
    `}
  >
    {/* Background accent */}
    <div
      className={`absolute top-0 right-0 w-16 h-16 ${iconBg} opacity-5 rounded-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150`}
    />

    <div className="relative flex items-center gap-4">
      <div
        className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-xl font-extrabold text-slate-800 tabular-nums leading-tight tracking-tight">
          {value}
        </p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
          {label}
        </p>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   Section header helper
 ───────────────────────────────────────── */
const SectionLabel = ({ children, icon: Icon }) => (
  <div className="flex items-center gap-2 mb-4 px-1">
    {Icon && <Icon className="w-4 h-4 text-indigo-500/60" />}
    <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">
      {children}
    </p>
    <div className="h-px flex-1 bg-slate-100/80 ml-2" />
  </div>
);

/* ─────────────────────────────────────────
   Dashboard
 ───────────────────────────────────────── */
const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const {
    dashboard,
    dealsByStage,
    monthlyTrend,
    topPerformers,
    dealsBySource,
    dealMomentum,
    dashboardLoading,
  } = useSelector((s) => s.analytics);

  const { quotationStatusSummary, quotationLifecycle, quotationValueTrend } =
    useSelector((s) => s.quotation);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchDashboardAnalytics());
      dispatch(fetchDealsByStage());
      dispatch(fetchMonthlyTrend(6));
      dispatch(fetchTopPerformers(5));
      dispatch(fetchDealsBySource());
      dispatch(fetchDealMomentum());
      dispatch(fetchQuotationStatusSummary());
      dispatch(fetchQuotationLifecycle());
      dispatch(fetchQuotationValueTrend(6));
    }
  }, [dispatch]);

  if (dashboardLoading && !dashboard) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  const summary = dashboard?.summary || {};
  const performance = dashboard?.performance || {};

  return (
    <div className="w-full space-y-10 pb-10 overflow-x-hidden">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 mb-8">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em]">
              Live Intelligence
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 leading-tight tracking-tighter">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Strategic overview of your CRM ecosystem and sales velocity.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <DateTimeWidget />
        </div>
      </div>
      {/* ── Primary Stat Cards ── */}
      <section>
        <SectionLabel icon={ChartBarIcon}>Growth Metrics</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Deals"
            value={summary.totalDeals || 0}
            subtitle="Pipeline reach"
            icon={ClipboardDocumentListIcon}
            color="indigo"
            onClick={() => navigate("/deals")}
          />
          <StatCard
            title="Open Deals"
            value={summary.openDeals || 0}
            subtitle="Active focus"
            icon={ChartBarIcon}
            color="blue"
            onClick={() => navigate("/deals")}
          />
          <StatCard
            title="Closed Deals"
            value={summary.closedDeals || 0}
            subtitle="Converted success"
            icon={TrophyIcon}
            color="green"
            onClick={() => navigate("/deals?stage=CLOSED_WON")}
          />
          <StatCard
            title="This Month"
            value={summary.thisMonthDeals || 0}
            subtitle="Velocity rate"
            icon={ArrowTrendingUpIcon}
            color="amber"
          />
        </div>
      </section>
      {/* ── Secondary Stat Cards ── */}
      <section>
        <SectionLabel icon={UserGroupIcon}>Ecosystem Volume</SectionLabel>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              value: summary.totalAccounts || 0,
              label: "Accounts",
              icon: BuildingOffice2Icon,
              iconBg: "bg-blue-50",
              iconColor: "text-blue-500",
              onClick: () => navigate("/accounts"),
              clickable: true,
            },
            {
              value: summary.totalContacts || 0,
              label: "Contacts",
              icon: UserGroupIcon,
              iconBg: "bg-indigo-50",
              iconColor: "text-indigo-600",
              onClick: () => navigate("/contacts"),
              clickable: true,
            },
            {
              value: performance.wonDeals || 0,
              label: "Won Deals",
              icon: TrophyIcon,
              iconBg: "bg-emerald-50",
              iconColor: "text-emerald-600",
              clickable: false,
            },
            {
              value: `${performance.winRate || 0}%`,
              label: "Win Rate",
              icon: ArrowTrendingUpIcon,
              iconBg: "bg-amber-50",
              iconColor: "text-amber-600",
              clickable: false,
            },
          ].map((props) => (
            <MiniStatCard key={props.label} {...props} />
          ))}
        </div>
      </section>
      

      {/* ── Quotation Intelligence ── */}
      <section>
        <SectionLabel icon={ClipboardDocumentListIcon}>
          Quotation Intelligence
        </SectionLabel>

        <div className="space-y-5">
          <QuotationStatusCards data={quotationStatusSummary} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <QuotationLifecycleChart data={quotationLifecycle} />

            <QuotationValueTrend data={quotationValueTrend} />
          </div>
        </div>
      </section>
      {/* ── Deal Momentum Panel ── */}
      <section>
        <SectionLabel icon={ArrowTrendingUpIcon}>
          High Velocity Deals
        </SectionLabel>
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5">
          {/* Panel header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-200">
                <ArrowTrendingUpIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-800 leading-none">
                  Deal Momentum
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Prioritized by probability
                </p>
              </div>
            </div>
          </div>

          {/* Deal rows */}
          <div className="divide-y divide-slate-100">
            {dealMomentum?.slice(0, 5).map((deal, idx) => (
              <div
                key={deal.dealId}
                onClick={() => navigate(`/deals/${deal.dealId}`)}
                className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/80 transition-all duration-200 cursor-pointer group"
              >
                {/* Rank bubble */}
                <div
                  className={`
                  w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-[11px] font-black
                  transition-all duration-300
                  ${
                    idx === 0
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                      : "bg-slate-50 text-slate-400 group-hover:bg-white group-hover:shadow-sm"
                  }
                `}
                >
                  {idx + 1}
                </div>

                {/* Deal info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate leading-tight group-hover:text-gray-900 transition-colors">
                    {deal.dealName}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className="text-[11px] text-gray-400">
                      {deal.account}
                    </span>
                    <span className="text-gray-200">·</span>
                    <span
                      className={`
                      text-[10px] font-semibold px-2 py-0.5 rounded-full leading-none
                      ${
                        idx === 0
                          ? "bg-indigo-50 text-indigo-600"
                          : idx === 1
                            ? "bg-violet-50 text-violet-500"
                            : "bg-gray-100 text-gray-500"
                      }
                    `}
                    >
                      {deal.stage.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                {/* Score + tooltip */}
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  <div className="flex flex-col items-end">
                    <span
                      className={`
                      text-base font-bold leading-none tabular-nums
                      ${idx === 0 ? "text-indigo-600" : "text-gray-400"}
                    `}
                    >
                      {deal.momentumScore}
                    </span>
                    <span className="text-[10px] text-gray-400 leading-none text-right mt-0.5">
                      {deal.reason}
                    </span>
                  </div>
                  <InfoTooltip
                    position="right"
                    content={<DealMomentumInfo deal={deal} />}
                  />
                </div>
              </div>
            ))}

            {!dealMomentum?.length && (
              <div className="py-14 text-center">
                <div className="w-11 h-11 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-3">
                  <ChartBarIcon className="w-5 h-5 text-gray-300" />
                </div>
                <p className="text-sm text-gray-400 font-semibold">
                  No priority deals found
                </p>
                <p className="text-xs text-gray-300 mt-1">
                  Check back once deals are active
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* ── Charts Row 1: Trend + Win Rate ── */}
      <div>
        <SectionLabel>Performance</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          <div className="lg:col-span-2">
            <MonthlyTrendChart data={monthlyTrend} />
          </div>
          <div>
            <WinRateGauge
              winRate={performance.winRate || 0}
              wonDeals={performance.wonDeals || 0}
              lostDeals={performance.lostDeals || 0}
              openDeals={summary.openDeals || 0}
            />
          </div>
        </div>
      </div>
      {/* ── Charts Row 2: Stage + Lead Source ── */}
      <div>
        <SectionLabel>Pipeline Breakdown</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          <StageChart data={dealsByStage} />
          <LeadSourceChart data={dealsBySource} />
        </div>
      </div>
      {/* ── Bottom Row ── */}
      <div>
        <SectionLabel>Activity &amp; Risk</SectionLabel>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          <DealsClosingSoon deals={dashboard?.dealsClosingThisMonth || []} />
          <TopPerformers data={topPerformers} />
          <DealRiskPanel level="HIGH" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

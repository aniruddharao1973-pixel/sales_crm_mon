// CRM-Frontend-main\src\features\analytics\pages\AdvancedAnalytics.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardAnalytics,
  fetchDealsBySource,
  fetchKpiMetrics,
} from "../analyticsSlice";
import API from "../../../api/axios";
import { askAnalyticsAI } from "../../../api/aiApi";
import KpiCalculationTooltip from "../KpiCalculationTooltip";

/* ───────────────── CONSTANTS ───────────────── */

const STAGE_COLORS = {
  RFQ: "#6366f1",
  VISIT_MEETING: "#f43f5e",
  PREVIEW: "#10b981",
  TECHNICAL_PROPOSAL: "#f59e0b",
  COMMERCIAL_PROPOSAL: "#ef4444",
  REVIEW_FEEDBACK: "#0ea5e9",
  MOVED_TO_PURCHASE: "#6366f1",
  NEGOTIATION: "#14b8a6",
  CLOSED_WON: "#22c55e",
  CLOSED_LOST: "#ef4444",
  CLOSED_LOST_TO_COMPETITION: "#a855f7",
  REGRETTED: "#78716c",
};

const STAGE_ORDER = [
  "RFQ",
  "VISIT_MEETING",
  "PREVIEW",
  "TECHNICAL_PROPOSAL",
  "COMMERCIAL_PROPOSAL",
  "REVIEW_FEEDBACK",
  "MOVED_TO_PURCHASE",
  "NEGOTIATION",
  "CLOSED_WON",
  "CLOSED_LOST",
  "CLOSED_LOST_TO_COMPETITION",
  "REGRETTED",
];

const RISK_CONFIG = {
  HIGH: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    dot: "bg-red-500",
    bar: "#ef4444",
    iconBg: "bg-red-100",
  },
  MEDIUM: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-500",
    bar: "#f59e0b",
    iconBg: "bg-amber-100",
  },
  LOW: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    bar: "#10b981",
    iconBg: "bg-emerald-100",
  },
};

/* ───────────────── SPINNER ───────────────── */

function Spinner({ size = "md" }) {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-[3px] border-indigo-100 border-t-indigo-600`}
      />
      <span className="text-sm font-medium text-slate-400 tracking-wide">
        Loading analytics…
      </span>
    </div>
  );
}

/* ───────────────── DONUT ───────────────── */

function DonutChart({ data }) {
  const radius = 15.915;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((s, d) => s + d.count, 0);
  let offset = 0;

  return (
    <div className="relative flex-shrink-0 flex items-center justify-center">
      <svg
        viewBox="0 0 42 42"
        className="w-36 h-36 sm:w-44 sm:h-44 -rotate-90 drop-shadow-sm"
      >
        <circle
          cx="21"
          cy="21"
          r={radius}
          stroke="#f1f5f9"
          strokeWidth="4"
          fill="none"
        />
        {data.map((d) => {
          if (!d.count) return null;
          const dash = total > 0 ? (d.count / total) * circumference : 0;
          const gap = circumference - dash;
          const color = STAGE_COLORS[d.stage] || "#94a3b8";
          const el = (
            <circle
              key={d.stage}
              cx="21"
              cy="21"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="4.5"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
              style={{
                filter: `drop-shadow(0 0 2px ${color}60)`,
              }}
            />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-slate-400 font-semibold">
          Total
        </span>
        <span className="text-3xl sm:text-4xl font-extrabold text-slate-800 leading-none">
          {total}
        </span>
        <span className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 font-medium">
          deals
        </span>
      </div>
    </div>
  );
}

/* ───────────────── KPI CARD ───────────────── */

function KPICard({ label, value, subtitle, accent, icon, trend, calculation }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div
      className="
        group relative overflow-visible rounded-2xl
        bg-white border border-slate-200/80
        p-5 sm:p-6
        shadow-sm hover:shadow-lg
        transition-all duration-300 ease-out
        hover:-translate-y-0.5
      "
    >
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        style={{ backgroundColor: accent }}
      />

      <div className="flex items-start justify-between mb-4">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl text-lg"
          style={{ background: `${accent}15`, color: accent }}
        >
          {icon}
        </div>
        {trend !== undefined && (
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              trend >= 0
                ? "bg-emerald-50 text-emerald-600"
                : "bg-rose-50 text-rose-600"
            }`}
          >
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-1.5">
        <p className="text-xs uppercase tracking-[0.1em] text-slate-400 font-semibold">
          {label}
        </p>
        {calculation && (
          <div className="relative z-20">
            <button
              onClick={() => setOpen(!open)}
              className="
                flex items-center justify-center
                w-4 h-4 rounded-full
                bg-indigo-100 text-indigo-600
                text-[10px] font-bold
                hover:bg-indigo-200
                transition-colors
              "
            >
              i
            </button>
            <KpiCalculationTooltip open={open} onClose={() => setOpen(false)}>
              {calculation}
            </KpiCalculationTooltip>
          </div>
        )}
      </div>

      <p className="text-2xl sm:text-3xl font-bold text-slate-800 leading-none tracking-tight">
        {value}
      </p>
      {subtitle && (
        <p className="text-sm text-slate-400 mt-1.5 leading-snug">{subtitle}</p>
      )}
    </div>
  );
}

/* ───────────────── CARD ───────────────── */

function Card({ title, subtitle, children, className = "" }) {
  return (
    <div
      className={`rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
    >
      <div className="px-5 sm:px-7 pt-5 sm:pt-6 pb-1">
        <p className="font-semibold text-slate-800 text-base sm:text-lg tracking-tight">
          {title}
        </p>
        {subtitle && (
          <p className="text-sm text-slate-400 mt-0.5 leading-snug">
            {subtitle}
          </p>
        )}
      </div>
      <div className="p-5 sm:p-7">{children}</div>
    </div>
  );
}

/* ───────────────── STAGE LEGEND ───────────────── */

function StageLegend({ data }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const half = Math.ceil(data.length / 2);
  const leftCol = data.slice(0, half);
  const rightCol = data.slice(half);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0">
      {[leftCol, rightCol].map((col, colIdx) => (
        <div
          key={colIdx}
          className={
            colIdx === 1 ? "sm:border-l sm:border-slate-100 sm:pl-4" : ""
          }
        >
          {col.map((s) => {
            const color = STAGE_COLORS[s.stage] || "#94a3b8";
            const pct = total > 0 ? Math.round((s.count / total) * 100) : 0;
            return (
              <div
                key={s.stage}
                className="flex items-center gap-2 py-2 group hover:bg-slate-50/80 rounded-lg px-2 transition-colors cursor-pointer"
              >
                <div
                  className="h-2.5 w-2.5 flex-shrink-0 rounded-full ring-2 ring-white"
                  style={{
                    background: color,
                    boxShadow: s.count > 0 ? `0 0 6px ${color}50` : "none",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-medium leading-tight truncate ${
                        s.count > 0 ? "text-slate-600" : "text-slate-400"
                      }`}
                    >
                      {s.stage.replace(/_/g, " ")}
                    </span>
                    <span
                      className={`text-xs font-bold ml-2 flex-shrink-0 ${
                        s.count > 0 ? "text-slate-800" : "text-slate-300"
                      }`}
                    >
                      {s.count}
                    </span>
                  </div>
                  {s.count > 0 && (
                    <div className="h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{
                          width: `${pct}%`,
                          background: color,
                          opacity: 0.65,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ───────────────── VISUAL FUNNEL ───────────────── */

function VisualFunnel({ data }) {
  if (!data || data.length === 0)
    return (
      <p className="text-sm text-slate-400 text-center py-8">
        No funnel data available
      </p>
    );

  const ordered = STAGE_ORDER.map((stage) =>
    data.find((d) => d.stage === stage),
  ).filter((s) => s && s.count > 0);

  const maxCount = Math.max(...ordered.map((s) => s.count), 1);

  return (
    <div className="flex flex-col gap-1 w-full">
      {ordered.map((s, i) => {
        if (s.count === 0) return null;
        const pct = Math.round((s.count / maxCount) * 100);
        const minWidth = 42;
        const width = minWidth + ((100 - minWidth) * pct) / 100;
        const color = STAGE_COLORS[s.stage] || "#6366f1";
        const isLast = i === ordered.length - 1;

        return (
          <div key={s.stage} className="flex flex-col items-center">
            <div
              className="relative flex items-center justify-center transition-all duration-500 hover:brightness-110 cursor-pointer"
              style={{
                width: `${width}%`,
                height: "48px",
                background: `linear-gradient(135deg, ${color}ee, ${color}aa)`,
                clipPath: isLast
                  ? "polygon(5% 0%, 95% 0%, 90% 100%, 10% 100%)"
                  : "polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)",
                boxShadow: `0 3px 12px ${color}30`,
              }}
            >
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 55%)",
                }}
              />
              <div className="relative z-10 flex items-center gap-1.5 sm:gap-2 px-2">
                <span className="text-white font-extrabold text-sm sm:text-base drop-shadow-sm">
                  {s.count}
                </span>
                <span className="text-white/90 text-[10px] sm:text-xs font-semibold uppercase tracking-wider drop-shadow-sm truncate">
                  {s.stage.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            {!isLast && (
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderTop: `7px solid ${color}70`,
                  marginTop: "-1px",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ───────────────── FUNNEL LEGEND ───────────────── */

function FunnelLegend({ data }) {
  const ordered = STAGE_ORDER.map((stage) =>
    data.find((d) => d.stage === stage),
  ).filter((s) => s && s.count > 0);

  const maxCount = Math.max(...ordered.map((s) => s.count), 1);

  return (
    <div className="flex flex-col gap-1 w-full">
      {ordered.map((s) => {
        const color = STAGE_COLORS[s.stage] || "#6366f1";
        const barPct = (s.count / maxCount) * 100;

        return (
          <div
            key={s.stage}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50/80 transition-colors cursor-pointer group"
          >
            <div
              className="h-3 w-3 rounded-full flex-shrink-0 ring-2 ring-white"
              style={{ background: color, boxShadow: `0 0 6px ${color}40` }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide truncate">
                  {s.stage.replace(/_/g, " ")}
                </span>
                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  <span className="text-sm font-bold text-slate-800">
                    {s.count}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    · {s.conversion.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${barPct}%`,
                    background: `linear-gradient(90deg, ${color}90, ${color})`,
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ───────────────── VELOCITY LINE CHART ───────────────── */

function VelocityLineChart({ data, onStageClick }) {
  if (!data || data.length === 0)
    return (
      <p className="text-sm text-slate-400 text-center py-8">
        No velocity data
      </p>
    );

  const SVG_W = 560;
  const SVG_H = 400;
  const PAD_L = 36;
  const PAD_R = 16;
  const PAD_T = 36;
  const PAD_B = 120;

  const chartW = SVG_W - PAD_L - PAD_R;
  const chartH = SVG_H - PAD_T - PAD_B;

  const maxDays = Math.max(...data.map((d) => d.avgDays), 1);
  const xStep = data.length > 1 ? chartW / (data.length - 1) : chartW;

  const pts = data.map((d, i) => ({
    x: PAD_L + (data.length > 1 ? i * xStep : chartW / 2),
    y: PAD_T + chartH - (d.avgDays / maxDays) * chartH,
    ...d,
  }));

  const linePath = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const areaPath = [
    ...pts.map(
      (p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`,
    ),
    `L${pts[pts.length - 1].x},${PAD_T + chartH}`,
    `L${pts[0].x},${PAD_T + chartH}`,
    "Z",
  ].join(" ");

  const gridCount = 4;
  const gridLines = Array.from({ length: gridCount + 1 }, (_, k) => ({
    y: PAD_T + chartH - (k / gridCount) * chartH,
    val: Math.round((k / gridCount) * maxDays),
  }));

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full min-w-[480px]"
        style={{ maxHeight: 420, display: "block" }}
      >
        <defs>
          <linearGradient id="velGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
            <stop offset="60%" stopColor="#6366f1" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {gridLines.map((g) => (
          <g key={g.y}>
            <line
              x1={PAD_L}
              y1={g.y.toFixed(1)}
              x2={SVG_W - PAD_R}
              y2={g.y.toFixed(1)}
              stroke="#e2e8f0"
              strokeWidth="0.7"
            />
            <text
              x={PAD_L - 10}
              y={g.y + 3.5}
              textAnchor="end"
              fill="#94a3b8"
              fontSize="12"
              fontFamily="Inter, system-ui, sans-serif"
            >
              {g.val}d
            </text>
          </g>
        ))}

        <path d={areaPath} fill="url(#velGrad)" />

        <path
          d={linePath}
          fill="none"
          stroke="#6366f1"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {pts.map((p) => (
          <g
            key={p.stage}
            className="cursor-pointer"
            onClick={() => onStageClick && onStageClick(p.stage)}
          >
            <line
              x1={p.x.toFixed(1)}
              y1={PAD_T + chartH}
              x2={p.x.toFixed(1)}
              y2={PAD_T + chartH + 4}
              stroke="#cbd5e1"
              strokeWidth="0.8"
            />
            <text
              x={p.x}
              y={PAD_T + chartH + 14}
              textAnchor="end"
              fill="#64748b"
              fontSize="10.5"
              fontWeight="500"
              fontFamily="Inter, system-ui, sans-serif"
              transform={`rotate(-45 ${p.x} ${PAD_T + chartH + 14})`}
            >
              {p.stage.replace(/_/g, " ")}
            </text>
            <circle
              cx={p.x.toFixed(1)}
              cy={p.y.toFixed(1)}
              r="8"
              fill="#6366f1"
              opacity="0.1"
            />
            <circle
              cx={p.x.toFixed(1)}
              cy={p.y.toFixed(1)}
              r="5"
              fill="#6366f1"
              stroke="white"
              strokeWidth="2.5"
            />
            <text
              x={p.x}
              y={p.y - 14}
              textAnchor="middle"
              fill="#4f46e5"
              fontSize="12"
              fontWeight="700"
              fontFamily="Inter, system-ui, sans-serif"
            >
              {p.avgDays}d
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ───────────────── MAIN ───────────────── */

export default function AdvancedAnalytics() {
  const dispatch = useDispatch();
  const { loading, error, dashboard, kpis, dealsBySource } = useSelector(
    (state) => state.analytics,
  );

  const safeDashboard = {
    summary: {
      totalDeals: dashboard?.summary?.totalDeals ?? 0,
      openDeals: dashboard?.summary?.openDeals ?? 0,
      closedDeals: dashboard?.summary?.closedDeals ?? 0,
    },
    performance: {
      winRate: dashboard?.performance?.winRate ?? 0,
    },
  };

  const [cohortData, setCohortData] = useState([]);
  const [expandedSource, setExpandedSource] = useState(null);
  const [funnelData, setFunnelData] = useState([]);
  const [riskDistribution, setRiskDistribution] = useState([]);
  const [stageAging, setStageAging] = useState([]);
  const [bottleneck, setBottleneck] = useState(null);
  const [stageDistribution, setStageDistribution] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [aiInsight, setAiInsight] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [insightMode, setInsightMode] = useState("detailed");
  const [expectedRevenue, setExpectedRevenue] = useState("");
  const [inputRevenueWon, setInputRevenueWon] = useState("");
  const [insightOpen, setInsightOpen] = useState(false);

  const [drilldownType, setDrilldownType] = useState(null);

  const [filters, setFilters] = useState({
    risk: null,
    stage: null,
  });

  const [drilldownData, setDrilldownData] = useState([]);
  const [drilldownLoading, setDrilldownLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortByDelay, setSortByDelay] = useState(true);
  const [activeTab, setActiveTab] = useState("data");

  useEffect(() => {
    dispatch(fetchDashboardAnalytics());
    dispatch(fetchDealsBySource());
    dispatch(fetchKpiMetrics());
    loadAll();
  }, [dispatch]);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") {
        setDrilldownType(null);
        setDrilldownData([]);
      }
    }
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  async function loadAll() {
    try {
      setAnalyticsLoading(true);
      const [cohort, funnel, risk, aging, stage] = await Promise.all([
        API.get("/analytics/cohort-lead-source"),
        API.get("/analytics/funnel"),
        API.get("/analytics/risk-distribution"),
        API.get("/analytics/stage-aging"),
        API.get("/analytics/deals-by-stage"),
      ]);

      setCohortData(cohort.data.data || []);
      setFunnelData(funnel.data.data || []);

      const riskOrder = ["LOW", "MEDIUM", "HIGH"];
      const sortedRisk = [...(risk.data.data || [])].sort(
        (a, b) =>
          riskOrder.indexOf(a.riskLevel) - riskOrder.indexOf(b.riskLevel),
      );
      setRiskDistribution(sortedRisk);

      const agingData = aging.data.data || {};
      setStageAging(agingData.stages || []);
      setBottleneck(agingData.bottleneck || null);

      const orderedStages = STAGE_ORDER.map(
        (s) =>
          stage.data.data.find((x) => x.stage === s) || { stage: s, count: 0 },
      );
      setStageDistribution(orderedStages);
    } finally {
      setAnalyticsLoading(false);
    }
  }

  async function loadDrilldown(type, value = null) {
    try {
      setDrilldownLoading(true);
      setDrilldownType(type);
      setIsModalOpen(true);
      setActiveTab("data");

      let res;

      if (type === "overdue") {
        setFilters({ risk: null, stage: null });
        res = await API.get("/analytics/overdue-deals");
      }

      if (type === "risk") {
        setFilters({ risk: value, stage: null });
        res = await API.get(`/analytics/risk-deals?risk=${value}`);
      }

      if (type === "stage") {
        setFilters({ risk: null, stage: value });
        res = await API.get(`/analytics/stage-deals?stage=${value}`);
      }

      setDrilldownData(res.data.data || []);
    } finally {
      setDrilldownLoading(false);
    }
  }

  async function generateAIInsights(mode = insightMode) {
    try {
      setAiLoading(true);

      let question = "";

      if (mode === "quick") {
        question = `
You are a CRM executive assistant.

STRICT RULES:
- You MUST return ALL 4 sections.
- NEVER skip any section.
- Each section MUST be exactly ONE sentence.
- Do NOT add extra text.
- Do NOT use bullets, numbering, or markdown.

RETURN EXACTLY THIS FORMAT:

Pipeline Status: <one sentence>
Main Risk: <one sentence>
Immediate Action: <one sentence>
Strategic Recommendation: <one sentence>

If any data is missing, still generate a reasonable sentence.
`;
      } else {
        question = `
Analyze the CRM pipeline using the provided data.

Focus on:
- risk concentration
- stage bottlenecks
- conversion efficiency
- revenue potential
- actionable strategy

Be specific. Avoid generic statements.
`;
      }

      const payload = {
        question: question,
        mode: mode || insightMode,
        regenerate: Boolean(aiInsight && aiInsight.length > 20),
        snapshot: {
          totalDeals: safeDashboard.summary.totalDeals,
          openDeals: safeDashboard.summary.openDeals,
          wonDeals: safeDashboard.summary.closedDeals,
          winRate: safeDashboard.performance.winRate,
          monthlyWonAmount: kpis?.revenueWon || 0,
          monthlyWonCount: kpis?.calculation?.wonDeals || 0,
        },
      };

      const answer = await askAnalyticsAI(payload);

      if (!answer || typeof answer !== "string") {
        setAiInsight("Unable to generate insights.");
        return;
      }

      setAiInsight(answer.trim());
    } finally {
      setAiLoading(false);
    }
  }

  function formatDate(date) {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-4 sm:m-8 rounded-2xl bg-red-50 border border-red-200 p-6 text-red-600 text-sm font-medium">
        {error}
      </div>
    );
  }

  const totalRisk = riskDistribution.reduce((sum, r) => sum + r._count.id, 0);

  /* ───────────────── UI ───────────────── */

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      {/* ─── TOP HEADER BAR ─── */}

      {/* ─── MAIN CONTENT ─── */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* ═══════════════ AI STRATEGIC INSIGHTS ═══════════════ */}
        <section className="relative overflow-hidden rounded-2xl lg:rounded-3xl border border-gray-200/80 bg-white shadow-sm">
          {/* Background decorations */}
          <div className="absolute -top-32 -right-32 h-64 w-64 bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 h-64 w-64 bg-violet-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

          <div className="relative z-10 p-5 sm:p-8 lg:p-10">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-lg">
                    🧠
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                    AI Strategic Insights
                  </h2>
                </div>
                <p className="text-sm text-gray-500 ml-[46px]">
                  Executive-grade pipeline intelligence powered by Sarvam AI
                </p>
              </div>

              {/* Enhanced Dropdown Button */}
              <button
                onClick={() => setInsightOpen((prev) => !prev)}
                className={`group relative h-10 w-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm hover:bg-gray-50 active:scale-95 transition-all after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:bg-indigo-500 after:rounded-full after:transition-all ${
                  insightOpen ? "after:w-[60%]" : "after:w-0"
                }`}
              >
                <svg
                  className={`transition-transform duration-400 ${
                    insightOpen
                      ? "rotate-180 [transition-timing-function:cubic-bezier(.34,1.56,.64,1)]"
                      : "[transition-timing-function:cubic-bezier(.34,1.56,.64,1)]"
                  }`}
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="2,4 7,10 12,4" />
                </svg>
              </button>
            </div>

            {/* AI Content */}
            <div
              className={`mt-6 sm:mt-8 overflow-hidden transition-all duration-500 ease-in-out transform ${
                insightOpen
                  ? "max-h-[2000px] opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-2"
              }`}
            >
              {/* Controls */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                {/* Mode toggle */}
                <div className="flex bg-gray-100 rounded-xl p-1 self-start shadow-inner border border-gray-200">
                  <button
                    onClick={() => setInsightMode("quick")}
                    className={`px-4 sm:px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      insightMode === "quick"
                        ? "bg-white shadow text-indigo-600 scale-[1.02]"
                        : "text-gray-500"
                    }`}
                  >
                    ⚡ Quick
                  </button>

                  <button
                    onClick={() => setInsightMode("detailed")}
                    className={`px-4 sm:px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      insightMode === "detailed"
                        ? "bg-white shadow text-indigo-600 scale-[1.02]"
                        : "text-gray-500"
                    }`}
                  >
                    📊 Detailed
                  </button>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  {aiInsight && !aiLoading && (
                    <button
                      onClick={() => setAiInsight("")}
                      className="px-4 py-2 text-sm font-medium rounded-xl border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 active:scale-95 transition w-full sm:w-auto"
                    >
                      Clear
                    </button>
                  )}

                  <button
                    onClick={() => generateAIInsights(insightMode)}
                    disabled={aiLoading}
                    className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 transition-all shadow-sm w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {aiLoading ? "Analyzing..." : "Generate Insights"}
                  </button>
                </div>
              </div>

              {/* Loading */}
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center py-16 sm:py-20">
                  <div className="h-12 w-12 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin shadow-md" />
                  <p className="mt-5 text-sm font-medium text-gray-500">
                    Generating{" "}
                    {insightMode === "quick"
                      ? "quick summary…"
                      : "detailed strategic analysis…"}
                  </p>
                </div>
              ) : aiInsight ? (
                (() => {
                  const clean = (aiInsight || "")
                    .replace(/\*\*/g, "")
                    .replace(/\\n/g, "\n")
                    .replace(/\r/g, "")
                    .replace(/Pipeline Status:/g, "\nPipeline Status:")
                    .replace(/Main Risk:/g, "\nMain Risk:")
                    .replace(/Immediate Action:/g, "\nImmediate Action:")
                    .replace(
                      /Strategic Recommendation:/g,
                      "\nStrategic Recommendation:",
                    )
                    .trim();

                  const isDetailed = insightMode === "detailed";

                  if (!isDetailed) {
                    const extract = (start, end) => {
                      const regex = new RegExp(
                        `${start}:\\s*([\\s\\S]*?)(?=${end}:|$)`,
                        "i",
                      );
                      const match = clean.match(regex);
                      return match ? match[1].replace(/\n/g, " ").trim() : "";
                    };

                    const lines = [
                      `Pipeline Status: ${extract("Pipeline Status", "Main Risk")}`,
                      `Main Risk: ${extract("Main Risk", "Immediate Action")}`,
                      `Immediate Action: ${extract("Immediate Action", "Strategic Recommendation")}`,
                      `Strategic Recommendation: ${extract("Strategic Recommendation", "$")}`,
                    ];

                    const quickCardConfig = [
                      {
                        bg: "bg-indigo-50/80",
                        border: "border-indigo-200",
                        text: "text-indigo-700",
                        icon: "📊",
                        iconBg: "bg-indigo-100",
                      },
                      {
                        bg: "bg-red-50/80",
                        border: "border-red-200",
                        text: "text-red-700",
                        icon: "⚠️",
                        iconBg: "bg-red-100",
                      },
                      {
                        bg: "bg-emerald-50/80",
                        border: "border-emerald-200",
                        text: "text-emerald-700",
                        icon: "🚀",
                        iconBg: "bg-emerald-100",
                      },
                      {
                        bg: "bg-blue-50/80",
                        border: "border-blue-200",
                        text: "text-blue-700",
                        icon: "💡",
                        iconBg: "bg-blue-100",
                      },
                    ];

                    return (
                      <div className="space-y-4">
                        <div className="text-right text-xs text-gray-400 font-medium">
                          Generated at{" "}
                          {new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {lines.map((line, index) => {
                            const [heading, ...rest] = line.split(":");
                            const content = rest.join(":").trim();
                            const cfg =
                              quickCardConfig[index] || quickCardConfig[0];

                            return (
                              <div
                                key={index}
                                className={`rounded-2xl border p-5 ${cfg.bg} ${cfg.border} transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
                              >
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`h-10 w-10 flex items-center justify-center rounded-xl ${cfg.iconBg} text-lg flex-shrink-0`}
                                  >
                                    {cfg.icon}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[11px] uppercase font-semibold text-gray-500 tracking-wide">
                                      {heading}
                                    </p>
                                    <p
                                      className={`mt-1.5 text-sm font-medium leading-relaxed ${cfg.text}`}
                                    >
                                      {content}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  // Detailed mode (unchanged logic, only styling improved above)
                  // Detailed mode with colored sections
                  const sections = [
                    {
                      key: "Pipeline Status",
                      color: "indigo",
                      icon: "📊",
                    },
                    {
                      key: "Main Risk",
                      color: "red",
                      icon: "⚠️",
                    },
                    {
                      key: "Strategic Recommendation",
                      color: "blue",
                      icon: "💡",
                    },
                    {
                      key: "Immediate Action",
                      color: "emerald",
                      icon: "🚀",
                    },
                  ];

                  // helper to extract section content
                  const extractSection = (title) => {
                    const regex = new RegExp(
                      `${title}:\\s*([\\s\\S]*?)(?=${sections
                        .map((s) => s.key)
                        .join(":|")}:|$)`,
                      "i",
                    );
                    const match = clean.match(regex);
                    return match ? match[1].trim() : "";
                  };

                  return (
                    <div className="space-y-4">
                      {sections.map((s, i) => {
                        const content = extractSection(s.key);
                        if (!content) return null;

                        return (
                          <div
                            key={i}
                            className={`rounded-2xl border p-5 bg-${s.color}-50/80 border-${s.color}-200 hover:shadow-md transition`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`h-10 w-10 flex items-center justify-center rounded-xl bg-${s.color}-100 text-lg`}
                              >
                                {s.icon}
                              </div>

                              <div>
                                <p className="text-[11px] uppercase font-semibold text-gray-500 tracking-wide">
                                  {s.key}
                                </p>

                                <p
                                  className={`mt-1.5 text-sm font-medium leading-relaxed text-${s.color}-700`}
                                >
                                  {content}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 sm:p-12 lg:p-14 text-center">
                  <div className="max-w-lg mx-auto">
                    <div className="flex justify-center mb-4">
                      <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-indigo-100 text-2xl">
                        ✨
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Unlock AI-Driven Intelligence
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      Generate insights about pipeline health, conversion
                      velocity, bottlenecks, risk concentration, and executive
                      action recommendations.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ═══════════════ SECTION HEADER ═══════════════ */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
              Pipeline Overview
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Performance metrics, behavior risk, and time risk
            </p>
          </div>
        </div>

        {/* ═══════════════ KPI STRIP ═══════════════ */}
        <div className="relative z-20 overflow-visible grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {/* Conversion Rate */}
          <KPICard
            label="Conversion Rate"
            value={`${kpis.conversionRate || 0}%`}
            subtitle="Closed won vs total deals"
            accent="#10b981"
            icon="🏆"
            calculation={
              <div className="space-y-1">
                <p className="font-semibold text-slate-700 mb-2">
                  🧮 Calculation
                </p>
                <p>Won Deals: {kpis.calculation?.wonDeals || 0}</p>
                <p>Lost Deals: {kpis.calculation?.lostDeals || 0}</p>
                <p>Total Deals: {kpis.calculation?.closedDeals || 0}</p>
                <p className="text-slate-500 text-xs mt-2">Formula</p>
                <p className="font-mono text-xs">
                  ({kpis.calculation?.wonDeals || 0} /{" "}
                  {kpis.calculation?.closedDeals || 0}) × 100
                </p>
                <p className="font-bold">= {kpis.conversionRate || 0}%</p>
                <div className="border-t pt-2 mt-2">
                  <p className="text-emerald-600 text-xs font-medium">
                    🟢 Healthy conversion rate
                  </p>
                  <p className="text-xs text-slate-500">
                    High conversion indicates strong deal qualification.
                  </p>
                </div>
              </div>
            }
          />

          {/* Revenue Won */}
          <KPICard
            label="Revenue Won"
            value={`₹${(kpis.revenueWon || 0).toLocaleString("en-IN")}`}
            subtitle="Total closed revenue"
            accent="#f59e0b"
            icon="💵"
            calculation={
              <div className="space-y-1">
                <p className="font-semibold text-slate-700 mb-2">
                  🧮 Calculation
                </p>
                <p>Total Closed Won Revenue</p>
                <p className="text-slate-500 text-xs mt-2">Formula</p>
                <p className="font-mono text-xs">
                  Sum(All CLOSED_WON deal values)
                </p>
                <p className="font-bold">
                  = ₹
                  {(kpis.calculation?.revenueWon || 0).toLocaleString("en-IN")}
                </p>
                <div className="border-t pt-2 mt-2">
                  <p className="text-indigo-600 text-xs font-medium">
                    💰 Revenue Performance
                  </p>
                  <p className="text-xs text-slate-500">
                    Represents total realized revenue from successfully closed
                    deals.
                  </p>
                </div>
              </div>
            }
          />

          {/* Revenue Achievement */}
          <KPICard
            label="Revenue Achievement"
            value={`${
              Number(expectedRevenue) > 0
                ? (
                    (Number(inputRevenueWon) / Number(expectedRevenue)) *
                    100
                  ).toFixed(2)
                : "--"
            }%`}
            subtitle="Target vs achieved revenue"
            accent="#0ea5e9"
            icon="📊"
            calculation={
              <div className="space-y-4">
                {(() => {
                  const formatINR = (value) => {
                    if (!value) return "";
                    const number = Number(value.toString().replace(/,/g, ""));
                    if (isNaN(number)) return "";
                    return new Intl.NumberFormat("en-IN").format(number);
                  };
                  const parseINR = (value) => value.replace(/,/g, "");
                  const percent =
                    Number(expectedRevenue) > 0
                      ? (Number(inputRevenueWon) / Number(expectedRevenue)) *
                        100
                      : 0;
                  const percentColor =
                    percent >= 90
                      ? "text-emerald-600"
                      : percent >= 70
                        ? "text-lime-600"
                        : percent >= 50
                          ? "text-amber-500"
                          : percent >= 30
                            ? "text-orange-500"
                            : "text-rose-500";

                  return (
                    <>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          Revenue Calculator
                        </p>
                        <p className="text-xs text-slate-400">
                          Simulate performance against your target
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-slate-500">Target Revenue</p>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                            ₹
                          </span>
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="1,00,000"
                            value={formatINR(expectedRevenue)}
                            onChange={(e) =>
                              setExpectedRevenue(parseINR(e.target.value))
                            }
                            className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-400"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-500">Revenue Won</p>
                          <button
                            onClick={() =>
                              setInputRevenueWon(
                                (kpis?.revenueWon || "").toString(),
                              )
                            }
                            className="text-[11px] px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-600 hover:bg-sky-100 font-medium transition"
                          >
                            Use Actual
                          </button>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                            ₹
                          </span>
                          <input
                            type="text"
                            inputMode="numeric"
                            // placeholder="7,10,000"
                            value={formatINR(inputRevenueWon)}
                            onChange={(e) =>
                              setInputRevenueWon(parseINR(e.target.value))
                            }
                            className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-400"
                          />
                        </div>
                        {Number(inputRevenueWon) === Number(kpis?.revenueWon) &&
                          inputRevenueWon !== "" && (
                            <p className="text-[11px] text-emerald-600">
                              ✓ Using actual revenue
                            </p>
                          )}
                      </div>
                      <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                        <p className="text-[11px] text-slate-500 mb-1">
                          Result
                        </p>
                        <p className="text-sm font-mono text-slate-600">
                          (Won / Target) × 100
                        </p>
                        <p className={`text-lg font-bold mt-1 ${percentColor}`}>
                          {Number(expectedRevenue) > 0
                            ? percent.toFixed(2) + "%"
                            : "--"}
                        </p>
                      </div>
                      <div className="border-t pt-3">
                        <p className="text-[11px] text-sky-600 font-medium">
                          Target Simulation
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Adjust values to explore different revenue outcomes.
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            }
          />

          {/* Closing Date Risk */}
          <div
            onClick={() => loadDrilldown("overdue")}
            className="cursor-pointer"
          >
            <KPICard
              label="Closing Date Risk"
              value={
                <span
                  className={
                    kpis.overdueDealsPercent >= 40
                      ? "text-red-600"
                      : kpis.overdueDealsPercent >= 20
                        ? "text-amber-500"
                        : "text-emerald-600"
                  }
                >
                  {kpis.overdueDealsPercent || 0}%
                </span>
              }
              subtitle="Deals past expected closing date"
              accent="#ef4444"
              icon="⏰"
              calculation={
                <div className="space-y-1">
                  <p className="font-semibold text-slate-700 mb-2">
                    🧮 Calculation
                  </p>
                  <p>
                    Total Active Deals:{" "}
                    {kpis.calculation?.totalActiveDeals || 0}
                  </p>
                  <p>Overdue Deals: {kpis.calculation?.overdueDeals || 0}</p>
                  <p className="text-slate-500 text-xs mt-2">Formula</p>
                  <p className="font-mono text-xs">
                    (Overdue Deals / Active Deals) × 100
                  </p>
                  <p className="font-bold">
                    = {kpis.overdueDealsPercent || 0}%
                  </p>
                  <div className="border-t pt-2 mt-2">
                    <p className="text-rose-600 text-xs font-medium">
                      ⚠️ Pipeline Risk Indicator
                    </p>
                    <p className="text-xs text-slate-500">
                      Higher overdue % indicates delays and poor pipeline
                      health.
                    </p>
                  </div>
                </div>
              }
            />
          </div>
        </div>

        {/* ═══════════════ CHARTS ROW ═══════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Stage Distribution */}
          <Card
            title="Stage Distribution"
            subtitle="Deals across pipeline stages"
            className="lg:col-span-5"
          >
            <div className="flex flex-col gap-5">
              <div className="flex justify-center py-2">
                <DonutChart data={stageDistribution} />
              </div>
              <div className="border-t border-gray-100 pt-4">
                <StageLegend data={stageDistribution} />
              </div>
            </div>
          </Card>

          {/* Sales Funnel */}
          <Card
            title="Sales Funnel"
            subtitle="Stage-wise conversion rates"
            className="lg:col-span-7"
          >
            {analyticsLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : funnelData.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                No funnel data available
              </p>
            ) : (
              <div className="flex flex-col lg:flex-row items-start gap-6">
                <div className="w-full lg:w-[55%] flex items-center justify-center">
                  <VisualFunnel data={funnelData} />
                </div>
                <div className="hidden lg:block self-stretch w-px bg-gray-100" />
                <div className="w-full lg:flex-1 flex flex-col justify-center">
                  <FunnelLegend data={funnelData} />
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* ═══════════════ INSIGHTS ROW ═══════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Pipeline Risk */}
          <Card
            title="Pipeline Risk (Behavior)"
            subtitle="Based on stage delay and deal stagnation"
            className="lg:col-span-4"
          >
            {analyticsLoading ? (
              <div className="flex justify-center py-6">
                <Spinner />
              </div>
            ) : riskDistribution.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">
                No risk data
              </p>
            ) : (
              <div className="space-y-3">
                {riskDistribution.map((r) => {
                  const conf = RISK_CONFIG[r.riskLevel] || RISK_CONFIG.LOW;
                  const pct =
                    totalRisk > 0
                      ? Math.round((r._count.id / totalRisk) * 100)
                      : 0;
                  return (
                    <div
                      key={r.riskLevel}
                      onClick={() => loadDrilldown("risk", r.riskLevel)}
                      className={`
                        rounded-xl border px-5 py-4 cursor-pointer 
                        ${conf.bg} ${conf.border}
                        transition-all duration-200
                        hover:shadow-md hover:scale-[1.01]
                        active:scale-[0.99]
                      `}
                    >
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`h-3 w-3 rounded-full ${conf.dot}`}
                          />
                          <span
                            className={`text-sm font-semibold uppercase tracking-wide ${conf.text}`}
                          >
                            {r.riskLevel}
                          </span>
                        </div>
                        <span
                          className={`text-2xl font-bold tabular-nums ${conf.text}`}
                        >
                          {r._count.id}
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/70 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${pct}%`,
                            background: conf.bar,
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5 font-medium">
                        {pct}% of pipeline
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Pipeline Velocity */}
          <Card
            title="Pipeline Velocity"
            subtitle="Average days per stage"
            className="lg:col-span-8"
          >
            {analyticsLoading ? (
              <div className="flex justify-center py-6">
                <Spinner />
              </div>
            ) : (
              <>
                {bottleneck && (
                  <div className="mb-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-xl flex-shrink-0">
                        ⚠️
                      </div>
                      <div>
                        <p className="text-sm font-bold text-amber-900">
                          Bottleneck Detected
                        </p>
                        <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mt-0.5">
                          {bottleneck.stage.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-3xl font-extrabold text-amber-700 leading-none tabular-nums">
                        {bottleneck.avgDays}d
                      </p>
                      <p className="text-[11px] font-medium text-amber-500 mt-1 uppercase tracking-wide">
                        avg days
                      </p>
                    </div>
                  </div>
                )}
                <VelocityLineChart
                  data={stageAging}
                  onStageClick={(stage) => loadDrilldown("stage", stage)}
                />
              </>
            )}
          </Card>
        </div>

        {/* ═══════════════ DRILLDOWN MODAL ═══════════════ */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
              onClick={() => {
                setIsModalOpen(false);
                setDrilldownType(null);
              }}
            />

            {/* Modal */}
            <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="px-5 sm:px-6 py-4 flex items-center justify-between bg-gray-50/80 border-b border-gray-200 flex-shrink-0">
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                    {drilldownType === "overdue" && "Closing Date Risk Deals"}
                    {filters.risk && `${filters.risk} Risk Deals`}
                    {filters.stage &&
                      `${filters.stage.replace(/_/g, " ")} Deals`}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {drilldownType === "overdue" &&
                      "Deals delayed beyond expected closing date"}
                    {filters.risk && "Behavior risk based on stage delay"}
                    {filters.stage && "Deals filtered by pipeline stage"}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setDrilldownType(null);
                  }}
                  className="h-9 w-9 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0 ml-3"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 px-5 sm:px-6 pt-3 pb-0 border-b border-gray-200 bg-white flex-shrink-0">
                <button
                  onClick={() => setActiveTab("data")}
                  className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all ${
                    activeTab === "data"
                      ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  📊 Data
                </button>
                <button
                  onClick={() => setActiveTab("insights")}
                  className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all ${
                    activeTab === "insights"
                      ? "bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  🧠 Insights
                </button>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 overflow-y-auto flex-1">
                {activeTab === "data" ? (
                  drilldownLoading ? (
                    <Spinner />
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-200">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50/80 border-b border-gray-200">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Deal
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Account
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Stage
                            </th>
                            {drilldownType === "overdue" ? (
                              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Delay
                              </th>
                            ) : (
                              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Days Stuck
                              </th>
                            )}
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Owner
                            </th>
                            {drilldownType !== "overdue" && (
                              <>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                  Last Change
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                  Closing Date
                                </th>
                              </>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {[...drilldownData]
                            .sort((a, b) => {
                              if (drilldownType === "overdue") {
                                return (b.delayDays || 0) - (a.delayDays || 0);
                              }
                              return (
                                (b.daysInStage || 0) - (a.daysInStage || 0)
                              );
                            })
                            .map((d) => {
                              const isOverdue = drilldownType === "overdue";
                              const value = isOverdue
                                ? d.delayDays
                                : d.daysInStage;

                              return (
                                <tr
                                  key={d.dealId}
                                  className="hover:bg-gray-50/50 transition-colors"
                                >
                                  <td className="px-4 py-3.5 font-medium text-gray-800">
                                    {d.dealName}
                                  </td>
                                  <td className="px-4 py-3.5 text-gray-600">
                                    {d.accountName}
                                  </td>
                                  <td className="px-4 py-3.5">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                                      {d.stage.replace(/_/g, " ")}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3.5 text-right">
                                    <span className="font-bold text-gray-800 tabular-nums">
                                      {value}d
                                    </span>
                                  </td>
                                  <td className="px-4 py-3.5 text-gray-600">
                                    {d.owner}
                                  </td>
                                  {!isOverdue && (
                                    <>
                                      <td className="px-4 py-3.5 text-gray-500">
                                        {formatDate(d.lastStageChangeAt)}
                                      </td>
                                      <td className="px-4 py-3.5 text-gray-500">
                                        {formatDate(d.closingDate)}
                                      </td>
                                    </>
                                  )}
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  )
                ) : (
                  <div className="space-y-4">
                    {/* Closing Date Risk */}
                    {drilldownType === "overdue" && (
                      <div className="rounded-2xl border border-red-200 bg-white shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 bg-red-50 border-b border-red-100">
                          <div>
                            <h4 className="text-sm font-semibold text-red-700 uppercase tracking-wide">
                              Closing Date Risk
                            </h4>
                            <p className="text-xs text-red-500 mt-0.5">
                              Time-based pipeline health indicator
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-red-600 leading-none tabular-nums">
                              {kpis.overdueDealsPercent || 0}%
                            </p>
                            <p className="text-[11px] text-red-500 mt-0.5">
                              Overdue
                            </p>
                          </div>
                        </div>

                        <div className="p-5 space-y-5">
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Measures the percentage of active deals that have
                            exceeded their expected closing date. A higher value
                            indicates delays in pipeline execution and potential
                            revenue risk.
                          </p>

                          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                            <p className="text-[11px] uppercase text-gray-400 font-medium mb-1">
                              Calculation Formula
                            </p>
                            <p className="font-mono text-sm text-gray-700">
                              (Overdue Deals / Active Deals) × 100
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-center">
                              <p className="text-xs text-gray-500 mb-1">
                                Active Deals
                              </p>
                              <p className="text-lg font-semibold text-gray-800 tabular-nums">
                                {kpis.calculation?.totalActiveDeals || 0}
                              </p>
                            </div>
                            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-center">
                              <p className="text-xs text-red-500 mb-1">
                                Overdue Deals
                              </p>
                              <p className="text-lg font-semibold text-red-600 tabular-nums">
                                {kpis.calculation?.overdueDeals || 0}
                              </p>
                            </div>
                          </div>

                          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                            <p className="text-xs font-semibold text-amber-700 mb-1 uppercase tracking-wide">
                              Insight
                            </p>
                            <p className="text-sm text-amber-700">
                              {kpis.overdueDealsPercent >= 40 &&
                                "Critical pipeline delay. Immediate intervention required."}
                              {kpis.overdueDealsPercent >= 20 &&
                                kpis.overdueDealsPercent < 40 &&
                                "Moderate delay detected. Monitor and prioritize key deals."}
                              {kpis.overdueDealsPercent < 20 &&
                                "Pipeline is healthy with minimal closing delays."}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Risk Insight */}
                    {filters.risk && (
                      <div className="rounded-xl border bg-amber-50 border-amber-200 p-5">
                        <h4 className="font-semibold text-amber-700 mb-2">
                          {filters.risk} Risk
                        </h4>
                        <p className="text-sm text-gray-600">
                          Risk is based on how long deals stay stuck in a stage.
                        </p>
                        <div className="mt-3 text-sm text-gray-700 leading-relaxed">
                          {filters.stage ? (
                            <>
                              {filters.risk === "LOW" && (
                                <p>
                                  Deals in{" "}
                                  <b>{filters.stage.replace(/_/g, " ")}</b> are
                                  progressing smoothly with minimal delay. This
                                  stage is not currently a bottleneck in your
                                  pipeline.
                                </p>
                              )}
                              {filters.risk === "MEDIUM" && (
                                <p>
                                  Deals in{" "}
                                  <b>{filters.stage.replace(/_/g, " ")}</b> are
                                  experiencing moderate delays. Monitoring and
                                  timely follow-ups are recommended to avoid
                                  escalation.
                                </p>
                              )}
                              {filters.risk === "HIGH" && (
                                <p>
                                  Deals in{" "}
                                  <b>{filters.stage.replace(/_/g, " ")}</b> are
                                  significantly delayed, indicating a potential
                                  bottleneck. Immediate intervention is required
                                  to prevent pipeline stagnation.
                                </p>
                              )}
                            </>
                          ) : (
                            <p>
                              Risk is determined by how long deals remain in a
                              stage relative to expected duration.
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Stage Insight */}
                    {filters.stage && (
                      <div className="rounded-xl border bg-indigo-50 border-indigo-200 p-5">
                        <h4 className="font-semibold text-indigo-700 mb-2">
                          {filters.stage.replace(/_/g, " ")} Stage
                        </h4>
                        <p className="text-sm text-gray-600">
                          Shows how long deals are staying in this stage.
                        </p>
                        <p className="text-sm mt-2 text-gray-500">
                          Higher duration indicates bottlenecks.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Next Best Action */}
                <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 mt-4 shadow-sm">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-lg flex-shrink-0">
                    💡
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Next Best Action
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {drilldownType === "overdue" &&
                        kpis.overdueDealsPercent >= 40 &&
                        "Immediately prioritize overdue deals, re-engage decision-makers, and revise timelines to recover pipeline health."}
                      {drilldownType === "overdue" &&
                        kpis.overdueDealsPercent >= 20 &&
                        kpis.overdueDealsPercent < 40 &&
                        "Focus on delayed deals and ensure consistent follow-ups to prevent further slippage."}
                      {filters.risk === "HIGH" &&
                        `Urgently review deals in ${filters.stage?.replace(/_/g, " ") || "this stage"}, unblock decision-makers, and resolve delays.`}
                      {filters.risk === "MEDIUM" &&
                        `Monitor deals in ${filters.stage?.replace(/_/g, " ") || "this stage"} closely and maintain follow-up cadence.`}
                      {filters.risk === "LOW" &&
                        `Maintain current momentum in ${filters.stage?.replace(/_/g, " ") || "this stage"} and ensure deals continue progressing.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─── FOOTER ─── */}
    </div>
  );
}

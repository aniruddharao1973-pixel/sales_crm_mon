// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchTopRiskDeals } from "./dealRiskSlice";
// import RiskBadge from "../../components/badges/RiskBadge";
// import { useNavigate } from "react-router-dom";

// const levelConfig = {
//   LOW: { label: "Low-Risk Deals", color: "text-green-600" },
//   MEDIUM: { label: "Medium-Risk Deals", color: "text-yellow-600" },
//   HIGH: { label: "High-Risk Deals", color: "text-orange-600" },
//   CRITICAL: { label: "Critical-Risk Deals", color: "text-red-600" },
// };

// export default function DealRiskPanel({ level = "HIGH" }) {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { topRiskDeals, loading, error } = useSelector(
//     (state) => state.dealRisk
//   );

//   useEffect(() => {
//     dispatch(fetchTopRiskDeals(level));
//   }, [dispatch, level]);

//   const config = levelConfig[level] || levelConfig.HIGH;

//   if (loading) {
//     return (
//       <div className="rounded-lg border bg-white p-4 text-sm text-gray-500">
//         Loading risky deals…
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="rounded-lg border bg-white p-4 shadow-sm">
//       {/* ================= HEADER ================= */}
//       <div className="mb-4 flex items-center justify-between">
//         <div className="flex flex-col">
//           <h3 className={`text-sm font-semibold ${config.color}`}>
//             {config.label}
//           </h3>
//           <span className="text-[11px] text-gray-500">
//             Top {topRiskDeals.length} deals
//           </span>
//         </div>
//       </div>

//       {/* ================= LIST ================= */}
//       {topRiskDeals.length === 0 ? (
//         <div className="rounded-md bg-gray-50 p-3 text-xs text-gray-500">
//           No risky deals at the moment 🎉
//         </div>
//       ) : (
//         <ul className="space-y-3">
//           {topRiskDeals.map((item) => (
//             <li
//               key={item.id}
//               className="group cursor-pointer rounded-lg border p-3 transition hover:shadow-md hover:bg-gray-50"
//               onClick={() => navigate(`/deals/${item.deal.id}`)}
//             >
//               <div className="flex items-center justify-between">
//                 {/* Left Side */}
//                 <div className="flex flex-col">
//                   <span className="text-sm font-medium text-gray-800 group-hover:text-gray-900">
//                     {item.deal.dealName}
//                   </span>

//                   <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500">
//                     <span className="rounded bg-gray-100 px-2 py-[2px]">
//                       {item.deal.stage}
//                     </span>

//                     {item.deal.amount && (
//                       <span>
//                         ₹{item.deal.amount.toLocaleString()}
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Right Side */}
//                 <RiskBadge
//                   level={item.riskLevel}
//                   score={item.score}
//                 />
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// src\features\analytics\DealRiskPanel.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopRiskDeals } from "./dealRiskSlice";
import RiskBadge from "../../components/badges/RiskBadge";
import { useNavigate } from "react-router-dom";

const levelConfig = {
  LOW: {
    label: "Low-Risk Deals",
    color: "text-emerald-700",
    accent: "bg-emerald-50 border-emerald-100",
    dot: "bg-emerald-500",
    pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  MEDIUM: {
    label: "Medium-Risk Deals",
    color: "text-amber-700",
    accent: "bg-amber-50 border-amber-100",
    dot: "bg-amber-400",
    pill: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
  HIGH: {
    label: "High-Risk Deals",
    color: "text-orange-700",
    accent: "bg-orange-50 border-orange-100",
    dot: "bg-orange-500",
    pill: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
  },
  CRITICAL: {
    label: "Critical-Risk Deals",
    color: "text-red-700",
    accent: "bg-red-50 border-red-100",
    dot: "bg-red-500",
    pill: "bg-red-50 text-red-700 ring-1 ring-red-200",
  },
};

/* ─── Skeleton loader ─── */
function SkeletonRow() {
  return (
    <li className="rounded-xl border border-gray-100 bg-gray-50/60 p-3.5 animate-pulse">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-3.5 w-2/3 rounded-full bg-gray-200" />
          <div className="flex gap-2">
            <div className="h-3 w-16 rounded-full bg-gray-200" />
            <div className="h-3 w-20 rounded-full bg-gray-200" />
          </div>
        </div>
        <div className="h-6 w-16 rounded-full bg-gray-200" />
      </div>
    </li>
  );
}

export default function DealRiskPanel({ level = "HIGH" }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { topRiskDeals, loading, error } = useSelector(
    (state) => state.dealRisk,
  );

  useEffect(() => {
    dispatch(fetchTopRiskDeals(level));
  }, [dispatch, level]);

  const config = levelConfig[level] || levelConfig.HIGH;

  /* ─── Error state ─── */
  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50/70 p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 text-sm">
            ✕
          </span>
          <div>
            <p className="text-sm font-semibold text-red-700">
              Failed to load deals
            </p>
            <p className="mt-0.5 text-xs text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.09)]">
      {/* ─── Header ─── */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Animated dot */}
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${config.dot}`}
            />
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${config.dot}`}
            />
          </span>

          <div>
            <h3
              className={`text-sm font-semibold leading-tight tracking-tight ${config.color}`}
            >
              {config.label}
            </h3>
            {!loading && (
              <p className="mt-0.5 text-[11px] font-medium text-gray-400 tracking-wide uppercase">
                {topRiskDeals.length} deal{topRiskDeals.length !== 1 ? "s" : ""}{" "}
                tracked
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ─── Loading state ─── */}
      {loading ? (
        <ul className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <SkeletonRow key={i} />
          ))}
        </ul>
      ) : topRiskDeals.length === 0 ? (
        /* ─── Empty state ─── */
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 px-4 py-8 text-center">
          <span className="mb-2 text-2xl">🎉</span>
          <p className="text-sm font-medium text-gray-600">All clear!</p>
          <p className="mt-1 text-xs text-gray-400">
            No risky deals at the moment.
          </p>
        </div>
      ) : (
        /* ─── Deal list ─── */
        <ul className="space-y-2">
          {topRiskDeals.map((item) => (
            <li
              key={item.id}
              onClick={() => navigate(`/deals/${item.deal.id}`)}
              className="group relative cursor-pointer rounded-xl border border-gray-100 bg-gray-50/40 px-4 py-3 transition-all duration-150 hover:border-gray-200 hover:bg-white hover:shadow-[0_2px_10px_rgba(0,0,0,0.07)] active:scale-[0.99]"
            >
              <div className="flex items-center justify-between gap-3">
                {/* Left — deal info */}
                <div className="flex min-w-0 flex-col gap-1.5">
                  <span className="truncate text-sm font-semibold text-gray-800 leading-snug transition-colors group-hover:text-gray-900">
                    {item.deal.dealName}
                  </span>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Stage pill */}
                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 ring-1 ring-inset ring-gray-200">
                      {item.deal.stage}
                    </span>

                    {/* Amount */}
                    {item.deal.amount && (
                      <span className="text-[11px] font-medium text-gray-500">
                        ₹{item.deal.amount.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right — risk badge + chevron */}
                <div className="flex shrink-0 items-center gap-2">
                  <RiskBadge level={item.riskLevel} score={item.score} />
                  <svg
                    className="h-4 w-4 text-gray-300 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

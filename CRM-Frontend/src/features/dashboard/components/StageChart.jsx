// import { formatCurrency, formatLabel, STAGE_COLORS } from "../../../constants";

// const StageChart = ({ data }) => {
//   if (!data || data.length === 0) {
//     return (
//       <div className="card">
//         <h3 className="section-title mb-4">Deals by Stage</h3>
//         <p className="text-gray-400 text-sm text-center py-8">No data available</p>
//       </div>
//     );
//   }

//   const maxAmount = Math.max(...data.map((d) => d.amount || 0), 1);
//   const totalDeals = data.reduce((sum, d) => sum + d.count, 0);

//   return (
//     <div className="card">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="section-title">Deals by Stage</h3>
//         <span className="text-sm text-gray-500">{totalDeals} total deals</span>
//       </div>

//       <div className="space-y-3">
//  {data.map((item) => {
//   const percentage = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;

//   const stageColor = STAGE_COLORS[item.stage] || {
//     bg: "bg-gray-50",
//     text: "text-gray-700",
//     dot: "bg-gray-500",
//   };

//   return (
//     <div key={item.stage} className="group">
//       <div className="flex items-center justify-between mb-1">
//         <div className="flex items-center gap-2">
//           <span className={`badge text-[10px] ${stageColor.bg} ${stageColor.text}`}>
//             {item.count}
//           </span>

//           <span className="text-sm text-gray-700">
//             {formatLabel(item.stage)}
//           </span>
//         </div>

//         <span className="text-sm font-semibold text-gray-900">
//           {formatCurrency(item.amount)}
//         </span>
//       </div>

//       <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
//         <div
//           className={`h-full rounded-full transition-all duration-500 ${stageColor.dot}`}
//           style={{ width: `${percentage}%` }}
//         />
//       </div>
//     </div>
//   );
// })}
//       </div>
//     </div>
//   );
// };

// export default StageChart;

// src\features\dashboard\components\StageChart.jsx
// import { formatLabel, STAGE_COLORS } from "../../../constants";

// const StageChart = ({ data }) => {
//   if (!data || data.length === 0) {
//     return (
//       <div className="card">
//         <h3 className="section-title mb-4">Deals by Stage</h3>
//         <p className="text-gray-400 text-sm text-center py-8">
//           No data available
//         </p>
//       </div>
//     );
//   }

//   const maxCount = Math.max(...data.map((d) => d.count), 1);
//   const totalDeals = data.reduce((sum, d) => sum + d.count, 0);

//   return (
//     <div className="card">
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="section-title">My Pipeline Deals By Stage</h3>
//         <div className="flex items-center gap-2">
//           <span className="text-sm text-gray-500">Total:</span>
//           <span className="text-lg font-semibold text-gray-800">
//             {totalDeals}
//           </span>
//         </div>
//       </div>

//       <div className="relative flex flex-col items-center py-4">
//         {data.map((item, index) => {
//           const widthPercentage = (item.count / maxCount) * 100;
//           const percentOfTotal = ((item.count / totalDeals) * 100).toFixed(1);

//           const stageColor = STAGE_COLORS[item.stage] || {
//             dot: "bg-gray-400",
//           };

//           return (
//             <div
//               key={item.stage}
//               className="relative group w-full flex flex-col items-center"
//             >
//               {/* Funnel Block Container */}
//               <div className="relative w-full flex justify-center">
//                 {/* Funnel Block */}
//                 <div
//                   className={`
//                     transition-all duration-500 ease-out
//                     ${stageColor.dot}
//                     hover:brightness-110 hover:scale-105
//                     cursor-pointer
//                     shadow-md hover:shadow-lg
//                     relative overflow-hidden
//                   `}
//                   style={{
//                     width: `${Math.max(widthPercentage, 20)}%`,
//                     height: "55px",
//                     clipPath:
//                       index === 0
//                         ? "polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)"
//                         : index === data.length - 1
//                         ? "polygon(10% 0%, 90% 0%, 70% 100%, 30% 100%)"
//                         : "polygon(5% 0%, 95% 0%, 90% 100%, 10% 100%)",
//                   }}
//                 >
//                   {/* Shine Effect */}
//                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20" />
//                 </div>

//                 {/* Stage Label & Count */}
//                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
//                   <span className="text-sm font-semibold text-gray-900 drop-shadow-sm">
//                     {formatLabel(item.stage)}
//                   </span>
//                   <span className="text-lg font-bold text-gray-900 drop-shadow-sm">
//                     {item.count}
//                   </span>
//                 </div>

//                 {/* Percentage Badge */}
//                 <div className="absolute -right-2 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full px-2 py-1 shadow-sm">
//                   <span className="text-xs font-medium text-gray-600">
//                     {percentOfTotal}%
//                   </span>
//                 </div>
//               </div>

//               {/* Tooltip */}
//               <div className="absolute -top-14 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col bg-gray-900 text-white shadow-xl rounded-lg px-4 py-2 text-xs z-20 min-w-[160px]">
//                 <div className="font-semibold text-sm mb-1">
//                   {formatLabel(item.stage)}
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-300">Deals:</span>
//                   <span className="font-bold">{item.count}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-300">Percentage:</span>
//                   <span className="font-bold">{percentOfTotal}%</span>
//                 </div>
//                 {/* Tooltip Arrow */}
//                 <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 transform rotate-45" />
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default StageChart;

// ===============================================================================================================================================
// src\features\dashboard\components\StageChart.jsx
import { formatLabel, STAGE_COLORS } from "../../../constants";

const StageChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-1">
          Pipeline
        </h3>
        <p className="text-base font-semibold text-gray-800 mb-6">
          Deals by Stage
        </p>
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7h18M3 12h12M3 17h6"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-400 font-medium">No pipeline data</p>
          <p className="text-xs text-gray-300">
            Deals will appear here once added
          </p>
        </div>
      </div>
    );
  }

  const totalDeals = data.reduce((sum, d) => sum + d.count, 0);

  const regrettedIndex = data.findIndex(
    (d) => d.stage.toLowerCase() === "regretted",
  );

  const funnelWidths = [];

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      funnelWidths.push(100);
      continue;
    }

    const prev = data[i - 1];
    const curr = data[i];

    const prevWidth = funnelWidths[i - 1];
    const ratio = prev.count === 0 ? 0 : curr.count / prev.count;

    let width = prevWidth * ratio;

    // keep the lower part a bit fuller after "Regretted"
    if (regrettedIndex !== -1 && i > regrettedIndex) {
      width = Math.max(width, prevWidth * 0.86);
    }

    // never let a stage become wider than the previous one
    width = Math.min(width, prevWidth * 0.95);

    // visual minimum
    const minWidth =
      i > regrettedIndex ? Math.max(12, 18 - (i - regrettedIndex) * 1.5) : 12;

    funnelWidths.push(Math.max(width, minWidth));
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 sm:mb-8">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Pipeline
          </p>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 leading-tight">
            My Pipeline Deals by Stage
          </h3>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            Total
          </span>
          <span className="text-2xl font-bold text-gray-800 leading-none tabular-nums">
            {totalDeals}
          </span>
        </div>
      </div>

      {/* Funnel */}
      <div className="flex flex-col items-center gap-1 px-2 sm:px-4 lg:px-6">
        {data.map((item, index) => {
          const percentOfTotal = ((item.count / totalDeals) * 100).toFixed(1);

          const stageColor = STAGE_COLORS[item.stage] || {
            dot: "bg-gray-300",
          };

          const clipPath =
            index === 0
              ? "polygon(0% 0%, 100% 0%, 95% 100%, 5% 100%)"
              : index === data.length - 1
                ? "polygon(10% 0%, 90% 0%, 70% 100%, 30% 100%)"
                : "polygon(5% 0%, 95% 0%, 90% 100%, 10% 100%)";

          return (
            <div
              key={item.stage}
              className="relative group w-full flex flex-col items-center"
            >
              {/* Funnel Row */}
              <div className="relative w-full flex justify-center items-center">
                {/* Funnel Block */}
                <div
                  className={`
              ${stageColor.dot}
              transition-all duration-300 ease-out
              hover:brightness-110 hover:scale-[1.02]
              cursor-pointer
              shadow-sm hover:shadow-md
              relative overflow-hidden
            `}
                  style={{
                    width: `${funnelWidths[index]}%`,
                    height: "52px",
                    clipPath,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                </div>

                {/* Label overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                  <span className="text-xs sm:text-sm font-semibold text-gray-900 drop-shadow-sm leading-tight">
                    {formatLabel(item.stage)}
                  </span>
                  <span className="text-base sm:text-lg font-bold text-gray-900 drop-shadow-sm tabular-nums leading-tight">
                    {item.count}
                  </span>
                </div>
              </div>

              {/* Tooltip */}
              <div className="absolute -top-[60px] left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col bg-gray-900/95 backdrop-blur-sm text-white shadow-xl rounded-xl px-4 py-2.5 text-xs z-20 min-w-[160px] pointer-events-none">
                <p className="font-semibold text-sm text-white mb-1.5 border-b border-gray-700 pb-1.5">
                  {formatLabel(item.stage)}
                </p>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-gray-400">Deals</span>
                  <span className="font-bold text-white tabular-nums">
                    {item.count}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-4 mt-0.5">
                  <span className="text-gray-400">Share</span>
                  <span className="font-bold text-white tabular-nums">
                    {percentOfTotal}%
                  </span>
                </div>
                <div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-gray-900/95 rotate-45 rounded-sm" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer legend */}
      <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap gap-x-4 gap-y-2">
        {data.map((item) => {
          const stageColor = STAGE_COLORS[item.stage] || { dot: "bg-gray-300" };
          return (
            <div key={item.stage} className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${stageColor.dot}`}
              />
              <span className="text-xs text-gray-500 font-medium">
                {formatLabel(item.stage)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StageChart;

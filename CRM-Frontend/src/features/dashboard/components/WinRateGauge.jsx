// // src\features\dashboard\components\WinRateGauge.jsx
// const WinRateGauge = ({ winRate, wonDeals, lostDeals, openDeals }) => {
//   const circumference = 2 * Math.PI * 45;
//   const strokeDashoffset = circumference - (winRate / 100) * circumference;

//   return (
//     <div className="card">
//       <h3 className="section-title mb-4">Win Rate</h3>

//       <div className="flex items-center justify-center">
//         <div className="relative w-32 h-32">
//           {/* Background circle */}
//           <svg className="w-full h-full transform -rotate-90">
//             <circle
//               cx="64"
//               cy="64"
//               r="45"
//               stroke="#e5e7eb"
//               strokeWidth="10"
//               fill="none"
//             />
//             <circle
//               cx="64"
//               cy="64"
//               r="45"
//               stroke={
//                 winRate >= 50
//                   ? "#10b981"
//                   : winRate >= 30
//                     ? "#f59e0b"
//                     : "#ef4444"
//               }
//               strokeWidth="10"
//               fill="none"
//               strokeLinecap="round"
//               strokeDasharray={circumference}
//               strokeDashoffset={strokeDashoffset}
//               className="transition-all duration-1000"
//             />
//           </svg>

//           {/* Center text */}
//           <div className="absolute inset-0 flex flex-col items-center justify-center">
//             <span className="text-3xl font-bold text-gray-900">{winRate}%</span>
//             <span className="text-xs text-gray-500">Win Rate</span>
//           </div>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-3 gap-2 mt-6">
//         <div className="text-center p-2 rounded-lg bg-green-50">
//           <p className="text-lg font-bold text-green-600">{wonDeals}</p>
//           <p className="text-xs text-green-700">Won</p>
//         </div>
//         <div className="text-center p-2 rounded-lg bg-red-50">
//           <p className="text-lg font-bold text-red-600">{lostDeals}</p>
//           <p className="text-xs text-red-700">Lost</p>
//         </div>
//         <div className="text-center p-2 rounded-lg bg-blue-50">
//           <p className="text-lg font-bold text-blue-600">{openDeals}</p>
//           <p className="text-xs text-blue-700">Open</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WinRateGauge;

// src\features\dashboard\components\WinRateGauge.jsx
const WinRateGauge = ({ winRate, wonDeals, lostDeals, openDeals }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (winRate / 100) * circumference;

  const gaugeColor =
    winRate >= 50 ? "#10b981" : winRate >= 30 ? "#f59e0b" : "#ef4444";

  const gaugeLabel =
    winRate >= 50 ? "On Track" : winRate >= 30 ? "Needs Attention" : "At Risk";

  const gaugeLabelColor =
    winRate >= 50
      ? "text-emerald-600"
      : winRate >= 30
        ? "text-amber-600"
        : "text-red-500";

  const stats = [
    {
      value: wonDeals,
      label: "Won",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      value_color: "text-emerald-600",
      label_color: "text-emerald-500",
      dot: "bg-emerald-400",
    },
    {
      value: lostDeals,
      label: "Lost",
      bg: "bg-red-50",
      border: "border-red-100",
      value_color: "text-red-500",
      label_color: "text-red-400",
      dot: "bg-red-400",
    },
    {
      value: openDeals,
      label: "Open",
      bg: "bg-blue-50",
      border: "border-blue-100",
      value_color: "text-blue-600",
      label_color: "text-blue-400",
      dot: "bg-blue-400",
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Performance
        </p>
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 leading-tight">
          Win Rate
        </h3>
      </div>

      {/* Gauge */}
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="relative w-36 h-36">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 128 128"
          >
            {/* Track */}
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="#f1f5f9"
              strokeWidth="10"
              fill="none"
            />
            {/* Progress */}
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke={gaugeColor}
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000"
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
            <span className="text-3xl font-bold text-gray-900 tabular-nums leading-none">
              {winRate}%
            </span>
            <span className="text-xs text-gray-400 font-medium">Win Rate</span>
          </div>
        </div>

        {/* Status badge */}
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${
            winRate >= 50
              ? "bg-emerald-50 border-emerald-100 text-emerald-600"
              : winRate >= 30
                ? "bg-amber-50 border-amber-100 text-amber-600"
                : "bg-red-50 border-red-100 text-red-500"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              winRate >= 50
                ? "bg-emerald-400"
                : winRate >= 30
                  ? "bg-amber-400"
                  : "bg-red-400"
            }`}
          />
          {gaugeLabel}
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 my-5" />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {stats.map(
          ({ value, label, bg, border, value_color, label_color, dot }) => (
            <div
              key={label}
              className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border ${bg} ${border} transition-all duration-200 hover:brightness-95`}
            >
              <p
                className={`text-lg sm:text-xl font-bold tabular-nums leading-tight ${value_color}`}
              >
                {value}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dot}`}
                />
                <p className={`text-xs font-medium ${label_color}`}>{label}</p>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
};

export default WinRateGauge;

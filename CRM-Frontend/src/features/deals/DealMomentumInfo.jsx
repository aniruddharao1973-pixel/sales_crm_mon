// // src\features\deals\DealMomentumInfo.jsx
// const DealMomentumInfo = ({ deal }) => {
//   const b = deal.breakdown || {};
//   const e = deal.explanation || {};

//   return (
//     <div className="text-xs text-gray-700 space-y-3">
//       {/* Title */}
//       <p className="font-semibold text-gray-900">
//         How this score was calculated
//       </p>

//       {/* HUMAN EXPLANATION */}
//       <div className="space-y-2 text-gray-600">
//         <p>• {e.value}</p>
//         <p>• {e.stage}</p>
//         <p>• {e.aging}</p>
//         <p>• {e.closing}</p>
//         <p>• {e.risk}</p>
//       </div>

//       {/* VISUAL BREAKDOWN */}
//       <div className="border-t pt-2">
//         <p className="text-[11px] text-gray-500 mb-1">Score Breakdown</p>

//         <div className="flex justify-between">
//           <span>Value</span>
//           <span>{b.valueScore || 0}</span>
//         </div>
//         <div className="flex justify-between">
//           <span>Stage</span>
//           <span>{b.stageScore || 0}</span>
//         </div>
//         <div className="flex justify-between">
//           <span>Time</span>
//           <span>{b.agingScore || 0}</span>
//         </div>
//         <div className="flex justify-between">
//           <span>Urgency</span>
//           <span>{b.closingScore || 0}</span>
//         </div>
//         <div className="flex justify-between">
//           <span>Risk</span>
//           <span>{b.riskAdjustment || 0}</span>
//         </div>
//       </div>

//       {/* FINAL RESULT */}
//       <div className="border-t pt-2 text-center">
//         <p className="text-[11px] text-gray-500">Final Score</p>
//         <p className="text-lg font-bold text-indigo-600">
//           {deal.momentumScore}
//         </p>
//         <p className="text-green-600 text-[11px]">{deal.reason}</p>
//       </div>
//     </div>
//   );
// };

// export default DealMomentumInfo;

// src\features\deals\DealMomentumInfo.jsx
const DealMomentumInfo = ({ deal }) => {
  const b = deal.breakdown || {};
  const e = deal.explanation || {};

  const items = [
    {
      label: "Deal Value",
      value: b.valueScore || 0,
      max: 30,
      desc: e.value,
    },
    {
      label: "Stage",
      value: b.stageScore || 0,
      max: 20,
      desc: e.stage,
    },
    {
      label: "Time in Stage",
      value: b.agingScore || 0,
      max: 20,
      desc: e.aging,
    },
    {
      label: "Closing Urgency",
      value: b.closingScore || 0,
      max: 20,
      desc: e.closing,
    },
    {
      label: "Risk Impact",
      value: b.riskAdjustment || 0,
      max: 10,
      desc: e.risk,
      isNegative: true,
    },
  ];

  return (
    <div className="text-xs text-gray-700 space-y-4">
      {/* HEADER */}
      <div>
        <p className="text-sm font-semibold text-gray-900">
          Deal Momentum Score
        </p>
        <p className="text-[11px] text-gray-500">
          How this score was calculated
        </p>
      </div>

      {/* FACTORS */}
      <div className="space-y-3">
        {items.map((item, i) => {
          const percent = Math.min(Math.abs(item.value) / item.max, 1) * 100;

          return (
            <div key={i} className="space-y-1">
              {/* Label + Value */}
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-medium text-gray-700">
                  {item.label}
                </span>
                <span
                  className={`text-[11px] font-semibold ${
                    item.value < 0 ? "text-red-500" : "text-indigo-600"
                  }`}
                >
                  {item.value}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    item.value < 0 ? "bg-red-400" : "bg-indigo-500"
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Explanation */}
              <p className="text-[10px] text-gray-500 leading-snug">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* FINAL SCORE */}
      <div className="border-t pt-3 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-gray-500">Final Score</p>
          <p className="text-lg font-bold text-indigo-600">
            {deal.momentumScore}
          </p>
        </div>

        <div className="text-right">
          <p
            className={`text-[11px] font-medium ${
              deal.momentumScore >= 60
                ? "text-green-600"
                : deal.momentumScore >= 35
                  ? "text-amber-600"
                  : "text-red-500"
            }`}
          >
            {deal.reason}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DealMomentumInfo;

// // src\features\dashboard\components\TopPerformers.jsx
// import {  formatIndianNumber } from "../../../constants";
// import Avatar from "../../../components/Avatar";

// const TopPerformers = ({ data }) => {
//   if (!data || data.length === 0) {
//     return (
//       <div className="card">
//         <h3 className="section-title mb-4">Top Performers</h3>
//         <p className="text-gray-400 text-sm text-center py-8">No data available</p>
//       </div>
//     );
//   }

//   const medalColors = ["text-yellow-500", "text-gray-400", "text-amber-600"];

//   return (
//     <div className="card">
//       <h3 className="section-title mb-4">Top Sales Performers</h3>

//       <div className="space-y-4">
//         {data.map((performer, index) => (
//           <div
//             key={performer.user?.id}
//             className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
//           >
//             {/* Rank */}
//             <div className="flex-shrink-0 w-8 text-center">
//               {index < 3 ? (
//                 <span className={`text-2xl ${medalColors[index]}`}>
//                   {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
//                 </span>
//               ) : (
//                 <span className="text-lg font-bold text-gray-400">
//                   #{index + 1}
//                 </span>
//               )}
//             </div>

//             {/* Avatar & Name */}
//             <div className="flex items-center gap-3 flex-1 min-w-0">
//               <Avatar
//                 name={performer.user?.name}
//                 image={performer.user?.avatar}
//                 size="md"
//               />
//               <div className="min-w-0">
//                 <p className="font-semibold text-gray-900 truncate">
//                   {performer.user?.name}
//                 </p>
//                 <p className="text-xs text-gray-500">
//                   {performer.wonDeals} deals won · {performer.winRate}% win rate
//                 </p>
//               </div>
//             </div>

//             {/* Revenue */}
//             <div className="text-right flex-shrink-0">
//               <p className="font-bold text-green-600">
//                 {formatIndianNumber(performer.wonAmount)}
//               </p>
//               <p className="text-xs text-gray-500">
//                 {performer.totalDeals} total
//               </p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TopPerformers;

// src\features\dashboard\components\TopPerformers.jsx
import { formatIndianNumber } from "../../../constants";
import Avatar from "../../../components/Avatar";

const medals = ["🥇", "🥈", "🥉"];

const rankRingColors = [
  "ring-yellow-300 bg-yellow-50",
  "ring-gray-300 bg-gray-50",
  "ring-amber-300 bg-amber-50",
];

const TopPerformers = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <h3 className="text-sm font-semibold tracking-tight text-gray-800">
          Top Performers
        </h3>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-2xl">
            🏆
          </div>
          <p className="text-sm font-medium text-gray-500">No data available</p>
          <p className="mt-1 text-xs text-gray-400">
            Performer stats will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.09)]">
      {/* ─── Header ─── */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold tracking-tight text-gray-800">
          Top Sales Performers
        </h3>
        <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
          {data.length} rep{data.length !== 1 ? "s" : ""} ranked
        </p>
      </div>

      {/* ─── Performer list ─── */}
      <div className="space-y-2">
        {data.map((performer, index) => {
          const isTop3 = index < 3;

          return (
            <div
              key={performer.user?.id}
              className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/40 px-4 py-3 transition-all duration-150 hover:border-gray-200 hover:bg-white hover:shadow-[0_2px_10px_rgba(0,0,0,0.07)]"
            >
              {/* ─── Rank ─── */}
              <div className="flex w-8 shrink-0 items-center justify-center">
                {isTop3 ? (
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-base ring-1 ring-inset ${rankRingColors[index]}`}
                  >
                    {medals[index]}
                  </span>
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-400 ring-1 ring-inset ring-gray-200">
                    #{index + 1}
                  </span>
                )}
              </div>

              {/* ─── Avatar & Name ─── */}
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Avatar
                  name={performer.user?.name}
                  image={performer.user?.avatar}
                  size="md"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-800 transition-colors group-hover:text-gray-900">
                    {performer.user?.name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-gray-400">
                    <span className="font-medium text-gray-500">
                      {performer.wonDeals}
                    </span>{" "}
                    won
                    <span className="mx-1 text-gray-300">·</span>
                    <span className="font-medium text-gray-500">
                      {performer.winRate}%
                    </span>{" "}
                    win rate
                  </p>
                </div>
              </div>

              {/* ─── Revenue ─── */}
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold tabular-nums text-emerald-600">
                  {formatIndianNumber(performer.wonAmount)}
                </p>
                <p className="mt-0.5 text-[11px] text-gray-400">
                  <span className="font-medium text-gray-500">
                    {performer.totalDeals}
                  </span>{" "}
                  total
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopPerformers;

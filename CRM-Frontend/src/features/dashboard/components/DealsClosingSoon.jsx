// // src\features\dashboard\components\DealsClosingSoon.jsx
// import { Link } from "react-router-dom";
// import { formatCurrency, formatLabel, STAGE_COLORS } from "../../../constants";
// import { CalendarIcon } from "@heroicons/react/24/outline";

// const DealsClosingSoon = ({ deals }) => {
//   if (!deals || deals.length === 0) {
//     return (
//       <div className="card">
//         <h3 className="section-title mb-4">Deals Closing This Month</h3>
//         <div className="text-center py-8">
//           <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
//           <p className="text-gray-400 text-sm">No deals closing this month</p>
//         </div>
//       </div>
//     );
//   }

//   const today = new Date();

//   return (
//     <div className="card">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="section-title">Deals Closing This Month</h3>
//         <span className="badge-blue">{deals.length} deals</span>
//       </div>

//       <div className="space-y-3">
//         {deals.map((deal) => {
//           const closingDate = new Date(deal.closingDate);
//           const daysLeft = Math.ceil((closingDate - today) / (1000 * 60 * 60 * 24));
//           const isOverdue = daysLeft < 0;
//           const isUrgent = daysLeft <= 7 && daysLeft >= 0;

//           return (
//             <Link
//               key={deal.id}
//               to={`/deals/${deal.id}`}
//               className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
//             >
//               <div className="min-w-0 flex-1">
//                 <div className="flex items-center gap-2">
//                   <p className="font-medium text-gray-900 truncate group-hover:text-blue-700">
//                     {deal.dealName}
//                   </p>
//                   <span className={`badge text-[10px] ${STAGE_COLORS[deal.stage]}`}>
//                     {formatLabel(deal.stage)}
//                   </span>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-0.5">
//                   {deal.account?.accountName} · {deal.owner?.name}
//                 </p>
//               </div>

//               <div className="text-right ml-4 flex-shrink-0">
//                 <p className="font-semibold text-gray-900">
//                   {formatCurrency(deal.amount)}
//                 </p>
//                 <p
//                   className={`text-xs font-medium ${
//                     isOverdue
//                       ? "text-red-600"
//                       : isUrgent
//                       ? "text-amber-600"
//                       : "text-gray-500"
//                   }`}
//                 >
//                   {isOverdue
//                     ? `${Math.abs(daysLeft)} days overdue`
//                     : daysLeft === 0
//                     ? "Closing today"
//                     : `${daysLeft} days left`}
//                 </p>
//               </div>
//             </Link>
//           );
//         })}
//       </div>

//       <Link
//         to="/deals"
//         className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium mt-4 pt-4 border-t border-gray-100"
//       >
//         View all deals →
//       </Link>
//     </div>
//   );
// };

// export default DealsClosingSoon;

// src\features\dashboard\components\DealsClosingSoon.jsx
import { Link } from "react-router-dom";
import { formatCurrency, formatLabel, STAGE_COLORS } from "../../../constants";
import { CalendarIcon } from "@heroicons/react/24/outline";

const DealsClosingSoon = ({ deals }) => {
  if (!deals || deals.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <h3 className="text-sm font-semibold tracking-tight text-gray-800">
          Deals Closing This Month
        </h3>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <CalendarIcon className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-500">
            No deals closing this month
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Check back later for upcoming closings.
          </p>
        </div>
      </div>
    );
  }

  const today = new Date();

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.09)]">
      {/* ─── Header ─── */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-gray-800">
            Deals Closing This Month
          </h3>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
            {deals.length} deal{deals.length !== 1 ? "s" : ""} tracked
          </p>
        </div>
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 ring-1 ring-inset ring-blue-100">
          {deals.length} deals
        </span>
      </div>

      {/* ─── Deal list ─── */}
      <div className="space-y-2">
        {deals.map((deal) => {
          const closingDate = new Date(deal.closingDate);
          const daysLeft = Math.ceil(
            (closingDate - today) / (1000 * 60 * 60 * 24),
          );
          const isOverdue = daysLeft < 0;
          const isUrgent = daysLeft <= 7 && daysLeft >= 0;

          return (
            <Link
              key={deal.id}
              to={`/deals/${deal.id}`}
              className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/40 px-4 py-3 transition-all duration-150 hover:border-gray-200 hover:bg-white hover:shadow-[0_2px_10px_rgba(0,0,0,0.07)] active:scale-[0.99]"
            >
              {/* Left — deal info */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="truncate text-sm font-semibold text-gray-800 transition-colors group-hover:text-blue-700">
                    {deal.dealName}
                  </p>
                  <span
                    className={`inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${STAGE_COLORS[deal.stage]}`}
                  >
                    {formatLabel(deal.stage)}
                  </span>
                </div>
                <p className="mt-1 truncate text-[11px] text-gray-400">
                  {deal.account?.accountName}
                  {deal.owner?.name && (
                    <>
                      <span className="mx-1 text-gray-300">·</span>
                      {deal.owner.name}
                    </>
                  )}
                </p>
              </div>

              {/* Right — amount + urgency */}
              <div className="ml-4 flex shrink-0 flex-col items-end gap-1">
                <p className="text-sm font-bold tabular-nums text-gray-800">
                  {formatCurrency(deal.amount)}
                </p>

                {/* Urgency pill */}
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${
                    isOverdue
                      ? "bg-red-50 text-red-600 ring-red-100"
                      : isUrgent
                        ? "bg-amber-50 text-amber-600 ring-amber-100"
                        : "bg-gray-100 text-gray-500 ring-gray-200"
                  }`}
                >
                  {/* dot */}
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isOverdue
                        ? "bg-red-500"
                        : isUrgent
                          ? "bg-amber-400"
                          : "bg-gray-400"
                    }`}
                  />
                  {isOverdue
                    ? `${Math.abs(daysLeft)}d overdue`
                    : daysLeft === 0
                      ? "Closing today"
                      : `${daysLeft}d left`}
                </span>
              </div>

              {/* Chevron */}
              <svg
                className="ml-3 h-4 w-4 shrink-0 text-gray-300 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-gray-400"
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
            </Link>
          );
        })}
      </div>

      {/* ─── Footer link ─── */}
      <div className="mt-4 border-t border-gray-100 pt-4">
        <Link
          to="/deals"
          className="group flex items-center justify-center gap-1.5 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
        >
          View all deals
          <svg
            className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default DealsClosingSoon;

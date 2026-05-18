// // src/features/dashboard/components/QuotationValueTrend.jsx

// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
// } from "recharts";

// const formatINR = (value = 0) => {
//   return new Intl.NumberFormat("en-IN", {
//     maximumFractionDigits: 0,
//   }).format(value);
// };

// const QuotationValueTrend = ({
//   data = [],
// }) => {
//   return (
//     <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
//       <div className="mb-5">
//         <h3 className="text-sm font-black text-slate-800">
//           Quotation Value Trend
//         </h3>

//         <p className="text-xs text-slate-400 mt-1">
//           Monthly quotation revenue movement
//         </p>
//       </div>

//       <div className="h-[320px]">
//         <ResponsiveContainer
//           width="100%"
//           height="100%"
//         >
//           <AreaChart data={data}>
//             <CartesianGrid
//               strokeDasharray="3 3"
//               vertical={false}
//             />

//             <XAxis dataKey="month" />

//             <YAxis />

//             <Tooltip
//               formatter={(v) =>
//                 `₹ ${formatINR(v)}`
//               }
//             />

//             <Area
//               type="monotone"
//               dataKey="value"
//               strokeWidth={3}
//               fillOpacity={0.15}
//             />
//           </AreaChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default QuotationValueTrend;


// src/features/dashboard/components/QuotationValueTrend.jsx

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const formatINR = (value = 0) => {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);
};

const QuotationValueTrend = ({ data = [] }) => {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-lg shadow-xl border border-slate-200/80 backdrop-blur-sm">
          <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-1.5">
            {label}
          </p>
          <p className="text-lg font-bold text-blue-600">
            ₹ {formatINR(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white to-slate-50/50 border border-slate-200/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header Section */}
      <div className="px-6 py-5 border-b border-slate-100/80 bg-white/60 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
          <h3 className="text-base font-semibold text-slate-800 tracking-tight">
            Quotation Value Trend
          </h3>
        </div>
        <p className="text-sm text-slate-500 ml-3">
          Monthly quotation revenue movement
        </p>
      </div>

      {/* Chart Section */}
      <div className="p-6">
        <div className="h-[320px] relative">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-transparent rounded-lg" />

          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 15, left: -5, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                </linearGradient>

                <filter id="shadow">
                  <feDropShadow
                    dx="0"
                    dy="2"
                    stdDeviation="3"
                    floodOpacity="0.1"
                  />
                </filter>
              </defs>

              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="#e2e8f0"
                strokeOpacity={0.5}
              />

              <XAxis
                dataKey="month"
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                tickLine={false}
                axisLine={{ stroke: "#cbd5e1", strokeWidth: 1.5 }}
                dy={8}
              />

              <YAxis
                tickFormatter={(value) => `₹${formatINR(value)}`}
                tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                tickLine={false}
                axisLine={{ stroke: "#cbd5e1", strokeWidth: 1.5 }}
                dx={-5}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: "#3b82f6",
                  strokeWidth: 1.5,
                  strokeDasharray: "4 4",
                }}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#colorValue)"
                filter="url(#shadow)"
                activeDot={{
                  r: 6,
                  fill: "#3b82f6",
                  stroke: "#fff",
                  strokeWidth: 3,
                }}
                dot={{
                  r: 4,
                  fill: "#3b82f6",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default QuotationValueTrend;

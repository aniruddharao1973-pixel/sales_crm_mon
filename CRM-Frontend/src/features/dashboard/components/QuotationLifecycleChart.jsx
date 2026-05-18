// // src/features/dashboard/components/QuotationLifecycleChart.jsx

// import {
//   ResponsiveContainer,
//   BarChart,
//   CartesianGrid,
//   Tooltip,
//   XAxis,
//   YAxis,
//   Bar,
// } from "recharts";

// const QuotationLifecycleChart = ({
//   data = [],
// }) => {
//   const formatted = data.map((d) => ({
//     ...d,
//     stage: d.stage.replace(/_/g, " "),
//   }));

//   return (
//     <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
//       <div className="mb-5">
//         <h3 className="text-sm font-black text-slate-800">
//           Quotation Lifecycle
//         </h3>

//         <p className="text-xs text-slate-400 mt-1">
//           Current quotation flow distribution
//         </p>
//       </div>

//       <div className="h-[320px]">
//         <ResponsiveContainer
//           width="100%"
//           height="100%"
//         >
//           <BarChart data={formatted}>
//             <CartesianGrid
//               strokeDasharray="3 3"
//               vertical={false}
//             />

//             <XAxis dataKey="stage" />

//             <YAxis allowDecimals={false} />

//             <Tooltip />

//             <Bar
//               dataKey="count"
//               radius={[10, 10, 0, 0]}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default QuotationLifecycleChart;

// src/features/dashboard/components/QuotationLifecycleChart.jsx

import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  Cell,
} from "recharts";

const QuotationLifecycleChart = ({ data = [] }) => {
  // Format stage names for better readability
  const formattedData = data.map((item) => ({
    ...item,
    stage: item.stage
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" "),
  }));

  // Color palette for bars - light theme
  const barColors = [
    "#3b82f6", // Blue
    "#8b5cf6", // Purple
    "#ec4899", // Pink
    "#f59e0b", // Amber
    "#10b981", // Emerald
    "#6366f1", // Indigo
  ];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-slate-200">
          <p className="text-sm font-semibold text-slate-700">
            {payload[0].payload.stage}
          </p>
          <p className="text-lg font-bold text-slate-900 mt-1">
            {payload[0].value} quotations
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header Section */}
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-800 tracking-tight">
              Quotation Lifecycle
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Distribution across pipeline stages
            </p>
          </div>

          {/* Optional: Total count badge */}
          <div className="bg-blue-50 px-3 py-1.5 rounded-lg">
            <p className="text-xs font-medium text-blue-700">
              Total: {formattedData.reduce((sum, item) => sum + item.count, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="px-6 py-6">
        <div className="h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
                opacity={0.6}
              />

              <XAxis
                dataKey="stage"
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
                angle={-15}
                textAnchor="end"
                height={60}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fill: "#64748b", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
                label={{
                  value: "Number of Quotations",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "#64748b", fontSize: 12 },
                }}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#f1f5f9" }}
              />

              <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={60}>
                {formattedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={barColors[index % barColors.length]}
                    opacity={0.9}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Optional: Footer with legend */}
      <div className="px-6 py-4 bg-slate-50 rounded-b-xl border-t border-slate-100">
        <div className="flex flex-wrap gap-4">
          {formattedData.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: barColors[index % barColors.length] }}
              />
              <span className="text-xs text-slate-600 font-medium">
                {item.stage}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuotationLifecycleChart;

// src/features/dashboard/components/QuotationLifecycleChart.jsx

import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
} from "recharts";

const QuotationLifecycleChart = ({
  data = [],
}) => {
  const formatted = data.map((d) => ({
    ...d,
    stage: d.stage.replace(/_/g, " "),
  }));

  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-sm font-black text-slate-800">
          Quotation Lifecycle
        </h3>

        <p className="text-xs text-slate-400 mt-1">
          Current quotation flow distribution
        </p>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart data={formatted}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis dataKey="stage" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Bar
              dataKey="count"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default QuotationLifecycleChart;
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

const QuotationValueTrend = ({
  data = [],
}) => {
  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-sm font-black text-slate-800">
          Quotation Value Trend
        </h3>

        <p className="text-xs text-slate-400 mt-1">
          Monthly quotation revenue movement
        </p>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip
              formatter={(v) =>
                `₹ ${formatINR(v)}`
              }
            />

            <Area
              type="monotone"
              dataKey="value"
              strokeWidth={3}
              fillOpacity={0.15}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default QuotationValueTrend;
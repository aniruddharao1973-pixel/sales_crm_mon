import { formatIndianNumber } from "../../../constants";

const MonthlyTrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-4 bg-indigo-500 rounded-full" />
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">
            Revenue Trend
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center py-12 gap-3 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
            <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 17l4-4 4 4 4-6 4 2" />
            </svg>
          </div>
          <p className="text-sm text-slate-400 font-bold">No trend data available</p>
        </div>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((d) => d.wonRevenue || 0), 1);
  const totalWon = data.reduce((sum, d) => sum + d.wonRevenue, 0);
  const totalNewDeals = data.reduce((sum, d) => sum + d.newDeals, 0);
  const totalWonCount = data.reduce((sum, d) => sum + d.wonCount, 0);

  const summaryStats = [
    {
      value: formatIndianNumber(totalWon),
      label: "Total Won",
      color: "text-emerald-600",
      bg: "bg-emerald-50/50",
      border: "border-emerald-100/50",
    },
    {
      value: totalNewDeals,
      label: "New Deals",
      color: "text-indigo-600",
      bg: "bg-indigo-50/50",
      border: "border-indigo-100/50",
    },
    {
      value: totalWonCount,
      label: "Deals Won",
      color: "text-slate-800",
      bg: "bg-slate-50/50",
      border: "border-slate-200/50",
    },
  ];

  return (
    <div className="group bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 bg-indigo-500 rounded-full" />
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">
            Revenue Velocity
          </h3>
        </div>
        <div className="px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Active Cycle</span>
        </div>
      </div>

      {/* Chart Grid */}
      <div className="relative">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-px w-full bg-slate-100" />
          ))}
        </div>

        {/* Bars */}
        <div className="relative flex items-end justify-between gap-2 sm:gap-4 h-48 sm:h-56 mb-4 px-2">
          {data.map((item, index) => {
            const height = maxRevenue > 0 ? (item.wonRevenue / maxRevenue) * 100 : 0;
            const isMax = item.wonRevenue === maxRevenue;

            return (
              <div key={index} className="flex-1 flex flex-col items-center group/bar relative h-full justify-end">
                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all duration-200 pointer-events-none z-20 translate-y-2 group-hover/bar:translate-y-0">
                  <div className="bg-slate-900 text-white rounded-lg px-3 py-1.5 text-center shadow-xl">
                    <p className="text-[11px] font-black">{formatIndianNumber(item.wonRevenue)}</p>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                  </div>
                </div>

                {/* Bar */}
                <div 
                  className={`
                    w-full max-w-[40px] rounded-t-lg transition-all duration-500 relative
                    ${isMax 
                      ? "bg-gradient-to-t from-[#3B2E7E] to-[#5A4A9C]" 
                      : "bg-slate-100 group-hover/bar:bg-indigo-100"}
                  `}
                  style={{ height: `${Math.max(height, 5)}%` }}
                >
                   {isMax && <div className="absolute -top-1 left-0 right-0 h-1 bg-white/20 rounded-full mx-1 mt-1 blur-[1px]" />}
                </div>
                
                {/* Label */}
                <p className={`text-[10px] font-bold mt-3 transition-colors ${isMax ? "text-indigo-600" : "text-slate-400"}`}>
                  {item.month}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100 my-6" />

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        {summaryStats.map(({ value, label, color, bg, border }) => (
          <div
            key={label}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border ${bg} ${border} transition-all hover:scale-[1.02]`}
          >
            <p className={`text-lg font-black tabular-nums leading-none mb-1 ${color}`}>
              {value}
            </p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyTrendChart;


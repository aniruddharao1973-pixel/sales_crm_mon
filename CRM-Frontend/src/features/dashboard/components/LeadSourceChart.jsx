import { formatLabel } from "../../../constants";

const COLORS = [
  {
    bar: "bg-indigo-500",
    dot: "bg-indigo-500",
    badge: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
  {
    bar: "bg-blue-500",
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    bar: "bg-emerald-500",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    bar: "bg-amber-500",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-600 border-amber-100",
  },
  {
    bar: "bg-rose-500",
    dot: "bg-rose-500",
    badge: "bg-rose-50 text-rose-600 border-rose-100",
  },
  {
    bar: "bg-violet-500",
    dot: "bg-violet-500",
    badge: "bg-violet-50 text-violet-600 border-violet-100",
  },
];

const LeadSourceChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-4 bg-indigo-500 rounded-full" />
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">
            Source Mix
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center py-10 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
           <p className="text-sm font-bold text-slate-400">No source data</p>
        </div>
      </div>
    );
  }

  const totalDeals = data.reduce((sum, d) => sum + d.totalDeals, 0);
  const topSource = data[0];

  return (
    <div className="group bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 bg-indigo-500 rounded-full" />
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">
            Market Origination
          </h3>
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {totalDeals} Total
        </span>
      </div>

      {/* Bar list */}
      <div className="space-y-5">
        {data.slice(0, 5).map((item, index) => {
          const percentage = totalDeals > 0 ? (item.totalDeals / totalDeals) * 100 : 0;
          const color = COLORS[index % COLORS.length];

          return (
            <div key={item.source} className="group/item">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-2 h-2 rounded-full ${color.dot} shadow-sm`} />
                  <span className="text-xs font-bold text-slate-700 truncate group-hover/item:text-indigo-600 transition-colors">
                    {formatLabel(item.source)}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                   <span className="text-[10px] font-bold text-slate-400 tabular-nums">{item.totalDeals} Deals</span>
                   <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border tabular-nums ${color.badge}`}>
                     {percentage.toFixed(1)}%
                   </span>
                </div>
              </div>
              <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${color.bar}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Stats */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
          <div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Top Performer</p>
            <p className="text-xs font-extrabold text-slate-800">{formatLabel(topSource?.source)}</p>
          </div>
          <div className="text-right">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Win Velocity</p>
             <p className="text-xs font-extrabold text-emerald-600">{topSource?.winRate}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadSourceChart;


import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
  color = "blue",
  onClick,
}) => {
  const colorVariants = {
    blue: {
      icon: "from-blue-500 to-blue-600 shadow-blue-200",
      bg: "bg-blue-50/50",
      text: "text-blue-700",
      border: "border-blue-100/50"
    },
    green: {
      icon: "from-emerald-500 to-emerald-600 shadow-emerald-200",
      bg: "bg-emerald-50/50",
      text: "text-emerald-700",
      border: "border-emerald-100/50"
    },
    purple: {
      icon: "from-[#3B2E7E] to-[#2A1F5C] shadow-indigo-200",
      bg: "bg-indigo-50/50",
      text: "text-[#3B2E7E]",
      border: "border-indigo-100/50"
    },
    amber: {
      icon: "from-amber-500 to-amber-600 shadow-amber-200",
      bg: "bg-amber-50/50",
      text: "text-amber-700",
      border: "border-amber-100/50"
    },
    red: {
      icon: "from-rose-500 to-rose-600 shadow-rose-200",
      bg: "bg-rose-50/50",
      text: "text-rose-700",
      border: "border-rose-100/50"
    },
    indigo: {
      icon: "from-[#3B2E7E] to-[#2A1F5C] shadow-indigo-200",
      bg: "bg-indigo-50/50",
      text: "text-[#3B2E7E]",
      border: "border-indigo-100/50"
    },
  };

  const variant = colorVariants[color] || colorVariants.blue;
  const trendIsPositive = trend > 0;
  const trendIsNegative = trend < 0;

  return (
    <div
      onClick={onClick}
      className={`
        relative group bg-white p-5 rounded-2xl border border-slate-200/60
        shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5
        transition-all duration-300
        ${onClick ? "cursor-pointer" : ""}
      `}
    >
      <div className="flex items-start justify-between">
        <div
          className={`
            w-12 h-12 rounded-xl bg-gradient-to-br ${variant.icon}
            flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300
          `}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend !== undefined && (
          <div
            className={`
              flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold
              ${
                trendIsPositive
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  : trendIsNegative
                  ? "bg-rose-50 text-rose-600 border border-rose-100"
                  : "bg-slate-50 text-slate-500 border border-slate-100"
              }
            `}
          >
            {trendIsPositive && <ArrowUpIcon className="w-3 h-3" />}
            {trendIsNegative && <ArrowDownIcon className="w-3 h-3" />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      <div className="mt-5">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-extrabold text-slate-800 tracking-tight leading-none">
            {value}
          </p>
        </div>
        {(subtitle || trendLabel) && (
          <div className="flex items-center gap-1.5 mt-3">
            <div className={`w-1.5 h-1.5 rounded-full ${trendIsPositive ? 'bg-emerald-400' : 'bg-slate-300'}`} />
            <p className="text-xs font-medium text-slate-500">
              {subtitle || trendLabel}
            </p>
          </div>
        )}
      </div>

      {/* Subtle bottom gradient accent */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r ${variant.icon} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
    </div>
  );
};

export default StatCard;

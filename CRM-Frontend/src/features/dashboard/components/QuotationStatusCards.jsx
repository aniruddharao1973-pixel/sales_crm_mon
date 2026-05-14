// src/features/dashboard/components/QuotationStatusCards.jsx

import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const Card = ({
  title,
  value,
  icon: Icon,
  color,
  bg,
}) => {
  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            {title}
          </p>

          <h3 className="text-3xl font-black text-slate-800 mt-2 tabular-nums">
            {value}
          </h3>
        </div>

        <div
          className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center`}
        >
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );
};

const QuotationStatusCards = ({ data }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
      <Card
        title="Total"
        value={data?.total || 0}
        icon={DocumentTextIcon}
        color="text-indigo-600"
        bg="bg-indigo-50"
      />

      <Card
        title="Draft"
        value={data?.draft || 0}
        icon={ClockIcon}
        color="text-amber-600"
        bg="bg-amber-50"
      />

      <Card
        title="Submitted"
        value={data?.submitted || 0}
        icon={DocumentTextIcon}
        color="text-blue-600"
        bg="bg-blue-50"
      />

      <Card
        title="Approved"
        value={data?.approved || 0}
        icon={CheckCircleIcon}
        color="text-emerald-600"
        bg="bg-emerald-50"
      />

      <Card
        title="Rejected"
        value={data?.rejected || 0}
        icon={XCircleIcon}
        color="text-red-600"
        bg="bg-red-50"
      />
    </div>
  );
};

export default QuotationStatusCards;
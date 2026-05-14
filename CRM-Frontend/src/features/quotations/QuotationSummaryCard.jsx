// src/features/quotations/QuotationSummaryCard.jsx

import {
  Landmark,
  ReceiptText,
  BadgeDollarSign,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { formatINR } from "./quotationUtils";

function StatRow({ label, value, subtle = false }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={subtle ? "text-slate-500" : "text-slate-600"}>
        {label}
      </span>
      <span className={subtle ? "text-slate-700" : "text-slate-900"}>
        {value}
      </span>
    </div>
  );
}

function Badge({ children, tone = "slate" }) {
  const tones = {
    slate: "border-slate-200 bg-slate-50 text-slate-700",
    indigo: "border-indigo-100 bg-indigo-50 text-indigo-700",
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${tones[tone] || tones.slate}`}
    >
      {children}
    </span>
  );
}

export default function QuotationSummaryCard({ totals, headerDiscount }) {
  return (
    <div className="xl:sticky xl:top-6 xl:self-start">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 via-white to-slate-50 px-5 py-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                Summary
              </div>
              <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
                Totals overview
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Final quotation value summary.
              </p>
            </div>

            <Badge tone="indigo">
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
              Live
            </Badge>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5 sm:px-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                <Landmark className="h-3.5 w-3.5" />
                Subtotal
              </div>
              <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                {formatINR(totals?.subtotal || 0)}
              </div>
              <div className="mt-1 text-sm text-slate-500">
                Before header discount
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                <ReceiptText className="h-3.5 w-3.5" />
                Total Value
              </div>
              <div className="mt-2 text-2xl font-bold tracking-tight text-emerald-900">
                {formatINR(totals?.taxable || 0)}
              </div>
              <div className="mt-1 text-sm text-emerald-700">
                After quotation discount
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mt-1 space-y-3">
              <StatRow
                label="Header Discount"
                value={formatINR(Number(headerDiscount || 0))}
              />
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-slate-900 p-5 text-white shadow-sm">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
              <BadgeDollarSign className="h-3.5 w-3.5" />
              Grand Total
            </div>

            <div className="mt-3 text-3xl font-bold tracking-tight">
              {formatINR(totals?.grandTotal || 0)}
            </div>

            <div className="mt-2 text-sm text-white/75">
              Final amount payable for this quotation.
            </div>

            <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
              <div className="mt-1 flex items-center justify-between gap-4 text-sm">
                <span className="text-white/75">Rounding</span>
                <span className="font-semibold">Auto</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

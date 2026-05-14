// src/features/items/ItemDetail.jsx

import { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ChevronLeft,
  Pencil,
  Trash2,
  Package,
  Tag,
  DollarSign,
  Calendar,
  FileText,
  BadgeCheck,
  Clock3,
  Layers,
} from "lucide-react";
// import { formatINR } from "../quotations/quotationUtils";

const formatPrice = (value) => {
  const num = Number(value || 0);

  return num.toLocaleString("en-IN");
};

function InfoCard({ label, value, mono = false }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 transition-colors hover:border-violet-200">
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-500">
        {label}
      </div>
      <div
        className={`mt-1 text-sm font-medium text-slate-900 ${
          mono ? "font-mono" : ""
        }`}
      >
        {value || "-"}
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 rounded-lg border border-violet-100 bg-violet-50 text-violet-700 p-2">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-0.5 text-xs leading-5 text-slate-500">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}

function MetaRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-2 last:border-b-0">
      <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
        {label}
      </span>
      <span className="text-sm font-medium text-slate-900">{value || "-"}</span>
    </div>
  );
}

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { list } = useSelector((state) => state.items);

  function findItemRecursive(items, targetId) {
    for (const item of items) {
      if (String(item.id) === String(targetId)) return item;
      if (item.children?.length) {
        const found = findItemRecursive(item.children, targetId);
        if (found) return found;
      }
    }
    return null;
  }

  const item = findItemRecursive(list, id);

  const childItems = useMemo(() => item?.children || [], [item]);

  const childCount = childItems.length;

  const totalChildValue = useMemo(() => {
    return childItems.reduce((sum, child) => {
      return sum + Number(child.basePrice || 0);
    }, 0);
  }, [childItems]);

  const totalValue = Number(item?.basePrice || 0) + totalChildValue;

  if (!item) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-3 py-3 sm:px-4 sm:py-4">
        <div className="mx-auto flex min-h-[calc(100vh-96px)] max-w-[1400px] items-center justify-center">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
              <Package className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">
              Item not found
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              The item you are looking for does not exist or has been removed.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const descriptionText = (item.description || "").trim();
  const childRows = childItems.filter(
    (c) => c?.sku || c?.name || c?.description,
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-3 py-3 sm:px-4 sm:py-4">
      <div className="mx-auto w-full max-w-[1600px] space-y-3">
        {/* TOP BAR */}
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-lg font-semibold text-slate-900">
                    {item.sku || "-"}
                  </h1>
                  {item.category ? (
                    <span className="inline-flex items-center rounded-full border border-violet-100 bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-700">
                      {item.category}
                    </span>
                  ) : null}
                  {childCount > 0 ? (
                    <span className="inline-flex items-center rounded-full border border-violet-100 bg-violet-50/60 px-2.5 py-1 text-[11px] font-medium text-violet-700">
                      <Layers className="mr-1 h-3.5 w-3.5" />
                      {childCount} child item{childCount > 1 ? "s" : ""}
                    </span>
                  ) : null}
                </div>
                {/* <p className="mt-1 truncate text-sm text-slate-500">
                  {item.name || "Unnamed item"}
                </p> */}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/items/${id}/edit`)}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-violet-700 px-3.5 text-sm font-medium text-white hover:bg-violet-800 transition-colors"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => navigate(-1)}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-violet-700 px-3.5 text-sm font-medium text-white hover:bg-violet-800 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
          {/* LEFT */}
          <div className="space-y-3">
            {/* OVERVIEW */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionTitle
                icon={Package}
                title="Item Overview"
                subtitle="Core master data used in quotations, catalog, and pricing."
              />

              <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4">
                <InfoCard label="SKU" value={item.sku} mono />
                <InfoCard label="Category" value={item.category} />
                <InfoCard label="Name" value={item.name} />
                <InfoCard label="Make" value={item.make} />
                <InfoCard label="Mfg Part No" value={item.mfgPartNo} mono />
                <InfoCard label="UOM" value={item.uom} />
                <InfoCard label="Children" value={String(childCount)} />
                <InfoCard label="Status" value="Active" />
              </div>
            </section>

            {/* DESCRIPTION */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionTitle
                icon={FileText}
                title="Description"
                subtitle="Stored description and specification text."
              />

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                {descriptionText ? (
                  <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700 font-sans">
                    {descriptionText}
                  </pre>
                ) : (
                  <p className="text-sm text-slate-500">
                    No description provided.
                  </p>
                )}
              </div>
            </section>

            {/* SUB ITEMS */}
            {childRows.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <SectionTitle
                  icon={Layers}
                  title="Sub Items"
                  subtitle="Linked child items under this master record."
                />

                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full border-collapse">
                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-200">
                        <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                          SKU
                        </th>
                        <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Description
                        </th>
                        <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Make
                        </th>
                        <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Mfg PN
                        </th>
                        <th className="px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                          UOM
                        </th>
                        <th className="px-3 py-2 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Price
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {childRows.map((child, index) => (
                        <tr
                          key={child.id || index}
                          className="border-b border-slate-100 last:border-b-0"
                        >
                          <td className="px-3 py-2 align-top">
                            <span className="inline-flex rounded-full border border-violet-100 bg-violet-50 px-2 py-1 font-mono text-[11px] text-violet-700">
                              {child.sku || "—"}
                            </span>
                          </td>
                          <td className="px-3 py-2 align-top">
                            <div className="text-sm font-medium text-slate-800">
                              {child.name || "Unnamed child"}
                            </div>
                            {child.description ? (
                              <div className="mt-1 whitespace-pre-wrap text-[12px] leading-5 text-slate-500">
                                {child.description}
                              </div>
                            ) : null}
                          </td>
                          <td className="px-3 py-2 align-top text-sm text-slate-600">
                            {child.make || "—"}
                          </td>
                          <td className="px-3 py-2 align-top">
                            <span className="inline-flex rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[11px] text-slate-700">
                              {child.mfgPartNo || "—"}
                            </span>
                          </td>
                          <td className="px-3 py-2 align-top text-center text-sm text-slate-600">
                            {child.uom || "—"}
                          </td>
                          <td className="px-3 py-2 align-top text-right text-sm font-medium text-slate-900">
                            {formatPrice(child.basePrice || 0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </div>

          {/* RIGHT */}
          <aside className="space-y-3">
            {/* PRICING */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionTitle
                icon={DollarSign}
                title="Pricing"
                subtitle="Current item and combined structure value."
              />

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Base Price
                </div>
                <div className="mt-1 text-2xl font-semibold text-violet-700">
                  {formatPrice(item.basePrice || 0)}
                </div>
                <div className="mt-3 h-px bg-slate-200" />
                <MetaRow
                  label="Child Value"
                  value={formatPrice(totalChildValue)}
                />
                <MetaRow
                  label="Combined Value"
                  value={formatPrice(totalValue)}
                />
              </div>
            </section>

            {/* TIMELINE */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <SectionTitle
                icon={Calendar}
                title="Timeline"
                subtitle="Record creation and latest update."
              />

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
                <MetaRow
                  label="Created"
                  value={
                    item.createdAt
                      ? new Date(item.createdAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "-"
                  }
                />
                <MetaRow
                  label="Updated"
                  value={
                    item.updatedAt
                      ? new Date(item.updatedAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "-"
                  }
                />
              </div>
            </section>

            {/* QUICK FACTS */}
            <section className="rounded-2xl border border-violet-900/20 bg-gradient-to-br from-violet-900 to-indigo-950 p-4 text-white shadow-sm">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-slate-300" />
                <h3 className="text-sm font-semibold">Quick Facts</h3>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 py-2">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    Status
                  </span>
                  <span className="text-sm text-white">Active</span>
                </div>
                <div className="flex items-center justify-between gap-3 border-b border-white/10 py-2">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    Category
                  </span>
                  <span className="text-sm text-white">
                    {item.category || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 border-b border-white/10 py-2">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
                    Children
                  </span>
                  <span className="text-sm text-white">
                    {String(childCount)}
                  </span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

// src/features/deals/components/StageHistoryModal.jsx

import { ClockIcon } from "@heroicons/react/24/outline";
import { formatDate, formatLabel } from "../../../constants";

const StageHistoryModal = ({
  open,
  onClose,
  data,
  stage,
  setNotesModal,
  getTimeSince,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-3xl max-h-[70vh] rounded-3xl overflow-hidden shadow-2xl border border-[#3B2E7E]/20 bg-white flex flex-col">
        {/* TOP BAR */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#3B2E7E] to-[#2A1F5C]" />

        {/* HEADER */}
        <div className="px-6 py-5 flex items-center justify-between bg-gradient-to-r from-[#3B2E7E]/5 to-transparent border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B2E7E] to-[#2A1F5C] flex items-center justify-center shadow-lg">
              <ClockIcon className="w-5 h-5 text-white" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-800">
                {formatLabel(stage)} History
              </h2>
              <p className="text-xs text-slate-400">{data.length} updates</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {data.map((h, i) => (
            <div
              key={h.id}
              className="flex gap-4 p-5 rounded-2xl border border-[#3B2E7E]/10 bg-gradient-to-br from-[#3B2E7E]/5 to-purple-50/40 hover:shadow-md transition-all"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B2E7E] to-[#5A4A9C] flex items-center justify-center text-white text-sm font-bold">
                {h.changedBy?.name?.[0] || "?"}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-sm font-semibold text-slate-800">
                    {h.changedBy?.name || "Unknown"}
                  </p>

                  <span className="text-xs text-slate-400">
                    {formatDate(h.createdAt)} • {getTimeSince(h.createdAt)}
                  </span>
                </div>

                {h.description && (
                  <button
                    onClick={() =>
                      setNotesModal({
                        open: true,
                        historyId: h.id,
                        description: h.description || "",
                      })
                    }
                    className="mt-3 text-[13px] text-slate-700 bg-white border rounded-xl px-4 py-2 hover:bg-slate-50 w-full text-left"
                  >
                    {h.description}
                  </button>
                )}
              </div>

              {i === 0 && (
                <span className="self-start text-[10px] px-2 py-1 rounded-lg bg-[#3B2E7E] text-white font-bold">
                  Latest
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StageHistoryModal;

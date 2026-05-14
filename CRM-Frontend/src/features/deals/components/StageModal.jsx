// src/features/deals/components/StageModal.jsx

import { formatLabel } from "../../../constants";

const StageModal = ({
  open,
  onClose,
  stageModal,
  setStageModal,
  updatingStage,
  handleStageChange,
  dealStage,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
        style={{
          animation: "modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Top bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-900 to-indigo-950" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-900 to-indigo-950 flex items-center justify-center shadow-md">
              →
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-800">Move Stage</h2>
              <p className="text-[11px] text-gray-400">
                Transitioning to{" "}
                <span className="font-semibold text-violet-700">
                  {formatLabel(stageModal.stage)}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="mx-6 h-px bg-gray-200" />

        {/* Stage indicator */}
        <div className="px-6 pt-5">
          <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-4">
            {/* Label */}
            <p className="text-[11px] font-semibold text-violet-600 uppercase tracking-wider mb-2">
              Stage Transition
            </p>

            {/* Flow */}
            <div className="flex items-center gap-2">
              {/* Current */}
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
                {formatLabel(dealStage)}
              </span>

              {/* Arrow */}
              <span className="text-gray-400 text-sm">→</span>

              {/* Target */}
              <span className="text-xs font-bold text-white bg-gradient-to-r from-purple-900 to-indigo-950 px-3 py-1.5 rounded-lg shadow-sm">
                {formatLabel(stageModal.stage)}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <label className="block text-[11px] font-semibold text-violet-900 mb-2 uppercase tracking-widest">
            Transition Notes
          </label>

          <textarea
            rows={5}
            value={stageModal.description}
            onChange={(e) =>
              setStageModal((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="w-full border border-gray-200 rounded-2xl p-4 text-sm bg-gray-50"
            placeholder="Add notes..."
          />

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {[
              "Prospect agreed",
              "Follow-up needed",
              "Docs shared",
              "Verbal confirm",
            ].map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  setStageModal((prev) => ({
                    ...prev,
                    description: prev.description
                      ? prev.description + " " + tag
                      : tag,
                  }))
                }
                className="px-2 py-1 text-xs text-violet-600 bg-violet-50 rounded-full"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm text-gray-500 border rounded-xl"
          >
            Cancel
          </button>

          <button
            disabled={updatingStage}
            onClick={async () => {
              await handleStageChange();

              if (stageModal.description) {
                const toast = document.createElement("div");
                toast.innerText = "Stage updated successfully";
                Object.assign(toast.style, {
                  position: "fixed",
                  bottom: "24px",
                  right: "24px",
                  background: "#2A1F5C",
                  color: "white",
                  padding: "10px 16px",
                  borderRadius: "12px",
                  zIndex: "9999",
                });
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 3000);
              }
            }}
            className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-xl"
          >
            {stageModal.stage === dealStage ? "Save Notes" : "Move Stage"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.93) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default StageModal;

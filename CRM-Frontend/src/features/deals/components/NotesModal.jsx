// src/features/deals/components/NotesModal.jsx

import { useState } from "react";

const NotesModal = ({
  open,
  onClose,
  notesModal,
  setNotesModal,
  API,
  dispatch,
  fetchDeal,
  dealId,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
        style={{
          animation: "modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Top bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-900 to-indigo-700" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-md shadow-violet-200">
              ✎
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-800">Stage Notes</h2>
              <p className="text-[11px] text-gray-400">
                Add notes for this pipeline stage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        <div className="mx-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Body */}
        <div className="p-6">
          <label className="block text-[11px] font-semibold text-violet-500 mb-2.5 uppercase tracking-widest">
            Your Notes
          </label>

          <div className="relative">
            <textarea
              rows={6}
              value={notesModal.description}
              onChange={(e) =>
                setNotesModal((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Write stage notes here..."
              className="w-full border border-gray-200 rounded-2xl p-4 text-sm bg-gray-50/50"
            />

            <span className="absolute bottom-3 right-3.5 text-[10px] text-gray-300">
              {notesModal.description.length} / 500
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {["Follow-up needed", "Blocked", "In review", "High priority"].map(
              (tag) => (
                <button
                  key={tag}
                  onClick={() =>
                    setNotesModal((prev) => ({
                      ...prev,
                      description: prev.description
                        ? prev.description + " " + tag
                        : tag,
                    }))
                  }
                  className="px-2.5 py-1 text-[11px] text-violet-600 bg-violet-50 rounded-full"
                >
                  + {tag}
                </button>
              ),
            )}
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
            onClick={async () => {
              try {
                await fetch(
                  `${API}/deals/stage-history/${notesModal.historyId}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                      description: notesModal.description,
                    }),
                  },
                );

                dispatch(fetchDeal(dealId));

                onClose();
              } catch (err) {
                console.error(err);
              }
            }}
            className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-xl"
          >
            Save Notes
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

export default NotesModal;

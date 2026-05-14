// src/features/analytics/KpiCalculationTooltip.jsx
import { useEffect, useRef, useState } from "react";

export default function KpiCalculationTooltip({ children, open, onClose }) {
  const ref = useRef();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function checkScreen() {
      setIsMobile(window.innerWidth < 640); // Tailwind sm breakpoint
    }

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose && onClose();
      }
    }

    function handleEscape(e) {
      if (e.key === "Escape") {
        onClose && onClose();
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* 🔥 MOBILE BACKDROP */}
      {isMobile && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* 🔥 TOOLTIP */}
      <div
        ref={ref}
        className={`
          z-50

          ${
            isMobile
              ? `
                fixed
                top-1/2 left-1/2
                -translate-x-1/2 -translate-y-1/2
                w-[92vw] max-w-md
              `
              : `
  absolute top-full mt-3
  left-1/2 -translate-x-1/2
  w-[340px]
`
          }

          rounded-2xl
          bg-white
          border border-slate-200
          shadow-[0_10px_30px_rgba(0,0,0,0.08)]
          ring-1 ring-black/5

          animate-in fade-in zoom-in-95 duration-200
        `}
      >
        {/* HEADER */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Calculation
          </span>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xs px-1.5 py-0.5 rounded hover:bg-slate-100 transition"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="px-4 py-4 space-y-4 text-sm text-slate-700 max-h-[60vh] overflow-y-auto">
          {children}
        </div>

        {/* FOOTER */}
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/60 rounded-b-2xl">
          <p className="text-[11px] text-slate-500">
            Tip: Use actual revenue for real performance comparison.
          </p>
        </div>

        {/* 🔥 ARROW (DESKTOP ONLY) */}
        {!isMobile && (
          <div
            className="
              absolute top-full left-1/2 -translate-x-1/2
              h-3 w-3 rotate-45 bg-white
              border-r border-b border-slate-200
            "
          />
        )}
      </div>
    </>
  );
}

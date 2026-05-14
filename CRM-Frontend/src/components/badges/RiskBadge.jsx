// CRM-Frontend-main/CRM-Frontend-main/src/components/badges/RiskBadge.jsx

import React from "react";
import clsx from "clsx";

const RISK_STYLES = {
  LOW: "bg-green-100 text-green-700 border-green-300",
  MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-300",
  HIGH: "bg-orange-100 text-orange-700 border-orange-300",
  CRITICAL: "bg-red-100 text-red-700 border-red-300",
};

export default function RiskBadge({ level, score, className = "" }) {
  if (!level) return null;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
        RISK_STYLES[level] || "bg-gray-100 text-gray-600 border-gray-300",
        className
      )}
      title={score != null ? `Risk Score: ${score}` : undefined}
    >
      {level}
      {score != null && <span className="opacity-70">({score})</span>}
    </span>
  );
}
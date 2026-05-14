// src\features\deals\InfoTooltip.jsx

import { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

const InfoTooltip = ({ content, position = "center" }) => {
  const [open, setOpen] = useState(false);

  // Position logic
  const positionClasses = {
    center: "left-1/2 -translate-x-1/2",
    right: "right-0",
    left: "left-0",
  };

  const arrowClasses = {
    center: "left-1/2 -translate-x-1/2",
    right: "right-4",
    left: "left-4",
  };

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Icon */}
      <InformationCircleIcon className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors duration-150" />

      {/* Tooltip */}
      {open && (
        <div
          className={`absolute ${positionClasses[position]} bottom-full mb-3 ${
            position === "center" ? "w-80" : "w-64"
          } bg-white border border-slate-200 shadow-2xl rounded-xl p-4 z-50 animate-fadeIn`}
        >
          {content}

          {/* Arrow */}
          <div
            className={`absolute ${arrowClasses[position]} top-full w-2.5 h-2.5 bg-white border-r border-b border-slate-200 rotate-45`}
          />
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;

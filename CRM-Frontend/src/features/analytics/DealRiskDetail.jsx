import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDealRisk,
  clearDealRisk,
} from "./dealRiskSlice";
import RiskBadge from "../../components/badges/RiskBadge";

export default function DealRiskDetail({ dealId }) {
  const dispatch = useDispatch();

  const { currentDealRisk, loading, error } = useSelector(
    (state) => state.dealRisk
  );

  // Listen to deal changes for live refresh
  const deal = useSelector((state) => state.deals.deal);

  useEffect(() => {
    if (dealId) {
      dispatch(fetchDealRisk(dealId));
    }

    return () => {
      dispatch(clearDealRisk());
    };
  }, [
    dealId,
    deal?.stage,
    deal?.probability,
    deal?.closingDate,
    dispatch,
  ]);

  if (!dealId) return null;

  if (loading) {
    return (
      <div className="rounded-lg border bg-white p-4 text-sm text-gray-500">
        Calculating deal risk…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!currentDealRisk) return null;

  const { score, riskLevel, factors, playbook, ai } = currentDealRisk;

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      {/* ================= HEADER ================= */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">
          Deal Risk Assessment
        </h3>
        <RiskBadge level={riskLevel} score={score} />
      </div>

      {/* ================= METRICS GRID ================= */}
      <div className="mb-4 grid grid-cols-2 gap-3 text-xs text-gray-700">
        <div className="rounded-md bg-gray-50 p-2">
          <div className="font-medium text-gray-500">Days in Stage</div>
          <div className="text-sm font-semibold">
            {factors?.daysInStage ?? 0}
          </div>
        </div>

        <div className="rounded-md bg-gray-50 p-2">
          <div className="font-medium text-gray-500">Last Activity</div>
          <div className="text-sm font-semibold">
            {factors?.lastActivityDays ?? 0} days ago
          </div>
        </div>

        <div className="rounded-md bg-gray-50 p-2">
          <div className="font-medium text-gray-500">Probability</div>
          <div className="text-sm font-semibold">
            {factors?.probability ?? 0}%
          </div>
        </div>

        <div className="rounded-md bg-gray-50 p-2">
          <div className="font-medium text-gray-500">Closing In</div>
          <div className="text-sm font-semibold">
            {factors?.closingInDays ?? 0} days
          </div>
        </div>
      </div>

      {/* ================= SYSTEM PLAYBOOK ================= */}
      {playbook?.length > 0 && (
        <div className="mb-4">
          <h4 className="mb-2 text-xs font-semibold text-gray-700">
            Recommended Actions
          </h4>
          <ul className="space-y-1 text-xs text-gray-700">
            {playbook.map((action, idx) => (
              <li
                key={idx}
                className="rounded-md bg-yellow-50 px-2 py-1"
              >
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ================= AI INSIGHT ================= */}
      {ai?.explanation && (
        <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-3">
          <div className="mb-1 flex items-center gap-1 text-xs font-semibold text-blue-700">
            🤖 AI Insight
          </div>
          <p className="text-xs text-blue-800 whitespace-pre-line">
            {ai.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
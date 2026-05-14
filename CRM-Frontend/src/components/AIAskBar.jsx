// src/components/AIAskBar.jsx
import { useState } from "react";

const QUICK_PROMPTS = [
  "Sales summary",
  "Top risks in pipeline",
  "Who is performing best?",
  "Deals likely to close this month",
];

export default function AIAskBar({ onAsk, loading }) {
  const [q, setQ] = useState("");

  const handleSubmit = (questionOverride) => {
    const question = typeof questionOverride === "string" ? questionOverride : q;
    console.log("🧑‍💻 [AI ASK BAR] ──────────────────────────────");
    console.log("🧑‍💻 [AI ASK BAR] Submitting:", question);
    console.log("🧑‍💻 [AI ASK BAR] Loading state:", loading);

    if (!question.trim()) {
      console.warn("⚠️  [AI ASK BAR] Empty — skipping");
      return;
    }
    if (loading) {
      console.warn("⚠️  [AI ASK BAR] Still loading — skipping duplicate");
      return;
    }

    onAsk(question);
    setQ("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      console.log("🧑‍💻 [AI ASK BAR] Enter pressed");
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Quick prompt chips — rendered once, no duplicates */}
      <div className="flex flex-wrap gap-2">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => {
              console.log("🧑‍💻 [AI ASK BAR] Chip clicked:", prompt);
              handleSubmit(prompt);
            }}
            disabled={loading}
            className="text-xs border px-3 py-1 rounded-full hover:bg-gray-100 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input + Ask button */}
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your sales..."
          disabled={loading}
          className="flex-1 border px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60"
        />
        <button
          onClick={() => handleSubmit()}
          disabled={loading || !q.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>
    </div>
  );
}
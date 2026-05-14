// components/AIChatbot.jsx
import React, { useState, useRef, useEffect } from "react";
import { askCRM } from "../api/aiApi";
import AIAskBar from "./AIAskBar";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Bot,
  User,
  Sparkles,
} from "lucide-react";

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const panelRef = useRef(null);

  useEffect(() => {
    if (open) {
      const el = document.querySelector("#ai-input");
      if (el) el.focus();
    }
  }, [open]);

  const handleAsk = async (question) => {
    if (loading || !question || !question.trim()) return;

    setHistory((h) => [...h, { role: "user", text: question, ts: Date.now() }]);

    try {
      setLoading(true);
      setHistory((h) => [
        ...h,
        {
          role: "assistant",
          text: "Analyzing your CRM data...",
          loading: true,
          ts: Date.now(),
        },
      ]);
      setAnswer("Analyzing your CRM data...");

      const res = await askCRM(question);
      const final = res || "No insights available.";

      setHistory((h) => {
        const copy = [...h];
        for (let i = copy.length - 1; i >= 0; i--) {
          if (copy[i].role === "assistant" && copy[i].loading) {
            copy[i] = { role: "assistant", text: final, ts: Date.now() };
            break;
          }
        }
        return copy;
      });

      setAnswer(final);
    } catch (e) {
      setAnswer("AI service unavailable. Please try again.");
      setHistory((h) => {
        const copy = [...h];
        for (let i = copy.length - 1; i >= 0; i--) {
          if (copy[i].role === "assistant" && copy[i].loading) {
            copy[i] = {
              role: "assistant",
              text: "AI service unavailable. Please try again.",
              ts: Date.now(),
            };
            break;
          }
        }
        return copy;
      });
    } finally {
      setLoading(false);
      setTimeout(
        () =>
          panelRef.current?.scrollTo({
            top: panelRef.current.scrollHeight,
            behavior: "smooth",
          }),
        60,
      );
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open AI Assistant"
        style={{
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          boxShadow:
            "0 8px 32px rgba(99,102,241,0.45), 0 2px 8px rgba(99,102,241,0.2)",
        }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl text-white hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400"
        title="Ask AI"
      >
        <MessageCircle className="w-6 h-6" strokeWidth={2} />
        {/* Pulse ring */}
        <span
          className="absolute inset-0 rounded-2xl animate-ping opacity-20"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
        />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40"
          style={{
            background: "rgba(15,15,35,0.18)",
            backdropFilter: "blur(4px)",
          }}
          aria-hidden
        />
      )}

      {/* Chat Panel */}
      <div
        className={`fixed z-50 right-5 bottom-5 w-full sm:w-[380px] md:w-[420px] transition-all duration-300 ease-out ${
          open
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95 pointer-events-none"
        }`}
        style={{ maxHeight: "78vh" }}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="flex flex-col overflow-hidden"
          style={{
            height: "78vh",
            borderRadius: "20px",
            background: "#ffffff",
            boxShadow:
              "0 32px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(99,102,241,0.08), 0 0 0 1px rgba(99,102,241,0.08)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div
            className="flex-shrink-0 flex items-center gap-3 px-4 py-3"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)",
              borderRadius: "20px 20px 0 0",
            }}
          >
            {/* Avatar */}
            <div
              className="flex h-9 w-9 items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(255,255,255,0.18)",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <Bot className="h-5 w-5 text-white" strokeWidth={2} />
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className="text-sm font-semibold text-white leading-tight tracking-tight"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Sales AI Assistant
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-300"
                  style={{ boxShadow: "0 0 6px rgba(110,231,183,0.9)" }}
                />
                <p className="text-xs text-indigo-100 opacity-90">
                  Online · Ready to help
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => {
                  setHistory([]);
                  setAnswer("");
                }}
                className="hidden sm:inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium text-white transition-all"
                style={{ background: "rgba(255,255,255,0.15)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.25)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.15)")
                }
              >
                Clear
              </button>

              <button
                onClick={() => setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-white transition-all"
                style={{ background: "rgba(255,255,255,0.12)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.22)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.12)")
                }
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Conversation Area ── */}
          <div
            ref={panelRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{
              background: "#f8f8fc",
              backgroundImage:
                "radial-gradient(circle at 20% 10%, rgba(99,102,241,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 90%, rgba(139,92,246,0.04) 0%, transparent 50%)",
            }}
          >
            {/* Empty State */}
            {history.length === 0 && (
              <div
                className="mx-auto max-w-xs text-center py-6"
                style={{ animation: "fadeUp 0.4s ease-out both" }}
              >
                <div
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                    borderRadius: "18px",
                    boxShadow: "0 4px 16px rgba(251,191,36,0.3)",
                  }}
                >
                  <Sparkles className="h-7 w-7 text-amber-500" />
                </div>
                <h4
                  className="text-sm font-semibold text-slate-800 mb-1"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  What can I help you with?
                </h4>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Ask anything about your pipeline, deals, or customers
                </p>

                <div className="flex flex-wrap justify-center gap-2">
                  <QuickHint
                    text="Deals closing this month"
                    onClick={() =>
                      handleAsk("Show me deals closing this month")
                    }
                  />
                  <QuickHint
                    text="High risk customers"
                    onClick={() => handleAsk("Which customers are high risk?")}
                  />
                  <QuickHint
                    text="Pipeline velocity"
                    onClick={() =>
                      handleAsk("What is our pipeline velocity last quarter?")
                    }
                  />
                  <QuickHint
                    text="Current pipeline scenario"
                    onClick={() =>
                      handleAsk(
                        "What is the current scenario in advanced analytics?",
                      )
                    }
                  />
                  <QuickHint
                    text="Pipeline health"
                    onClick={() =>
                      handleAsk("Is our pipeline healthy right now?")
                    }
                  />
                  <QuickHint
                    text="Biggest risks"
                    onClick={() =>
                      handleAsk("What are the biggest risks in our pipeline?")
                    }
                  />
                  <QuickHint
                    text="Strategic recommendations"
                    onClick={() =>
                      handleAsk(
                        "Give me strategic recommendations for this month.",
                      )
                    }
                  />
                </div>
              </div>
            )}

            {/* Message List */}
            <ul className="flex flex-col gap-4">
              {history.map((m, idx) => (
                <li
                  key={m.ts + idx}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  style={{ animation: "fadeUp 0.25s ease-out both" }}
                >
                  <div
                    className={`flex items-end gap-2.5 max-w-[88%] ${
                      m.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {/* Avatar */}
                    {m.role === "user" ? (
                      <div
                        className="flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(135deg, #e0e7ff, #c7d2fe)",
                          border: "2px solid #a5b4fc",
                        }}
                      >
                        <User className="h-3.5 w-3.5 text-indigo-600" />
                      </div>
                    ) : (
                      <div
                        className="flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(135deg, #6366f1, #7c3aed)",
                          boxShadow: "0 2px 8px rgba(99,102,241,0.35)",
                        }}
                      >
                        <Bot className="h-3.5 w-3.5 text-white" />
                      </div>
                    )}

                    {/* Bubble */}
                    <div
                      className={`relative px-3.5 py-2.5 text-[13px] leading-5 ${
                        m.role === "user" ? "text-white" : "text-slate-700"
                      }`}
                      style={
                        m.role === "user"
                          ? {
                              background:
                                "linear-gradient(135deg, #6366f1, #7c3aed)",
                              borderRadius: "18px 18px 4px 18px",
                              boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
                            }
                          : {
                              background: "#ffffff",
                              border: "1px solid rgba(99,102,241,0.1)",
                              borderRadius: "18px 18px 18px 4px",
                              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                            }
                      }
                    >
                      <div className="whitespace-pre-wrap leading-relaxed space-y-1">
                        {(m.role === "assistant" && !m.loading
                          ? m.text
                          : m.text
                        )
                          ?.replace(/\\n/g, "\n")
                          .split("\n")
                          .map((line, i) => {
                            const trimmed = line.replace(/\*\*/g, "").trim();

                            if (/^\*\*.*\*\*$/.test(trimmed)) {
                              const clean = trimmed.replace(/\*\*/g, "");
                              return (
                                <div
                                  key={i}
                                  className="font-semibold text-slate-900 text-sm mt-2"
                                  style={{
                                    fontFamily: "'DM Sans', sans-serif",
                                  }}
                                >
                                  {m.role === "assistant" && !m.loading ? (
                                    <TypingText text={clean} />
                                  ) : (
                                    clean
                                  )}
                                </div>
                              );
                            }

                            if (
                              trimmed.startsWith("- ") ||
                              trimmed.startsWith("• ")
                            ) {
                              const text = trimmed
                                .replace(/^[-•]\s*/, "")
                                .replace(/\*\*/g, "");
                              return (
                                <div key={i} className="flex gap-2 items-start">
                                  <span
                                    className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0"
                                    style={{ background: "#6366f1" }}
                                  />
                                  <span>
                                    {m.role === "assistant" && !m.loading ? (
                                      <TypingText text={text} />
                                    ) : (
                                      text
                                    )}
                                  </span>
                                </div>
                              );
                            }

                            if (/^\d+\./.test(trimmed)) {
                              const header = trimmed.replace(/^\d+\.\s*/, "");
                              return (
                                <div
                                  key={i}
                                  className="text-xs font-semibold mt-3 mb-0.5 pt-2"
                                  style={{
                                    color: "#6366f1",
                                    borderTop:
                                      "1px solid rgba(99,102,241,0.12)",
                                    fontFamily: "'DM Sans', sans-serif",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.04em",
                                  }}
                                >
                                  {m.role === "assistant" && !m.loading ? (
                                    <TypingText text={header} />
                                  ) : (
                                    header
                                  )}
                                </div>
                              );
                            }

                            return (
                              <div key={i}>
                                {m.role === "assistant" && !m.loading ? (
                                  <TypingText text={trimmed} />
                                ) : (
                                  trimmed
                                )}
                              </div>
                            );
                          })}
                      </div>

                      {/* Loading dots */}
                      {m.loading && (
                        <div className="mt-2.5 flex items-center gap-1.5">
                          {[0, 1, 2].map((d) => (
                            <span
                              key={d}
                              className="h-1.5 w-1.5 rounded-full"
                              style={{
                                background: "#a5b4fc",
                                animation: `bounce 1.2s ease-in-out ${d * 0.2}s infinite`,
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {/* Timestamp */}
                      <div
                        className="mt-1.5 text-[10px] select-none"
                        style={{
                          color:
                            m.role === "user"
                              ? "rgba(255,255,255,0.5)"
                              : "#c4c4d0",
                        }}
                      >
                        {new Date(m.ts).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Input Bar ── */}
          <div
            className="flex-shrink-0 px-4 py-3"
            style={{
              background: "#ffffff",
              borderTop: "1px solid rgba(99,102,241,0.08)",
            }}
          >
            <AIAskBar onAsk={handleAsk} loading={loading} />
          </div>
        </div>
      </div>

      {/* Inline keyframe styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40%            { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </>
  );
}

/* ── QuickHint chip ── */
function QuickHint({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 active:scale-95"
      style={{
        background: "#ffffff",
        border: "1px solid rgba(99,102,241,0.2)",
        color: "#4f46e5",
        boxShadow: "0 1px 4px rgba(99,102,241,0.08)",
        fontFamily: "'DM Sans', sans-serif",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#eef2ff";
        e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#ffffff";
        e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
      }}
    >
      {text}
    </button>
  );
}

/* ── TypingText — logic unchanged ── */
function TypingText({ text }) {
  const [display, setDisplay] = React.useState("");

  useEffect(() => {
    if (!text) return;

    let i = 0;
    setDisplay("");

    const interval = setInterval(() => {
      i++;
      setDisplay(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 10);

    return () => clearInterval(interval);
  }, [text]);

  return <span>{display}</span>;
}

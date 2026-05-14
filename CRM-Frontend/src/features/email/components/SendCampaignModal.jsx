// src/features/email/components/SendCampaignModal.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendEmailCampaign, fetchEmailTemplates } from "../emailSlice";

import {
  XMarkIcon,
  PaperAirplaneIcon,
  DocumentTextIcon,
  ChatBubbleBottomCenterTextIcon,
  UserGroupIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

/* ───────────────────────────────────────── */

const SendCampaignModal = ({ contacts = [], onClose }) => {
  const dispatch = useDispatch();

  const { templates, loadingTemplates, sendingCampaign } = useSelector(
    (s) => s.email,
  );

  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  /* LOAD TEMPLATES */

  useEffect(() => {
    dispatch(fetchEmailTemplates());
  }, [dispatch]);

  /* APPLY TEMPLATE */

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);

    const template = templates.find((t) => String(t.id) === String(templateId));

    if (!template) {
      setSubject("");
      setBody("");
      return;
    }

    setSubject(template.subject || "");
    setBody(template.body || "");
  };

  /* SEND CAMPAIGN */

  const handleSend = async () => {
    if (!body.trim()) {
      alert("Email body cannot be empty");
      return;
    }

    if (!contacts.length) {
      alert("No contacts selected");
      return;
    }

    try {
      await dispatch(
        sendEmailCampaign({
          contactIds: contacts.map((c) => c.id),
          subject,
          body,
          templateId: selectedTemplate || null,
        }),
      ).unwrap();

      alert("Emails sent successfully!");
      onClose();
    } catch (err) {
      alert(err || "Campaign failed");
    }
  };

  const canSend = body.trim() && contacts.length;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 sm:p-6">
      <div
        className="bg-slate-50 w-full max-w-2xl rounded-2xl shadow-2xl shadow-slate-900/20 flex flex-col overflow-hidden border border-slate-200/80 animate-in"
        style={{ animation: "modalIn 0.2s ease-out" }}
      >
        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: translateY(8px) scale(0.98); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          .field-input {
            width: 100%;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 10px 14px;
            font-size: 0.875rem;
            color: #1e293b;
            outline: none;
            transition: border-color 0.15s, box-shadow 0.15s;
          }
          .field-input::placeholder { color: #94a3b8; }
          .field-input:focus {
            border-color: #6366f1;
            box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
          }
          .select-wrapper { position: relative; }
          .select-wrapper select { appearance: none; padding-right: 36px; cursor: pointer; }
          .select-arrow {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
            color: #94a3b8;
          }
        `}</style>

        {/* ── HEADER ─────────────────────────────── */}

        <div className="flex items-start justify-between px-6 pt-6 pb-5 sm:px-8 sm:pt-7">
          <div className="flex items-start gap-4">
            {/* Icon badge */}
            <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <PaperAirplaneIcon className="w-5 h-5 text-indigo-500" />
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-semibold text-slate-800 tracking-tight leading-tight">
                Send Email Campaign
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                <UserGroupIcon className="w-3.5 h-3.5 text-slate-400" />
                <p className="text-xs text-slate-500 font-medium">
                  {contacts.length}{" "}
                  {contacts.length === 1 ? "recipient" : "recipients"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors duration-150"
          >
            <XMarkIcon
              className="w-4.5 h-4.5"
              style={{ width: 18, height: 18 }}
            />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200/80 mx-6 sm:mx-8" />

        {/* ── FORM BODY ───────────────────────────── */}

        <div className="px-6 py-6 sm:px-8 sm:py-7 space-y-5 overflow-y-auto">
          {/* TEMPLATE */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <DocumentTextIcon className="w-3.5 h-3.5" />
              Template
            </label>

            <div className="select-wrapper">
              <select
                value={selectedTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="field-input"
                disabled={loadingTemplates}
              >
                <option value="">
                  {loadingTemplates ? "Loading templates…" : "No template"}
                </option>
                {templates?.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="select-arrow w-4 h-4" />
            </div>

            {loadingTemplates && (
              <div className="flex items-center gap-2 pt-1">
                <div className="w-3 h-3 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
                <span className="text-xs text-slate-400">
                  Fetching templates…
                </span>
              </div>
            )}
          </div>

          {/* SUBJECT */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Subject
            </label>

            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Your account summary for July"
              className="field-input"
            />
          </div>

          {/* MESSAGE */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <ChatBubbleBottomCenterTextIcon className="w-3.5 h-3.5" />
              Message
            </label>

            <div className="relative">
              <textarea
                rows="8"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message here…"
                className="field-input resize-none leading-relaxed"
                style={{ paddingBottom: 36 }}
              />
              {/* Character count badge inside textarea */}
              <span className="absolute bottom-3 right-3 text-xs text-slate-400 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-md border border-slate-100 font-mono tabular-nums select-none">
                {body.length.toLocaleString()}
              </span>
            </div>
          </div>

          {/* RECIPIENT SUMMARY CHIP */}
          {contacts.length > 0 && (
            <div className="flex items-center gap-2 px-3.5 py-2.5 bg-indigo-50/60 border border-indigo-100 rounded-xl">
              <UserGroupIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <p className="text-xs text-indigo-700 font-medium">
                This campaign will be sent to{" "}
                <span className="font-bold">{contacts.length}</span>{" "}
                {contacts.length === 1 ? "contact" : "contacts"}
              </p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-200/80 mx-6 sm:mx-8" />

        {/* ── FOOTER ──────────────────────────────── */}

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 px-6 py-4 sm:px-8 sm:py-5">
          {/* Left: helper text */}
          <p className="text-xs text-slate-400 hidden sm:block">
            Emails will be queued and delivered immediately.
          </p>

          {/* Right: action buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              disabled={sendingCampaign}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 hover:text-slate-800 hover:border-slate-300 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              onClick={handleSend}
              disabled={!canSend || sendingCampaign}
              className={`
                relative flex items-center justify-center gap-2
                px-5 py-2.5 text-sm font-semibold rounded-xl
                transition-all duration-150
                ${
                  canSend && !sendingCampaign
                    ? "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white shadow-sm shadow-indigo-600/30 hover:shadow-md hover:shadow-indigo-600/30"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }
              `}
            >
              {sendingCampaign ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  <span>Sending…</span>
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="w-4 h-4" />
                  <span>Send Campaign</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendCampaignModal;

// // CRM-Frontend\src\features\email\components\EmailTemplateManager.jsx
// import { useState } from "react";
// import {
//   XMarkIcon,
//   PlusIcon,
// } from "@heroicons/react/24/outline";

// const EmailTemplateManager = ({ onClose }) => {
//   const [templates, setTemplates] = useState([]);
//   const [name, setName] = useState("");
//   const [subject, setSubject] = useState("");
//   const [body, setBody] = useState("");

//   const addTemplate = () => {
//     const newTemplate = {
//       id: Date.now(),
//       name,
//       subject,
//       body,
//     };

//     setTemplates([...templates, newTemplate]);

//     setName("");
//     setSubject("");
//     setBody("");
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 space-y-4">

//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <h2 className="text-lg font-semibold">
//             Email Templates
//           </h2>

//           <button onClick={onClose}>
//             <XMarkIcon className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         {/* New Template */}
//         <div className="space-y-2 border rounded-xl p-4">

//           <input
//             placeholder="Template Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full border rounded-lg px-3 py-2"
//           />

//           <input
//             placeholder="Subject"
//             value={subject}
//             onChange={(e) => setSubject(e.target.value)}
//             className="w-full border rounded-lg px-3 py-2"
//           />

//           <textarea
//             rows="4"
//             placeholder="Email body"
//             value={body}
//             onChange={(e) => setBody(e.target.value)}
//             className="w-full border rounded-lg px-3 py-2"
//           />

//           <button
//             onClick={addTemplate}
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
//           >
//             <PlusIcon className="w-4 h-4" />
//             Add Template
//           </button>
//         </div>

//         {/* Template List */}
//         <div className="space-y-2 max-h-64 overflow-y-auto">

//           {templates.map((t) => (
//             <div
//               key={t.id}
//               className="border rounded-lg p-3"
//             >
//               <p className="font-semibold">{t.name}</p>
//               <p className="text-sm text-gray-500">{t.subject}</p>
//             </div>
//           ))}

//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmailTemplateManager;

//=========================================================================================================
// // CRM-Frontend/src/features/email/components/EmailTemplateManager.jsx

// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { createEmailTemplate, fetchEmailTemplates } from "../emailSlice";
// import {
//   XMarkIcon,
//   PlusIcon,
//   DocumentTextIcon,
//   InboxIcon,
// } from "@heroicons/react/24/outline";

// /*
// =====================================================
// TEMPLATE VARIABLES
// =====================================================
// */

// const TEMPLATE_VARIABLES = {
//   Contact: [
//     "contact.firstName",
//     "contact.lastName",
//     "contact.email",
//     "contact.phone",
//   ],
//   Deal: ["deal.dealName", "deal.amount", "deal.stage"],
//   Account: ["account.accountName", "account.industry"],
//   User: ["user.name", "user.email"],
// };

// /*
// =====================================================
// TEMPLATE COMPONENTS
// =====================================================
// */

// const TEMPLATE_COMPONENTS = ["header", "signature", "footer"];

// const TEMPLATE_SNIPPETS = [
//   "Looking forward to your response.",
//   "Please find the quotation attached.",
//   "Let me know if you have any questions.",
//   "Happy to schedule a call to discuss.",
// ];

// /*
// =====================================================
// PREVIEW DATA
// =====================================================
// */

// const previewVariables = {
//   contact: {
//     firstName: "John",
//     lastName: "Doe",
//     email: "john@example.com",
//     phone: "+91 9999999999",
//   },
//   deal: {
//     dealName: "Automation System",
//     amount: "₹50,000",
//     stage: "NEGOTIATION",
//   },
//   account: {
//     accountName: "ABC Manufacturing",
//     industry: "Industrial Automation",
//   },
//   user: {
//     name: "Sales Rep",
//     email: "sales@micrologicglobal.com",
//   },
// };

// /*
// =====================================================
// PREVIEW PARSER
// =====================================================
// */

// const previewComponents = {
//   header: `
//     <div style="font-weight:600;">Micrologic Global</div>
//     <hr/>
//   `,
//   signature: `
//     <br/>
//     Regards,<br/>
//     Sales Rep<br/>
//     Micrologic Global
//   `,
//   footer: `
//     <hr/>
//     <small>Micrologic Global Pvt Ltd</small>
//   `,
// };

// const previewTemplate = (template) => {
//   if (!template) return "";

//   let html = template;

//   // render components first
//   html = html.replace(/{{(header|footer|signature)}}/g, (_, key) => {
//     return previewComponents[key] || "";
//   });

//   // render variables
//   html = html.replace(/{{\s*(.*?)\s*}}/g, (_, key) => {
//     const keys = key.split(".");
//     let value = previewVariables;

//     for (const k of keys) {
//       value = value?.[k];
//     }

//     return value || "";
//   });

//   return html;
// };

// const EmailTemplateManager = ({ onClose }) => {
//   const dispatch = useDispatch();
//   const { templates } = useSelector((s) => s.email);

//   const [name, setName] = useState("");
//   const [subject, setSubject] = useState("");
//   const [body, setBody] = useState("");
//   const [search, setSearch] = useState("");

//   const filteredTemplates = templates.filter((t) =>
//     t.name.toLowerCase().includes(search.toLowerCase()),
//   );

//   const insertVariable = (variable) => {
//     const textarea = document.activeElement;
//     if (!textarea || textarea.tagName !== "TEXTAREA") {
//       setBody((prev) => prev + ` {{${variable}}} `);
//       return;
//     }

//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;

//     const newText =
//       body.substring(0, start) + `{{${variable}}}` + body.substring(end);

//     setBody(newText);
//   };

//   const insertComponent = (component) => {
//     const textarea = document.activeElement;
//     if (!textarea || textarea.tagName !== "TEXTAREA") {
//       setBody((prev) => prev + ` {{${component}}} `);
//       return;
//     }

//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;

//     const newText =
//       body.substring(0, start) + `{{${component}}}` + body.substring(end);

//     setBody(newText);
//   };

//   const insertSnippet = (text) => {
//     setBody((prev) => prev + "\n\n" + text);
//   };
//   const copyTemplate = (template) => {
//     setName(template.name + " Copy");
//     setSubject(template.subject);
//     setBody(template.body);
//   };

//   const addTemplate = async () => {
//     if (!name.trim() || !subject.trim() || !body.trim()) return;

//     try {
//       await dispatch(
//         createEmailTemplate({
//           name,
//           subject,
//           body,
//         }),
//       ).unwrap();

//       setName("");
//       setSubject("");
//       setBody("");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to create template");
//     }
//   };

//   const isFormValid = name.trim() && subject.trim() && body.trim();

//   useEffect(() => {
//     dispatch(fetchEmailTemplates());
//   }, [dispatch]);

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
//         {/* HEADER */}
//         <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
//           <div className="flex items-center gap-3">
//             <div className="flex items-center justify-center w-9 h-9 rounded-full bg-purple-100">
//               <DocumentTextIcon className="w-5 h-5 text-purple-600" />
//             </div>

//             <div>
//               <h2 className="text-lg font-semibold text-gray-900">
//                 Email Templates
//               </h2>
//               <p className="text-xs text-gray-500">
//                 Create reusable CRM email templates
//               </p>
//             </div>
//           </div>

//           <button onClick={onClose}>
//             <XMarkIcon className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         <div className="px-6 py-5 space-y-6">
//           {/* NEW TEMPLATE */}
//           <div className="space-y-4 border border-gray-200 rounded-xl p-5 bg-gray-50/50">
//             <h3 className="text-sm font-semibold text-gray-700 uppercase">
//               New Template
//             </h3>

//             <input
//               placeholder="Template name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full border rounded-lg px-4 py-2 text-sm"
//             />

//             <input
//               placeholder="Subject"
//               value={subject}
//               onChange={(e) => setSubject(e.target.value)}
//               className="w-full border rounded-lg px-4 py-2 text-sm"
//             />

//             <textarea
//               rows="5"
//               placeholder="Write template here..."
//               value={body}
//               onChange={(e) => setBody(e.target.value)}
//               className="w-full border rounded-lg px-4 py-3 text-sm resize-none"
//             />

//             {/* VARIABLE PICKER */}

//             <div>
//               <p className="text-xs font-medium text-gray-500 mb-2">
//                 Insert Variables
//               </p>

//               <div className="flex flex-wrap gap-2">
//                 {Object.entries(TEMPLATE_VARIABLES).map(([group, vars]) =>
//                   vars.map((v) => (
//                     <button
//                       key={v}
//                       type="button"
//                       onClick={() => insertVariable(v)}
//                       className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-purple-100"
//                     >
//                       {v}
//                     </button>
//                   )),
//                 )}
//               </div>
//             </div>

//             {/* COMPONENT PICKER */}

//             <div>
//               <p className="text-xs font-medium text-gray-500 mb-2">
//                 Components
//               </p>

//               <div className="flex gap-2">
//                 {TEMPLATE_COMPONENTS.map((c) => (
//                   <button
//                     key={c}
//                     onClick={() => insertComponent(c)}
//                     className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded"
//                   >
//                     {c}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* QUICK SNIPPETS */}

//             <div>
//               <p className="text-xs font-medium text-gray-500 mb-2">
//                 Quick Snippets
//               </p>

//               <div className="flex flex-wrap gap-2">
//                 {TEMPLATE_SNIPPETS.map((s) => (
//                   <button
//                     key={s}
//                     onClick={() => insertSnippet(s)}
//                     className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
//                   >
//                     {s.substring(0, 20)}...
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* LIVE PREVIEW */}

//             <div className="border rounded-lg p-3 bg-gray-50">
//               <p className="text-xs font-semibold mb-2 text-gray-500">
//                 Live Preview
//               </p>

//               <div
//                 className="text-sm text-gray-700"
//                 dangerouslySetInnerHTML={{
//                   __html: previewTemplate(body),
//                 }}
//               />
//             </div>

//             <div className="flex justify-end">
//               <button
//                 onClick={addTemplate}
//                 disabled={!isFormValid}
//                 className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg text-sm"
//               >
//                 <PlusIcon className="w-4 h-4" />
//                 Add Template
//               </button>
//             </div>
//           </div>

//           {/* TEMPLATE LIST */}

//           <div>
//             <h3 className="text-sm font-semibold text-gray-700 uppercase mb-3">
//               Saved Templates
//             </h3>

//             <input
//               type="text"
//               placeholder="Search templates..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="w-full border rounded-lg px-3 py-2 text-sm mb-3"
//             />

//             <div className="space-y-2 max-h-64 overflow-y-auto">
//               {templates.length === 0 ? (
//                 <div className="flex flex-col items-center py-8 text-gray-500">
//                   <InboxIcon className="w-6 h-6 mb-2" />
//                   No templates yet
//                 </div>
//               ) : (
//                 filteredTemplates.map((t) => (
//                   <div
//                     key={t.id}
//                     className="border rounded-lg p-3 bg-white flex justify-between items-center"
//                   >
//                     <div>
//                       <p className="font-semibold text-sm">{t.name}</p>
//                       <p className="text-xs text-gray-500">{t.subject}</p>
//                     </div>

//                     <button
//                       onClick={() => copyTemplate(t)}
//                       className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-purple-100"
//                     >
//                       Copy
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>

//         {/* FOOTER */}

//         <div className="flex justify-end px-6 py-4 border-t bg-gray-50">
//           <button
//             onClick={onClose}
//             className="px-5 py-2 rounded-lg border text-sm"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmailTemplateManager;

// ===============================================================================================

// CRM-Frontend/src/features/email/components/EmailTemplateManager.jsx

// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   createEmailTemplate,
//   fetchEmailTemplates,
//   generateEmailTemplateAI,
// } from "../emailSlice";
// import {
//   XMarkIcon,
//   PlusIcon,
//   DocumentTextIcon,
//   InboxIcon,
//   MagnifyingGlassIcon,
//   ClipboardDocumentIcon,
//   EyeIcon,
//   PencilSquareIcon,
//   ChevronDownIcon,
// } from "@heroicons/react/24/outline";
// import { SparklesIcon } from "@heroicons/react/24/solid";

// /*
// =====================================================
// TEMPLATE VARIABLES
// =====================================================
// */

// const TEMPLATE_VARIABLES = {
//   Contact: [
//     "contact.firstName",
//     "contact.lastName",
//     "contact.email",
//     "contact.phone",
//   ],
//   Deal: ["deal.dealName", "deal.amount", "deal.stage"],
//   Account: ["account.accountName", "account.industry"],
//   User: ["user.name", "user.email"],
// };

// /*
// =====================================================
// TEMPLATE COMPONENTS
// =====================================================
// */

// const TEMPLATE_COMPONENTS = ["header", "signature", "footer"];

// const TEMPLATE_SNIPPETS = [
//   "Looking forward to your response.",
//   "Please find the quotation attached.",
//   "Let me know if you have any questions.",
//   "Happy to schedule a call to discuss.",
// ];

// /*
// =====================================================
// AI PURPOSE OPTIONS
// =====================================================
// */

// const AI_PURPOSE_OPTIONS = [
//   "cold outreach",
//   "follow up",
//   "proposal submission",
//   "meeting request",
//   "negotiation",
//   "deal closing",
//   "re-engagement",
//   "thank you",
//   "custom",
// ];
// /*
// =====================================================
// PREVIEW DATA
// =====================================================
// */

// const previewVariables = {
//   contact: {
//     firstName: "John",
//     lastName: "Doe",
//     email: "john@example.com",
//     phone: "+91 9999999999",
//   },
//   deal: {
//     dealName: "Automation System",
//     amount: "₹50,000",
//     stage: "NEGOTIATION",
//   },
//   account: {
//     accountName: "ABC Manufacturing",
//     industry: "Industrial Automation",
//   },
//   user: {
//     name: "Sales Rep",
//     email: "sales@micrologicglobal.com",
//   },
// };

// /*
// =====================================================
// PREVIEW PARSER
// =====================================================
// */

// const previewComponents = {
//   header: `<div style="display:flex;align-items:center;gap:12px;padding-bottom:10px;"><img src="/Micro_2026.png" alt="Micrologic" style="height:40px;width:auto;" /><div><div style="font-family:'Georgia',serif;font-size:16px;font-weight:700;color:#1a2e44;line-height:1.2;">Micrologic Integrated Systems</div><div style="font-family:'Georgia',serif;font-size:10px;color:#2d6a9f;letter-spacing:1.5px;text-transform:uppercase;margin-top:1px;">Bangalore</div></div></div><hr style="border:none;border-top:1.5px solid #e0e7ff;margin:4px 0 8px;"/>`,
//   signature: `<br/><span style="color:#4f46e5;font-weight:500;">Regards,</span><br/>Sales Rep<br/><span style="color:#6b7280;font-size:12px;">Micrologic Global</span>`,
//   footer: `<hr style="border:none;border-top:1px solid #e5e7eb;margin:10px 0;"/><small style="color:#9ca3af;font-size:11px;">Micrologic Integrated Systems Bangalore</small>`,
// };

// const previewTemplate = (template) => {
//   if (!template) return "";
//   let html = template;
//   html = html.replace(/{{(header|footer|signature)}}/g, (_, key) => {
//     return previewComponents[key] || "";
//   });
//   html = html.replace(/{{\s*(.*?)\s*}}/g, (_, key) => {
//     const keys = key.split(".");
//     let value = previewVariables;
//     for (const k of keys) {
//       value = value?.[k];
//     }
//     return value || "";
//   });
//   return html;
// };

// /* =====================================================
//    GROUP COLOR MAP
// ===================================================== */
// const GROUP_COLORS = {
//   Contact: "bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100",
//   Deal: "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100",
//   Account:
//     "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100",
//   User: "bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100",
// };

// const GROUP_DOT = {
//   Contact: "bg-sky-400",
//   Deal: "bg-amber-400",
//   Account: "bg-emerald-400",
//   User: "bg-violet-400",
// };

// /* =====================================================
//    SECTION LABEL
// ===================================================== */
// const SectionLabel = ({ children }) => (
//   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
//     {children}
//   </p>
// );

// /* =====================================================
//    INPUT
// ===================================================== */
// const Field = ({ label, ...props }) => (
//   <div className="space-y-1.5">
//     {label && (
//       <label className="text-xs font-semibold text-gray-600">{label}</label>
//     )}
//     <input
//       {...props}
//       className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 transition-all duration-150 shadow-sm"
//     />
//   </div>
// );

// /* =====================================================
//    MAIN COMPONENT
// ===================================================== */
// const EmailTemplateManager = ({ onClose }) => {
//   const dispatch = useDispatch();
//   const { templates, generatingTemplate } = useSelector((s) => s.email);

//   const [name, setName] = useState("");
//   const [subject, setSubject] = useState("");
//   const [body, setBody] = useState("");
//   const [search, setSearch] = useState("");
//   const [activeTab, setActiveTab] = useState("editor"); // "editor" | "preview"
//   const [expandedGroup, setExpandedGroup] = useState(null);
//   // AI Wizard
//   const [showAIWizard, setShowAIWizard] = useState(false);
//   const [aiPurpose, setAiPurpose] = useState("");
//   const [customPurpose, setCustomPurpose] = useState("");
//   const [aiTone, setAiTone] = useState("professional");
//   const [aiRecipient, setAiRecipient] = useState("client");
//   const [aiLength, setAiLength] = useState("medium");

//   const filteredTemplates = templates.filter((t) =>
//     t.name.toLowerCase().includes(search.toLowerCase()),
//   );

//   const insertVariable = (variable) => {
//     const textarea = document.activeElement;
//     if (!textarea || textarea.tagName !== "TEXTAREA") {
//       setBody((prev) => prev + ` {{${variable}}} `);
//       return;
//     }
//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     const newText =
//       body.substring(0, start) + `{{${variable}}}` + body.substring(end);
//     setBody(newText);
//   };

//   const insertComponent = (component) => {
//     const textarea = document.activeElement;
//     if (!textarea || textarea.tagName !== "TEXTAREA") {
//       setBody((prev) => prev + ` {{${component}}} `);
//       return;
//     }
//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     const newText =
//       body.substring(0, start) + `{{${component}}}` + body.substring(end);
//     setBody(newText);
//   };

//   const insertSnippet = (text) => {
//     setBody((prev) => prev + "\n\n" + text);
//   };

//   const copyTemplate = (template) => {
//     setName(template.name + " Copy");
//     setSubject(template.subject);
//     setBody(template.body);
//     setActiveTab("editor");
//   };

//   const addTemplate = async () => {
//     if (!name.trim() || !subject.trim() || !body.trim()) return;
//     try {
//       await dispatch(createEmailTemplate({ name, subject, body })).unwrap();
//       setName("");
//       setSubject("");
//       setBody("");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to create template");
//     }
//   };

//   // const generateTemplateWithAI = async () => {
//   //   try {
//   //     const result = await dispatch(
//   //       generateEmailTemplateAI({
//   //         purpose: aiPurpose,
//   //         tone: aiTone,
//   //         recipient: aiRecipient,
//   //         length: aiLength,
//   //         category: "GENERAL",
//   //       }),
//   //     ).unwrap();

//   //     if (result) {
//   //       setName(result.name || "AI Generated Template");
//   //       setSubject(result.subject || "");
//   //       setBody(result.body || "");
//   //       setActiveTab("editor");
//   //       setShowAIWizard(false);
//   //     }
//   //   } catch (err) {
//   //     console.error("AI template generation failed:", err);
//   //     alert("AI failed to generate template");
//   //   }
//   // };

//   const generateTemplateWithAI = async () => {
//     try {
//       const finalPurpose = aiPurpose === "custom" ? customPurpose : aiPurpose;

//       const result = await dispatch(
//         generateEmailTemplateAI({
//           purpose: finalPurpose,
//           tone: aiTone,
//           recipient: aiRecipient,
//           length: aiLength,
//           category: "GENERAL",
//         }),
//       ).unwrap();

//       if (result) {
//         setName(result.name || "AI Generated Template");
//         setSubject(result.subject || "");
//         setBody(result.body || "");
//         setActiveTab("editor");
//         setShowAIWizard(false);
//       }
//     } catch (err) {
//       console.error("AI template generation failed:", err);
//       alert("AI failed to generate template");
//     }
//   };
//   const isFormValid = name.trim() && subject.trim() && body.trim();

//   useEffect(() => {
//     dispatch(fetchEmailTemplates());
//   }, [dispatch]);

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
//       <div
//         className="bg-white rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden"
//         style={{ maxWidth: "780px", maxHeight: "96vh" }}
//       >
//         {/* ── HEADER ── */}
//         <div className="flex-shrink-0 flex items-center justify-between px-5 sm:px-7 py-4 border-b border-gray-100">
//           <div className="flex items-center gap-3">
//             <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-violet-600 shadow-lg shadow-violet-200">
//               <DocumentTextIcon className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
//                 Email Templates
//               </h2>
//               <p className="text-xs text-gray-400 leading-tight">
//                 Create reusable CRM email templates
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
//           >
//             <XMarkIcon className="w-5 h-5" />
//           </button>
//         </div>

//         {/* ── SCROLLABLE BODY ── */}
//         <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 space-y-6 scroll-smooth">
//           {/* ── NEW TEMPLATE CARD ── */}
//           <div className="rounded-2xl border border-gray-100 bg-gray-50/60 overflow-hidden">
//             {/* Card top bar */}
//             <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-white">
//               <div className="flex items-center gap-3">
//                 <div className="flex items-center gap-2">
//                   <SparklesIcon className="w-4 h-4 text-violet-500" />
//                   <span className="text-sm font-bold text-gray-700">
//                     New Template
//                   </span>
//                 </div>

//                 <button
//                   onClick={() => setShowAIWizard(true)}
//                   disabled={generatingTemplate}
//                   className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all disabled:opacity-50"
//                 >
//                   <SparklesIcon className="w-3.5 h-3.5" />
//                   {generatingTemplate ? "Generating..." : "Generate with AI"}
//                 </button>
//               </div>
//               {/* Editor / Preview toggle */}
//               <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
//                 <button
//                   onClick={() => setActiveTab("editor")}
//                   className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
//                     activeTab === "editor"
//                       ? "bg-white text-violet-700 shadow-sm"
//                       : "text-gray-500 hover:text-gray-700"
//                   }`}
//                 >
//                   <PencilSquareIcon className="w-3.5 h-3.5" />
//                   <span className="hidden sm:inline">Editor</span>
//                 </button>
//                 <button
//                   onClick={() => setActiveTab("preview")}
//                   className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
//                     activeTab === "preview"
//                       ? "bg-white text-violet-700 shadow-sm"
//                       : "text-gray-500 hover:text-gray-700"
//                   }`}
//                 >
//                   <EyeIcon className="w-3.5 h-3.5" />
//                   <span className="hidden sm:inline">Preview</span>
//                 </button>
//               </div>
//             </div>

//             <div className="p-5 space-y-4">
//               {/* Name + Subject side by side on md+ */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 <Field
//                   label="Template Name"
//                   placeholder="e.g. Welcome Email"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                 />
//                 <Field
//                   label="Subject Line"
//                   placeholder="e.g. Quotation for {{deal.dealName}}"
//                   value={subject}
//                   onChange={(e) => setSubject(e.target.value)}
//                 />
//               </div>

//               {/* Editor tab */}
//               {activeTab === "editor" && (
//                 <div className="space-y-4">
//                   <div className="space-y-1.5">
//                     <label className="text-xs font-semibold text-gray-600">
//                       Body
//                     </label>
//                     <textarea
//                       rows="6"
//                       placeholder="Write your email template here... Use {{variable}} syntax."
//                       value={body}
//                       onChange={(e) => setBody(e.target.value)}
//                       className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 transition-all duration-150 shadow-sm resize-none leading-relaxed"
//                     />
//                   </div>

//                   {/* Variables — accordion by group */}
//                   <div>
//                     <SectionLabel>
//                       <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400" />
//                       Insert Variables
//                     </SectionLabel>
//                     <div className="space-y-2">
//                       {Object.entries(TEMPLATE_VARIABLES).map(
//                         ([group, vars]) => (
//                           <div
//                             key={group}
//                             className="rounded-xl border border-gray-100 bg-white overflow-hidden"
//                           >
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 setExpandedGroup(
//                                   expandedGroup === group ? null : group,
//                                 )
//                               }
//                               className="w-full flex items-center justify-between px-3.5 py-2.5 text-left hover:bg-gray-50 transition-colors"
//                             >
//                               <div className="flex items-center gap-2">
//                                 <span
//                                   className={`w-2 h-2 rounded-full ${GROUP_DOT[group]}`}
//                                 />
//                                 <span className="text-xs font-bold text-gray-600">
//                                   {group}
//                                 </span>
//                               </div>
//                               <ChevronDownIcon
//                                 className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
//                                   expandedGroup === group ? "rotate-180" : ""
//                                 }`}
//                               />
//                             </button>
//                             {expandedGroup === group && (
//                               <div className="px-3.5 pb-3 flex flex-wrap gap-1.5">
//                                 {vars.map((v) => (
//                                   <button
//                                     key={v}
//                                     type="button"
//                                     onClick={() => insertVariable(v)}
//                                     className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all duration-100 cursor-pointer ${GROUP_COLORS[group]}`}
//                                   >
//                                     {`{{${v}}}`}
//                                   </button>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         ),
//                       )}
//                     </div>
//                   </div>

//                   {/* Components */}
//                   <div>
//                     <SectionLabel>
//                       <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-400" />
//                       Components
//                     </SectionLabel>
//                     <div className="flex flex-wrap gap-2">
//                       {TEMPLATE_COMPONENTS.map((c) => (
//                         <button
//                           key={c}
//                           onClick={() => insertComponent(c)}
//                           className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200 rounded-lg hover:bg-violet-100 transition-colors capitalize"
//                         >
//                           <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
//                           {c}
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Quick Snippets */}
//                   <div>
//                     <SectionLabel>
//                       <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-400" />
//                       Quick Snippets
//                     </SectionLabel>
//                     <div className="flex flex-wrap gap-2">
//                       {TEMPLATE_SNIPPETS.map((s) => (
//                         <button
//                           key={s}
//                           onClick={() => insertSnippet(s)}
//                           className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50 transition-all duration-150 font-medium"
//                         >
//                           {s.substring(0, 22)}…
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Preview tab */}
//               {activeTab === "preview" && (
//                 <div className="rounded-xl border border-dashed border-violet-200 bg-white overflow-hidden">
//                   <div className="flex items-center gap-2 px-4 py-2.5 border-b border-violet-100 bg-violet-50/50">
//                     <EyeIcon className="w-3.5 h-3.5 text-violet-500" />
//                     <span className="text-xs font-bold text-violet-600 uppercase tracking-wide">
//                       Live Preview
//                     </span>
//                     <span className="ml-auto text-[10px] text-gray-400 font-medium">
//                       Sample data
//                     </span>
//                   </div>
//                   {body ? (
//                     <div
//                       className="px-5 py-4 text-sm text-gray-700 leading-relaxed min-h-[120px]"
//                       dangerouslySetInnerHTML={{
//                         __html: previewTemplate(body),
//                       }}
//                     />
//                   ) : (
//                     <div className="px-5 py-8 text-center text-gray-400 text-sm">
//                       Start typing in the editor to see a preview
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Submit */}
//               <div className="flex justify-end pt-1">
//                 <button
//                   onClick={addTemplate}
//                   disabled={!isFormValid}
//                   className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 shadow-sm ${
//                     isFormValid
//                       ? "bg-violet-600 hover:bg-violet-700 text-white shadow-violet-200 hover:shadow-violet-300 hover:shadow-md active:scale-95"
//                       : "bg-gray-100 text-gray-400 cursor-not-allowed"
//                   }`}
//                 >
//                   <PlusIcon className="w-4 h-4" />
//                   Save Template
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* ── SAVED TEMPLATES ── */}
//           <div>
//             <div className="flex items-center justify-between mb-3">
//               <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
//                 Saved Templates
//                 {templates.length > 0 && (
//                   <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold">
//                     {templates.length}
//                   </span>
//                 )}
//               </h3>
//             </div>

//             {/* Search */}
//             <div className="relative mb-3">
//               <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
//               <input
//                 type="text"
//                 placeholder="Search templates..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-violet-400 transition-all duration-150 shadow-sm"
//               />
//             </div>

//             {/* List */}
//             <div className="space-y-2 max-h-56 overflow-y-auto pr-0.5">
//               {templates.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-10 text-gray-400 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
//                   <InboxIcon className="w-8 h-8 mb-2 text-gray-300" />
//                   <p className="text-sm font-medium">No templates yet</p>
//                   <p className="text-xs text-gray-400 mt-0.5">
//                     Create your first template above
//                   </p>
//                 </div>
//               ) : filteredTemplates.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-8 text-gray-400 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
//                   <MagnifyingGlassIcon className="w-6 h-6 mb-2 text-gray-300" />
//                   <p className="text-sm font-medium">No results found</p>
//                 </div>
//               ) : (
//                 filteredTemplates.map((t) => (
//                   <div
//                     key={t.id}
//                     className="group flex items-center justify-between gap-3 px-4 py-3.5 bg-white border border-gray-100 rounded-xl hover:border-violet-200 hover:shadow-sm transition-all duration-150"
//                   >
//                     <div className="flex items-center gap-3 min-w-0">
//                       <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
//                         <DocumentTextIcon className="w-4 h-4 text-violet-500" />
//                       </div>
//                       <div className="min-w-0">
//                         <p className="font-semibold text-sm text-gray-800 truncate">
//                           {t.name}
//                         </p>
//                         <p className="text-xs text-gray-400 truncate">
//                           {t.subject}
//                         </p>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => copyTemplate(t)}
//                       className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-200 rounded-lg group-hover:bg-violet-50 group-hover:text-violet-700 group-hover:border-violet-200 transition-all duration-150"
//                     >
//                       <ClipboardDocumentIcon className="w-3.5 h-3.5" />
//                       Copy
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ── FOOTER ── */}
//         <div className="flex-shrink-0 flex items-center justify-end gap-2 px-5 sm:px-7 py-4 border-t border-gray-100 bg-gray-50/50">
//           <button
//             onClick={onClose}
//             className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all duration-150 active:scale-95"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//       {showAIWizard && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60]">
//           <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
//             <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//               <SparklesIcon className="w-5 h-5 text-violet-500" />
//               Generate Template with AI
//             </h3>

//             {/* Purpose */}
//             <div className="space-y-1">
//               <label className="text-sm font-semibold text-gray-600">
//                 Email Purpose
//               </label>

//               <select
//                 value={aiPurpose}
//                 onChange={(e) => setAiPurpose(e.target.value)}
//                 className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
//               >
//                 {AI_PURPOSE_OPTIONS.map((p) => (
//                   <option key={p} value={p}>
//                     {p.charAt(0).toUpperCase() + p.slice(1)}
//                   </option>
//                 ))}
//               </select>

//               {aiPurpose === "custom" && (
//                 <input
//                   type="text"
//                   placeholder="Describe the email purpose"
//                   value={customPurpose}
//                   onChange={(e) => setCustomPurpose(e.target.value)}
//                   className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-2"
//                 />
//               )}
//             </div>

//             {/* Tone */}
//             <div>
//               <label className="text-sm font-semibold text-gray-600">
//                 Tone
//               </label>
//               <select
//                 value={aiTone}
//                 onChange={(e) => setAiTone(e.target.value)}
//                 className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
//               >
//                 <option value="professional">Professional</option>
//                 <option value="friendly">Friendly</option>
//                 <option value="persuasive">Persuasive</option>
//               </select>
//             </div>

//             {/* Recipient */}
//             <div>
//               <label className="text-sm font-semibold text-gray-600">
//                 Recipient
//               </label>
//               <select
//                 value={aiRecipient}
//                 onChange={(e) => setAiRecipient(e.target.value)}
//                 className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
//               >
//                 <option value="client">Client</option>
//                 <option value="hiring manager">Hiring Manager</option>
//                 <option value="partner">Partner</option>
//               </select>
//             </div>

//             {/* Length */}
//             <div>
//               <label className="text-sm font-semibold text-gray-600">
//                 Length
//               </label>
//               <select
//                 value={aiLength}
//                 onChange={(e) => setAiLength(e.target.value)}
//                 className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
//               >
//                 <option value="short">Short</option>
//                 <option value="medium">Medium</option>
//                 <option value="long">Detailed</option>
//               </select>
//             </div>

//             <div className="flex justify-end gap-2 pt-2">
//               <button
//                 onClick={() => setShowAIWizard(false)}
//                 className="px-4 py-2 text-sm rounded-lg border"
//               >
//                 Cancel
//               </button>

//               <button
//                 onClick={generateTemplateWithAI}
//                 disabled={
//                   generatingTemplate ||
//                   (aiPurpose === "custom" && !customPurpose.trim())
//                 }
//                 className="px-4 py-2 text-sm rounded-lg bg-violet-600 text-white"
//               >
//                 {generatingTemplate ? "Generating..." : "Generate"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmailTemplateManager;

//================================================================================================

// // CRM-Frontend/src/features/email/components/EmailTemplateManager.jsx

// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   createEmailTemplate,
//   fetchEmailTemplates,
//   generateEmailTemplateAI,
//   deleteEmailTemplate,
//   updateEmailTemplate,
// } from "../emailSlice";
// import {
//   XMarkIcon,
//   PlusIcon,
//   DocumentTextIcon,
//   InboxIcon,
//   MagnifyingGlassIcon,
//   ClipboardDocumentIcon,
//   EyeIcon,
//   PencilSquareIcon,
//   ChevronDownIcon,
// } from "@heroicons/react/24/outline";
// import { SparklesIcon } from "@heroicons/react/24/solid";

// /*
// =====================================================
// TEMPLATE VARIABLES
// =====================================================
// */

// const TEMPLATE_VARIABLES = {
//   Contact: [
//     "contact.firstName",
//     "contact.lastName",
//     "contact.email",
//     "contact.phone",
//   ],
//   Deal: ["deal.dealName", "deal.amount", "deal.stage"],
//   Account: ["account.accountName", "account.industry"],
//   User: ["user.name", "user.email"],
// };

// /*
// =====================================================
// TEMPLATE COMPONENTS
// =====================================================
// */

// const TEMPLATE_COMPONENTS = ["header", "signature", "footer"];

// const TEMPLATE_SNIPPETS = [
//   "Looking forward to your response.",
//   "Please find the quotation attached.",
//   "Let me know if you have any questions.",
//   "Happy to schedule a call to discuss.",
// ];

// /*
// =====================================================
// AI PURPOSE OPTIONS
// =====================================================
// */

// const AI_PURPOSE_OPTIONS = [
//   "",
//   "cold outreach",
//   "follow up",
//   "proposal submission",
//   "meeting request",
//   "negotiation",
//   "deal closing",
//   "re-engagement",
//   "thank you",
//   "custom",
// ];
// /*
// =====================================================
// PREVIEW DATA
// =====================================================
// */

// const previewVariables = {
//   contact: {
//     firstName: "John",
//     lastName: "Doe",
//     email: "john@example.com",
//     phone: "+91 9999999999",
//   },
//   deal: {
//     dealName: "Automation System",
//     amount: "₹50,000",
//     stage: "NEGOTIATION",
//   },
//   account: {
//     accountName: "ABC Manufacturing",
//     industry: "Industrial Automation",
//   },
//   user: {
//     name: "Sales Rep",
//     email: "sales@micrologicglobal.com",
//   },
// };

// /*
// =====================================================
// PREVIEW PARSER
// =====================================================
// */

// const previewComponents = {
//   header: `<div style="display:flex;align-items:center;gap:12px;padding-bottom:10px;"><img src="/Micro_2026.png" alt="Micrologic" style="height:40px;width:auto;" /><div><div style="font-family:'Georgia',serif;font-size:16px;font-weight:700;color:#1a2e44;line-height:1.2;">Micrologic Integrated Systems</div><div style="font-family:'Georgia',serif;font-size:10px;color:#2d6a9f;letter-spacing:1.5px;text-transform:uppercase;margin-top:1px;">Bangalore</div></div></div><hr style="border:none;border-top:1.5px solid #e0e7ff;margin:4px 0 8px;"/>`,
//   signature: `<br/><span style="color:#4f46e5;font-weight:500;">Regards,</span><br/>Sales Rep<br/><span style="color:#6b7280;font-size:12px;">Micrologic Global</span>`,
//   footer: `<hr style="border:none;border-top:1px solid #e5e7eb;margin:10px 0;"/><small style="color:#9ca3af;font-size:11px;">Micrologic Integrated Systems Bangalore</small>`,
// };

// const previewTemplate = (template) => {
//   if (!template) return "";
//   let html = template;
//   html = html.replace(/{{(header|footer|signature)}}/g, (_, key) => {
//     return previewComponents[key] || "";
//   });
//   html = html.replace(/{{\s*(.*?)\s*}}/g, (_, key) => {
//     const keys = key.split(".");
//     let value = previewVariables;
//     for (const k of keys) {
//       value = value?.[k];
//     }
//     return value || "";
//   });
//   return html;
// };

// /* =====================================================
//    GROUP COLOR MAP
// ===================================================== */
// const GROUP_COLORS = {
//   Contact: "bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100",
//   Deal: "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100",
//   Account:
//     "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100",
//   User: "bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100",
// };

// const GROUP_DOT = {
//   Contact: "bg-sky-400",
//   Deal: "bg-amber-400",
//   Account: "bg-emerald-400",
//   User: "bg-violet-400",
// };

// /* =====================================================
//    SECTION LABEL
// ===================================================== */
// const SectionLabel = ({ children }) => (
//   <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.18em] mb-3 flex items-center gap-2">
//     {children}
//   </p>
// );

// /* =====================================================
//    INPUT
// ===================================================== */
// const Field = ({ label, ...props }) => (
//   <div className="space-y-1.5">
//     {label && (
//       <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
//         {label}
//       </label>
//     )}
//     <input
//       {...props}
//       className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-200 shadow-sm hover:border-gray-300"
//     />
//   </div>
// );

// /* =====================================================
//    MAIN COMPONENT
// ===================================================== */
// const EmailTemplateManager = ({ onClose }) => {
//   const dispatch = useDispatch();
//   const { templates, generatingTemplate } = useSelector((s) => s.email);

//   const [name, setName] = useState("");
//   const [subject, setSubject] = useState("");
//   const [body, setBody] = useState("");
//   const [search, setSearch] = useState("");
//   const [activeTab, setActiveTab] = useState("editor");
//   const [expandedGroup, setExpandedGroup] = useState(null);
//   const [showAIWizard, setShowAIWizard] = useState(false);
//   const [aiPurpose, setAiPurpose] = useState("");
//   const [customPurpose, setCustomPurpose] = useState("");
//   const [aiTone, setAiTone] = useState("professional");
//   const [aiRecipient, setAiRecipient] = useState("client");
//   const [aiLength, setAiLength] = useState("medium");
//   const [editingTemplateId, setEditingTemplateId] = useState(null);

//   const filteredTemplates = templates.filter((t) =>
//     t.name.toLowerCase().includes(search.toLowerCase()),
//   );

//   const insertVariable = (variable) => {
//     const textarea = document.activeElement;
//     if (!textarea || textarea.tagName !== "TEXTAREA") {
//       setBody((prev) => prev + ` {{${variable}}} `);
//       return;
//     }
//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     const newText =
//       body.substring(0, start) + `{{${variable}}}` + body.substring(end);
//     setBody(newText);
//   };

//   const insertComponent = (component) => {
//     const textarea = document.activeElement;
//     if (!textarea || textarea.tagName !== "TEXTAREA") {
//       setBody((prev) => prev + ` {{${component}}} `);
//       return;
//     }
//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     const newText =
//       body.substring(0, start) + `{{${component}}}` + body.substring(end);
//     setBody(newText);
//   };

//   const insertSnippet = (text) => {
//     setBody((prev) => prev + "\n\n" + text);
//   };

//   const copyTemplate = (template) => {
//     setEditingTemplateId(template.id);
//     setName(template.name);
//     setSubject(template.subject);
//     setBody(template.body);
//     setActiveTab("editor");
//   };

//   const addTemplate = async () => {
//     if (!name.trim() || !subject.trim() || !body.trim()) return;

//     try {
//       if (editingTemplateId) {
//         await dispatch(
//           updateEmailTemplate({
//             id: editingTemplateId,
//             data: { name, subject, body },
//           }),
//         ).unwrap();
//       } else {
//         await dispatch(createEmailTemplate({ name, subject, body })).unwrap();
//       }

//       setName("");
//       setSubject("");
//       setBody("");
//       setEditingTemplateId(null);
//     } catch (err) {
//       console.error(err);
//       alert("Failed to save template");
//     }
//   };

//   // const generateTemplateWithAI = async () => {
//   //   try {
//   //     const finalPurpose =
//   //       aiPurpose === "custom" ? customPurpose.trim() : aiPurpose?.trim();

//   //     if (!finalPurpose) {
//   //       alert("Please select or enter an email purpose");
//   //       return;
//   //     }

//   //     const result = await dispatch(
//   //       generateEmailTemplateAI({
//   //         purpose: finalPurpose,
//   //         tone: aiTone,
//   //         recipient: aiRecipient,
//   //         length: aiLength,
//   //         category: "GENERAL",
//   //       }),
//   //     ).unwrap();

//   //     if (result) {
//   //       setName(
//   //         result.name ||
//   //           `${(aiPurpose || "Email").replace(/\b\w/g, (l) => l.toUpperCase())} Template`,
//   //       );
//   //       setSubject(result.subject || "");
//   //       setBody(result.body || "");
//   //       setActiveTab("editor");
//   //       setShowAIWizard(false);
//   //       setAiPurpose("");
//   //       setCustomPurpose("");
//   //       setAiTone("professional");
//   //       setAiRecipient("client");
//   //       setAiLength("medium");
//   //     }
//   //   } catch (err) {
//   //     console.error("AI template generation failed:", err);
//   //     alert("AI failed to generate template");
//   //   }
//   // };

//   const generateTemplateWithAI = async () => {
//     try {
//       if (!aiPurpose) {
//         alert("Please select an email purpose");
//         return;
//       }

//       if (aiPurpose === "custom" && !customPurpose.trim()) {
//         alert("Please enter a custom email purpose");
//         return;
//       }

//       const payload = {
//         purpose: aiPurpose,
//         customPurpose: aiPurpose === "custom" ? customPurpose.trim() : "",
//         tone: aiTone,
//         recipient: aiRecipient,
//         length: aiLength,
//         category: "GENERAL",
//       };

//       const result = await dispatch(generateEmailTemplateAI(payload)).unwrap();

//       if (result) {
//         setName(
//           result.name ||
//             `${(aiPurpose || "Email").replace(/\b\w/g, (l) =>
//               l.toUpperCase(),
//             )} Template`,
//         );

//         setSubject(result.subject || "");
//         setBody(result.body || "");

//         setActiveTab("editor");
//         setShowAIWizard(false);

//         setAiPurpose("");
//         setCustomPurpose("");
//         setAiTone("professional");
//         setAiRecipient("client");
//         setAiLength("medium");
//       }
//     } catch (err) {
//       console.error("AI template generation failed:", err);
//       alert("AI failed to generate template");
//     }
//   };

//   const isFormValid = name.trim() && subject.trim() && body.trim();

//   useEffect(() => {
//     dispatch(fetchEmailTemplates());
//   }, [dispatch]);

//   return (
//     <div className="fixed inset-0 bg-black/30 backdrop-blur-lg flex items-center justify-center z-50 p-3 sm:p-5">
//       <div
//         className="bg-white rounded-3xl shadow-2xl shadow-black/10 w-full flex flex-col overflow-hidden border border-gray-100"
//         style={{ maxWidth: "800px", maxHeight: "96vh" }}
//       >
//         {/* ── HEADER ── */}
//         <div className="flex-shrink-0 flex items-center justify-between px-6 sm:px-8 py-5 border-b border-gray-100">
//           <div className="flex items-center gap-3.5">
//             <div className="flex items-center justify-center w-9 h-9 rounded-2xl bg-violet-600">
//               <DocumentTextIcon className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
//             </div>
//             <div>
//               <h2 className="text-[15px] font-bold text-gray-900 tracking-tight leading-tight">
//                 Email Templates
//               </h2>
//               <p className="text-[11px] text-gray-400 leading-tight mt-0.5">
//                 Create & manage reusable email templates
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onClose}
//             className="flex items-center justify-center w-8 h-8 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-150"
//           >
//             <XMarkIcon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
//           </button>
//         </div>

//         {/* ── SCROLLABLE BODY ── */}
//         <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
//           {/* ── NEW TEMPLATE CARD ── */}
//           <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm">
//             {/* Card Header */}
//             <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
//               <div className="flex items-center gap-3">
//                 <span className="text-[11px] font-bold text-gray-700 uppercase tracking-widest">
//                   New Template
//                 </span>
//                 <button
//                   onClick={() => {
//                     if (!generatingTemplate) setShowAIWizard(true);
//                   }}
//                   disabled={generatingTemplate}
//                   className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700 active:scale-95 transition-all duration-150 disabled:opacity-50 shadow-sm shadow-violet-200"
//                 >
//                   <SparklesIcon className="w-3 h-3" />
//                   {generatingTemplate ? "Generating…" : "AI Generate"}
//                 </button>
//               </div>

//               {/* Editor / Preview toggle */}
//               <div className="flex items-center gap-0.5 bg-gray-100/80 rounded-xl p-1">
//                 {[
//                   { key: "editor", Icon: PencilSquareIcon, label: "Editor" },
//                   { key: "preview", Icon: EyeIcon, label: "Preview" },
//                 ].map(({ key, Icon, label }) => (
//                   <button
//                     key={key}
//                     onClick={() => setActiveTab(key)}
//                     className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150 ${
//                       activeTab === key
//                         ? "bg-white text-violet-700 shadow-sm"
//                         : "text-gray-500 hover:text-gray-700"
//                     }`}
//                   >
//                     <Icon className="w-3.5 h-3.5" />
//                     <span className="hidden sm:inline">{label}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Card Body */}
//             <div className="p-5 space-y-5">
//               {/* Name + Subject */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <Field
//                   label="Template Name"
//                   placeholder="e.g. Welcome Email"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                 />
//                 <Field
//                   label="Subject Line"
//                   placeholder="e.g. Quotation for {{deal.dealName}}"
//                   value={subject}
//                   onChange={(e) => setSubject(e.target.value)}
//                 />
//               </div>

//               {/* ── EDITOR TAB ── */}
//               {activeTab === "editor" && (
//                 <div className="space-y-5">
//                   {/* Body textarea */}
//                   <div className="space-y-1.5">
//                     <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
//                       Body
//                     </label>
//                     <textarea
//                       rows={7}
//                       placeholder="Write your email template here… Use {{variable}} syntax."
//                       value={body}
//                       onChange={(e) => setBody(e.target.value)}
//                       className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-200 shadow-sm hover:border-gray-300 resize-none leading-relaxed font-mono"
//                     />
//                   </div>

//                   {/* Separator */}
//                   <div className="border-t border-dashed border-gray-100" />

//                   {/* Insert Variables — accordion */}
//                   <div>
//                     <SectionLabel>
//                       <span className="w-1 h-1 rounded-full bg-gray-300 inline-block" />
//                       Insert Variables
//                     </SectionLabel>
//                     <div className="space-y-1.5">
//                       {Object.entries(TEMPLATE_VARIABLES).map(
//                         ([group, vars]) => (
//                           <div
//                             key={group}
//                             className="rounded-xl border border-gray-100 overflow-hidden"
//                           >
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 setExpandedGroup(
//                                   expandedGroup === group ? null : group,
//                                 )
//                               }
//                               className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50/80 transition-colors duration-150"
//                             >
//                               <div className="flex items-center gap-2.5">
//                                 <span
//                                   className={`w-1.5 h-1.5 rounded-full ${GROUP_DOT[group]}`}
//                                 />
//                                 <span className="text-xs font-semibold text-gray-600">
//                                   {group}
//                                 </span>
//                               </div>
//                               <ChevronDownIcon
//                                 className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
//                                   expandedGroup === group ? "rotate-180" : ""
//                                 }`}
//                               />
//                             </button>
//                             {expandedGroup === group && (
//                               <div className="px-4 pb-3 pt-1 flex flex-wrap gap-1.5 bg-gray-50/40 border-t border-gray-100">
//                                 {vars.map((v) => (
//                                   <button
//                                     key={v}
//                                     type="button"
//                                     onClick={() => insertVariable(v)}
//                                     className={`px-2.5 py-1 text-[11px] rounded-lg font-mono font-medium transition-all duration-100 cursor-pointer ${GROUP_COLORS[group]}`}
//                                   >
//                                     {`{{${v}}}`}
//                                   </button>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         ),
//                       )}
//                     </div>
//                   </div>

//                   {/* Components */}
//                   <div>
//                     <SectionLabel>
//                       <span className="w-1 h-1 rounded-full bg-violet-400 inline-block" />
//                       Components
//                     </SectionLabel>
//                     <div className="flex flex-wrap gap-2">
//                       {TEMPLATE_COMPONENTS.map((c) => (
//                         <button
//                           key={c}
//                           onClick={() => insertComponent(c)}
//                           className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold bg-violet-50 text-violet-700 border border-violet-100 rounded-lg hover:bg-violet-100 hover:border-violet-200 active:scale-95 transition-all duration-150 capitalize"
//                         >
//                           <span className="w-1 h-1 rounded-full bg-violet-400 inline-block" />
//                           {c}
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Quick Snippets */}
//                   <div>
//                     <SectionLabel>
//                       <span className="w-1 h-1 rounded-full bg-gray-300 inline-block" />
//                       Quick Snippets
//                     </SectionLabel>
//                     <div className="flex flex-wrap gap-2">
//                       {TEMPLATE_SNIPPETS.map((s) => (
//                         <button
//                           key={s}
//                           onClick={() => insertSnippet(s)}
//                           className="px-3 py-1.5 text-[11px] text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50/60 active:scale-95 transition-all duration-150 font-medium"
//                         >
//                           {s.substring(0, 22)}…
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* ── PREVIEW TAB ── */}
//               {activeTab === "preview" && (
//                 <div className="rounded-2xl border border-gray-100 overflow-hidden">
//                   <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/60">
//                     <EyeIcon className="w-3.5 h-3.5 text-violet-500" />
//                     <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
//                       Live Preview
//                     </span>
//                     <span className="ml-auto text-[10px] text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
//                       sample data
//                     </span>
//                   </div>
//                   {body ? (
//                     <div
//                       className="px-6 py-5 text-sm text-gray-700 leading-relaxed min-h-[140px] bg-white"
//                       dangerouslySetInnerHTML={{
//                         __html: previewTemplate(body),
//                       }}
//                     />
//                   ) : (
//                     <div className="px-5 py-12 text-center text-gray-400 bg-white">
//                       <EyeIcon className="w-8 h-8 mx-auto mb-2 text-gray-200" />
//                       <p className="text-sm font-medium text-gray-400">
//                         Start typing to see a preview
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Save Button */}
//               <div className="flex justify-end pt-1">
//                 <button
//                   onClick={addTemplate}
//                   disabled={!isFormValid}
//                   className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 ${
//                     isFormValid
//                       ? "bg-violet-600 hover:bg-violet-700 text-white shadow-sm shadow-violet-200 hover:shadow-violet-300 hover:shadow-md active:scale-95"
//                       : "bg-gray-100 text-gray-400 cursor-not-allowed"
//                   }`}
//                 >
//                   <PlusIcon className="w-4 h-4" />
//                   {editingTemplateId ? "Update Template" : "Save Template"}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* ── SAVED TEMPLATES ── */}
//           <div>
//             <div className="flex items-center justify-between mb-4">
//               <div className="flex items-center gap-2.5">
//                 <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
//                   Saved Templates
//                 </h3>
//                 {templates.length > 0 && (
//                   <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold">
//                     {templates.length}
//                   </span>
//                 )}
//               </div>
//             </div>

//             {/* Search */}
//             <div className="relative mb-3">
//               <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
//               <input
//                 type="text"
//                 placeholder="Search templates…"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-200 shadow-sm hover:border-gray-300"
//               />
//             </div>

//             {/* Template List */}
//             <div className="space-y-1.5 max-h-56 overflow-y-auto pr-0.5">
//               {templates.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-12 text-gray-400 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
//                   <InboxIcon className="w-8 h-8 mb-2.5 text-gray-200" />
//                   <p className="text-sm font-semibold text-gray-400">
//                     No templates yet
//                   </p>
//                   <p className="text-xs text-gray-300 mt-0.5">
//                     Create your first template above
//                   </p>
//                 </div>
//               ) : filteredTemplates.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-10 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
//                   <MagnifyingGlassIcon className="w-6 h-6 mb-2 text-gray-200" />
//                   <p className="text-sm font-medium text-gray-400">
//                     No results found
//                   </p>
//                 </div>
//               ) : (
//                 filteredTemplates.map((t) => (
//                   <div
//                     key={t.id}
//                     className="group flex items-center justify-between gap-3 px-4 py-3 bg-white border border-gray-100 rounded-xl hover:border-violet-200 hover:shadow-sm hover:bg-violet-50/20 transition-all duration-150"
//                   >
//                     <div className="flex items-center gap-3 min-w-0">
//                       <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
//                         <DocumentTextIcon className="w-4 h-4 text-violet-400" />
//                       </div>
//                       <div className="min-w-0">
//                         <p className="font-semibold text-sm text-gray-800 truncate leading-tight">
//                           {t.name}
//                         </p>
//                         <p className="text-[11px] text-gray-400 truncate mt-0.5 leading-tight">
//                           {t.subject}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => copyTemplate(t)}
//                         className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-violet-600 hover:text-white hover:border-violet-600 active:scale-95 transition-all duration-150"
//                       >
//                         <ClipboardDocumentIcon className="w-3.5 h-3.5" />
//                         Use
//                       </button>
//                       {editingTemplateId && (
//                         <button
//                           onClick={() => {
//                             setEditingTemplateId(null);
//                             setName("");
//                             setSubject("");
//                             setBody("");
//                           }}
//                           className="ml-3 px-4 py-2 text-sm border rounded-lg"
//                         >
//                           Cancel
//                         </button>
//                       )}

//                       <button
//                         onClick={() => {
//                           if (window.confirm("Delete this template?")) {
//                             dispatch(deleteEmailTemplate(t.id));
//                           }
//                         }}
//                         className="px-3 py-1.5 text-[11px] font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 active:scale-95 transition-all"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ── FOOTER ── */}
//         <div className="flex-shrink-0 flex items-center justify-end gap-2 px-6 sm:px-8 py-4 border-t border-gray-100 bg-gray-50/50">
//           <button
//             onClick={onClose}
//             className="px-5 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:bg-white hover:border-gray-300 hover:text-gray-800 active:scale-95 transition-all duration-150"
//           >
//             Close
//           </button>
//         </div>
//       </div>

//       {/* ── AI WIZARD MODAL ── */}
//       {showAIWizard && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[60] p-4">
//           <div className="bg-white rounded-3xl shadow-2xl shadow-black/10 w-full max-w-[420px] overflow-hidden border border-gray-100">
//             {/* Wizard Header */}
//             <div className="px-6 pt-6 pb-5 border-b border-gray-100">
//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center">
//                   <SparklesIcon className="w-4 h-4 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">
//                     Generate with AI
//                   </h3>
//                   <p className="text-[11px] text-gray-400 mt-0.5">
//                     Craft a perfect email template instantly
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Wizard Fields */}
//             <div className="px-6 py-5 space-y-4">
//               {/* Purpose */}
//               <div className="space-y-1.5">
//                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
//                   Email Purpose
//                 </label>
//                 <select
//                   value={aiPurpose}
//                   onChange={(e) => setAiPurpose(e.target.value)}
//                   className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-150 hover:border-gray-300"
//                 >
//                   {AI_PURPOSE_OPTIONS.map((p) => (
//                     <option key={p} value={p}>
//                       {p === ""
//                         ? "Select purpose"
//                         : p.charAt(0).toUpperCase() + p.slice(1)}
//                     </option>
//                   ))}
//                 </select>
//                 {aiPurpose === "custom" && (
//                   <input
//                     type="text"
//                     placeholder="Describe the email purpose…"
//                     value={customPurpose}
//                     onChange={(e) => setCustomPurpose(e.target.value)}
//                     className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 mt-2 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-150 placeholder-gray-300"
//                   />
//                 )}
//               </div>

//               {/* Tone + Recipient side by side */}
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="space-y-1.5">
//                   <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
//                     Tone
//                   </label>
//                   <select
//                     value={aiTone}
//                     onChange={(e) => setAiTone(e.target.value)}
//                     className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-150 hover:border-gray-300"
//                   >
//                     <option value="professional">Professional</option>
//                     <option value="friendly">Friendly</option>
//                     <option value="persuasive">Persuasive</option>
//                   </select>
//                 </div>
//                 <div className="space-y-1.5">
//                   <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
//                     Recipient
//                   </label>
//                   <select
//                     value={aiRecipient}
//                     onChange={(e) => setAiRecipient(e.target.value)}
//                     className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-150 hover:border-gray-300"
//                   >
//                     <option value="client">Client</option>
//                     <option value="hiring manager">Hiring Manager</option>
//                     <option value="partner">Partner</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Length */}
//               <div className="space-y-1.5">
//                 <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
//                   Length
//                 </label>
//                 <div className="grid grid-cols-3 gap-2">
//                   {[
//                     { value: "short", label: "Short" },
//                     { value: "medium", label: "Medium" },
//                     { value: "long", label: "Detailed" },
//                   ].map(({ value, label }) => (
//                     <button
//                       key={value}
//                       type="button"
//                       onClick={() => setAiLength(value)}
//                       className={`py-2 rounded-xl text-[12px] font-semibold border transition-all duration-150 active:scale-95 ${
//                         aiLength === value
//                           ? "bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-200"
//                           : "bg-white text-gray-600 border-gray-200 hover:border-violet-300 hover:text-violet-700"
//                       }`}
//                     >
//                       {label}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Wizard Footer */}
//             <div className="flex items-center justify-end gap-2 px-6 pb-6">
//               <button
//                 onClick={() => setShowAIWizard(false)}
//                 className="px-4 py-2.5 text-[13px] font-semibold text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 active:scale-95 transition-all duration-150"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={generateTemplateWithAI}
//                 disabled={
//                   generatingTemplate ||
//                   (aiPurpose === "custom" && !customPurpose.trim())
//                 }
//                 className="flex items-center gap-1.5 px-5 py-2.5 text-[13px] font-semibold rounded-xl bg-violet-600 text-white hover:bg-violet-700 active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-violet-200"
//               >
//                 <SparklesIcon className="w-3.5 h-3.5" />
//                 {generatingTemplate ? "Generating…" : "Generate"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmailTemplateManager;


// CRM-Frontend/src/features/email/components/EmailTemplateManager.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createEmailTemplate,
  fetchEmailTemplates,
  generateEmailTemplateAI,
  deleteEmailTemplate,
  updateEmailTemplate,
} from "../emailSlice";
import {
  XMarkIcon,
  PlusIcon,
  DocumentTextIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentIcon,
  EyeIcon,
  PencilSquareIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/solid";

/* ─────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────── */

const TEMPLATE_VARIABLES = {
  Contact: [
    "contact.firstName",
    "contact.lastName",
    "contact.email",
    "contact.phone",
  ],
  Deal: ["deal.dealName", "deal.amount", "deal.stage"],
  Account: ["account.accountName", "account.industry"],
  User: ["user.name", "user.email"],
};

const TEMPLATE_COMPONENTS = ["header", "signature", "footer"];

const TEMPLATE_SNIPPETS = [
  "Looking forward to your response.",
  "Please find the quotation attached.",
  "Let me know if you have any questions.",
  "Happy to schedule a call to discuss.",
];

const AI_PURPOSE_OPTIONS = [
  "",
  "cold outreach",
  "follow up",
  "proposal submission",
  "meeting request",
  "negotiation",
  "deal closing",
  "re-engagement",
  "thank you",
  "custom",
];

/* ─────────────────────────────────────────────────────────
   PREVIEW DATA
───────────────────────────────────────────────────────── */

const previewVariables = {
  contact: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+91 9999999999",
  },
  deal: {
    dealName: "Automation System",
    amount: "₹50,000",
    stage: "NEGOTIATION",
  },
  account: {
    accountName: "ABC Manufacturing",
    industry: "Industrial Automation",
  },
  user: {
    name: "Sales Rep",
    email: "sales@micrologicglobal.com",
  },
};

const previewComponents = {
  header: `<div style="display:flex;align-items:center;gap:12px;padding-bottom:10px;"><img src="/Micro_2026.png" alt="Micrologic" style="height:40px;width:auto;" /><div><div style="font-family:'Georgia',serif;font-size:16px;font-weight:700;color:#1a2e44;line-height:1.2;">Micrologic Integrated Systems</div><div style="font-family:'Georgia',serif;font-size:10px;color:#2d6a9f;letter-spacing:1.5px;text-transform:uppercase;margin-top:1px;">Bangalore</div></div></div><hr style="border:none;border-top:1.5px solid #e0e7ff;margin:4px 0 8px;"/>`,
  signature: `<br/><span style="color:#4f46e5;font-weight:500;">Regards,</span><br/>Sales Rep<br/><span style="color:#6b7280;font-size:12px;">Micrologic Global</span>`,
  footer: `<hr style="border:none;border-top:1px solid #e5e7eb;margin:10px 0;"/><small style="color:#9ca3af;font-size:11px;">Micrologic Integrated Systems Bangalore</small>`,
};

const previewTemplate = (template) => {
  if (!template) return "";
  let html = template;
  html = html.replace(/{{(header|footer|signature)}}/g, (_, key) => previewComponents[key] || "");
  html = html.replace(/{{\s*(.*?)\s*}}/g, (_, key) => {
    const keys = key.split(".");
    let value = previewVariables;
    for (const k of keys) value = value?.[k];
    return value || "";
  });
  return html;
};

/* ─────────────────────────────────────────────────────────
   GROUP STYLES
───────────────────────────────────────────────────────── */

const GROUP_STYLES = {
  Contact: {
    chip: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 hover:border-sky-300",
    dot: "bg-sky-400",
    header: "text-sky-600",
  },
  Deal: {
    chip: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300",
    dot: "bg-amber-400",
    header: "text-amber-600",
  },
  Account: {
    chip: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300",
    dot: "bg-emerald-400",
    header: "text-emerald-600",
  },
  User: {
    chip: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 hover:border-violet-300",
    dot: "bg-violet-400",
    header: "text-violet-600",
  },
};

/* ─────────────────────────────────────────────────────────
   SMALL PRIMITIVES
───────────────────────────────────────────────────────── */

const SectionLabel = ({ children, className = "" }) => (
  <p className={`text-[10px] font-bold text-stone-400 uppercase tracking-[0.15em] mb-2.5 flex items-center gap-2 ${className}`}>
    {children}
  </p>
);

const FieldLabel = ({ children }) => (
  <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
    {children}
  </label>
);

const inputCls =
  "w-full bg-white border border-stone-200 rounded-lg px-3.5 py-2.5 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-violet-500/15 focus:border-violet-400 hover:border-stone-300 transition-all duration-150 shadow-sm";

const Field = ({ label, ...props }) => (
  <div>
    {label && <FieldLabel>{label}</FieldLabel>}
    <input {...props} className={inputCls} />
  </div>
);

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────── */

const EmailTemplateManager = ({ onClose }) => {
  const dispatch = useDispatch();
  const { templates, generatingTemplate } = useSelector((s) => s.email);

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("editor");
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [showAIWizard, setShowAIWizard] = useState(false);
  const [aiPurpose, setAiPurpose] = useState("");
  const [customPurpose, setCustomPurpose] = useState("");
  const [aiTone, setAiTone] = useState("professional");
  const [aiRecipient, setAiRecipient] = useState("client");
  const [aiLength, setAiLength] = useState("medium");
  const [editingTemplateId, setEditingTemplateId] = useState(null);

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  const insertVariable = (variable) => {
    const textarea = document.activeElement;
    if (!textarea || textarea.tagName !== "TEXTAREA") {
      setBody((prev) => prev + ` {{${variable}}} `);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    setBody(body.substring(0, start) + `{{${variable}}}` + body.substring(end));
  };

  const insertComponent = (component) => {
    const textarea = document.activeElement;
    if (!textarea || textarea.tagName !== "TEXTAREA") {
      setBody((prev) => prev + ` {{${component}}} `);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    setBody(body.substring(0, start) + `{{${component}}}` + body.substring(end));
  };

  const insertSnippet = (text) => setBody((prev) => prev + "\n\n" + text);

  const copyTemplate = (template) => {
    setEditingTemplateId(template.id);
    setName(template.name);
    setSubject(template.subject);
    setBody(template.body);
    setActiveTab("editor");
  };

  const cancelEdit = () => {
    setEditingTemplateId(null);
    setName("");
    setSubject("");
    setBody("");
  };

  const addTemplate = async () => {
    if (!name.trim() || !subject.trim() || !body.trim()) return;
    try {
      if (editingTemplateId) {
        await dispatch(updateEmailTemplate({ id: editingTemplateId, data: { name, subject, body } })).unwrap();
      } else {
        await dispatch(createEmailTemplate({ name, subject, body })).unwrap();
      }
      setName(""); setSubject(""); setBody(""); setEditingTemplateId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to save template");
    }
  };

  const generateTemplateWithAI = async () => {
    try {
      if (!aiPurpose) { alert("Please select an email purpose"); return; }
      if (aiPurpose === "custom" && !customPurpose.trim()) { alert("Please enter a custom email purpose"); return; }
      const payload = { purpose: aiPurpose, customPurpose: aiPurpose === "custom" ? customPurpose.trim() : "", tone: aiTone, recipient: aiRecipient, length: aiLength, category: "GENERAL" };
      const result = await dispatch(generateEmailTemplateAI(payload)).unwrap();
      if (result) {
        setName(result.name || `${(aiPurpose || "Email").replace(/\b\w/g, (l) => l.toUpperCase())} Template`);
        setSubject(result.subject || "");
        setBody(result.body || "");
        setActiveTab("editor");
        setShowAIWizard(false);
        setAiPurpose(""); setCustomPurpose(""); setAiTone("professional"); setAiRecipient("client"); setAiLength("medium");
      }
    } catch (err) {
      console.error("AI template generation failed:", err);
      alert("AI failed to generate template");
    }
  };

  const isFormValid = name.trim() && subject.trim() && body.trim();

  useEffect(() => { dispatch(fetchEmailTemplates()); }, [dispatch]);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(10px) scale(0.985); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
        .modal-enter { animation: fadeUp 0.22s cubic-bezier(0.16,1,0.3,1) both; }
        .overlay-enter { animation: fadeIn 0.18s ease both; }
        .template-row { transition: box-shadow 0.15s, border-color 0.15s, background 0.15s; }
        .template-row:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .chip-btn { transition: all 0.12s ease; }
        .chip-btn:active { transform: scale(0.94); }
        .tab-btn { transition: all 0.15s ease; }
        .accordion-content { animation: fadeUp 0.15s ease both; }
        textarea { font-feature-settings: "kern"; }
        .scroll-thin::-webkit-scrollbar { width: 4px; }
        .scroll-thin::-webkit-scrollbar-track { background: transparent; }
        .scroll-thin::-webkit-scrollbar-thumb { background: #e2e0dc; border-radius: 99px; }
      `}</style>

      {/* ── BACKDROP ───────────────────────────────────────── */}
      <div className="overlay-enter fixed inset-0 bg-stone-900/40 backdrop-blur-[3px] flex items-center justify-center z-50 p-3 sm:p-5">

        {/* ── MODAL SHELL ─────────────────────────────────── */}
        <div
          className="modal-enter bg-stone-50 rounded-2xl shadow-2xl shadow-stone-900/15 w-full flex flex-col border border-stone-200/70 overflow-hidden"
          style={{ maxWidth: 820, maxHeight: "94vh" }}
        >

          {/* ═══ HEADER ═══════════════════════════════════ */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 sm:px-7 py-4 bg-white border-b border-stone-100">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-sm shadow-violet-300/40 flex-shrink-0">
                <DocumentTextIcon className="w-[18px] h-[18px] text-white" />
              </div>
              <div>
                <h2 className="text-[15px] font-bold text-stone-800 tracking-tight leading-none">
                  Email Templates
                </h2>
                <p className="text-[11px] text-stone-400 font-medium mt-1 leading-none">
                  Create &amp; manage reusable templates
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors duration-150"
            >
              <XMarkIcon className="w-[18px] h-[18px]" />
            </button>
          </div>

          {/* ═══ SCROLLABLE BODY ══════════════════════════ */}
          <div className="flex-1 overflow-y-auto scroll-thin px-5 sm:px-7 py-6 space-y-6">

            {/* ─── NEW / EDIT TEMPLATE CARD ──────────────── */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">

              {/* Card toolbar */}
              <div className="flex items-center justify-between gap-3 px-5 py-3.5 bg-stone-50 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.14em]">
                    {editingTemplateId ? "Editing Template" : "New Template"}
                  </span>

                  {editingTemplateId && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-[10px] font-semibold text-amber-700">
                      Editing
                    </span>
                  )}

                  <button
                    onClick={() => { if (!generatingTemplate) setShowAIWizard(true); }}
                    disabled={generatingTemplate}
                    className="chip-btn flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 shadow-sm shadow-violet-300/30"
                  >
                    <SparklesIcon className="w-3 h-3" />
                    {generatingTemplate ? "Generating…" : "AI Generate"}
                  </button>
                </div>

                {/* Editor / Preview toggle */}
                <div className="flex items-center bg-stone-100 rounded-lg p-0.5 gap-0.5">
                  {[
                    { key: "editor", Icon: PencilSquareIcon, label: "Editor" },
                    { key: "preview", Icon: EyeIcon, label: "Preview" },
                  ].map(({ key, Icon, label }) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`tab-btn flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold ${
                        activeTab === key
                          ? "bg-white text-violet-700 shadow-sm"
                          : "text-stone-500 hover:text-stone-700"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card body */}
              <div className="p-5 space-y-5">
                {/* Name + Subject row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Template Name"
                    placeholder="e.g. Welcome Email"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Field
                    label="Subject Line"
                    placeholder="e.g. Quotation for {{deal.dealName}}"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                {/* ── EDITOR TAB ── */}
                {activeTab === "editor" && (
                  <div className="space-y-5">
                    {/* Body textarea */}
                    <div>
                      <FieldLabel>Body</FieldLabel>
                      <div className="relative">
                        <textarea
                          rows={7}
                          placeholder="Write your email template here… Use {{variable}} syntax."
                          value={body}
                          onChange={(e) => setBody(e.target.value)}
                          className={`${inputCls} resize-none leading-relaxed font-mono text-[13px] pb-8`}
                        />
                        <span className="absolute bottom-3 right-3.5 text-[10px] text-stone-400 font-mono tabular-nums pointer-events-none select-none">
                          {body.length.toLocaleString()} chars
                        </span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-dashed border-stone-100" />

                    {/* Variables accordion */}
                    <div>
                      <SectionLabel>
                        <span className="w-1 h-1 rounded-full bg-stone-300 inline-block" />
                        Insert Variables
                      </SectionLabel>
                      <div className="space-y-1.5">
                        {Object.entries(TEMPLATE_VARIABLES).map(([group, vars]) => {
                          const s = GROUP_STYLES[group];
                          const open = expandedGroup === group;
                          return (
                            <div key={group} className="rounded-lg border border-stone-150 overflow-hidden" style={{ borderColor: "#e8e6e1" }}>
                              <button
                                type="button"
                                onClick={() => setExpandedGroup(open ? null : group)}
                                className="w-full flex items-center justify-between px-4 py-2.5 text-left bg-white hover:bg-stone-50/80 transition-colors duration-120"
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className={`w-1.5 h-1.5 rounded-full ${s.dot} flex-shrink-0`} />
                                  <span className={`text-xs font-semibold ${s.header}`}>{group}</span>
                                  <span className="text-[10px] text-stone-400 font-medium">
                                    {vars.length} vars
                                  </span>
                                </div>
                                <ChevronDownIcon
                                  className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                                />
                              </button>
                              {open && (
                                <div className="accordion-content flex flex-wrap gap-1.5 px-4 py-3 bg-stone-50/60 border-t border-stone-100">
                                  {vars.map((v) => (
                                    <button
                                      key={v}
                                      type="button"
                                      onClick={() => insertVariable(v)}
                                      className={`chip-btn px-2.5 py-1 text-[11px] rounded-md border font-mono font-medium ${s.chip}`}
                                    >
                                      {`{{${v}}}`}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Components + Snippets in a 2-col grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Components */}
                      <div>
                        <SectionLabel>
                          <span className="w-1 h-1 rounded-full bg-violet-400 inline-block" />
                          Components
                        </SectionLabel>
                        <div className="flex flex-wrap gap-2">
                          {TEMPLATE_COMPONENTS.map((c) => (
                            <button
                              key={c}
                              onClick={() => insertComponent(c)}
                              className="chip-btn flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold bg-white border border-violet-200 text-violet-700 rounded-lg hover:bg-violet-50 hover:border-violet-300 capitalize"
                            >
                              <span className="w-1 h-1 rounded-full bg-violet-400 flex-shrink-0" />
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Snippets */}
                      <div>
                        <SectionLabel>
                          <span className="w-1 h-1 rounded-full bg-stone-300 inline-block" />
                          Quick Snippets
                        </SectionLabel>
                        <div className="flex flex-wrap gap-2">
                          {TEMPLATE_SNIPPETS.map((s) => (
                            <button
                              key={s}
                              onClick={() => insertSnippet(s)}
                              className="chip-btn px-3 py-1.5 text-[11px] font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50/50"
                            >
                              {s.substring(0, 20)}…
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── PREVIEW TAB ── */}
                {activeTab === "preview" && (
                  <div className="rounded-xl border border-stone-200 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 bg-stone-50 border-b border-stone-100">
                      <EyeIcon className="w-3.5 h-3.5 text-violet-500" />
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.14em]">
                        Live Preview
                      </span>
                      <span className="ml-auto text-[10px] text-stone-400 font-medium bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
                        sample data
                      </span>
                    </div>
                    {body ? (
                      <div
                        className="px-6 py-5 text-sm text-stone-700 leading-relaxed min-h-[120px] bg-white"
                        dangerouslySetInnerHTML={{ __html: previewTemplate(body) }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-14 bg-white">
                        <EyeIcon className="w-8 h-8 text-stone-200 mb-3" />
                        <p className="text-sm font-semibold text-stone-400">Nothing to preview yet</p>
                        <p className="text-xs text-stone-300 mt-1">Start writing in the editor to see a live preview</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Save / Update row */}
                <div className="flex items-center justify-end gap-2.5 pt-1">
                  {editingTemplateId && (
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2.5 text-[13px] font-semibold text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 hover:border-stone-300 transition-all duration-150"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button
                    onClick={addTemplate}
                    disabled={!isFormValid}
                    className={`chip-btn flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-150 ${
                      isFormValid
                        ? "bg-violet-600 hover:bg-violet-700 text-white shadow-sm shadow-violet-300/30 hover:shadow-violet-300/50 hover:shadow-md"
                        : "bg-stone-100 text-stone-400 cursor-not-allowed"
                    }`}
                  >
                    <PlusIcon className="w-4 h-4" />
                    {editingTemplateId ? "Update Template" : "Save Template"}
                  </button>
                </div>
              </div>
            </div>

            {/* ─── SAVED TEMPLATES ───────────────────────── */}
            <div>
              {/* Section heading row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.14em]">
                    Saved Templates
                  </h3>
                  {templates.length > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold">
                      {templates.length}
                    </span>
                  )}
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-3">
                <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search templates…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={`${inputCls} pl-10`}
                />
              </div>

              {/* List */}
              <div className="space-y-1.5 max-h-60 overflow-y-auto scroll-thin pr-0.5">
                {templates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 rounded-xl border border-dashed border-stone-200 bg-white">
                    <InboxIcon className="w-8 h-8 text-stone-200 mb-2.5" />
                    <p className="text-sm font-semibold text-stone-400">No templates yet</p>
                    <p className="text-xs text-stone-300 mt-1">Create your first template above</p>
                  </div>
                ) : filteredTemplates.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 rounded-xl border border-dashed border-stone-200 bg-white">
                    <MagnifyingGlassIcon className="w-6 h-6 text-stone-200 mb-2" />
                    <p className="text-sm font-semibold text-stone-400">No results for "{search}"</p>
                  </div>
                ) : (
                  filteredTemplates.map((t) => (
                    <div
                      key={t.id}
                      className="template-row group flex items-center justify-between gap-3 px-4 py-3 bg-white border border-stone-150 rounded-xl hover:border-violet-200 hover:bg-violet-50/20"
                      style={{ borderColor: "#ece9e3" }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center">
                          <DocumentTextIcon className="w-4 h-4 text-stone-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-stone-800 truncate leading-tight">
                            {t.name}
                          </p>
                          <p className="text-[11px] text-stone-400 truncate mt-0.5 leading-tight">
                            {t.subject}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => copyTemplate(t)}
                          className="chip-btn flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-violet-600 hover:text-white hover:border-violet-600"
                        >
                          <ClipboardDocumentIcon className="w-3.5 h-3.5" />
                          Use
                        </button>
                        <button
                          onClick={() => { if (window.confirm("Delete this template?")) dispatch(deleteEmailTemplate(t.id)); }}
                          className="chip-btn px-3 py-1.5 text-[11px] font-semibold text-red-500 border border-red-100 bg-white rounded-lg hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ═══ FOOTER ═══════════════════════════════════ */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 sm:px-7 py-4 bg-white border-t border-stone-100">
            <p className="text-[11px] text-stone-400 hidden sm:block font-medium">
              Templates support{" "}
              <code className="px-1 py-0.5 rounded bg-stone-100 text-stone-500 text-[10px] font-mono">
                {"{{variable}}"}
              </code>{" "}
              syntax
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-stone-200 text-[13px] font-semibold text-stone-600 bg-white hover:bg-stone-50 hover:border-stone-300 hover:text-stone-800 transition-all duration-150"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* ═══ AI WIZARD MODAL ══════════════════════════════ */}
      {showAIWizard && (
        <div className="overlay-enter fixed inset-0 bg-stone-900/50 backdrop-blur-[3px] flex items-center justify-center z-[60] p-4">
          <div className="modal-enter bg-white rounded-2xl shadow-2xl shadow-stone-900/15 w-full max-w-[420px] border border-stone-200 overflow-hidden">

            {/* Wizard header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-sm shadow-violet-300/30 flex-shrink-0">
                  <SparklesIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-stone-800 tracking-tight leading-none">
                    Generate with AI
                  </h3>
                  <p className="text-[11px] text-stone-400 font-medium mt-1 leading-none">
                    Craft a perfect email template instantly
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAIWizard(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors duration-150"
              >
                <XMarkIcon className="w-[18px] h-[18px]" />
              </button>
            </div>

            {/* Wizard fields */}
            <div className="px-6 py-5 space-y-4">
              {/* Purpose */}
              <div>
                <FieldLabel>Email Purpose</FieldLabel>
                <div className="relative">
                  <select
                    value={aiPurpose}
                    onChange={(e) => setAiPurpose(e.target.value)}
                    className={`${inputCls} appearance-none pr-9 cursor-pointer`}
                  >
                    {AI_PURPOSE_OPTIONS.map((p) => (
                      <option key={p} value={p}>
                        {p === "" ? "Select a purpose…" : p.charAt(0).toUpperCase() + p.slice(1)}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                </div>
                {aiPurpose === "custom" && (
                  <input
                    type="text"
                    placeholder="Describe the email purpose…"
                    value={customPurpose}
                    onChange={(e) => setCustomPurpose(e.target.value)}
                    className={`${inputCls} mt-2`}
                  />
                )}
              </div>

              {/* Tone + Recipient */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Tone</FieldLabel>
                  <div className="relative">
                    <select
                      value={aiTone}
                      onChange={(e) => setAiTone(e.target.value)}
                      className={`${inputCls} appearance-none pr-9 cursor-pointer`}
                    >
                      <option value="professional">Professional</option>
                      <option value="friendly">Friendly</option>
                      <option value="persuasive">Persuasive</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <FieldLabel>Recipient</FieldLabel>
                  <div className="relative">
                    <select
                      value={aiRecipient}
                      onChange={(e) => setAiRecipient(e.target.value)}
                      className={`${inputCls} appearance-none pr-9 cursor-pointer`}
                    >
                      <option value="client">Client</option>
                      <option value="hiring manager">Hiring Manager</option>
                      <option value="partner">Partner</option>
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Length segmented control */}
              <div>
                <FieldLabel>Length</FieldLabel>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "short", label: "Short" },
                    { value: "medium", label: "Medium" },
                    { value: "long", label: "Detailed" },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAiLength(value)}
                      className={`chip-btn py-2.5 rounded-lg text-[12px] font-semibold border transition-all duration-150 ${
                        aiLength === value
                          ? "bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-300/30"
                          : "bg-white text-stone-600 border-stone-200 hover:border-violet-300 hover:text-violet-700 hover:bg-violet-50/50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Wizard footer */}
            <div className="flex items-center justify-end gap-2.5 px-6 pb-6">
              <button
                onClick={() => setShowAIWizard(false)}
                className="px-4 py-2.5 text-[13px] font-semibold text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 hover:border-stone-300 transition-all duration-150"
              >
                Cancel
              </button>
              <button
                onClick={generateTemplateWithAI}
                disabled={generatingTemplate || (aiPurpose === "custom" && !customPurpose.trim()) || !aiPurpose}
                className="chip-btn flex items-center gap-1.5 px-5 py-2.5 text-[13px] font-semibold rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-violet-300/30 transition-all duration-150"
              >
                {generatingTemplate ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    Generating…
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-3.5 h-3.5" />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmailTemplateManager;
// // // src/features/quotations/QuotationDetailsSection.jsx

// // export default function QuotationDetailsSection({
// //   form,
// //   updateField,
// //   accounts,
// //   deals,
// //   contacts,
// // }) {
// //   return (
// //     <div className="rounded-2xl border bg-white p-5 space-y-4">
// //       <h2 className="text-base font-semibold text-slate-800">
// //         Quotation Details
// //       </h2>

// //       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

// //         {/* ACCOUNT */}
// //         <select
// //           value={form.accountId}
// //           onChange={(e) => updateField("accountId", e.target.value)}
// //           className="w-full rounded-xl border px-3 py-2 text-sm"
// //         >
// //           <option value="">Select Account</option>
// //           {accounts.map((a) => (
// //             <option key={a.id} value={a.id}>
// //               {a.accountName}
// //             </option>
// //           ))}
// //         </select>

// //         {/* DEAL */}
// //         <select
// //           value={form.dealId}
// //           onChange={(e) => updateField("dealId", e.target.value)}
// //           className="w-full rounded-xl border px-3 py-2 text-sm"
// //         >
// //           <option value="">Select Deal</option>
// //           {deals.map((d) => (
// //             <option key={d.id} value={d.id}>
// //               {d.dealName}
// //             </option>
// //           ))}
// //         </select>

// //         {/* CONTACT MULTI */}
// //         <div className="border rounded-xl p-2 max-h-32 overflow-auto">
// //           {contacts.map((c) => (
// //             <label key={c.id} className="flex gap-2 text-sm">
// //               <input
// //                 type="checkbox"
// //                 checked={form.contactIds.includes(c.id)}
// //                 onChange={() => {
// //                   const exists = form.contactIds.includes(c.id);
// //                   updateField(
// //                     "contactIds",
// //                     exists
// //                       ? form.contactIds.filter((x) => x !== c.id)
// //                       : [...form.contactIds, c.id]
// //                   );
// //                 }}
// //               />
// //               {`${c.firstName || ""} ${c.lastName || ""}`.trim() || c.email}
// //             </label>
// //           ))}
// //         </div>

// //         {/* ISSUE DATE */}
// //         <input
// //           type="date"
// //           value={form.date}
// //           onChange={(e) => updateField("date", e.target.value)}
// //           className="w-full rounded-xl border px-3 py-2 text-sm"
// //         />

// //         {/* VALID UNTIL */}
// //         <input
// //           type="date"
// //           value={form.validUntil}
// //           onChange={(e) => updateField("validUntil", e.target.value)}
// //           className="w-full rounded-xl border px-3 py-2 text-sm"
// //         />
// //       </div>
// //     </div>
// //   );
// // }

// // // src/features/quotations/QuotationDetailsSection.jsx

// // import { useEffect, useMemo, useState } from "react";
// // import {
// //   Building2,
// //   BriefcaseBusiness,
// //   Users,
// //   CalendarDays,
// //   BadgeCheck,
// //   Search,
// //   X,
// //   ChevronsUpDown,
// //   Sparkles,
// // } from "lucide-react";

// // function Field({ label, hint, children, icon: Icon, className = "" }) {
// //   return (
// //     <div className={`space-y-2 ${className}`}>
// //       <div className="flex min-h-[32px] items-center justify-between gap-3">
// //         <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
// //           {Icon ? <Icon className="h-3.5 w-3.5 text-slate-400" /> : null}
// //           {label}
// //         </label>
// //         {hint ? (
// //           <span className="text-[11px] text-slate-400">{hint}</span>
// //         ) : null}
// //       </div>
// //       {children}
// //     </div>
// //   );
// // }

// // function Pill({ children, tone = "slate" }) {
// //   const tones = {
// //     slate: "border-slate-200 bg-slate-50 text-slate-700",
// //     indigo: "border-indigo-100 bg-indigo-50 text-indigo-700",
// //     emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
// //     amber: "border-amber-100 bg-amber-50 text-amber-700",
// //   };

// //   return (
// //     <span
// //       className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${tones[tone] || tones.slate}`}
// //     >
// //       {children}
// //     </span>
// //   );
// // }

// // function InputShell({ children, active = false }) {
// //   return (
// //     <div
// //       className={[
// //         "rounded-2xl border bg-white shadow-sm transition",
// //         active
// //           ? "border-indigo-300 ring-4 ring-indigo-500/10"
// //           : "border-slate-200 hover:border-slate-300",
// //       ].join(" ")}
// //     >
// //       {children}
// //     </div>
// //   );
// // }

// // export default function QuotationDetailsSection({
// //   form,
// //   updateField,
// //   accounts,
// //   deals,
// //   contacts,
// //   onLogIdSearch,
// //   onClearLogLookup,
// // }) {
// //   const [contactSearch, setContactSearch] = useState("");
// //   const [logIdSearch, setLogIdSearch] = useState("");

// //   useEffect(() => {
// //     setContactSearch("");
// //   }, [form.accountId]);

// //   const selectedAccount = useMemo(
// //     () => accounts.find((a) => a.id === form.accountId),
// //     [accounts, form.accountId],
// //   );

// //   const selectedDeal = useMemo(
// //     () => deals.find((d) => d.id === form.dealId),
// //     [deals, form.dealId],
// //   );

// //   const filteredContacts = useMemo(() => {
// //     const q = contactSearch.trim().toLowerCase();
// //     if (!q) return contacts;

// //     return contacts.filter((c) => {
// //       const fullName = `${c.firstName || ""} ${c.lastName || ""}`
// //         .trim()
// //         .toLowerCase();
// //       const email = (c.email || "").toLowerCase();
// //       return fullName.includes(q) || email.includes(q);
// //     });
// //   }, [contacts, contactSearch]);

// //   const selectedContactsCount = form.contactIds?.length || 0;

// //   return (
// //     <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
// //       <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-indigo-50/40 px-5 py-4 sm:px-6">
// //         {/* <div className="flex items-start justify-between gap-2">
// //           <div>
// //             <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
// //               <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
// //               Quotation Details
// //             </div>
// //             <h2 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
// //               Header information
// //             </h2>
// //           </div>

// //           <div className="hidden sm:flex flex-col items-end gap-2">
// //             <Pill tone={form.accountId ? "emerald" : "amber"}>
// //               {form.accountId ? "Account selected" : "Account pending"}
// //             </Pill>
// //             <Pill tone={form.dealId ? "indigo" : "slate"}>
// //               {form.dealId ? "Deal selected" : "Deal pending"}
// //             </Pill>
// //           </div>
// //         </div> */}
// //       </div>

// //       <div className="space-y-4 p-4 sm:p-4">
// //         <div className="mb-3">
// //           <Field
// //             label="Log ID Search"
// //             hint="Auto fetch account, deal & contacts"
// //             icon={Search}
// //           >
// //             <InputShell active={Boolean(logIdSearch)}>
// //               <div className="flex flex-col gap-2 p-2 sm:flex-row">
// //                 <input
// //                   type="text"
// //                   value={logIdSearch}
// //                   onChange={(e) => setLogIdSearch(e.target.value.toUpperCase())}
// //                   onKeyDown={(e) => {
// //                     if (e.key === "Enter") {
// //                       onLogIdSearch(logIdSearch);
// //                     }
// //                   }}
// //                   placeholder="Enter Deal Log ID"
// //                   className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/10"
// //                 />

// //                 <button
// //                   type="button"
// //                   onClick={() => onLogIdSearch(logIdSearch)}
// //                   className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:w-auto w-full"
// //                 >
// //                   Search
// //                 </button>
// //               </div>
// //               {selectedDeal?.dealLogId && (
// //                 <div className="flex items-center justify-between px-3 pb-3">
// //                   <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-bold tracking-[0.08em] text-indigo-700">
// //                     Active Log ID: {selectedDeal.dealLogId}
// //                   </span>

// //                   <button
// //                     type="button"
// //                     onClick={() => {
// //                       setLogIdSearch("");
// //                       onClearLogLookup();
// //                     }}
// //                     className="text-xs font-medium text-rose-600 hover:text-rose-700"
// //                   >
// //                     Clear
// //                   </button>
// //                 </div>
// //               )}
// //             </InputShell>
// //           </Field>
// //         </div>
// //         <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.2fr_1.2fr_0.8fr] items-start">
// //           {/* ACCOUNT */}
// //           <Field
// //             label="Account"
// //             hint={
// //               selectedDeal?.dealLogId
// //                 ? "Locked by Log ID"
// //                 : selectedAccount?.accountName
// //                   ? "Selected company"
// //                   : "Required"
// //             }
// //             icon={Building2}
// //           >
// //             <InputShell active={Boolean(form.accountId)}>
// //               {selectedDeal?.dealLogId ? (
// //                 <div className="flex h-11 items-center justify-between rounded-xl bg-slate-50 px-3 text-sm text-slate-900">
// //                   <span className="truncate">
// //                     {selectedAccount?.accountName || form.accountName || "—"}
// //                   </span>
// //                   <span className="ml-3 rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-indigo-700">
// //                     Fixed
// //                   </span>
// //                 </div>
// //               ) : (
// //                 <div className="relative">
// //                   <select
// //                     value={form.accountId}
// //                     onChange={(e) => updateField("accountId", e.target.value)}
// //                     className="w-full appearance-none rounded-xl bg-transparent px-3 py-2 pr-10 text-sm text-slate-900 outline-none"
// //                   >
// //                     <option value="">Select Account</option>
// //                     {accounts.map((a) => (
// //                       <option key={a.id} value={a.id}>
// //                         {a.accountName}
// //                       </option>
// //                     ))}
// //                   </select>
// //                   <ChevronsUpDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
// //                 </div>
// //               )}
// //             </InputShell>
// //           </Field>
// //           {/* DEAL */}
// //           <Field
// //             label={
// //               <div className="flex items-center gap-2 leading-none">
// //                 <span className="flex items-center">Project</span>

// //                 {selectedDeal?.dealLogId && (
// //                   <span className="inline-flex h-7 items-center rounded-full border border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50 px-3 text-[13px] font-extrabold tracking-[0.08em] text-indigo-700 shadow-sm ring-1 ring-indigo-100 whitespace-nowrap">
// //                     {selectedDeal.dealLogId}
// //                   </span>
// //                 )}
// //               </div>
// //             }
// //             hint={
// //               form.accountId
// //                 ? `${deals.length} available`
// //                 : "Select account first"
// //             }
// //             icon={BriefcaseBusiness}
// //           >
// //             <InputShell active={Boolean(form.dealId)}>
// //               <div className="relative">
// //                 <select
// //                   value={form.dealId}
// //                   onChange={(e) => updateField("dealId", e.target.value)}
// //                   disabled={!form.accountId || Boolean(selectedDeal?.dealLogId)}
// //                   className="w-full appearance-none rounded-xl bg-transparent px-3 py-2 pr-10 text-sm text-slate-900 outline-none disabled:cursor-not-allowed disabled:text-slate-500"
// //                 >
// //                   {!selectedDeal?.dealLogId ? (
// //                     <>
// //                       <option value="">
// //                         {form.accountId
// //                           ? "Select Deal"
// //                           : "Select account first"}
// //                       </option>

// //                       {deals.map((d) => (
// //                         <option key={d.id} value={d.id}>
// //                           {d.dealName}
// //                         </option>
// //                       ))}
// //                     </>
// //                   ) : (
// //                     <option value={form.dealId}>
// //                       {selectedDeal?.dealName}
// //                     </option>
// //                   )}
// //                 </select>
// //                 <ChevronsUpDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
// //               </div>
// //             </InputShell>
// //           </Field>

// //           {/* CONTACTS */}
// //           <Field
// //             label="Contacts"
// //             hint={
// //               form.accountId
// //                 ? `${selectedContactsCount} selected`
// //                 : "Select account first"
// //             }
// //             icon={Users}
// //           >
// //             <InputShell active={selectedContactsCount > 0}>
// //               <div className="px-3 py-2">
// //                 {/* SEARCH */}
// //                 <div className="relative mb-2">
// //                   <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

// //                   <input
// //                     type="text"
// //                     value={contactSearch}
// //                     onChange={(e) => setContactSearch(e.target.value)}
// //                     placeholder="Search contacts"
// //                     disabled={!form.accountId}
// //                     className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 py-2 text-xs outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-slate-100"
// //                   />
// //                 </div>

// //                 {/* CONTACT LIST */}
// //                 <div className="max-h-[90px] overflow-y-auto space-y-1">
// //                   {!form.accountId ? (
// //                     <div className="text-xs text-slate-400">
// //                       Select account first
// //                     </div>
// //                   ) : filteredContacts.length ? (
// //                     filteredContacts.map((c) => {
// //                       const id = c.id;
// //                       const checked = (form.contactIds || []).some(
// //                         (contactId) => String(contactId) === String(id),
// //                       );

// //                       const displayName =
// //                         `${c.firstName || ""} ${c.lastName || ""}`.trim() ||
// //                         c.email ||
// //                         "Unnamed";

// //                       return (
// //                         <label
// //                           key={id}
// //                           className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition ${
// //                             checked
// //                               ? "bg-indigo-50 text-indigo-700"
// //                               : "hover:bg-slate-50"
// //                           }`}
// //                         >
// //                           <input
// //                             type="checkbox"
// //                             checked={checked}
// //                             onChange={() => {
// //                               const exists = (form.contactIds || []).some(
// //                                 (contactId) => String(contactId) === String(id),
// //                               );

// //                               updateField(
// //                                 "contactIds",
// //                                 exists
// //                                   ? form.contactIds.filter((x) => x !== id)
// //                                   : [...form.contactIds, id],
// //                               );
// //                             }}
// //                             className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600"
// //                           />

// //                           <span className="truncate text-xs font-medium">
// //                             {displayName}
// //                           </span>
// //                         </label>
// //                       );
// //                     })
// //                   ) : (
// //                     <div className="text-xs text-slate-400">
// //                       No contacts found
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </InputShell>
// //           </Field>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // src/features/quotations/QuotationDetailsSection.jsx

// import { useEffect, useMemo, useState } from "react";
// import {
//   Building2,
//   BriefcaseBusiness,
//   Users,
//   Search,
//   ChevronsUpDown,
// } from "lucide-react";

// function Field({ label, hint, children, icon: Icon, className = "" }) {
//   return (
//     <div className={`space-y-1 ${className}`}>
//       <div className="flex min-h-[18px] items-center justify-between gap-2">
//         <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
//           {Icon ? <Icon className="h-3.5 w-3.5 text-slate-400" /> : null}
//           {label}
//         </label>
//         {hint ? (
//           <span className="text-[10px] text-slate-400">{hint}</span>
//         ) : null}
//       </div>
//       {children}
//     </div>
//   );
// }

// function InputShell({ children, active = false }) {
//   return (
//     <div
//       className={[
//         "rounded-xl border bg-white shadow-sm transition",
//         active
//           ? "border-indigo-300 ring-2 ring-indigo-500/10"
//           : "border-slate-200 hover:border-slate-300",
//       ].join(" ")}
//     >
//       {children}
//     </div>
//   );
// }

// export default function QuotationDetailsSection({
//   form,
//   updateField,
//   accounts,
//   deals,
//   contacts,
//   onLogIdSearch,
//   onClearLogLookup,
// }) {
//   const [contactSearch, setContactSearch] = useState("");
//   const [logIdSearch, setLogIdSearch] = useState("");

//   useEffect(() => {
//     setContactSearch("");
//   }, [form.accountId]);

//   const selectedAccount = useMemo(
//     () => accounts.find((a) => String(a.id) === String(form.accountId)),
//     [accounts, form.accountId],
//   );

//   const selectedDeal = useMemo(
//     () => deals.find((d) => String(d.id) === String(form.dealId)),
//     [deals, form.dealId],
//   );

//   const filteredContacts = useMemo(() => {
//     const q = contactSearch.trim().toLowerCase();
//     if (!q) return contacts;

//     return contacts.filter((c) => {
//       const fullName = `${c.firstName || ""} ${c.lastName || ""}`
//         .trim()
//         .toLowerCase();
//       const email = (c.email || "").toLowerCase();
//       return fullName.includes(q) || email.includes(q);
//     });
//   }, [contacts, contactSearch]);

//   const selectedContactsCount = form.contactIds?.length || 0;
//   const lockSelection = Boolean(selectedDeal?.dealLogId);

//   return (
//     <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
//       <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-indigo-50/20 px-3 py-2" />

//       <div className="space-y-2 p-2.5">
//         <Field
//           label="Log ID Search"
//           hint="Auto fetch account, deal & contacts"
//           icon={Search}
//         >
//           <InputShell active={Boolean(logIdSearch)}>
//             <div className="flex flex-col gap-1.5 p-1.5 sm:flex-row">
//               <input
//                 type="text"
//                 value={logIdSearch}
//                 onChange={(e) => setLogIdSearch(e.target.value.toUpperCase())}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") onLogIdSearch?.(logIdSearch);
//                 }}
//                 placeholder="Enter Deal Log ID"
//                 className="h-8 flex-1 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/10"
//               />

//               <button
//                 type="button"
//                 onClick={() => onLogIdSearch?.(logIdSearch)}
//                 className="inline-flex h-8 items-center justify-center rounded-md bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 sm:w-auto w-full"
//               >
//                 Search
//               </button>
//             </div>

//             {selectedDeal?.dealLogId && (
//               <div className="flex items-center justify-between px-2 pb-2">
//                 <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold tracking-[0.08em] text-indigo-700">
//                   Active Log ID: {selectedDeal.dealLogId}
//                 </span>

//                 <button
//                   type="button"
//                   onClick={() => {
//                     setLogIdSearch("");
//                     onClearLogLookup?.();
//                   }}
//                   className="text-xs font-medium text-rose-600 hover:text-rose-700"
//                 >
//                   Clear
//                 </button>
//               </div>
//             )}
//           </InputShell>
//         </Field>

//         <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-[1fr_1fr_0.95fr] items-start">
//           {/* ACCOUNT */}
//           <Field
//             label="Account"
//             hint={form.accountId ? "Loaded" : "Search Log ID"}
//             icon={Building2}
//           >
//             <InputShell active={Boolean(form.accountId)}>
//               <div
//                 className={`flex h-14 items-center gap-3 rounded-xl px-3 ${
//                   form.accountId
//                     ? "bg-slate-50 text-slate-700"
//                     : "bg-amber-50/70 text-amber-700"
//                 }`}
//               >
//                 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/90 shadow-sm">
//                   <Building2 className="h-4 w-4 text-indigo-600" />
//                 </div>

//                 <div className="min-w-0 flex-1">
//                   <div className="truncate text-sm font-semibold text-slate-900">
//                     {form.accountId
//                       ? selectedAccount?.accountName ||
//                         form.accountName ||
//                         "No account selected"
//                       : "Search Log ID to auto load account"}
//                   </div>
//                 </div>
//               </div>
//             </InputShell>
//           </Field>

//           {/* DEAL */}
//           <Field
//             label="Project"
//             hint={
//               form.accountId
//                 ? `${deals.length} available`
//                 : "Select account first"
//             }
//             icon={BriefcaseBusiness}
//           >
//             <InputShell active={Boolean(form.dealId)}>
//               {lockSelection ? (
//                 <div className="flex h-14 items-center gap-3 rounded-xl bg-slate-50 px-3 text-slate-900">
//                   <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/90 shadow-sm">
//                     <BriefcaseBusiness className="h-4 w-4 text-indigo-600" />
//                   </div>

//                   <div className="min-w-0 flex-1">
//                     <div className="truncate text-sm font-semibold text-slate-900">
//                       {selectedDeal?.dealName || "—"}
//                     </div>
//                   </div>

//                   <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-700">
//                     Fixed
//                   </span>
//                 </div>
//               ) : (
//                 <div className="relative">
//                   <select
//                     value={form.dealId}
//                     onChange={(e) => updateField("dealId", e.target.value)}
//                     disabled={!form.accountId}
//                     className="h-14 w-full appearance-none rounded-xl bg-transparent px-3 pr-9 text-sm text-slate-900 outline-none disabled:cursor-not-allowed disabled:text-slate-500"
//                   >
//                     <option value="">
//                       {form.accountId ? "Select Deal" : "Select account first"}
//                     </option>
//                     {deals.map((d) => (
//                       <option key={d.id} value={d.id}>
//                         {d.dealName}
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronsUpDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//                 </div>
//               )}
//             </InputShell>
//           </Field>

//           {/* CONTACTS */}
//           <Field
//             label="Contacts"
//             hint={
//               form.accountId
//                 ? `${selectedContactsCount} selected`
//                 : "Select account first"
//             }
//             icon={Users}
//           >
//             <InputShell active={selectedContactsCount > 0}>
//               <div className="p-2.5">
//                 <div className="relative mb-2">
//                   <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
//                   <input
//                     type="text"
//                     value={contactSearch}
//                     onChange={(e) => setContactSearch(e.target.value)}
//                     placeholder="Search contacts"
//                     disabled={!form.accountId}
//                     className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-8 pr-3 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-slate-100"
//                   />
//                 </div>

//                 <div className="max-h-[72px] overflow-y-auto space-y-1">
//                   {!form.accountId ? (
//                     <div className="text-sm text-slate-400">
//                       Select account first
//                     </div>
//                   ) : filteredContacts.length ? (
//                     filteredContacts.map((c) => {
//                       const id = c.id;
//                       const checked = (form.contactIds || []).some(
//                         (contactId) => String(contactId) === String(id),
//                       );

//                       const displayName =
//                         `${c.firstName || ""} ${c.lastName || ""}`.trim() ||
//                         c.email ||
//                         "Unnamed";

//                       return (
//                         <label
//                           key={id}
//                           className={`flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 transition ${
//                             checked
//                               ? "bg-indigo-50 text-indigo-700"
//                               : "hover:bg-slate-50"
//                           }`}
//                         >
//                           <input
//                             type="checkbox"
//                             checked={checked}
//                             onChange={() => {
//                               const exists = (form.contactIds || []).some(
//                                 (contactId) => String(contactId) === String(id),
//                               );

//                               updateField(
//                                 "contactIds",
//                                 exists
//                                   ? form.contactIds.filter(
//                                       (x) => String(x) !== String(id),
//                                     )
//                                   : [...(form.contactIds || []), id],
//                               );
//                             }}
//                             className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600"
//                           />

//                           <span className="truncate text-sm font-medium">
//                             {displayName}
//                           </span>
//                         </label>
//                       );
//                     })
//                   ) : (
//                     <div className="text-sm text-slate-400">
//                       No contacts found
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </InputShell>
//           </Field>
//         </div>
//       </div>
//     </div>
//   );
// }



// src/features/quotations/QuotationDetailsSection.jsx

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  BriefcaseBusiness,
  Users,
  Search,
  ChevronsUpDown,
  Trash2,
} from "lucide-react";

function Field({ label, hint, children, icon: Icon, className = "" }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex min-h-[20px] items-center justify-between gap-2 px-0.5">
        <label className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-slate-500">
          {Icon ? <Icon className="h-4 w-4 text-slate-400" /> : null}
          {label}
        </label>
        {hint ? (
          <span className="text-[11px] font-medium text-slate-400">{hint}</span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function InputShell({ children, active = false }) {
  return (
    <div
      className={[
        "rounded-xl border bg-white shadow-sm transition",
        active
          ? "border-indigo-300 ring-2 ring-indigo-500/10"
          : "border-slate-200 hover:border-slate-300",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export default function QuotationDetailsSection({
  form,
  updateField,
  accounts,
  deals,
  contacts,
  onLogIdSearch,
  onClearLogLookup,
  isEdit = false,
}) {
  const [contactSearch, setContactSearch] = useState("");
  const [logIdSearch, setLogIdSearch] = useState("");

  const selectedAccount = useMemo(
    () => accounts.find((a) => String(a.id) === String(form.accountId)),
    [accounts, form.accountId],
  );

  const selectedDeal = useMemo(
    () => deals.find((d) => String(d.id) === String(form.dealId)),
    [deals, form.dealId],
  );

  useEffect(() => {
    setContactSearch("");
  }, [form.accountId]);

  useEffect(() => {
    // Only initialize logIdSearch if it's currently empty and we have a valid ID from the form/deal
    const activeLogId = form.logId || selectedDeal?.dealLogId;
    if (activeLogId && !logIdSearch) {
      setLogIdSearch(activeLogId);
    }
  }, [form.logId, selectedDeal?.dealLogId]);

  // Sync logIdSearch if form.logId is explicitly cleared
  useEffect(() => {
    if (!form.logId && !selectedDeal?.dealLogId) {
      setLogIdSearch("");
    }
  }, [form.logId, selectedDeal?.dealLogId]);

  const filteredContacts = useMemo(() => {
    const q = contactSearch.trim().toLowerCase();
    if (!q) return contacts;

    return contacts.filter((c) => {
      const fullName = `${c.firstName || ""} ${c.lastName || ""}`
        .trim()
        .toLowerCase();
      const email = (c.email || "").toLowerCase();
      return fullName.includes(q) || email.includes(q);
    });
  }, [contacts, contactSearch]);

  const selectedContactsCount = form.contactIds?.length || 0;
  const lockSelection = Boolean(selectedDeal?.dealLogId);

  const selectedContactNames = useMemo(() => {
    if (!form.contactIds?.length) return "Pending Log ID";
    
    // 🔥 Improved logic to find names even if 'contacts' list is different
    const names = (form.contactIds || []).map(id => {
      const found = contacts.find(c => String(c.id) === String(id));
      if (found) return `${found.firstName || ""} ${found.lastName || ""}`.trim() || found.email;
      return null;
    }).filter(Boolean);

    if (names.length === 0) return `${form.contactIds.length} contact(s) selected`;
    return names.join(", ");
  }, [contacts, form.contactIds]);

  return (
    <div className="overflow-visible rounded-2xl border border-slate-200/60 bg-white/50 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col gap-3 p-3 lg:flex-row lg:items-center">

        {/* LOG ID SEARCH - COMPACT */}
        <div className="flex-none w-full lg:w-[280px]">
          <div className="relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            </div>
            <input
              type="text"
              value={logIdSearch}
              onChange={(e) => setLogIdSearch(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isEdit) onLogIdSearch?.(logIdSearch);
              }}
              readOnly={isEdit}
              placeholder={isEdit ? "Locked Log ID" : "Log ID (e.g. FY2627.1022)"}
              className={`h-11 w-full rounded-xl border border-slate-200 pl-10 pr-20 text-[13px] font-bold tracking-wide outline-none transition-all ${
                isEdit
                  ? "bg-slate-50 text-slate-500 cursor-not-allowed"
                  : "bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 placeholder:text-slate-400 placeholder:font-normal"
              }`}
            />
            {!isEdit && (
              <div className="absolute right-1.5 top-1.5 bottom-1.5 flex items-center gap-1">
                {form.logId && (
                  <button
                    type="button"
                    onClick={() => {
                      setLogIdSearch("");
                      onClearLogLookup?.();
                    }}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors shadow-sm"
                    title="Clear Log ID"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onLogIdSearch?.(logIdSearch)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-[11px] font-black uppercase tracking-wider text-white transition-all hover:bg-slate-800 active:scale-95 shadow-sm"
                >
                  Search
                </button>
              </div>
            )}
          </div>
        </div>

        {/* VERTICAL DIVIDER (DESKTOP) */}
        <div className="hidden lg:block w-px h-8 bg-slate-200/60 mx-1" />

        <div className="flex-1 flex flex-col sm:flex-row items-center gap-2">
          {/* ACCOUNT SELECTION */}
          <div className={`relative flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all ${
            form.accountId ? "bg-transparent border-slate-200/60" : "bg-transparent border-slate-100/40 border-dashed"
          } min-w-0 flex-1 border shadow-sm group`}>
            <Building2 className={`h-3.5 w-3.5 shrink-0 ${form.accountId ? "text-indigo-500" : "text-slate-300"}`} />
            <div className="flex flex-col min-w-0 w-full">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 leading-none mb-1">Account</span>
                <span className={`text-[12px] font-bold truncate ${form.accountId ? "text-slate-900" : "text-slate-300 italic font-normal"}`}>
                  {form.accountId ? (selectedAccount?.accountName || form.accountName) : "Search Log ID"}
                </span>
            </div>
          </div>

          {/* PROJECT SELECTION */}
          <div className={`relative flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all ${
            form.dealId ? "bg-transparent border-slate-200/60" : "bg-transparent border-slate-100/40 border-dashed"
          } min-w-0 flex-1 border shadow-sm group`}>
            <BriefcaseBusiness className={`h-3.5 w-3.5 shrink-0 ${form.dealId ? "text-emerald-500" : "text-slate-300"}`} />
            <div className="flex flex-col min-w-0 w-full">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 leading-none mb-1">Project</span>
                <span className={`text-[12px] font-bold truncate ${form.dealId ? "text-slate-900" : "text-slate-300 italic font-normal"}`}>
                  {form.dealId ? (selectedDeal?.dealName || "—") : "Pending"}
                </span>
            </div>
          </div>

          <div className={`flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all ${
            selectedContactsCount > 0 ? "bg-transparent border-slate-200/60" : "bg-transparent border-slate-100/40 border-dashed"
          } min-w-0 flex-1 border shadow-sm`}>
            <Users className={`h-3.5 w-3.5 shrink-0 ${selectedContactsCount > 0 ? "text-amber-500" : "text-slate-300"}`} />
            <div className="flex flex-col min-w-0 w-full">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 leading-none mb-1">Contacts ({selectedContactsCount})</span>
              <div className={`text-[12px] font-bold truncate ${selectedContactsCount > 0 ? "text-indigo-600" : "text-slate-300 italic font-normal"}`}>
                {selectedContactNames}
              </div>
            </div>
          </div>
        </div>

        {/* CLEAR BUTTON */}
        {!isEdit && selectedDeal?.dealLogId && (
          <button
            type="button"
            onClick={() => {
              setLogIdSearch("");
              onClearLogLookup?.();
            }}
            className="flex items-center justify-center h-11 w-11 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors shadow-sm"
            title="Reset All"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* NEW: Metadata & References Row */}
      <div className="border-t border-slate-100/60 p-3 bg-slate-50/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ref Documents */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1.5">
              Ref Documents
            </label>
            <input 
              type="text"
              value={form.refDocuments || ""}
              onChange={(e) => updateField("refDocuments", e.target.value)}
              placeholder="Enter reference documents (e.g. RFQ No, Email dated...)"
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 placeholder:font-normal placeholder:text-slate-300"
            />
          </div>

          {/* Tech Prop Ref */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1 flex items-center gap-1.5">
              Tech Prop Ref
            </label>
            <input 
              type="text"
              value={form.techPropRef || ""}
              onChange={(e) => updateField("techPropRef", e.target.value)}
              placeholder="Enter technical proposal reference number..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none transition-all focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 placeholder:font-normal placeholder:text-slate-300"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
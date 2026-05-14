// // CRM-Frontend\src\features\email\components\EmailLogs.jsx
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchEmailLogs } from "../emailSlice";
// import {
//   XMarkIcon,
//   EnvelopeIcon,
// } from "@heroicons/react/24/outline";

// const EmailLogs = ({ dealId, onClose }) => {
//   const dispatch = useDispatch();

//   const { logs } = useSelector((s) => s.email);

//   useEffect(() => {
//     dispatch(fetchEmailLogs(dealId));
//   }, [dispatch, dealId]);

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 space-y-4">

//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <h2 className="text-lg font-semibold">
//             Email History
//           </h2>

//           <button onClick={onClose}>
//             <XMarkIcon className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         {/* Logs */}
//         <div className="space-y-3 max-h-96 overflow-y-auto">

//           {logs?.length === 0 && (
//             <p className="text-sm text-gray-400">
//               No emails sent yet.
//             </p>
//           )}

//           {logs?.map((log) => (
//             <div
//               key={log.id}
//               className="border rounded-xl p-4 flex gap-3"
//             >
//               <EnvelopeIcon className="w-5 h-5 text-gray-400 mt-1" />

//               <div>
//                 <p className="font-medium">{log.subject}</p>

//                 <p className="text-xs text-gray-500">
//                   To: {log.to}
//                 </p>

//                 <p className="text-xs text-gray-400">
//                   {new Date(log.createdAt).toLocaleString()}
//                 </p>
//               </div>
//             </div>
//           ))}

//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmailLogs;

// ========================================================================================
// CRM-Frontend\src\features\email\components\EmailLogs.jsx
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchEmailLogs, deleteEmailLog } from "../emailSlice";
// import {
//   XMarkIcon,
//   EnvelopeIcon,
//   InboxIcon,
//   ClockIcon,
//   TrashIcon,
// } from "@heroicons/react/24/outline";

// const EmailLogs = ({ dealId, onClose }) => {
//   const dispatch = useDispatch();

//   const { logs } = useSelector((s) => s.email);

//   useEffect(() => {
//     if (dealId) {
//       dispatch(fetchEmailLogs({ dealId }));
//     }
//   }, [dispatch, dealId]);

//   const handleDelete = (id) => {
//     if (!window.confirm("Delete this email from history?")) return;

//     dispatch(deleteEmailLog(id));
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out]">
//         {/* Header */}
//         <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
//           <div className="flex items-center gap-3">
//             <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100">
//               <ClockIcon className="w-5 h-5 text-blue-600" />
//             </div>
//             <div>
//               <h2 className="text-lg font-semibold text-gray-900">
//                 Email History
//               </h2>
//               <p className="text-xs text-gray-500 mt-0.5">
//                 View all sent emails for this deal
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={onClose}
//             className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white/80 transition-colors duration-150"
//           >
//             <XMarkIcon className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Logs */}
//         <div className="px-6 py-5">
//           <div className="space-y-3 max-h-96 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
//             {logs?.length === 0 && (
//               <div className="flex flex-col items-center justify-center py-12 text-center">
//                 <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-4">
//                   <InboxIcon className="w-7 h-7 text-gray-400" />
//                 </div>
//                 <p className="text-sm font-medium text-gray-500">
//                   No emails sent yet
//                 </p>
//                 <p className="text-xs text-gray-400 mt-1">
//                   Emails you send for this deal will appear here
//                 </p>
//               </div>
//             )}

//             {logs?.map((log, index) => (
//               <div
//                 key={log.id || index}
//                 className="border border-gray-200 rounded-xl p-4 flex gap-4 bg-white hover:border-blue-200 hover:shadow-sm transition-all duration-150 group"
//               >
//                 <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-500 shrink-0 mt-0.5 group-hover:bg-blue-100 transition-colors duration-150">
//                   <EnvelopeIcon className="w-4.5 h-4.5" />
//                 </div>

//                 <div className="min-w-0 flex-1">
//                   <div className="flex items-start justify-between gap-3">
//                     <p className="font-semibold text-sm text-gray-900 truncate">
//                       {log.subject}
//                     </p>
//                     <div className="flex items-center gap-2 shrink-0">
//                       <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700 border border-green-100">
//                         Sent
//                       </span>

//                       <button
//                         onClick={() => handleDelete(log.id)}
//                         className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
//                         title="Delete email"
//                       >
//                         <TrashIcon className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>

//                   <p className="text-xs text-gray-500 mt-1 truncate">
//                     To: {log.toEmail}
//                   </p>

//                   <div className="flex items-center gap-1.5 mt-2">
//                     <ClockIcon className="w-3.5 h-3.5 text-gray-400" />
//                     <p className="text-[11px] text-gray-400">
//                       {log.createdAt
//                         ? new Date(log.createdAt).toLocaleString()
//                         : "-"}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
//           <p className="text-xs text-gray-400">
//             {logs?.length || 0} {logs?.length === 1 ? "email" : "emails"} total
//           </p>
//           <button
//             onClick={onClose}
//             className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all duration-150"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EmailLogs;

// ==================================================================================================================

// CRM-Frontend\src\features\email\components\EmailLogs.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmailLogs, deleteEmailLog } from "../emailSlice";
import {
  XMarkIcon,
  EnvelopeIcon,
  InboxIcon,
  ClockIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const EmailLogs = ({ dealId, onClose }) => {
  const dispatch = useDispatch();

  const { logs } = useSelector((s) => s.email);
  const { user: currentUser } = useSelector((s) => s.auth);

  useEffect(() => {
    if (dealId) {
      dispatch(fetchEmailLogs({ dealId }));
    }
  }, [dispatch, dealId]);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this email from history?")) return;

    dispatch(deleteEmailLog(id));
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-0 sm:p-6">
      <div className="bg-white w-full sm:max-w-xl sm:rounded-3xl shadow-2xl shadow-slate-200/80 overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[80vh] rounded-t-3xl">
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-slate-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100">
              <ClockIcon className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-slate-800 tracking-tight leading-tight">
                Email History
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium tracking-wide uppercase">
                {logs?.length || 0}{" "}
                {logs?.length === 1 ? "message" : "messages"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:scale-95 transition-all duration-150"
          >
            <XMarkIcon className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Logs */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-2.5 overscroll-contain">
          {logs?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 mb-4">
                <InboxIcon className="w-7 h-7 text-slate-300" />
              </div>
              <p className="text-sm font-semibold text-slate-500">
                No emails yet
              </p>
              <p className="text-xs text-slate-400 mt-1.5 max-w-[200px] leading-relaxed">
                Emails you send for this deal will appear here
              </p>
            </div>
          )}

          {logs?.map((log, index) => (
            <div
              key={log.id || index}
              className="group flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-white hover:border-blue-100 hover:bg-blue-50/30 hover:shadow-sm transition-all duration-200"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 shrink-0 group-hover:bg-blue-50 group-hover:border-blue-100 group-hover:text-blue-400 transition-all duration-200">
                <EnvelopeIcon className="w-4.5 h-4.5" />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-800 truncate leading-tight">
                    {log.subject}
                  </p>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="inline-flex items-center rounded-lg bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 tracking-wide uppercase">
                      Sent
                    </span>
                    {currentUser?.role !== "SALES_REP" && (
                      <button
                        onClick={() => handleDelete(log.id)}
                        className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 active:scale-95 transition-all duration-150"
                        title="Delete email"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-1 truncate font-medium">
                  To: {log.toEmail}
                </p>

                <div className="flex items-center gap-1.5 mt-2">
                  <ClockIcon className="w-3 h-3 text-slate-300" />
                  <p className="text-[10px] text-slate-400 font-medium">
                    {log.createdAt
                      ? new Date(log.createdAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-100 bg-slate-50/60">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 active:scale-[0.97] transition-all duration-150 shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailLogs;

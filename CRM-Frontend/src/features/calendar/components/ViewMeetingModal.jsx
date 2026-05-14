// // src/features/calendar/components/ViewMeetingModal.jsx

// import { CalendarDays, Clock, Video, Users, Briefcase } from "lucide-react";
// import { useDispatch } from "react-redux";
// import { deleteMeeting } from "../calendarSlice";

// export default function ViewMeetingModal({ meeting, onClose, onEdit }) {
//   const dispatch = useDispatch();

//   if (!meeting) return null;

//   const start = new Date(meeting.start);
//   const end = new Date(meeting.end);

//   const handleDelete = () => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to cancel this meeting?",
//     );

//     if (!confirmDelete) return;

//     dispatch(deleteMeeting(meeting.id));
//     onClose();
//   };

//   const handleEdit = () => {
//     onEdit(meeting); // 🔥 switches to edit mode
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
//         {/* HEADER */}
//         <div className="flex justify-between items-start mb-4">
//           <div>
//             <h2 className="text-xl font-semibold text-gray-800">
//               {meeting.title}
//             </h2>

//             <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
//               <span className="flex items-center gap-1">
//                 <CalendarDays size={14} />
//                 {isNaN(start) ? "Invalid Date" : start.toLocaleDateString()}
//               </span>

//               <span className="flex items-center gap-1">
//                 <Clock size={14} />
//                 {isNaN(start)
//                   ? "--"
//                   : `${start.toLocaleTimeString()} - ${end.toLocaleTimeString()}`}
//               </span>
//             </div>
//           </div>

//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 text-lg"
//           >
//             ✕
//           </button>
//         </div>

//         {/* DESCRIPTION */}
//         {meeting.description && (
//           <p className="text-gray-700 mb-4">{meeting.description}</p>
//         )}

//         {/* CRM CONTEXT */}
//         <div className="space-y-2 text-sm text-gray-700">
//           {meeting.account && (
//             <div className="flex items-center gap-2">
//               <Briefcase size={14} />
//               <span>
//                 <strong>Account:</strong> {meeting.account.accountName}
//               </span>
//             </div>
//           )}

//           {meeting.contact && (
//             <div className="flex items-center gap-2">
//               <Users size={14} />
//               <span>
//                 <strong>Contact:</strong> {meeting.contact.firstName}
//               </span>
//             </div>
//           )}

//           {meeting.deal && (
//             <div className="flex items-center gap-2">
//               <Briefcase size={14} />
//               <span>
//                 <strong>Deal:</strong> {meeting.deal.dealName}
//               </span>
//             </div>
//           )}
//         </div>

//         {/* ATTENDEES */}
//         {/* {meeting.attendees?.length > 0 && (
//           <div className="mt-4">
//             <p className="text-sm font-medium text-gray-800 mb-1">Attendees</p>

//             <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm text-gray-600">
//               {meeting.attendees.map((a) => (
//                 <div key={a.id}>
//                   • {a.name ? `${a.name} (${a.email})` : a.email}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )} */}

//         {/* ATTENDEES */}
//         {meeting.attendees?.length > 0 && (
//           <div className="mt-5">
//             <div className="flex items-center justify-between mb-2">
//               <p className="text-sm font-semibold text-gray-800">Attendees</p>
//               <span className="text-xs text-gray-400">
//                 {meeting.attendees.length} people
//               </span>
//             </div>

//             <div className="bg-gray-50 rounded-xl p-3 space-y-3">
//               {meeting.attendees.map((a) => {
//                 const initials = a.name
//                   ? a.name
//                       .split(" ")
//                       .map((n) => n[0])
//                       .join("")
//                       .slice(0, 2)
//                       .toUpperCase()
//                   : "U";

//                 return (
//                   <div
//                     key={a.id}
//                     className="flex items-center justify-between p-2 rounded-lg hover:bg-white transition"
//                   >
//                     {/* LEFT SIDE */}
//                     <div className="flex items-center gap-3">
//                       {/* AVATAR */}
//                       <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
//                         {initials}
//                       </div>

//                       {/* NAME + EMAIL */}
//                       <div>
//                         <div className="text-sm font-medium text-gray-800">
//                           {a.name || "Unknown"}
//                         </div>
//                         <div className="text-xs text-gray-500">{a.email}</div>
//                       </div>
//                     </div>

//                     {/* RIGHT SIDE (STATUS / ACTION READY) */}
//                     <div className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
//                       Invited
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* ACTIONS */}
//         <div className="flex justify-end gap-2 mt-6 flex-wrap">
//           {meeting.meetingLink && (
//             <button
//               onClick={() => window.open(meeting.meetingLink)}
//               className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
//             >
//               <Video size={16} />
//               Join
//             </button>
//           )}

//           <button
//             onClick={handleEdit}
//             className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
//           >
//             Edit
//           </button>

//           <button
//             onClick={handleDelete}
//             className="px-4 py-2 border text-red-600 rounded-lg hover:bg-red-50 transition"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={onClose}
//             className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// src/features/calendar/components/ViewMeetingModal.jsx
import {
  CalendarDays,
  Clock,
  Video,
  Users,
  Briefcase,
  X,
  Pencil,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { deleteMeeting } from "../calendarSlice";

export default function ViewMeetingModal({ meeting, onClose, onEdit }) {
  const dispatch = useDispatch();

  if (!meeting) return null;

  // const start = new Date(meeting.start);
  const start = new Date(meeting.start);
  const end = new Date(meeting.end);

  // const handleDelete = () => {
  //   const confirmDelete = window.confirm(
  //     "Are you sure you want to cancel this meeting?",
  //   );
  //   if (!confirmDelete) return;
  //   dispatch(deleteMeeting(meeting.id));
  //   onClose();
  // };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: `<div class="text-lg font-semibold">Cancel Meeting</div>`,
      html: `
      <div class="text-sm text-left leading-relaxed">
        <p class="mb-2">
          Are you sure you want to cancel this meeting?
        </p>
        <p class="text-gray-500 text-xs">
          This action cannot be undone.
        </p>
      </div>
    `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, cancel it",
      cancelButtonText: "No, keep it",
      focusCancel: true,
    });

    if (!result.isConfirmed) return;

    dispatch(deleteMeeting(meeting.id));
    onClose();

    Swal.fire({
      title: "Cancelled",
      text: "The meeting has been successfully cancelled.",
      icon: "success",
      timer: 1800,
      showConfirmButton: false,
    });
  };

  const handleEdit = () => {
    onEdit(meeting);
  };

  const avatarColors = [
    "bg-violet-100 text-violet-600",
    "bg-blue-100 text-blue-600",
    "bg-emerald-100 text-emerald-600",
    "bg-amber-100 text-amber-600",
    "bg-rose-100 text-rose-600",
  ];

  const getAvatarColor = (index) => avatarColors[index % avatarColors.length];

  const formatTime = (date) =>
    isNaN(date)
      ? "--"
      : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatDate = (date) =>
    isNaN(date)
      ? "Invalid Date"
      : date.toLocaleDateString([], {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[92vh] overflow-hidden flex flex-col"
        style={{
          boxShadow:
            "0 24px 64px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)",
        }}
      >
        {/* HEADER */}
        <div className="px-6 pt-6 pb-5 border-b border-gray-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-[17px] font-semibold text-gray-900 leading-snug truncate">
                {meeting.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                  <CalendarDays size={13} className="text-gray-400" />
                  {formatDate(start)}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock size={13} className="text-gray-400" />
                  {formatTime(start)} – {formatTime(end)}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-150 flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* DESCRIPTION */}
          {meeting.description && (
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
              {meeting.description}
            </p>
          )}

          {/* CRM CONTEXT */}
          {(meeting.account || meeting.contact || meeting.deal) && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                CRM Context
              </p>
              <div className="rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
                {meeting.account && (
                  <div className="flex items-center gap-3 px-4 py-2.5">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <Briefcase size={13} className="text-indigo-500" />
                    </div>
                    <div className="text-sm text-gray-700">
                      <span className="text-gray-400 text-xs mr-1.5">
                        Account
                      </span>
                      <span className="font-medium">
                        {meeting.account.accountName}
                      </span>
                    </div>
                  </div>
                )}
                {meeting.contact && (
                  <div className="flex items-center gap-3 px-4 py-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Users size={13} className="text-blue-500" />
                    </div>
                    <div className="text-sm text-gray-700">
                      <span className="text-gray-400 text-xs mr-1.5">
                        Contact
                      </span>
                      <span className="font-medium">
                        {meeting.contact.firstName}
                      </span>
                    </div>
                  </div>
                )}
                {meeting.deal && (
                  <div className="flex items-center gap-3 px-4 py-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                      <Briefcase size={13} className="text-emerald-500" />
                    </div>
                    <div className="text-sm text-gray-700">
                      <span className="text-gray-400 text-xs mr-1.5">Deal</span>
                      <span className="font-medium">
                        {meeting.deal.dealName}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ATTENDEES */}
          {meeting.attendees?.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                  <Users size={13} />
                  Attendees
                </p>
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                  {meeting.attendees.length}{" "}
                  {meeting.attendees.length === 1 ? "person" : "people"}
                </span>
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-50">
                {meeting.attendees.map((a, index) => {
                  const initials = a.name
                    ? a.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "U";

                  return (
                    <div
                      key={a.id}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors duration-100"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${getAvatarColor(index)}`}
                        >
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-800 truncate">
                            {a.name || "Unknown"}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            {a.email}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-600 font-medium border border-green-100 flex-shrink-0 ml-3">
                        Invited
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-2">
          {/* LEFT: Join button */}
          <div>
            {meeting.meetingLink && (
              <button
                onClick={() => {
                  window.open(
                    meeting.meetingLink,
                    "_blank",
                    "noopener,noreferrer",
                  );
                }}
                title={
                  meeting.provider === "MICROSOFT"
                    ? "Opens Microsoft Teams"
                    : "Join Google Meet"
                }
                className={`inline-flex items-center gap-2 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-150 shadow-sm active:scale-[0.98] ${
                  meeting.provider === "MICROSOFT"
                    ? "bg-purple-600 hover:bg-purple-700 shadow-purple-200"
                    : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                }`}
              >
                {meeting.provider === "MICROSOFT" ? (
                  <span className="text-[11px] font-bold">T</span>
                ) : (
                  <Video size={15} />
                )}

                {meeting.provider === "MICROSOFT"
                  ? "Open Teams"
                  : "Join Meeting"}
              </button>
            )}
          </div>

          {/* RIGHT: Edit / Delete / Close */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-red-600 bg-white border border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all duration-150"
            >
              <Trash2 size={14} />
              <span className="hidden sm:inline">Cancel Meeting</span>
            </button>

            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-150"
            >
              <Pencil size={14} />
              <span className="hidden sm:inline">Edit</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all duration-150 shadow-sm shadow-blue-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

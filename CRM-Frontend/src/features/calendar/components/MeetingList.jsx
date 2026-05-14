// // src/features/calendar/components/MeetingList.jsx

// import { useSelector } from "react-redux";
// import { CalendarDays, Clock, Video } from "lucide-react";

// export default function MeetingList() {
//   const { meetings } = useSelector((state) => state.calendar);

//   if (!meetings || meetings.length === 0) {
//     return (
//       <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
//         <p className="text-lg">No meetings scheduled yet</p>
//         <p className="text-sm mt-2">
//           Click "Schedule Meeting" to create your first meeting
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-xl shadow overflow-hidden">
//       <div className="px-6 py-4 border-b">
//         <h2 className="text-lg font-semibold text-gray-800">
//           Upcoming Meetings
//         </h2>
//       </div>

//       <div className="divide-y">
//         {meetings.map((meeting) => {
//           // ✅ FIXED
//           const start = new Date(meeting.start);

//           return (
//             <div
//               key={meeting.id}
//               className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
//             >
//               {/* LEFT */}
//               <div className="flex items-center gap-4">
//                 <div className="bg-blue-100 p-3 rounded-lg">
//                   <CalendarDays className="w-5 h-5 text-blue-600" />
//                 </div>

//                 <div>
//                   <p className="font-medium text-gray-800">{meeting.title}</p>

//                   <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
//                     <span className="flex items-center gap-1">
//                       <Clock size={14} />
//                       {start instanceof Date && !isNaN(start)
//                         ? start.toLocaleString()
//                         : "Invalid Date"}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* RIGHT */}
//               {/* RIGHT */}
//               {meeting.extendedProps?.meetingLink && (
//                 <a
//                   href={meeting.extendedProps.meetingLink}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//                 >
//                   <Video size={16} />
//                   Join
//                 </a>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// src/features/calendar/components/MeetingList.jsx
import { useSelector } from "react-redux";
import { CalendarDays, Clock, Video, Calendar } from "lucide-react";

export default function MeetingList() {
  const { meetings } = useSelector((state) => state.calendar);

  const avatarColors = [
    "bg-violet-100 text-violet-600",
    "bg-blue-100 text-blue-600",
    "bg-emerald-100 text-emerald-600",
    "bg-amber-100 text-amber-600",
    "bg-rose-100 text-rose-600",
  ];

  const cardAccents = [
    "border-l-blue-400",
    "border-l-violet-400",
    "border-l-emerald-400",
    "border-l-amber-400",
    "border-l-rose-400",
  ];

  const iconBgs = [
    "bg-blue-50 text-blue-500",
    "bg-violet-50 text-violet-500",
    "bg-emerald-50 text-emerald-500",
    "bg-amber-50 text-amber-500",
    "bg-rose-50 text-rose-500",
  ];

  /*
  -------------------------------------------------------
  SORT + FILTER
  -------------------------------------------------------
  */
  const sortedMeetings = [...(meetings || [])].sort(
    (a, b) => new Date(a.start) - new Date(b.start),
  );

  // const upcomingMeetings = sortedMeetings.filter(
  //   (m) => new Date(m.start) >= new Date(),
  // );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingMeetings = sortedMeetings.filter(
    (m) => new Date(m.start) >= today,
  );

  if (!upcomingMeetings || upcomingMeetings.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
          <Calendar size={24} className="text-gray-300" />
        </div>
        <p className="text-[15px] font-semibold text-gray-700">
          No meetings scheduled
        </p>
        <p className="text-sm text-gray-400 mt-1.5 max-w-xs">
          Click "Schedule Meeting" to create your first meeting
        </p>
      </div>
    );
  }

  const formatDate = (date) =>
    isNaN(date)
      ? "Invalid Date"
      : date.toLocaleDateString([], {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

  const formatTime = (date) =>
    isNaN(date)
      ? "--"
      : date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* HEADER */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
            <CalendarDays size={15} className="text-blue-600" />
          </div>
          <h2 className="text-[15px] font-semibold text-gray-900">
            Upcoming Meetings
          </h2>
        </div>
        <span className="text-xs font-medium text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
          {upcomingMeetings.length}{" "}
          {upcomingMeetings.length === 1 ? "meeting" : "meetings"}
        </span>
      </div>

      {/* LIST */}
      <div className="divide-y divide-gray-50">
        {upcomingMeetings.map((meeting, index) => {
          if (meeting.extendedProps?.status === "CANCELLED") return null;

          const start = new Date(meeting.start);
          // const start = new Date(meeting.start + "Z");
          const accentClass = cardAccents[index % cardAccents.length];
          const iconClass = iconBgs[index % iconBgs.length];

          const attendees = meeting.extendedProps?.attendees || [];
          const provider = meeting.extendedProps?.provider;

          return (
            <div
              key={meeting.id}
              className={`flex items-center justify-between px-6 py-4 hover:bg-gray-50/70 transition-colors duration-100 border-l-[3px] ${accentClass}`}
            >
              {/* LEFT */}
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconClass}`}
                >
                  <CalendarDays size={18} />
                </div>

                <div className="min-w-0">
                  {/* TITLE + PROVIDER BADGE */}
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {meeting.title}
                    </p>

                    {provider && (
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          provider === "MICROSOFT"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {provider === "MICROSOFT"
                          ? "Teams Meeting"
                          : "Google Meet"}
                      </span>
                    )}
                  </div>

                  {/* META */}
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                      <CalendarDays size={11} />
                      {formatDate(start)}
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock size={11} />
                      {formatTime(start)}
                    </span>

                    {attendees.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                        <div className="flex -space-x-1">
                          {attendees.slice(0, 3).map((a, i) => (
                            <div
                              key={i}
                              className={`w-4 h-4 rounded-full border border-white flex items-center justify-center text-[8px] font-bold ${
                                avatarColors[i % avatarColors.length]
                              }`}
                            >
                              {(a.name?.[0] || "U").toUpperCase()}
                            </div>
                          ))}
                        </div>
                        {attendees.length > 3 && (
                          <span>+{attendees.length - 3}</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              {meeting.extendedProps?.meetingLink && (
                <button
                  // onClick={() =>
                  //   window.open(
                  //     meeting.extendedProps.meetingLink,
                  //     "_blank",
                  //     "noopener,noreferrer",
                  //   )
                  // }

                  onClick={() => {
                    window.open(
                      meeting.extendedProps.meetingLink,
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }}
                  title={
                    provider === "MICROSOFT"
                      ? "Opens Microsoft Teams meeting creation page"
                      : "Join Google Meet"
                  }
                  className={`flex-shrink-0 ml-4 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white rounded-xl transition-all duration-150 shadow-sm ${
                    provider === "MICROSOFT"
                      ? "bg-purple-600 hover:bg-purple-700 shadow-purple-200"
                      : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                  }`}
                >
                  {provider === "MICROSOFT" ? (
                    <span className="text-[10px] font-bold">T</span>
                  ) : (
                    <Video size={13} />
                  )}

                  <span className="hidden sm:inline">
                    {provider === "MICROSOFT" ? "Open Teams" : "Join"}
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

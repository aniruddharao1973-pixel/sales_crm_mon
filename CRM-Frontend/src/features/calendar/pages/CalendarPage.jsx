// // src/features/calendar/pages/CalendarPage.jsx

// import { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Calendar, dateFnsLocalizer } from "react-big-calendar";
// import { format, parse, startOfWeek, getDay } from "date-fns";
// import enUS from "date-fns/locale/en-US";

// import { fetchCalendarMeetings } from "../calendarSlice";

// import "react-big-calendar/lib/css/react-big-calendar.css";

// import CreateMeetingModal from "../components/CreateMeetingModal";
// import MeetingList from "../components/MeetingList";
// import ViewMeetingModal from "../components/ViewMeetingModal";
// import EditMeetingModal from "../components/EditMeetingModal"; // ✅ ADD THIS

// const locales = {
//   "en-US": enUS,
// };

// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// });

// export default function CalendarPage() {
//   const dispatch = useDispatch();

//   const { user } = useSelector((state) => state.auth);
//   const { meetings } = useSelector((state) => state.calendar);

//   const [openModal, setOpenModal] = useState(false);
//   const [selectedMeeting, setSelectedMeeting] = useState(null);
//   const [mode, setMode] = useState("create"); // create | view | edit

//   const connectGoogleCalendar = () => {
//     const API_BASE = import.meta.env.VITE_API_BASE_URL;
//     window.location.href = `${API_BASE}/calendar/connect?userId=${user.id}`;
//   };

//   /*
//   ────────────────────────────────────────────
//   FETCH MEETINGS
//   ────────────────────────────────────────────
//   */
//   useEffect(() => {
//     const start = new Date();
//     start.setDate(1);

//     const end = new Date();
//     end.setMonth(end.getMonth() + 1);

//     dispatch(
//       fetchCalendarMeetings({
//         start: start.toISOString(),
//         end: end.toISOString(),
//       }),
//     );
//   }, [dispatch]);

//   /*
//   ────────────────────────────────────────────
//   EVENTS MAPPING
//   ────────────────────────────────────────────
//   */
//   // const events = meetings.map((m) => ({
//   //   id: m.id,
//   //   title: m.title,

//   //   // ✅ USE NORMALIZED VALUES
//   //   start: m.start,
//   //   end: m.end,

//   //   // ✅ PASS FULL OBJECT
//   //   ...m.extendedProps,
//   // }));

//   const events = meetings.map((m) => ({
//     id: m.id,
//     title: m.title,

//     // ✅ convert HERE (correct place)
//     start: new Date(m.start),
//     end: new Date(m.end),

//     // ✅ flatten properly
//     meetingLink: m.extendedProps?.meetingLink,
//     description: m.extendedProps?.description,
//     location: m.extendedProps?.location,
//     status: m.extendedProps?.status,

//     contact: m.extendedProps?.contact,
//     account: m.extendedProps?.account,
//     deal: m.extendedProps?.deal,
//     attendees: m.extendedProps?.attendees,
//   }));

//   /*
//   ────────────────────────────────────────────
//   EDIT HANDLER (🔥 FIX)
//   ────────────────────────────────────────────
//   */
//   const handleEdit = (meeting) => {
//     setSelectedMeeting(meeting);
//     setMode("edit");
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* HEADER */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-semibold text-gray-800">
//             Calendar & Meetings
//           </h1>

//           <p className="text-sm text-gray-500 mt-1">
//             Schedule and manage client meetings
//           </p>
//         </div>

//         <div className="flex gap-3">
//           <button
//             onClick={connectGoogleCalendar}
//             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
//           >
//             Connect Google Calendar
//           </button>

//           <button
//             onClick={() => {
//               setSelectedMeeting(null);
//               setMode("create");
//               setOpenModal(true);
//             }}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Schedule Meeting
//           </button>
//         </div>
//       </div>

//       {/* CALENDAR */}
//       <div className="bg-white rounded-xl shadow p-4">
//         <Calendar
//           localizer={localizer}
//           events={events}
//           startAccessor="start"
//           endAccessor="end"
//           style={{ height: 600 }}
//           onSelectEvent={(event) => {
//             setSelectedMeeting({
//               ...event,
//               ...event, // base
//               startTime: event.start,
//               endTime: event.end,
//             });

//             setMode("view");
//             setOpenModal(true);
//           }}
//         />
//       </div>

//       {/* LIST */}
//       <MeetingList />

//       {/* MODALS */}

//       {/* CREATE */}
//       {openModal && mode === "create" && (
//         <CreateMeetingModal onClose={() => setOpenModal(false)} />
//       )}

//       {/* VIEW */}
//       {openModal && mode === "view" && (
//         <ViewMeetingModal
//           meeting={selectedMeeting}
//           onClose={() => setOpenModal(false)}
//           onEdit={handleEdit} // 🔥 FIXED HERE
//         />
//       )}

//       {/* EDIT */}
//       {openModal && mode === "edit" && (
//         <EditMeetingModal
//           meeting={selectedMeeting}
//           onClose={() => setOpenModal(false)}
//         />
//       )}
//     </div>
//   );
// }

// // src/features/calendar/pages/CalendarPage.jsx
// import { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Calendar, dateFnsLocalizer } from "react-big-calendar";
// import { format, parse, startOfWeek, getDay } from "date-fns";
// import enUS from "date-fns/locale/en-US";

// import { fetchCalendarMeetings } from "../calendarSlice";

// import "react-big-calendar/lib/css/react-big-calendar.css";

// import CreateMeetingModal from "../components/CreateMeetingModal";
// import MeetingList from "../components/MeetingList";
// import ViewMeetingModal from "../components/ViewMeetingModal";
// import EditMeetingModal from "../components/EditMeetingModal";

// import { CalendarDays, Plus, CalendarCheck } from "lucide-react";

// const locales = { "en-US": enUS };

// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// });

// export default function CalendarPage() {
//   const dispatch = useDispatch();

//   const { user } = useSelector((state) => state.auth);
//   const { meetings } = useSelector((state) => state.calendar);

//   const [openModal, setOpenModal] = useState(false);
//   const [selectedMeeting, setSelectedMeeting] = useState(null);
//   const [mode, setMode] = useState("create");

//   const connectGoogleCalendar = () => {
//     const API_BASE = import.meta.env.VITE_API_BASE_URL;
//     window.location.href = `${API_BASE}/calendar/connect?userId=${user.id}`;
//   };

//   useEffect(() => {
//     const start = new Date();
//     start.setDate(1);

//     const end = new Date();
//     end.setMonth(end.getMonth() + 1);

//     dispatch(
//       fetchCalendarMeetings({
//         start: start.toISOString(),
//         end: end.toISOString(),
//       }),
//     );
//   }, [dispatch]);

//   const events = meetings.map((m) => ({
//     id: m.id,
//     title: m.title,
//     start: new Date(m.start),
//     end: new Date(m.end),
//     meetingLink: m.extendedProps?.meetingLink,
//     description: m.extendedProps?.description,
//     location: m.extendedProps?.location,
//     status: m.extendedProps?.status,
//     contact: m.extendedProps?.contact,
//     account: m.extendedProps?.account,
//     deal: m.extendedProps?.deal,
//     attendees: m.extendedProps?.attendees,
//   }));

//   const handleEdit = (meeting) => {
//     setSelectedMeeting(meeting);
//     setMode("edit");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50/60 p-4 sm:p-6 space-y-5">

//       {/* HEADER */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-200">
//             <CalendarDays size={20} className="text-white" />
//           </div>
//           <div>
//             <h1 className="text-[18px] font-semibold text-gray-900 leading-tight">
//               Calendar & Meetings
//             </h1>
//             <p className="text-xs text-gray-400 mt-0.5">
//               Schedule and manage client meetings
//             </p>
//           </div>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
//           <button
//             onClick={connectGoogleCalendar}
//             className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-150"
//           >
//             <CalendarCheck size={15} />
//             Connect Google Calendar
//           </button>

//           <button
//             onClick={() => {
//               setSelectedMeeting(null);
//               setMode("create");
//               setOpenModal(true);
//             }}
//             className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all duration-150 shadow-sm shadow-blue-200"
//           >
//             <Plus size={15} />
//             Schedule Meeting
//           </button>
//         </div>
//       </div>

//       {/* CALENDAR */}
//       <div
//         className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
//         style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)" }}
//       >
//         {/* Calendar inner header bar */}
//         <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
//           <div className="w-2 h-2 rounded-full bg-blue-500"></div>
//           <span className="text-sm font-medium text-gray-600">
//             {format(new Date(), "MMMM yyyy")}
//           </span>
//         </div>

//         <div className="p-4 sm:p-5">
//           <style>{`
//             .rbc-calendar { font-family: inherit; }
//             .rbc-header { padding: 10px 0; font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 1px solid #f3f4f6; background: transparent; }
//             .rbc-month-view { border: 1px solid #f3f4f6; border-radius: 12px; overflow: hidden; }
//             .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #f9fafb; }
//             .rbc-month-row + .rbc-month-row { border-top: 1px solid #f9fafb; }
//             .rbc-off-range-bg { background: #fafafa; }
//             .rbc-today { background: #eff6ff !important; }
//             .rbc-event { background: #2563eb; border: none; border-radius: 6px; font-size: 11px; font-weight: 500; padding: 2px 6px; }
//             .rbc-event:focus { outline: none; box-shadow: 0 0 0 2px #93c5fd; }
//             .rbc-event.rbc-selected { background: #1d4ed8; }
//             .rbc-show-more { font-size: 11px; color: #3b82f6; font-weight: 600; padding: 2px 4px; }
//             .rbc-toolbar { margin-bottom: 16px; gap: 8px; flex-wrap: wrap; }
//             .rbc-toolbar button { font-size: 13px; font-weight: 500; color: #374151; border: 1px solid #e5e7eb; border-radius: 8px; padding: 6px 14px; background: white; transition: all 0.15s; }
//             .rbc-toolbar button:hover { background: #f9fafb; border-color: #d1d5db; color: #111827; }
//             .rbc-toolbar button.rbc-active { background: #2563eb; color: white; border-color: #2563eb; }
//             .rbc-toolbar button.rbc-active:hover { background: #1d4ed8; }
//             .rbc-toolbar-label { font-size: 15px; font-weight: 600; color: #111827; }
//             .rbc-date-cell { font-size: 12px; padding: 6px 8px; color: #6b7280; }
//             .rbc-date-cell.rbc-now { font-weight: 700; color: #2563eb; }
//             .rbc-time-header { border-bottom: 1px solid #f3f4f6; }
//             .rbc-time-slot { font-size: 11px; color: #9ca3af; }
//             .rbc-timeslot-group { border-bottom: 1px solid #f9fafb; }
//             .rbc-time-content { border-top: 1px solid #f3f4f6; }
//             .rbc-current-time-indicator { background: #2563eb; height: 2px; }
//           `}</style>

//           <Calendar
//             localizer={localizer}
//             events={events}
//             startAccessor="start"
//             endAccessor="end"
//             style={{ height: 580 }}
//             onSelectEvent={(event) => {
//               setSelectedMeeting({
//                 ...event,
//                 startTime: event.start,
//                 endTime: event.end,
//               });
//               setMode("view");
//               setOpenModal(true);
//             }}
//           />
//         </div>
//       </div>

//       {/* MEETING LIST */}
//       <MeetingList />

//       {/* MODALS */}
//       {openModal && mode === "create" && (
//         <CreateMeetingModal onClose={() => setOpenModal(false)} />
//       )}

//       {openModal && mode === "view" && (
//         <ViewMeetingModal
//           meeting={selectedMeeting}
//           onClose={() => setOpenModal(false)}
//           onEdit={handleEdit}
//         />
//       )}

//       {openModal && mode === "edit" && (
//         <EditMeetingModal
//           meeting={selectedMeeting}
//           onClose={() => setOpenModal(false)}
//         />
//       )}
//     </div>
//   );
// }

// // src/features/calendar/pages/CalendarPage.jsx
// import { useState, useEffect, useCallback } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Calendar, dateFnsLocalizer } from "react-big-calendar";
// import {
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   startOfMonth,
//   endOfMonth,
//   addMonths,
//   subMonths,
//   startOfDay,
//   endOfDay,
//   addWeeks,
//   subWeeks,
//   startOfISOWeek,
//   endOfISOWeek,
// } from "date-fns";
// import enUS from "date-fns/locale/en-US";

// import { fetchCalendarMeetings } from "../calendarSlice";

// import "react-big-calendar/lib/css/react-big-calendar.css";

// import CreateMeetingModal from "../components/CreateMeetingModal";
// import MeetingList from "../components/MeetingList";
// import ViewMeetingModal from "../components/ViewMeetingModal";
// import EditMeetingModal from "../components/EditMeetingModal";

// import {
//   CalendarDays,
//   Plus,
//   CalendarCheck,
//   ChevronLeft,
//   ChevronRight,
//   Clock,
//   Sparkles,
// } from "lucide-react";

// const locales = { "en-US": enUS };

// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek,
//   getDay,
//   locales,
// });

// /* ─── Custom Toolbar ─── */
// function CustomToolbar({ label, onNavigate, onView, view }) {
//   const viewOptions = [
//     { key: "month", label: "Month" },
//     { key: "week", label: "Week" },
//     { key: "day", label: "Day" },
//     { key: "agenda", label: "Agenda" },
//   ];

//   return (
//     <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 px-1">
//       {/* Left: Today + arrows + label */}
//       <div className="flex items-center gap-3">
//         <button
//           type="button"
//           onClick={() => onNavigate("TODAY")}
//           className="px-4 py-2 text-[13px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 hover:border-indigo-300 active:scale-[0.97] transition-all duration-200 shadow-sm"
//         >
//           Today
//         </button>

//         <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
//           <button
//             type="button"
//             onClick={() => onNavigate("PREV")}
//             className="p-2 hover:bg-gray-50 transition-colors border-r border-gray-100 active:bg-gray-100"
//           >
//             <ChevronLeft size={16} className="text-gray-500" />
//           </button>
//           <button
//             type="button"
//             onClick={() => onNavigate("NEXT")}
//             className="p-2 hover:bg-gray-50 transition-colors active:bg-gray-100"
//           >
//             <ChevronRight size={16} className="text-gray-500" />
//           </button>
//         </div>

//         <h2 className="text-lg font-bold text-gray-800 ml-1 whitespace-nowrap tracking-tight">
//           {label}
//         </h2>
//       </div>

//       {/* Right: View switcher */}
//       <div className="flex items-center bg-gray-100/80 p-1 rounded-xl gap-0.5">
//         {viewOptions.map((v) => (
//           <button
//             key={v.key}
//             type="button"
//             onClick={() => onView(v.key)}
//             className={`
//               px-3.5 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-200
//               ${
//                 view === v.key
//                   ? "bg-white text-indigo-600 shadow-sm border border-gray-200/80"
//                   : "text-gray-500 hover:text-gray-700 hover:bg-white/50 border border-transparent"
//               }
//             `}
//           >
//             {v.label}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default function CalendarPage() {
//   const dispatch = useDispatch();

//   const { user } = useSelector((state) => state.auth);
//   const { meetings } = useSelector((state) => state.calendar);

//   const [openModal, setOpenModal] = useState(false);
//   const [selectedMeeting, setSelectedMeeting] = useState(null);
//   const [mode, setMode] = useState("create");

//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [currentView, setCurrentView] = useState("month");

//   const connectGoogleCalendar = () => {
//     const API_BASE = import.meta.env.VITE_API_BASE_URL;
//     window.location.href = `${API_BASE}/calendar/connect?userId=${user.id}`;
//   };

//   const connectMicrosoftCalendar = () => {
//     const API_BASE = import.meta.env.VITE_API_BASE_URL;
//     window.location.href = `${API_BASE}/calendar/microsoft/connect?userId=${user.id}`;
//   };

//   const fetchRange = useCallback(
//     (date, view) => {
//       let start, end;

//       switch (view) {
//         case "month":
//           start = startOfWeek(startOfMonth(date));
//           end = endOfISOWeek(endOfMonth(date));
//           break;
//         case "week":
//           start = startOfWeek(date);
//           end = endOfISOWeek(date);
//           break;
//         case "day":
//           start = startOfDay(date);
//           end = endOfDay(date);
//           break;
//         case "agenda":
//           start = startOfDay(date);
//           end = endOfDay(addMonths(date, 1));
//           break;
//         default:
//           start = startOfMonth(date);
//           end = endOfMonth(date);
//       }

//       dispatch(
//         fetchCalendarMeetings({
//           start: start.toISOString(),
//           end: end.toISOString(),
//         }),
//       );
//     },
//     [dispatch],
//   );

//   useEffect(() => {
//     fetchRange(currentDate, currentView);
//   }, [currentDate, currentView, fetchRange]);

//   const events = meetings.map((m) => ({
//     id: m.id,
//     title: m.title,
//     start: new Date(m.start),
//     end: new Date(m.end),
//     provider: m.extendedProps?.provider,
//     meetingLink: m.extendedProps?.meetingLink,
//     description: m.extendedProps?.description,
//     location: m.extendedProps?.location,
//     status: m.extendedProps?.status,
//     contact: m.extendedProps?.contact,
//     account: m.extendedProps?.account,
//     deal: m.extendedProps?.deal,
//     attendees: m.extendedProps?.attendees,
//   }));

//   const handleEdit = (meeting) => {
//     setSelectedMeeting(meeting);
//     setMode("edit");
//   };

//   const handleNavigate = (newDate) => {
//     setCurrentDate(newDate);
//   };

//   const handleViewChange = (newView) => {
//     setCurrentView(newView);
//   };

//   const refreshCalendar = () => {
//     setTimeout(() => {
//       fetchRange(currentDate, currentView);
//     }, 1500);
//   };

//   // Stats
//   const todayCount = events.filter((e) => {
//     const today = new Date();
//     return (
//       e.start.getDate() === today.getDate() &&
//       e.start.getMonth() === today.getMonth() &&
//       e.start.getFullYear() === today.getFullYear()
//     );
//   }).length;

//   const upcomingCount = events.filter((e) => e.start > new Date()).length;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-[1400px] mx-auto space-y-6">
//         {/* HEADER */}
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//           <div className="flex items-center gap-4">
//             <div className="relative">
//               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-200/50">
//                 <CalendarDays size={22} className="text-white" />
//               </div>
//               <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
//                 <Sparkles size={8} className="text-white" />
//               </div>
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-gray-900 tracking-tight">
//                 Calendar & Meetings
//               </h1>
//               <p className="text-sm text-gray-400 mt-0.5">
//                 Schedule, manage and track your client meetings
//               </p>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
//             {/* GOOGLE */}
//             <button
//               onClick={connectGoogleCalendar}
//               className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-emerald-700 bg-white border border-emerald-200 rounded-xl hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-100/50 transition-all duration-200"
//             >
//               <CalendarCheck
//                 size={16}
//                 className="group-hover:scale-110 transition-transform duration-200"
//               />
//               Connect Google
//             </button>

//             {/* MICROSOFT TEAMS ✅ ADD THIS */}
//             <button
//               onClick={connectMicrosoftCalendar}
//               className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-purple-700 bg-white border border-purple-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 hover:shadow-md hover:shadow-purple-100/50 transition-all duration-200"
//             >
//               <CalendarCheck
//                 size={16}
//                 className="group-hover:scale-110 transition-transform duration-200"
//               />
//               Connect Teams
//             </button>

//             {/* CREATE MEETING */}
//             <button
//               onClick={() => {
//                 setSelectedMeeting(null);
//                 setMode("create");
//                 setOpenModal(true);
//               }}
//               className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl hover:from-indigo-700 hover:to-blue-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/50"
//             >
//               <Plus
//                 size={16}
//                 className="group-hover:rotate-90 transition-transform duration-300"
//               />
//               Schedule Meeting
//             </button>
//           </div>
//         </div>

//         {/* STATS CARDS */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
//             <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
//               <CalendarDays size={18} className="text-blue-600" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-gray-900">
//                 {events.length}
//               </p>
//               <p className="text-xs text-gray-400 font-medium">Total Events</p>
//             </div>
//           </div>
//           <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
//             <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
//               <Clock size={18} className="text-amber-600" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-gray-900">{todayCount}</p>
//               <p className="text-xs text-gray-400 font-medium">
//                 Today's Meetings
//               </p>
//             </div>
//           </div>
//           <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
//             <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
//               <CalendarCheck size={18} className="text-emerald-600" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-gray-900">
//                 {upcomingCount}
//               </p>
//               <p className="text-xs text-gray-400 font-medium">Upcoming</p>
//             </div>
//           </div>
//         </div>

//         {/* CALENDAR */}
//         <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
//           <div className="p-5 sm:p-6">
//             <style>{`
//             /* ─── Reset ─── */
//             .rbc-calendar { font-family: inherit; }

//             /* ─── Month view ─── */
//             .rbc-header {
//               padding: 12px 4px;
//               font-size: 11px;
//               font-weight: 700;
//               color: #94a3b8;
//               text-transform: uppercase;
//               letter-spacing: 0.08em;
//               border-bottom: 1px solid #f1f5f9 !important;
//               background: #fafbfd;
//             }
//             .rbc-month-view {
//               border: 1px solid #e2e8f0 !important;
//               border-radius: 16px;
//               overflow: hidden;
//             }
//             .rbc-day-bg + .rbc-day-bg {
//               border-left: 1px solid #f1f5f9 !important;
//             }
//               /* ✅ ADD THIS */
// .rbc-day-bg {
//   border-right: 1px solid #f1f5f9;
//   border-bottom: 1px solid #f1f5f9;
// }

// .rbc-day-bg:hover {
//   background: #f8fafc !important;
//   transition: background 0.2s ease;
// }
//             .rbc-month-row + .rbc-month-row {
//               border-top: 1px solid #f1f5f9 !important;
//             }
//             /* ✅ ADD THIS */
// .rbc-month-row {
//   min-height: 110px;
// }

// .rbc-row-content {
//   padding: 4px 6px;
// }
//             .rbc-off-range-bg { background: #fafbfd; }
//             .rbc-today {
//   background: linear-gradient(135deg, #eef2ff, #e0e7ff) !important;
//   box-shadow: inset 0 0 0 1px #c7d2fe;
// }

//             /* ─── Events ─── */
// /* ✅ DOT STYLE EVENTS */
// .rbc-event {
//   background: transparent !important;
//   border: none !important;
//   padding: 0 !important;
//   margin-top: 4px;
// }
//             .rbc-event:hover {
//               transform: translateY(-1px);
//               box-shadow: 0 4px 8px rgba(99,102,241,0.35), 0 2px 4px rgba(0,0,0,0.08);
//             }
//             .rbc-event:focus {
//               outline: none;
//               box-shadow: 0 0 0 3px rgba(99,102,241,0.3);
//             }
//             .rbc-event.rbc-selected {
//               background: linear-gradient(135deg, #4f46e5, #4338ca) !important;
//               box-shadow: 0 0 0 3px rgba(99,102,241,0.25);
//             }
//             .rbc-show-more {
//               font-size: 11px;
//               color: #6366f1;
//               font-weight: 700;
//               padding: 2px 6px;
//               background: transparent !important;
//               border-radius: 4px;
//             }
//             .rbc-show-more:hover {
//               background: #eef2ff !important;
//             }

//             /* ✅ Dot container */
// .rbc-event-content {
//   display: flex;
//   align-items: center;
//   gap: 6px;
//   font-size: 11px;
//   font-weight: 500;
//   color: #334155;
// }

// /* ✅ Dot circle */
// .rbc-event-dot {
//   width: 8px;
//   height: 8px;
//   border-radius: 50%;
//   flex-shrink: 0;
// }

// /* Hover effect */
// .rbc-event:hover .rbc-event-content {
//   opacity: 0.8;
// }

//             /* ─── Date cells ─── */
// .rbc-date-cell {
//   font-size: 12px;
//   padding: 6px 8px;
//   text-align: right;
//   font-weight: 700;
//   color: #334155;
//   opacity: 0.9;
// }

// .rbc-date-cell a {
//   padding: 4px 6px;
//   border-radius: 6px;
// }
//             .rbc-date-cell.rbc-now {
//               font-weight: 800;
//             }
//             .rbc-date-cell.rbc-now a,
//             .rbc-date-cell.rbc-now button {
//               background: linear-gradient(135deg, #6366f1, #4f46e5);
//               color: #fff;
//               border-radius: 50%;
//               width: 30px;
//               height: 30px;
//               display: inline-flex;
//               align-items: center;
//               justify-content: center;
//               line-height: 1;
//               box-shadow: 0 2px 6px rgba(99,102,241,0.35);
//               font-weight: 700;
//             }

//             /* ─── Week / Day time views ─── */
//             .rbc-time-view {
//               border: 1px solid #e2e8f0 !important;
//               border-radius: 16px;
//               overflow: hidden;
//             }
//             .rbc-time-header {
//               border-bottom: 1px solid #f1f5f9 !important;
//             }
//             .rbc-time-header-content {
//               border-left: 1px solid #f1f5f9 !important;
//             }
//             .rbc-time-slot {
//               font-size: 11px;
//               color: #94a3b8;
//             }
//             .rbc-timeslot-group {
//               border-bottom: 1px solid #f8fafc !important;
//               min-height: 52px;
//             }
//             .rbc-time-content {
//               border-top: 1px solid #f1f5f9 !important;
//             }
//             .rbc-time-content > * + * > * {
//               border-left: 1px solid #f1f5f9 !important;
//             }
//             .rbc-day-slot .rbc-time-slot {
//               border-top: 1px solid #fafbfd !important;
//             }
//             .rbc-current-time-indicator {
//               background: linear-gradient(90deg, #ef4444, #f87171) !important;
//               height: 2px;
//               border-radius: 1px;
//             }
//             .rbc-current-time-indicator::before {
//               content: '';
//               position: absolute;
//               left: -5px;
//               top: -4px;
//               width: 10px;
//               height: 10px;
//               border-radius: 50%;
//               background: #ef4444;
//               box-shadow: 0 0 6px rgba(239,68,68,0.4);
//             }

//             /* ─── Agenda view ─── */
//             .rbc-agenda-view {
//               border: 1px solid #e2e8f0 !important;
//               border-radius: 16px;
//               overflow: hidden;
//             }
//             .rbc-agenda-view table.rbc-agenda-table {
//               border: none !important;
//             }
//             .rbc-agenda-view table.rbc-agenda-table thead > tr > th {
//               padding: 12px 16px;
//               font-size: 11px;
//               font-weight: 700;
//               color: #94a3b8;
//               text-transform: uppercase;
//               letter-spacing: 0.08em;
//               border-bottom: 1px solid #f1f5f9 !important;
//               background: #fafbfd;
//             }
//             .rbc-agenda-view table.rbc-agenda-table tbody > tr > td {
//               padding: 12px 16px;
//               font-size: 13px;
//               border-bottom: 1px solid #f1f5f9 !important;
//               color: #334155;
//               font-weight: 500;
//             }
//             .rbc-agenda-view table.rbc-agenda-table tbody > tr:hover > td {
//               background: #fafbfe;
//             }
//             .rbc-agenda-view table.rbc-agenda-table tbody > tr + tr {
//               border-top: none !important;
//             }
//             .rbc-agenda-event-cell {
//               color: #6366f1;
//               font-weight: 600;
//               cursor: pointer;
//             }

//             /* ─── All-day row ─── */
//             .rbc-allday-cell {
//               border-bottom: 1px solid #f1f5f9 !important;
//             }
//             .rbc-row-segment .rbc-event-content {
//               white-space: nowrap;
//               overflow: hidden;
//               text-overflow: ellipsis;
//             }

//             /* ─── Remove default rbc-toolbar ─── */
//             .rbc-toolbar {
//               display: none !important;
//             }

//             /* ─── Header gutter ─── */
//             .rbc-time-header-gutter {
//               min-width: 72px;
//             }
//             .rbc-label {
//               font-size: 11px;
//               color: #94a3b8;
//               font-weight: 600;
//             }

//             /* ─── Selection ─── */
//             .rbc-slot-selection {
//               background: rgba(99,102,241,0.12) !important;
//               border: 1px solid rgba(99,102,241,0.3) !important;
//               border-radius: 6px;
//             }

//             /* ─── Day header (week view) ─── */
//             .rbc-header.rbc-today {
//               background: #eef2ff !important;
//               color: #4f46e5 !important;
//             }

//             /* ─── Overlay ─── */
//             .rbc-overlay {
//               border-radius: 12px !important;
//               border: 1px solid #e2e8f0 !important;
//               box-shadow: 0 20px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04) !important;
//               padding: 8px !important;
//             }
//             .rbc-overlay-header {
//               border-bottom: 1px solid #f1f5f9 !important;
//               padding: 8px 12px !important;
//               font-size: 12px !important;
//               font-weight: 700 !important;
//               color: #475569 !important;
//             }
// /* ✅ FIXED Weekend headers */
// .rbc-header {
//   text-align: center;
// }

// .rbc-header:first-child {
//   color: #ef4444 !important; /* Sunday */
// }

// .rbc-header:last-child {
//   color: #f59e0b !important; /* Saturday */
// }
//           `}</style>

//             <CustomToolbar
//               label={(() => {
//                 switch (currentView) {
//                   case "month":
//                     return format(currentDate, "MMMM yyyy");
//                   case "week": {
//                     const ws = startOfWeek(currentDate);
//                     const we = new Date(ws);
//                     we.setDate(we.getDate() + 6);
//                     if (ws.getMonth() === we.getMonth()) {
//                       return `${format(ws, "MMM d")} – ${format(we, "d, yyyy")}`;
//                     }
//                     return `${format(ws, "MMM d")} – ${format(we, "MMM d, yyyy")}`;
//                   }
//                   case "day":
//                     return format(currentDate, "EEEE, MMMM d, yyyy");
//                   case "agenda":
//                     return format(currentDate, "MMMM yyyy");
//                   default:
//                     return format(currentDate, "MMMM yyyy");
//                 }
//               })()}
//               onNavigate={(action) => {
//                 let newDate = currentDate;
//                 switch (action) {
//                   case "TODAY":
//                     newDate = new Date();
//                     break;
//                   case "PREV":
//                     if (currentView === "month") {
//                       newDate = subMonths(currentDate, 1);
//                     } else if (currentView === "week") {
//                       newDate = subWeeks(currentDate, 1);
//                     } else if (currentView === "day") {
//                       newDate = new Date(currentDate);
//                       newDate.setDate(newDate.getDate() - 1);
//                     } else if (currentView === "agenda") {
//                       newDate = subMonths(currentDate, 1);
//                     }
//                     break;
//                   case "NEXT":
//                     if (currentView === "month") {
//                       newDate = addMonths(currentDate, 1);
//                     } else if (currentView === "week") {
//                       newDate = addWeeks(currentDate, 1);
//                     } else if (currentView === "day") {
//                       newDate = new Date(currentDate);
//                       newDate.setDate(newDate.getDate() + 1);
//                     } else if (currentView === "agenda") {
//                       newDate = addMonths(currentDate, 1);
//                     }
//                     break;
//                   default:
//                     break;
//                 }
//                 setCurrentDate(newDate);
//               }}
//               onView={(newView) => {
//                 setCurrentView(newView);
//               }}
//               view={currentView}
//             />

//             <Calendar
//               localizer={localizer}
//               events={events}
//               startAccessor="start"
//               endAccessor="end"
//               date={currentDate}
//               view={currentView}
//               onNavigate={handleNavigate}
//               onView={handleViewChange}
//               views={["month", "week", "day", "agenda"]}
//               toolbar={false}
//               style={{ height: 650 }}
//               popup
//               selectable
//               onSelectEvent={(event) => {
//                 setSelectedMeeting({
//                   ...event,
//                   startTime: event.start,
//                   endTime: event.end,
//                   provider: event.provider,
//                 });
//                 setMode("view");
//                 setOpenModal(true);
//               }}
//               dayPropGetter={(date) => {
//                 const today = new Date();
//                 const day = date.getDay();

//                 const start = new Date(today);
//                 start.setDate(today.getDate() - today.getDay());

//                 const end = new Date(start);
//                 end.setDate(start.getDate() + 6);

//                 const isCurrentWeek = date >= start && date <= end;

//                 const isToday =
//                   date.getDate() === today.getDate() &&
//                   date.getMonth() === today.getMonth() &&
//                   date.getFullYear() === today.getFullYear();

//                 if (isToday) {
//                   return {
//                     style: {
//                       background: "#eef2ff",
//                       boxShadow: "inset 0 0 0 1px #6366f1",
//                     },
//                   };
//                 }

//                 if (day === 0) {
//                   return {
//                     style: {
//                       background: "linear-gradient(180deg, #fff1f2, #ffe4e6)",
//                     },
//                   };
//                 }

//                 if (day === 6) {
//                   return {
//                     style: {
//                       background: "linear-gradient(180deg, #fffbeb, #fef3c7)",
//                     },
//                   };
//                 }

//                 // ✅ NEW: current week highlight
//                 if (isCurrentWeek) {
//                   return {
//                     style: {
//                       backgroundColor: "#f8fafc",
//                     },
//                   };
//                 }

//                 return {};
//               }}
//               eventPropGetter={() => ({
//                 style: {
//                   background: "transparent",
//                 },
//               })}
//               components={{
//                 event: ({ event }) => {
//                   let color = "#6366f1";

//                   if (event.status === "completed") color = "#10b981";
//                   else if (event.status === "pending") color = "#f59e0b";
//                   else if (event.status === "cancelled") color = "#ef4444";

//                   return (
//                     <div className="rbc-event-content">
//                       <span
//                         className="rbc-event-dot"
//                         style={{ backgroundColor: color }}
//                       />
//                       <span className="truncate">{event.title}</span>
//                     </div>
//                   );
//                 },
//               }}
//             />
//           </div>
//         </div>

//         {/* MEETING LIST */}
//         <MeetingList />

//         {/* MODALS */}
//         {openModal && mode === "create" && (
//           <CreateMeetingModal
//             onClose={() => setOpenModal(false)}
//             onSuccess={refreshCalendar}
//           />
//         )}

//         {openModal && mode === "view" && (
//           <ViewMeetingModal
//             meeting={selectedMeeting}
//             onClose={() => setOpenModal(false)}
//             onEdit={handleEdit}
//           />
//         )}

//         {openModal && mode === "edit" && (
//           <EditMeetingModal
//             meeting={selectedMeeting}
//             onClose={() => setOpenModal(false)}
//             onSuccess={refreshCalendar}
//           />
//         )}
//       </div>
//     </div>
//   );
// }


// src/features/calendar/pages/CalendarPage.jsx
import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  startOfDay,
  endOfDay,
  addWeeks,
  subWeeks,
  endOfISOWeek,
} from "date-fns";
import enUS from "date-fns/locale/en-US";

import { fetchCalendarMeetings } from "../calendarSlice";

import "react-big-calendar/lib/css/react-big-calendar.css";

import CreateMeetingModal from "../components/CreateMeetingModal";
import MeetingList from "../components/MeetingList";
import ViewMeetingModal from "../components/ViewMeetingModal";
import EditMeetingModal from "../components/EditMeetingModal";

import {
  CalendarDays,
  Plus,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
} from "lucide-react";

// ─── RBC global style overrides injected once ───────────────────────────────
// These target react-big-calendar's own class names that Tailwind cannot reach
// via JSX props. We inject them in a plain <style> tag but keep ALL component-
// level styling in Tailwind className strings below.
const RBC_GLOBAL_CSS = `
  .rbc-calendar { font-family: inherit; }

  /* Hide default toolbar – we render our own */
  .rbc-toolbar { display: none !important; }

  /* ── Month view shell ── */
  .rbc-month-view {
    border: 1px solid #e2e8f0 !important;
    border-radius: 16px;
    overflow: hidden;
  }
  .rbc-month-row { min-height: 110px; }
  .rbc-month-row + .rbc-month-row { border-top: 1px solid #f1f5f9 !important; }
  .rbc-row-content { padding: 4px 6px; }

  /* ── Column / day separators ── */
  .rbc-day-bg {
    border-right: 1px solid #f1f5f9;
    border-bottom: 1px solid #f1f5f9;
    transition: background 0.2s ease;
  }
  .rbc-day-bg:hover { background: #f8fafc !important; }
  .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #f1f5f9 !important; }
  .rbc-off-range-bg { background: #fafbfd; }

  /* ── Today highlight ── */
  .rbc-today {
    background: linear-gradient(135deg,#eef2ff,#e0e7ff) !important;
    box-shadow: inset 0 0 0 1px #c7d2fe;
  }

  /* ── Column headers ── */
  .rbc-header {
    padding: 12px 4px;
    font-size: 11px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border-bottom: 1px solid #f1f5f9 !important;
    background: #fafbfd;
    text-align: center;
  }
  .rbc-header:first-child { color: #ef4444 !important; }
  .rbc-header:last-child  { color: #f59e0b !important; }
  .rbc-header.rbc-today   { background: #eef2ff !important; color: #4f46e5 !important; }

  /* ── Date cells ── */
  .rbc-date-cell {
    font-size: 12px;
    padding: 6px 8px;
    text-align: right;
    font-weight: 700;
    color: #334155;
    opacity: 0.9;
  }
  .rbc-date-cell a { padding: 4px 6px; border-radius: 6px; }
  .rbc-date-cell.rbc-now { font-weight: 800; }
  .rbc-date-cell.rbc-now a,
  .rbc-date-cell.rbc-now button {
    background: linear-gradient(135deg,#6366f1,#4f46e5);
    color: #fff;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    box-shadow: 0 2px 6px rgba(99,102,241,0.35);
    font-weight: 700;
  }

  /* ── Events (dot style) ── */
  .rbc-event {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    margin-top: 4px;
  }
  .rbc-event:hover { transform: translateY(-1px); }
  .rbc-event:focus { outline: none; box-shadow: 0 0 0 3px rgba(99,102,241,0.3); }
  .rbc-event.rbc-selected {
    background: linear-gradient(135deg,#4f46e5,#4338ca) !important;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.25);
  }
  .rbc-row-segment .rbc-event-content {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .rbc-show-more {
    font-size: 11px;
    color: #6366f1;
    font-weight: 700;
    padding: 2px 6px;
    background: transparent !important;
    border-radius: 4px;
  }
  .rbc-show-more:hover { background: #eef2ff !important; }

  /* ── Time / week / day views ── */
  .rbc-time-view {
    border: 1px solid #e2e8f0 !important;
    border-radius: 16px;
    overflow: hidden;
  }
  .rbc-time-header         { border-bottom: 1px solid #f1f5f9 !important; }
  .rbc-time-header-content { border-left: 1px solid #f1f5f9 !important; }
  .rbc-time-header-gutter  { min-width: 72px; }
  .rbc-label               { font-size: 11px; color: #94a3b8; font-weight: 600; }
  .rbc-time-slot           { font-size: 11px; color: #94a3b8; }
  .rbc-timeslot-group      { border-bottom: 1px solid #f8fafc !important; min-height: 52px; }
  .rbc-time-content        { border-top: 1px solid #f1f5f9 !important; }
  .rbc-time-content > * + * > * { border-left: 1px solid #f1f5f9 !important; }
  .rbc-day-slot .rbc-time-slot { border-top: 1px solid #fafbfd !important; }

  /* Current time indicator */
  .rbc-current-time-indicator {
    background: linear-gradient(90deg,#ef4444,#f87171) !important;
    height: 2px;
    border-radius: 1px;
  }
  .rbc-current-time-indicator::before {
    content: '';
    position: absolute;
    left: -5px; top: -4px;
    width: 10px; height: 10px;
    border-radius: 50%;
    background: #ef4444;
    box-shadow: 0 0 6px rgba(239,68,68,0.4);
  }

  /* ── Agenda view ── */
  .rbc-agenda-view {
    border: 1px solid #e2e8f0 !important;
    border-radius: 16px;
    overflow: hidden;
  }
  .rbc-agenda-view table.rbc-agenda-table { border: none !important; }
  .rbc-agenda-view table.rbc-agenda-table thead > tr > th {
    padding: 12px 16px;
    font-size: 11px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border-bottom: 1px solid #f1f5f9 !important;
    background: #fafbfd;
  }
  .rbc-agenda-view table.rbc-agenda-table tbody > tr > td {
    padding: 12px 16px;
    font-size: 13px;
    border-bottom: 1px solid #f1f5f9 !important;
    color: #334155;
    font-weight: 500;
  }
  .rbc-agenda-view table.rbc-agenda-table tbody > tr:hover > td { background: #fafbfe; }
  .rbc-agenda-view table.rbc-agenda-table tbody > tr + tr { border-top: none !important; }
  .rbc-agenda-event-cell { color: #6366f1; font-weight: 600; cursor: pointer; }

  /* ── All-day row ── */
  .rbc-allday-cell { border-bottom: 1px solid #f1f5f9 !important; }

  /* ── Slot selection ── */
  .rbc-slot-selection {
    background: rgba(99,102,241,0.12) !important;
    border: 1px solid rgba(99,102,241,0.3) !important;
    border-radius: 6px;
  }

  /* ── Popup overlay ── */
  .rbc-overlay {
    border-radius: 12px !important;
    border: 1px solid #e2e8f0 !important;
    box-shadow: 0 20px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04) !important;
    padding: 8px !important;
  }
  .rbc-overlay-header {
    border-bottom: 1px solid #f1f5f9 !important;
    padding: 8px 12px !important;
    font-size: 12px !important;
    font-weight: 700 !important;
    color: #475569 !important;
  }
`;

// ─── Inject global RBC styles once ──────────────────────────────────────────
function injectRbcStyles() {
  if (document.getElementById("rbc-calendar-overrides")) return;
  const tag = document.createElement("style");
  tag.id = "rbc-calendar-overrides";
  tag.textContent = RBC_GLOBAL_CSS;
  document.head.appendChild(tag);
}

// ─── Localizer ──────────────────────────────────────────────────────────────
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// ─── Status → colour map ─────────────────────────────────────────────────────
const STATUS_COLOR = {
  completed: "#10b981",
  pending:   "#f59e0b",
  cancelled: "#ef4444",
  default:   "#6366f1",
};

function getEventColor(status) {
  return STATUS_COLOR[status] || STATUS_COLOR.default;
}

// ─── Custom event dot renderer ───────────────────────────────────────────────
function EventDot({ event }) {
  const color = getEventColor(event.status);
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="truncate text-[11px] font-medium text-slate-700">
        {event.title}
      </span>
    </div>
  );
}

// ─── Custom Toolbar ──────────────────────────────────────────────────────────
const VIEW_OPTIONS = [
  { key: "month",  label: "Month"  },
  { key: "week",   label: "Week"   },
  { key: "day",    label: "Day"    },
  { key: "agenda", label: "Agenda" },
];

function CustomToolbar({ label, onNavigate, onView, view }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 px-1">
      {/* Left: Today + arrows + label */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onNavigate("TODAY")}
          className="px-4 py-2 text-[13px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-xl hover:bg-indigo-100 hover:border-indigo-300 active:scale-[0.97] transition-all duration-200 shadow-sm"
        >
          Today
        </button>

        <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => onNavigate("PREV")}
            className="p-2 hover:bg-gray-50 transition-colors border-r border-gray-100 active:bg-gray-100"
          >
            <ChevronLeft size={16} className="text-gray-500" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate("NEXT")}
            className="p-2 hover:bg-gray-50 transition-colors active:bg-gray-100"
          >
            <ChevronRight size={16} className="text-gray-500" />
          </button>
        </div>

        <h2 className="text-lg font-bold text-gray-800 ml-1 whitespace-nowrap tracking-tight">
          {label}
        </h2>
      </div>

      {/* Right: View switcher */}
      <div className="flex items-center bg-gray-100/80 p-1 rounded-xl gap-0.5">
        {VIEW_OPTIONS.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => onView(v.key)}
            className={[
              "px-3.5 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-200 border",
              view === v.key
                ? "bg-white text-indigo-600 shadow-sm border-gray-200/80"
                : "text-gray-500 hover:text-gray-700 hover:bg-white/50 border-transparent",
            ].join(" ")}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Stat card ───────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, iconBg, iconColor, value, label }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
        <Icon size={18} className={iconColor} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
      </div>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function CalendarPage() {
  const dispatch = useDispatch();
  const { user }     = useSelector((s) => s.auth);
  const { meetings } = useSelector((s) => s.calendar);

  const [openModal,       setOpenModal]       = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [mode,            setMode]            = useState("create");
  const [currentDate,     setCurrentDate]     = useState(new Date());
  const [currentView,     setCurrentView]     = useState("month");

  // Inject RBC global CSS once on mount
  useEffect(() => { injectRbcStyles(); }, []);

  // ── Calendar connect helpers ─────────────────────────────────────────────
  const connectGoogleCalendar = () => {
    const base = import.meta.env.VITE_API_BASE_URL;
    window.location.href = `${base}/calendar/connect?userId=${user.id}`;
  };

  const connectMicrosoftCalendar = () => {
    const base = import.meta.env.VITE_API_BASE_URL;
    window.location.href = `${base}/calendar/microsoft/connect?userId=${user.id}`;
  };

  // ── Fetch range ─────────────────────────────────────────────────────────
  const fetchRange = useCallback(
    (date, view) => {
      let start, end;
      switch (view) {
        case "month":
          start = startOfWeek(startOfMonth(date));
          end   = endOfISOWeek(endOfMonth(date));
          break;
        case "week":
          start = startOfWeek(date);
          end   = endOfISOWeek(date);
          break;
        case "day":
          start = startOfDay(date);
          end   = endOfDay(date);
          break;
        case "agenda":
          start = startOfDay(date);
          end   = endOfDay(addMonths(date, 1));
          break;
        default:
          start = startOfMonth(date);
          end   = endOfMonth(date);
      }
      dispatch(fetchCalendarMeetings({
        start: start.toISOString(),
        end:   end.toISOString(),
      }));
    },
    [dispatch],
  );

  useEffect(() => { fetchRange(currentDate, currentView); }, [currentDate, currentView, fetchRange]);

  const refreshCalendar = () => setTimeout(() => fetchRange(currentDate, currentView), 1500);

  // ── Map meetings → RBC events ────────────────────────────────────────────
  const events = meetings.map((m) => ({
    id:          m.id,
    title:       m.title,
    start:       new Date(m.start),
    end:         new Date(m.end),
    provider:    m.extendedProps?.provider,
    meetingLink: m.extendedProps?.meetingLink,
    description: m.extendedProps?.description,
    location:    m.extendedProps?.location,
    status:      m.extendedProps?.status,
    contact:     m.extendedProps?.contact,
    account:     m.extendedProps?.account,
    deal:        m.extendedProps?.deal,
    attendees:   m.extendedProps?.attendees,
  }));

  // ── Stats ────────────────────────────────────────────────────────────────
  const today = new Date();
  const todayCount    = events.filter((e) =>
    e.start.getDate()     === today.getDate()  &&
    e.start.getMonth()    === today.getMonth() &&
    e.start.getFullYear() === today.getFullYear()
  ).length;
  const upcomingCount = events.filter((e) => e.start > today).length;

  // ── Toolbar label ────────────────────────────────────────────────────────
  const toolbarLabel = (() => {
    switch (currentView) {
      case "month":
        return format(currentDate, "MMMM yyyy");
      case "week": {
        const ws = startOfWeek(currentDate);
        const we = new Date(ws);
        we.setDate(we.getDate() + 6);
        return ws.getMonth() === we.getMonth()
          ? `${format(ws, "MMM d")} – ${format(we, "d, yyyy")}`
          : `${format(ws, "MMM d")} – ${format(we, "MMM d, yyyy")}`;
      }
      case "day":
        return format(currentDate, "EEEE, MMMM d, yyyy");
      case "agenda":
      default:
        return format(currentDate, "MMMM yyyy");
    }
  })();

  // ── Toolbar navigation ───────────────────────────────────────────────────
  const handleToolbarNavigate = (action) => {
    let d = currentDate;
    if (action === "TODAY") { setCurrentDate(new Date()); return; }
    const dir = action === "PREV" ? -1 : 1;
    switch (currentView) {
      case "month":  d = (dir < 0 ? subMonths : addMonths)(currentDate, 1); break;
      case "week":   d = (dir < 0 ? subWeeks  : addWeeks )(currentDate, 1); break;
      case "agenda": d = (dir < 0 ? subMonths : addMonths)(currentDate, 1); break;
      case "day": {
        d = new Date(currentDate);
        d.setDate(d.getDate() + dir);
        break;
      }
      default: break;
    }
    setCurrentDate(d);
  };

  // ── Day cell colours ─────────────────────────────────────────────────────
  const dayPropGetter = (date) => {
    const day = date.getDay();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const isToday =
      date.getDate()     === today.getDate()  &&
      date.getMonth()    === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) return { style: { background: "#eef2ff", boxShadow: "inset 0 0 0 1px #6366f1" } };
    if (day === 0) return { style: { background: "linear-gradient(180deg,#fff1f2,#ffe4e6)" } };
    if (day === 6) return { style: { background: "linear-gradient(180deg,#fffbeb,#fef3c7)" } };
    if (date >= weekStart && date <= weekEnd) return { style: { backgroundColor: "#f8fafc" } };
    return {};
  };

  // ── Edit handler ─────────────────────────────────────────────────────────
  const handleEdit = (meeting) => { setSelectedMeeting(meeting); setMode("edit"); };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">

        {/* ── HEADER ── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Title */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-200/50">
                <CalendarDays size={22} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
                <Sparkles size={8} className="text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                Calendar &amp; Meetings
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Schedule, manage and track your client meetings
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
            {/* Connect Google */}
            <button
              onClick={connectGoogleCalendar}
              className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-emerald-700 bg-white border border-emerald-200 rounded-xl hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-100/50 transition-all duration-200"
            >
              <CalendarCheck size={16} className="group-hover:scale-110 transition-transform duration-200" />
              Connect Google
            </button>

            {/* Connect Teams */}
            <button
              onClick={connectMicrosoftCalendar}
              className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-purple-700 bg-white border border-purple-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 hover:shadow-md hover:shadow-purple-100/50 transition-all duration-200"
            >
              <CalendarCheck size={16} className="group-hover:scale-110 transition-transform duration-200" />
              Connect Teams
            </button>

            {/* Schedule Meeting */}
            <button
              onClick={() => { setSelectedMeeting(null); setMode("create"); setOpenModal(true); }}
              className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl hover:from-indigo-700 hover:to-blue-700 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-indigo-200/50 hover:shadow-indigo-300/50"
            >
              <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
              Schedule Meeting
            </button>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={CalendarDays}  iconBg="bg-blue-50"    iconColor="text-blue-600"    value={events.length}  label="Total Events"      />
          <StatCard icon={Clock}         iconBg="bg-amber-50"   iconColor="text-amber-600"   value={todayCount}     label="Today's Meetings"  />
          <StatCard icon={CalendarCheck} iconBg="bg-emerald-50" iconColor="text-emerald-600" value={upcomingCount}  label="Upcoming"          />
        </div>

        {/* ── CALENDAR ── */}
        <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="p-5 sm:p-6">
            <CustomToolbar
              label={toolbarLabel}
              onNavigate={handleToolbarNavigate}
              onView={setCurrentView}
              view={currentView}
            />

            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              date={currentDate}
              view={currentView}
              onNavigate={setCurrentDate}
              onView={setCurrentView}
              views={["month", "week", "day", "agenda"]}
              toolbar={false}
              style={{ height: 650 }}
              popup
              selectable
              onSelectEvent={(event) => {
                setSelectedMeeting({
                  ...event,
                  startTime: event.start,
                  endTime:   event.end,
                  provider:  event.provider,
                });
                setMode("view");
                setOpenModal(true);
              }}
              dayPropGetter={dayPropGetter}
              eventPropGetter={() => ({ style: { background: "transparent" } })}
              components={{
                event: ({ event }) => <EventDot event={event} />,
              }}
            />
          </div>
        </div>

        {/* ── MEETING LIST ── */}
        <MeetingList />

        {/* ── MODALS ── */}
        {openModal && mode === "create" && (
          <CreateMeetingModal onClose={() => setOpenModal(false)} onSuccess={refreshCalendar} />
        )}
        {openModal && mode === "view" && (
          <ViewMeetingModal
            meeting={selectedMeeting}
            onClose={() => setOpenModal(false)}
            onEdit={handleEdit}
          />
        )}
        {openModal && mode === "edit" && (
          <EditMeetingModal
            meeting={selectedMeeting}
            onClose={() => setOpenModal(false)}
            onSuccess={refreshCalendar}
          />
        )}

      </div>
    </div>
  );
}
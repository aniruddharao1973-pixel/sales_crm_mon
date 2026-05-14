// // src/features/calendar/components/EditMeetingModal.jsx

// import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { updateMeeting } from "../calendarSlice";
// import API from "../../../api/axios";
// import { toast } from "react-hot-toast";

// export default function EditMeetingModal({ meeting, onClose }) {
//   const dispatch = useDispatch();

//   /*
//   ────────────────────────────────────────────
//   FORMAT DATE FOR INPUT (NO TIMEZONE SHIFT)
//   ────────────────────────────────────────────
//   */
//   const formatLocal = (date) => {
//     if (!date) return "";

//     const d = new Date(date);
//     if (isNaN(d)) return "";

//     const pad = (n) => String(n).padStart(2, "0");

//     return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
//       d.getDate(),
//     )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
//   };

//   /*
//   ────────────────────────────────────────────
//   STATE
//   ────────────────────────────────────────────
//   */
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [allContacts, setAllContacts] = useState([]);
//   const [selectedContacts, setSelectedContacts] = useState([]);

//   /*
//   ────────────────────────────────────────────
//   FETCH CONTACTS
//   ────────────────────────────────────────────
//   */
//   useEffect(() => {
//     const fetchContacts = async () => {
//       try {
//         const res = await API.get("/contacts");

//         console.log("🔥 CONTACT API RESPONSE:", res.data);

//         // ✅ CORRECT EXTRACTION
//         setAllContacts(res.data.data || []);
//       } catch (err) {
//         console.error("❌ Failed to fetch contacts:", err);
//       }
//     };

//     fetchContacts();
//   }, []);

//   /*
//   ────────────────────────────────────────────
//   INIT STATE (MEETING DATA)
//   ────────────────────────────────────────────
//   */
//   useEffect(() => {
//     if (!meeting) return;

//     console.log("🧠 RAW MEETING:", meeting);

//     const ids =
//       meeting.attendees?.map((a) => a.contactId).filter(Boolean) || [];

//     console.log("👥 PRESELECTED CONTACT IDS:", ids);

//     // ✅ Batch update using functional updates
//     setTitle(() => meeting.title || "");
//     setDescription(() => meeting.description || "");
//     setStartTime(() => formatLocal(meeting.start || meeting.startTime));
//     setEndTime(() => formatLocal(meeting.end || meeting.endTime));
//     setSelectedContacts(() => ids);
//   }, [meeting]);

//   /*
//   ────────────────────────────────────────────
//   TOGGLE CONTACT
//   ────────────────────────────────────────────
//   */
//   const toggleContact = (id) => {
//     setSelectedContacts((prev) =>
//       prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
//     );
//   };

//   /*
//   ────────────────────────────────────────────
//   UPDATE HANDLER
//   ────────────────────────────────────────────
//   */
//   // const handleUpdate = async () => {
//   //   console.log("🚀 SUBMIT:", {
//   //     title,
//   //     startTime,
//   //     endTime,
//   //     selectedContacts,
//   //   });

//   //   await dispatch(
//   //     updateMeeting({
//   //       id: meeting.id,
//   //       data: {
//   //         title,
//   //         description,
//   //         startTime: new Date(startTime).toISOString(),
//   //         endTime: new Date(endTime).toISOString(),

//   //         // 🔥 IMPORTANT
//   //         contactIds: selectedContacts,
//   //       },
//   //     }),
//   //   );

//   //   onClose();
//   // };

//   const handleUpdate = async () => {
//     if (loading) return; // 🛑 prevent duplicate

//     try {
//       setLoading(true);

//       console.log("🚀 SUBMIT VALUES:", {
//         startTime,
//         endTime,
//         selectedContacts,
//       });

//       await dispatch(
//         updateMeeting({
//           id: meeting.id,
//           data: {
//             title,
//             description,
//             startTime: new Date(startTime).toISOString(),
//             endTime: new Date(endTime).toISOString(),
//             contactIds: selectedContacts,
//           },
//         }),
//       ).unwrap();

//       toast.success("Meeting updated & invites sent");

//       onClose();
//     } catch (error) {
//       console.error("❌ Update failed:", error);
//       toast.error(error || "Failed to update meeting");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /*
//   ────────────────────────────────────────────
//   UI
//   ────────────────────────────────────────────
//   */
//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-3">
//         <h2 className="text-xl font-semibold">Edit Meeting</h2>

//         {/* TITLE */}
//         <input
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           className="w-full border p-2 rounded"
//           placeholder="Title"
//         />

//         {/* DESCRIPTION */}
//         <textarea
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="w-full border p-2 rounded"
//           placeholder="Description"
//         />

//         {/* CONTACT SELECT */}
//         <div>
//           <p className="text-sm font-medium mb-1">Attendees</p>

//           <div className="max-h-40 overflow-y-auto border rounded-lg p-2 space-y-2">
//             {allContacts.map((c) => {
//               const isSelected = selectedContacts.includes(c.id);

//               return (
//                 <div
//                   key={c.id}
//                   onClick={() => toggleContact(c.id)}
//                   className={`p-2 rounded-lg cursor-pointer border flex justify-between items-center
//                     ${
//                       isSelected
//                         ? "bg-blue-50 border-blue-300"
//                         : "hover:bg-gray-50"
//                     }
//                   `}
//                 >
//                   <div>
//                     <div className="text-sm font-medium">
//                       {c.firstName} {c.lastName || ""}
//                     </div>
//                     <div className="text-xs text-gray-500">{c.email}</div>
//                   </div>

//                   {isSelected && (
//                     <span className="text-xs text-blue-600 font-semibold">
//                       ✓
//                     </span>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* START TIME */}
//         <input
//           type="datetime-local"
//           value={startTime}
//           onChange={(e) => setStartTime(e.target.value)}
//           className="w-full border p-2 rounded"
//         />

//         {/* END TIME */}
//         <input
//           type="datetime-local"
//           value={endTime}
//           onChange={(e) => setEndTime(e.target.value)}
//           className="w-full border p-2 rounded"
//         />

//         {/* ACTIONS */}
//         <div className="flex justify-end gap-2 pt-2">
//           <button onClick={onClose} className="border px-4 py-2 rounded">
//             Cancel
//           </button>

//           <button
//             onClick={handleUpdate}
//             disabled={loading}
//             className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
//           >
//             {loading ? "Updating..." : "Update"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// src/features/calendar/components/EditMeetingModal.jsx
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateMeeting } from "../calendarSlice";
import API from "../../../api/axios";
import { toast } from "react-hot-toast";
import {
  X,
  Calendar,
  Clock,
  FileText,
  Users,
  Check,
  Loader2,
} from "lucide-react";

export default function EditMeetingModal({ meeting, onClose, onSuccess }) {
  const dispatch = useDispatch();

  const formatLocal = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d)) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [allContacts, setAllContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await API.get("/contacts");
        console.log("🔥 CONTACT API RESPONSE:", res.data);
        setAllContacts(res.data.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch contacts:", err);
      }
    };
    fetchContacts();
  }, []);

  useEffect(() => {
    if (!meeting) return;
    console.log("🧠 RAW MEETING:", meeting);
    const ids =
      meeting.attendees?.map((a) => a.contactId).filter(Boolean) || [];
    console.log("👥 PRESELECTED CONTACT IDS:", ids);
    setTitle(() => meeting.title || "");
    setDescription(() => meeting.description || "");
    setStartTime(() => formatLocal(meeting.start || meeting.startTime));
    setEndTime(() => formatLocal(meeting.end || meeting.endTime));
    setSelectedContacts(() => ids);
  }, [meeting]);

  const toggleContact = (id) => {
    setSelectedContacts((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const getMinDateTime = () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");

    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate(),
    )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  const handleUpdate = async () => {
    if (loading) return;
    try {
      setLoading(true);
      console.log("🚀 SUBMIT VALUES:", {
        startTime,
        endTime,
        selectedContacts,
      });

      const now = new Date();
      const start = new Date(startTime);
      const end = new Date(endTime);

      if (start < now) {
        toast.error("Start time cannot be in the past");
        return;
      }

      if (end <= start) {
        toast.error("End time must be after start time");
        return;
      }
      await dispatch(
        updateMeeting({
          id: meeting.id,
          data: {
            title,
            description,
            startTime: new Date(startTime).toISOString(),
            endTime: new Date(endTime).toISOString(),
            contactIds: selectedContacts,

            // ✅ ADD THIS
            provider: meeting.provider,
          },
        }),
      ).unwrap();

      toast.success("Meeting updated & invites sent");

      onSuccess(); // 🔥 ADD THIS
      onClose();
    } catch (error) {
      console.error("❌ Update failed:", error);
      toast.error(error || "Failed to update meeting");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (firstName, lastName) =>
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  const avatarColors = [
    "bg-violet-100 text-violet-600",
    "bg-blue-100 text-blue-600",
    "bg-emerald-100 text-emerald-600",
    "bg-amber-100 text-amber-600",
    "bg-rose-100 text-rose-600",
  ];

  const getAvatarColor = (index) => avatarColors[index % avatarColors.length];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md max-h-[92vh] overflow-hidden flex flex-col"
        style={{
          boxShadow:
            "0 24px 64px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)",
        }}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <Calendar className="text-amber-500" size={18} />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-gray-900 leading-tight">
                Edit Meeting
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Update meeting details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-150"
          >
            <X size={16} />
          </button>
        </div>

        {/* BODY */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {/* TITLE */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Meeting Title
            </label>
            <div className="relative">
              <FileText
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-150"
                placeholder="e.g. Q2 Strategy Review"
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-150 resize-none"
              placeholder="What's this meeting about?"
              rows={3}
            />
          </div>

          {/* MEETING TYPE (READ ONLY) */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Meeting Type
            </label>

            <div className="px-3 py-2 text-sm rounded-xl border bg-gray-50 border-gray-200 text-gray-700">
              {meeting.provider === "MICROSOFT"
                ? "Microsoft Teams"
                : "Google Meet"}
            </div>
          </div>

          {/* TIME FIELDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Start Time
              </label>
              <div className="relative">
                <Clock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="datetime-local"
                  value={startTime}
                  min={getMinDateTime()}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-150"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                End Time
              </label>
              <div className="relative">
                <Clock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="datetime-local"
                  value={endTime}
                  min={getMinDateTime()}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-150"
                />
              </div>
            </div>
          </div>

          {/* ATTENDEES */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                <Users size={13} />
                Attendees
              </label>
              {selectedContacts.length > 0 && (
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                  {selectedContacts.length} selected
                </span>
              )}
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden max-h-44 overflow-y-auto">
              {allContacts.length > 0 ? (
                allContacts.map((c, index) => {
                  const isSelected = selectedContacts.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      onClick={() => toggleContact(c.id)}
                      className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors duration-100 border-b border-gray-50 last:border-b-0
                        ${isSelected ? "bg-blue-50/70" : "hover:bg-gray-50"}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${getAvatarColor(index)}`}
                      >
                        {getInitials(c.firstName, c.lastName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">
                          {c.firstName} {c.lastName || ""}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {c.email}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-150
                        ${isSelected ? "bg-blue-600" : "border-2 border-gray-200"}`}
                      >
                        {isSelected && (
                          <Check
                            size={11}
                            className="text-white"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                    <Users size={16} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    No contacts available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-400 hidden sm:block">
            {selectedContacts.length === 0
              ? "No attendees selected"
              : `${selectedContacts.length} attendee${selectedContacts.length > 1 ? "s" : ""} invited`}
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-150"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 shadow-sm shadow-blue-200"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

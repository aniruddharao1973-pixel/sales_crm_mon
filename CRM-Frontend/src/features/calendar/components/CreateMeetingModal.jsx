// // src/features/calendar/components/CreateMeetingModal.jsx

// import { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { createMeeting } from "../calendarSlice";
// import api from "../../../api/axios";

// const CreateMeetingModal = ({ onClose }) => {
//   const dispatch = useDispatch();

//   const [contacts, setContacts] = useState([]);
//   const [search, setSearch] = useState("");

//   const [selectedContacts, setSelectedContacts] = useState([]);

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     startTime: "",
//     endTime: "",
//   });

//   /*
//   -------------------------------------------------
//   FETCH CONTACTS
//   -------------------------------------------------
//   */

//   useEffect(() => {
//     const fetchContacts = async () => {
//       try {
//         const res = await api.get("/contacts");

//         const contactsData =
//           res.data?.contacts || res.data?.data || res.data || [];

//         setContacts(Array.isArray(contactsData) ? contactsData : []);
//       } catch (err) {
//         console.error("Failed to load contacts");
//       }
//     };

//     fetchContacts();
//   }, []);

//   /*
//   -------------------------------------------------
//   CONTACT SELECTION
//   -------------------------------------------------
//   */

//   const addContact = (contact) => {
//     if (!selectedContacts.find((c) => c.id === contact.id)) {
//       setSelectedContacts([...selectedContacts, contact]);
//     }
//   };

//   const removeContact = (id) => {
//     setSelectedContacts(selectedContacts.filter((c) => c.id !== id));
//   };

//   /*
//   -------------------------------------------------
//   FILTER CONTACTS
//   -------------------------------------------------
//   */

//   const filteredContacts = contacts.filter((c) =>
//     `${c.firstName} ${c.lastName || ""} ${c.email}`
//       .toLowerCase()
//       .includes(search.toLowerCase()),
//   );

//   /*
//   -------------------------------------------------
//   SUBMIT
//   -------------------------------------------------
//   */

//   const handleSubmit = () => {
//     dispatch(
//       createMeeting({
//         title: form.title,
//         description: form.description,
//         startTime: form.startTime,
//         endTime: form.endTime,
//         contactIds: selectedContacts.map((c) => c.id),
//       }),
//     );

//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
//       <div className="bg-white rounded-xl shadow-xl p-6 w-[500px] max-h-[90vh] overflow-y-auto">
//         <h2 className="text-xl font-semibold mb-4">Schedule Meeting</h2>

//         {/* TITLE */}

//         <input
//           className="border w-full p-2 rounded mb-3"
//           placeholder="Meeting Title"
//           value={form.title}
//           onChange={(e) => setForm({ ...form, title: e.target.value })}
//         />

//         {/* DESCRIPTION */}

//         <textarea
//           className="border w-full p-2 rounded mb-3"
//           placeholder="Description"
//           rows={3}
//           value={form.description}
//           onChange={(e) => setForm({ ...form, description: e.target.value })}
//         />

//         {/* START TIME */}

//         <input
//           type="datetime-local"
//           className="border w-full p-2 rounded mb-3"
//           onChange={(e) => setForm({ ...form, startTime: e.target.value })}
//         />

//         {/* END TIME */}

//         <input
//           type="datetime-local"
//           className="border w-full p-2 rounded mb-4"
//           onChange={(e) => setForm({ ...form, endTime: e.target.value })}
//         />

//         {/* CONTACT SEARCH */}

//         <div className="mb-2">
//           <label className="text-sm text-gray-600">Invite Attendees</label>

//           <input
//             type="text"
//             placeholder="Search contacts..."
//             className="border w-full p-2 rounded mt-1"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>

//         {/* SELECTED CONTACTS */}

//         {selectedContacts.length > 0 && (
//           <div className="flex flex-wrap gap-2 mb-3">
//             {selectedContacts.map((contact) => (
//               <div
//                 key={contact.id}
//                 className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
//               >
//                 {contact.firstName} {contact.lastName}
//                 <button
//                   onClick={() => removeContact(contact.id)}
//                   className="text-blue-700 font-bold"
//                 >
//                   ×
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* CONTACT LIST */}

//         <div className="border rounded max-h-40 overflow-y-auto mb-4">
//           {filteredContacts.map((contact) => (
//             <div
//               key={contact.id}
//               className="p-2 hover:bg-gray-100 cursor-pointer border-b"
//               onClick={() => addContact(contact)}
//             >
//               <div className="font-medium">
//                 {contact.firstName} {contact.lastName}
//               </div>

//               <div className="text-sm text-gray-500">{contact.email}</div>
//             </div>
//           ))}

//           {filteredContacts.length === 0 && (
//             <div className="p-3 text-sm text-gray-400">No contacts found</div>
//           )}
//         </div>

//         {/* ACTIONS */}

//         <div className="flex justify-end gap-3">
//           <button onClick={onClose} className="px-4 py-2 text-gray-600">
//             Cancel
//           </button>

//           <button
//             className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
//             onClick={handleSubmit}
//           >
//             Create Meeting
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CreateMeetingModal;

// src/features/calendar/components/CreateMeetingModal.jsx
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createMeeting } from "../calendarSlice";
import api from "../../../api/axios";
import {
  X,
  Calendar,
  Clock,
  FileText,
  Users,
  Search,
  UserCircle2,
} from "lucide-react";

const CreateMeetingModal = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();

  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    provider: "GOOGLE",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchContacts = async () => {
      try {
        const res = await api.get("/contacts", {
          params: { limit: 500 },
        });

        const data = res.data?.contacts || res.data?.data || res.data || [];

        if (!isMounted) return;

        const contactsArray = Array.isArray(data) ? data : [];

        // ⚠️ Safety check (future-proof)
        if (contactsArray.length === 500) {
          console.warn(
            "Contacts may be truncated. Consider pagination if data grows.",
          );
        }

        setContacts(contactsArray);
      } catch (err) {
        console.error("Failed to load contacts", err);
      }
    };

    fetchContacts();

    return () => {
      isMounted = false; // prevents state update after unmount
    };
  }, []);

  const addContact = (contact) => {
    if (!selectedContacts.find((c) => c.id === contact.id)) {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const removeContact = (id) => {
    setSelectedContacts(selectedContacts.filter((c) => c.id !== id));
  };

  const filteredContacts = contacts.filter((c) =>
    `${c.firstName} ${c.lastName || ""} ${c.email}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  // const handleSubmit = async () => {
  //   if (!form.title || !form.startTime || !form.endTime) return;

  //   try {
  //     const res = await dispatch(
  //       createMeeting({
  //         title: form.title,
  //         description: form.description,
  //         startTime: form.startTime,
  //         endTime: form.endTime,
  //         contactIds: selectedContacts.map((c) => c.id),
  //         meetingType: form.provider,
  //       }),
  //     ).unwrap();

  //     // ✅ Auto open meeting link
  //     if (res?.meetingLink) {
  //       window.open(res.meetingLink, "_blank");
  //     }

  //     onSuccess();
  //     onClose();
  //   } catch (err) {
  //     console.error("Meeting creation failed:", err);
  //   }
  // };

  const toUTC = (localDateTime) => {
    if (!localDateTime) return null;
    return new Date(localDateTime).toISOString();
  };

  const getMinDateTime = () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");

    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
      now.getDate(),
    )}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  const handleSubmit = async () => {
    // if (!form.title || !form.startTime || !form.endTime) return;

    if (!form.title || !form.startTime || !form.endTime) return;

    const now = new Date();
    const start = new Date(form.startTime);
    const end = new Date(form.endTime);

    if (start < now) {
      alert("Start time cannot be in the past");
      return;
    }

    if (end <= start) {
      alert("End time must be after start time");
      return;
    }

    try {
      await dispatch(
        createMeeting({
          title: form.title,
          description: form.description,
          startTime: toUTC(form.startTime),
          endTime: toUTC(form.endTime),
          contactIds: selectedContacts.map((c) => c.id),
          meetingType: form.provider,
        }),
      ).unwrap();

      // ✅ NO AUTO OPEN — for both Google & Teams

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Meeting creation failed:", err);
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

  const getAvatarColor = (id) => avatarColors[id % avatarColors.length];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-hidden flex flex-col"
        style={{
          boxShadow:
            "0 24px 64px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)",
        }}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Calendar className="w-4.5 h-4.5 text-blue-600" size={18} />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-gray-900 leading-tight">
                Schedule Meeting
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Fill in the details below
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
                className="w-full pl-9 pr-4 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-150"
                placeholder="e.g. Q2 Strategy Review"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Description
            </label>
            <textarea
              className="w-full px-4 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-150 resize-none"
              placeholder="What's this meeting about?"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* MEETING TYPE */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Meeting Type
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, provider: "GOOGLE" })}
                className={`flex-1 py-2 rounded-xl border text-sm font-medium transition ${
                  form.provider === "GOOGLE"
                    ? "bg-blue-50 border-blue-500 text-blue-600"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Google Meet
              </button>

              <button
                type="button"
                onClick={() => setForm({ ...form, provider: "MICROSOFT" })}
                className={`flex-1 py-2 rounded-xl border text-sm font-medium transition ${
                  form.provider === "MICROSOFT"
                    ? "bg-purple-50 border-purple-500 text-purple-600"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Microsoft Teams
              </button>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 mt-1">
            {form.provider === "MICROSOFT"
              ? "A Microsoft Teams link will be generated and sent via email"
              : "A Google Meet link will be generated"}
          </p>

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
                  min={getMinDateTime()}
                  className="w-full pl-9 pr-3 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-150"
                  onChange={(e) =>
                    setForm({ ...form, startTime: e.target.value })
                  }
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
                  min={getMinDateTime()}
                  className="w-full pl-9 pr-3 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-150"
                  onChange={(e) =>
                    setForm({ ...form, endTime: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* ATTENDEES SECTION */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                <Users size={13} />
                Invite Attendees
              </label>
              {selectedContacts.length > 0 && (
                <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                  {selectedContacts.length} selected
                </span>
              )}
            </div>

            {/* SEARCH */}
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full pl-9 pr-4 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-150"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* SELECTED CHIPS */}
            {selectedContacts.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-3 bg-blue-50/60 border border-blue-100 rounded-xl">
                {selectedContacts.map((contact) => (
                  <span
                    key={contact.id}
                    className="inline-flex items-center gap-1.5 bg-white border border-blue-200 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-lg shadow-sm"
                  >
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-bold flex-shrink-0">
                      {getInitials(contact.firstName, contact.lastName)}
                    </span>
                    {contact.firstName} {contact.lastName}
                    <button
                      onClick={() => removeContact(contact.id)}
                      className="text-blue-400 hover:text-blue-700 transition-colors ml-0.5"
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* CONTACT LIST */}
            <div className="border border-gray-200 rounded-xl overflow-hidden max-h-44 overflow-y-auto">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact, index) => {
                  const isSelected = selectedContacts.some(
                    (c) => c.id === contact.id,
                  );
                  return (
                    <div
                      key={contact.id}
                      className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors duration-100 border-b border-gray-50 last:border-b-0
                        ${isSelected ? "bg-blue-50/70" : "hover:bg-gray-50"}`}
                      onClick={() => addContact(contact)}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${getAvatarColor(index)}`}
                      >
                        {getInitials(contact.firstName, contact.lastName) || (
                          <UserCircle2 size={14} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">
                          {contact.firstName} {contact.lastName}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {contact.email}
                        </div>
                      </div>
                      {isSelected && (
                        <span className="text-xs text-blue-500 font-medium bg-blue-100 px-2 py-0.5 rounded-full flex-shrink-0">
                          Added
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                    <Users size={16} className="text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    No contacts found
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Try a different search term
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
              ? "No attendees added yet"
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
              className="flex-1 sm:flex-none px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all duration-150 shadow-sm shadow-blue-200"
              onClick={handleSubmit}
            >
              Create Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMeetingModal;

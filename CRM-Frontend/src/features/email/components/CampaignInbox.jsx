// // src/features/email/components/CampaignInbox.jsx

// import { useEffect, useState } from "react";
// import API from "../../../api/axios";

// import {
//   XMarkIcon,
//   InboxIcon,
//   ClockIcon,
//   TrashIcon,
// } from "@heroicons/react/24/outline";

// const CampaignInbox = ({ onClose }) => {
//   const [campaigns, setCampaigns] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const fetchCampaigns = async () => {
//     try {
//       setLoading(true);

//       const res = await API.get("/email/campaign/list");

//       if (res.data?.success) {
//         setCampaigns(res.data.data || []);
//       } else {
//         setCampaigns([]);
//       }
//     } catch (err) {
//       console.error("Failed to load campaigns:", err);
//       setCampaigns([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteCampaign = async (id) => {
//     if (!window.confirm("Delete this campaign?")) return;

//     try {
//       await API.delete(`/email/campaign/${id}`);

//       setCampaigns((prev) => prev.filter((c) => c.id !== id));
//     } catch (err) {
//       console.error("Delete campaign failed:", err);
//       alert("Failed to delete campaign");
//     }
//   };

//   useEffect(() => {
//     fetchCampaigns();
//   }, []);

//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
//         {/* HEADER */}
//         <div className="flex justify-between items-center px-6 py-4 border-b">
//           <div className="flex items-center gap-3">
//             <InboxIcon className="w-6 h-6 text-gray-500" />
//             <h2 className="text-lg font-semibold">Campaign Inbox</h2>
//           </div>

//           <button onClick={onClose}>
//             <XMarkIcon className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         {/* BODY */}
//         <div className="p-6 space-y-3 max-h-[400px] overflow-y-auto">
//           {loading && (
//             <p className="text-sm text-gray-500">Loading campaigns...</p>
//           )}

//           {!loading && campaigns.length === 0 && (
//             <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
//               <InboxIcon className="w-10 h-10 mb-3 text-gray-300" />
//               <p className="text-sm font-medium">No campaigns sent yet</p>
//               <p className="text-xs text-gray-400 mt-1">
//                 Campaign emails will appear here once sent
//               </p>
//             </div>
//           )}

//           {!loading &&
//             campaigns.map((campaign) => (
//               <div
//                 key={campaign.id}
//                 className="border rounded-lg p-4 hover:border-blue-200 transition-colors"
//               >
//                 <div className="flex justify-between items-start">
//                   {/* LEFT SIDE */}
//                   <div className="space-y-1">
//                     <p className="font-semibold text-sm text-gray-900">
//                       {campaign.subject}
//                     </p>

//                     <p className="text-xs text-gray-500">
//                       Sent to {campaign.totalRecipients || 0} contacts
//                     </p>

//                     <div className="flex items-center gap-1 text-xs text-gray-400">
//                       <ClockIcon className="w-3 h-3" />
//                       {campaign.createdAt
//                         ? new Date(campaign.createdAt).toLocaleString()
//                         : "-"}
//                     </div>
//                   </div>

//                   {/* DELETE BUTTON */}
//                   <button
//                     onClick={() => deleteCampaign(campaign.id)}
//                     className="p-1 rounded hover:bg-red-50 text-red-500 hover:text-red-600 transition"
//                     title="Delete campaign"
//                   >
//                     <TrashIcon className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//         </div>

//         {/* FOOTER */}
//         <div className="px-6 py-4 border-t flex justify-end">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CampaignInbox;

// src/features/email/components/CampaignInbox.jsx

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "../../../api/axios";

import {
  XMarkIcon,
  InboxIcon,
  ClockIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const CampaignInbox = ({ onClose }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useSelector((s) => s.auth);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);

      const res = await API.get("/email/campaign/list");

      if (res.data?.success) {
        setCampaigns(res.data.data || []);
      } else {
        setCampaigns([]);
      }
    } catch (err) {
      console.error("Failed to load campaigns:", err);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteCampaign = async (id) => {
    if (!window.confirm("Delete this campaign?")) return;

    try {
      await API.delete(`/email/campaign/${id}`);

      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Delete campaign failed:", err);
      alert("Failed to delete campaign");
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)] w-full max-w-2xl overflow-hidden border border-gray-100/80 animate-in">
        {/* HEADER */}
        <div className="flex justify-between items-center px-7 py-5 border-b border-gray-100 bg-gradient-to-r from-slate-50/80 to-white">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <InboxIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                Campaign Inbox
              </h2>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                {campaigns.length > 0
                  ? `${campaigns.length} campaign${campaigns.length > 1 ? "s" : ""}`
                  : "Manage your campaigns"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all duration-200 group"
          >
            <XMarkIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-3 max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-[3px] border-gray-100 border-t-blue-500 animate-spin"></div>
              </div>
              <p className="text-sm text-gray-400 font-medium mt-5">
                Loading campaigns...
              </p>
            </div>
          )}

          {!loading && campaigns.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center mb-4">
                <InboxIcon className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-500">
                No campaigns sent yet
              </p>
              <p className="text-xs text-gray-400 mt-1.5 max-w-[240px] leading-relaxed">
                Campaign emails will appear here once you've sent your first one
              </p>
            </div>
          )}

          {!loading &&
            campaigns.map((campaign, index) => (
              <div
                key={campaign.id}
                className="group border border-gray-100 rounded-2xl p-5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300 bg-white hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-white"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex justify-between items-start gap-4">
                  {/* LEFT SIDE */}
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 shadow-sm shadow-green-400/40 flex-shrink-0"></div>
                      <p className="font-semibold text-sm text-gray-900 truncate">
                        {campaign.subject}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 ml-[18px]">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-xs font-medium text-blue-600">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {campaign.totalRecipients || 0} contacts
                      </span>

                      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                        <ClockIcon className="w-3.5 h-3.5" />
                        {campaign.createdAt
                          ? new Date(campaign.createdAt).toLocaleString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                          : "-"}
                      </div>
                    </div>
                  </div>

                  {/* DELETE BUTTON */}
                  {currentUser?.role !== "SALES_REP" && (
                    <button
                      onClick={() => deleteCampaign(campaign.id)}
                      className="p-2.5 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all duration-200 flex-shrink-0"
                      title="Delete campaign"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
        </div>

        {/* FOOTER */}
        <div className="px-7 py-5 border-t border-gray-100 bg-gradient-to-r from-gray-50/50 to-white flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-gray-900/10"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignInbox;

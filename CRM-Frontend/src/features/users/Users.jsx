// // src/features/users/Users.jsx

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { fetchUsers, deleteUser } from "../auth/authSlice";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
// import toast from "react-hot-toast";
// import {
//   PlusIcon,
//   PencilSquareIcon,
//   TrashIcon,
//   ExclamationTriangleIcon,
//   UserGroupIcon,
//   ShieldCheckIcon,
//   UserIcon,
//   EnvelopeIcon,
//   CheckCircleIcon,
//   XCircleIcon,
// } from "@heroicons/react/24/outline";

// // Role styles
// const ROLE_STYLES = {
//   ADMIN: {
//     bg: "bg-red-50",
//     text: "text-red-700",
//     ring: "ring-red-500/20",
//     icon: ShieldCheckIcon,
//     label: "Admin",
//   },
//   MANAGER: {
//     bg: "bg-purple-50",
//     text: "text-purple-700",
//     ring: "ring-purple-500/20",
//     icon: UserGroupIcon,
//     label: "Manager",
//   },
//   SALES_REP: {
//     bg: "bg-blue-50",
//     text: "text-blue-700",
//     ring: "ring-blue-500/20",
//     icon: UserIcon,
//     label: "Sales Rep",
//   },
// };

// // Status styles
// const STATUS_STYLES = {
//   active: {
//     bg: "bg-green-50",
//     text: "text-green-700",
//     ring: "ring-green-500/20",
//     dot: "bg-green-500",
//     icon: CheckCircleIcon,
//   },
//   inactive: {
//     bg: "bg-red-50",
//     text: "text-red-700",
//     ring: "ring-red-500/20",
//     dot: "bg-red-500",
//     icon: XCircleIcon,
//   },
// };

// // Detect email provider based on domain
// // const detectEmailProvider = (email) => {
// //   if (!email) return "SMTP";

// //   const domain = email.split("@")[1]?.toLowerCase();

// //   if (domain.includes("gmail.com")) return "GOOGLE";

// //   if (
// //     domain.includes("outlook.com") ||
// //     domain.includes("hotmail.com") ||
// //     domain.includes("live.com")
// //   ) {
// //     return "MICROSOFT";
// //   }

// //   return "SMTP";
// // };

// export default function Users() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const {
//     users,
//     loading,
//     user: currentUser,
//   } = useSelector((state) => state.auth);
//   // const emailProvider =
//   //   currentUser?.emailProvider || detectEmailProvider(currentUser?.email);

//   const [deleteModal, setDeleteModal] = useState({
//     open: false,
//     id: null,
//     name: "",
//   });
//   const [deleting, setDeleting] = useState(false);
//   const [showExportDropdown, setShowExportDropdown] = useState(false);

//   useEffect(() => {
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   const handleDelete = async () => {
//     setDeleting(true);
//     try {
//       await dispatch(deleteUser(deleteModal.id)).unwrap();
//       toast.success("User deleted successfully");
//       setDeleteModal({ open: false, id: null, name: "" });
//     } catch (err) {
//       toast.error(err || "Failed to delete user");
//     } finally {
//       setDeleting(false);
//     }
//   };

//   // const connectGmail = async () => {
//   //   try {
//   //     const res = await fetch(
//   //       "http://localhost:5000/api/email/connect/google",
//   //       { 
//   //         headers: {
//   //           Authorization: `Bearer ${localStorage.getItem("token")}`,
//   //         },
//   //       },
//   //     );

//   //     const data = await res.json();

//   //     if (!data.url) {
//   //       throw new Error("OAuth URL not returned");
//   //     }

//   //     window.location.href = data.url;
//   //   } catch (err) {
//   //     console.error("Google connect failed", err);
//   //     toast.error("Unable to connect Gmail");
//   //   }
//   // };

//   const connectOutlook = async () => {
//     try {
//       const API = import.meta.env.VITE_API_BASE_URL;

//       const res = await fetch(`${API}/email/connect/outlook`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       const data = await res.json();

//       if (!data.url) {
//         throw new Error("OAuth URL not returned");
//       }

//       window.location.href = data.url;
//     } catch (err) {
//       console.error("Outlook connect failed", err);
//       toast.error("Unable to connect Outlook");
//     }
//   };

//   // Stats calculation
//   const totalUsers = users.length;
//   const activeUsers = users.filter((u) => u.isActive).length;
//   const adminCount = users.filter((u) => u.role === "ADMIN").length;
//   const managerCount = users.filter((u) => u.role === "MANAGER").length;

//   const prepareExportData = () => {
//     return users.map((u) => ({
//       UserID: u.id,
//       EmployeeID: u.employeeId,
//       Name: u.name,
//       Username: u.username,
//       Email: u.email,
//       Role: u.role,
//       Status: u.isActive ? "Active" : "Inactive",
//       EmailConnected: u.emailProvider ? "Yes" : "No",
//     }));
//   };

//   const exportCSV = () => {
//     const data = prepareExportData();

//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const csv = XLSX.utils.sheet_to_csv(worksheet);

//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     saveAs(blob, `users_export_${Date.now()}.csv`);

//     setShowExportDropdown(false);
//   };

//   const exportExcel = () => {
//     const data = prepareExportData();

//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();

//     XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

//     const excelBuffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//     });

//     const blob = new Blob([excelBuffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });

//     saveAs(blob, `users_export_${Date.now()}.xlsx`);

//     setShowExportDropdown(false);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Users</h1>
//           <p className="mt-1 text-sm text-gray-500">
//             Manage team members and their access levels
//           </p>
//         </div>
//         <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
//           {/* EXPORT */}
//           <div className="relative">
//             <button
//               onClick={() => setShowExportDropdown(!showExportDropdown)}
//               disabled={!users.length}
//               className="inline-flex items-center gap-2 px-3 sm:px-4 py-2.5 text-sm font-medium bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
//             >
//               <ArrowDownTrayIcon className="w-4 h-4 sm:w-5 sm:h-5" />
//               <span className="hidden sm:inline">Export</span>
//             </button>

//             {showExportDropdown && (
//               <>
//                 {/* Backdrop */}
//                 <div
//                   className="fixed inset-0 z-40"
//                   onClick={() => setShowExportDropdown(false)}
//                 />

//                 {/* Dropdown (RESPONSIVE SAFE) */}
//                 <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-44 max-w-[95vw] bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
//                   <button
//                     onClick={exportExcel}
//                     className="block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50"
//                   >
//                     Export as Excel
//                   </button>

//                   <button
//                     onClick={exportCSV}
//                     className="block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50"
//                   >
//                     Export as CSV
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>

//           {/* ADD USER */}
//           <Link
//             to="/users/create"
//             className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700"
//           >
//             <PlusIcon className="w-5 h-5" />
//             Add User
//           </Link>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         <div className="bg-white rounded-xl border border-gray-200 p-5">
//           <div className="flex items-center gap-3">
//             <div className="p-2.5 bg-indigo-50 rounded-lg">
//               <UserGroupIcon className="w-6 h-6 text-indigo-600" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
//               <p className="text-sm text-gray-500">Total Users</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl border border-gray-200 p-5">
//           <div className="flex items-center gap-3">
//             <div className="p-2.5 bg-green-50 rounded-lg">
//               <CheckCircleIcon className="w-6 h-6 text-green-600" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
//               <p className="text-sm text-gray-500">Active Users</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl border border-gray-200 p-5">
//           <div className="flex items-center gap-3">
//             <div className="p-2.5 bg-red-50 rounded-lg">
//               <ShieldCheckIcon className="w-6 h-6 text-red-600" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-gray-900">{adminCount}</p>
//               <p className="text-sm text-gray-500">Admins</p>
//             </div>
//           </div>
//         </div>
//         <div className="bg-white rounded-xl border border-gray-200 p-5">
//           <div className="flex items-center gap-3">
//             <div className="p-2.5 bg-purple-50 rounded-lg">
//               <UserGroupIcon className="w-6 h-6 text-purple-600" />
//             </div>
//             <div>
//               <p className="text-2xl font-bold text-gray-900">{managerCount}</p>
//               <p className="text-sm text-gray-500">Managers</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Users Table */}
//       <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
//         {loading ? (
//           <div className="flex items-center justify-center py-20">
//             <div className="flex flex-col items-center gap-3">
//               <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
//               <p className="text-sm text-gray-500">Loading users...</p>
//             </div>
//           </div>
//         ) : users.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-20">
//             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//               <UserGroupIcon className="w-8 h-8 text-gray-400" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-1">
//               No users found
//             </h3>
//             <p className="text-sm text-gray-500 mb-4">
//               Get started by creating your first user
//             </p>
//             <Link
//               to="/users/create"
//               className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
//             >
//               <PlusIcon className="w-4 h-4 mr-1.5" />
//               Create User
//             </Link>
//           </div>
//         ) : (
//           <>
//             {/* Desktop Table */}
//             <div className="hidden lg:block overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="bg-gray-50 border-b border-gray-200">
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       User
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Employee ID
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Email
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Role
//                     </th>
//                     <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Email Status
//                     </th>
//                     {/* <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Status
//                     </th> */}
//                     <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {users.map((user) => {
//                     const roleStyle =
//                       ROLE_STYLES[user.role] || ROLE_STYLES.SALES_REP;
//                     const RoleIcon = roleStyle.icon;
//                     const statusStyle = user.isActive
//                       ? STATUS_STYLES.active
//                       : STATUS_STYLES.inactive;
//                     const isCurrentUser = currentUser?.id === user.id;

//                     return (
//                       <tr
//                         key={user.id}
//                         className="hover:bg-gray-50/50 transition-colors duration-150 group"
//                       >
//                         {/* User Info */}
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-3">
//                             {/* <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
//                               <span className="text-white font-semibold text-sm">
//                                 {user.name?.charAt(0)?.toUpperCase()}
//                               </span>
//                             </div> */}
//                             <div>
//                               <div className="flex items-center gap-2">
//                                 <p className="text-sm font-semibold text-gray-900">
//                                   {user.name}
//                                 </p>
//                                 {isCurrentUser && (
//                                   <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-100 text-indigo-700 rounded uppercase">
//                                     You
//                                   </span>
//                                 )}
//                               </div>
//                               {/* <p className="text-xs text-gray-400 mt-0.5">
//                                 ID: {user.id?.slice(0, 8)}...
//                               </p> */}
//                             </div>
//                           </div>
//                         </td>

//                         {/* Employee ID */}
//                         <td className="px-6 py-4">
//                           <p className="text-sm text-gray-600 font-medium">
//                             {user.employeeId || "N/A"}
//                           </p>
//                         </td>

//                         {/* Email */}
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-2">
//                             <EnvelopeIcon className="w-4 h-4 text-gray-400" />
//                             <a
//                               href={`mailto:${user.email}`}
//                               className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
//                             >
//                               {user.email}
//                             </a>
//                           </div>
//                         </td>

//                         {/* Role */}
//                         <td className="px-6 py-4">
//                           <span
//                             className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${roleStyle.bg} ${roleStyle.text} ${roleStyle.ring}`}
//                           >
//                             <RoleIcon className="w-3.5 h-3.5" />
//                             {roleStyle.label}
//                           </span>
//                         </td>

//                         {/* Email Connection Status */}
//                         <td className="px-6 py-4">
//                           {user.emailProvider ? (
//                             <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 ring-1 ring-green-500/20">
//                               <CheckCircleIcon className="w-3.5 h-3.5" />
//                               Connected
//                             </span>
//                           ) : (
//                             <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 ring-1 ring-gray-300">
//                               <XCircleIcon className="w-3.5 h-3.5" />
//                               Not Connected
//                             </span>
//                           )}
//                         </td>

//                         {/* Status */}
//                         {/* <td className="px-6 py-4">
//                           <span
//                             className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${statusStyle.bg} ${statusStyle.text} ${statusStyle.ring}`}
//                           >
//                             <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
//                             {user.isActive ? "Active" : "Inactive"}
//                           </span>
//                         </td> */}

//                         {/* Actions */}
//                         <td className="px-6 py-4">
//                           <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                             <Link
//                               to={`/users/${user.id}`}
//                               className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200"
//                               title="Edit User"
//                             >
//                               <PencilSquareIcon className="w-4 h-4" />
//                             </Link>
//                             {currentUser?.role !== "SALES_REP" && (
//                               <button
//                                 onClick={() =>
//                                   setDeleteModal({
//                                     open: true,
//                                     id: user.id,
//                                     name: user.name,
//                                   })
//                                 }
//                                 disabled={isCurrentUser}
//                                 className={`p-2 rounded-lg transition-all duration-200 ${
//                                   isCurrentUser
//                                     ? "text-gray-300 cursor-not-allowed"
//                                     : "text-gray-500 hover:text-red-600 hover:bg-red-50"
//                                 }`}
//                                 title={
//                                   isCurrentUser
//                                     ? "Cannot delete yourself"
//                                     : "Delete User"
//                                 }
//                               >
//                                 <TrashIcon className="w-4 h-4" />
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>

//             {/* Mobile Card View */}
//             <div className="lg:hidden divide-y divide-gray-100">
//               {users.map((user) => {
//                 const roleStyle =
//                   ROLE_STYLES[user.role] || ROLE_STYLES.SALES_REP;
//                 const RoleIcon = roleStyle.icon;
//                 const statusStyle = user.isActive
//                   ? STATUS_STYLES.active
//                   : STATUS_STYLES.inactive;
//                 const isCurrentUser = currentUser?.id === user.id;

//                 return (
//                   <div
//                     key={user.id}
//                     className="p-4 hover:bg-gray-50/50 transition-colors"
//                   >
//                     {/* Header Row */}
//                     <div className="flex items-start justify-between gap-3 mb-3">
//                       <div className="flex items-center gap-3">
//                         <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
//                           <span className="text-white font-bold text-lg">
//                             {user.name?.charAt(0)?.toUpperCase()}
//                           </span>
//                         </div>
//                         <div>
//                           <div className="flex items-center gap-2">
//                             <p className="text-sm font-semibold text-gray-900">
//                               {user.name}
//                             </p>
//                             {isCurrentUser && (
//                               <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-100 text-indigo-700 rounded uppercase">
//                                 You
//                               </span>
//                             )}
//                           </div>
//                           <p className="text-xs text-gray-500 mt-0.5">
//                             {user.email}
//                           </p>
//                         </div>
//                       </div>
//                       <span
//                         className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${roleStyle.bg} ${roleStyle.text}`}
//                       >
//                         <RoleIcon className="w-3 h-3" />
//                         {roleStyle.label}
//                       </span>
//                     </div>

//                     {/* Footer Row */}
//                     <div className="flex items-center justify-between pt-3 border-t border-gray-100">
//                       <span
//                         className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}
//                       >
//                         <span
//                           className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
//                         />
//                         {user.isActive ? "Active" : "Inactive"}
//                       </span>
//                       <div className="flex items-center gap-1">
//                         <Link
//                           to={`/users/${user.id}`}
//                           className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
//                         >
//                           <PencilSquareIcon className="w-4 h-4" />
//                         </Link>
//                         {currentUser?.role !== "SALES_REP" && (
//                           <button
//                             onClick={() =>
//                               setDeleteModal({
//                                 open: true,
//                                 id: user.id,
//                                 name: user.name,
//                               })
//                             }
//                             disabled={isCurrentUser}
//                             className={`p-2 rounded-lg transition-all ${
//                               isCurrentUser
//                                 ? "text-gray-300 cursor-not-allowed"
//                                 : "text-gray-500 hover:text-red-600 hover:bg-red-50"
//                             }`}
//                           >
//                             <TrashIcon className="w-4 h-4" />
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </>
//         )}
//       </div>

//       {/* Delete Confirmation Modal */}
//       {deleteModal.open && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4">
//             {/* Backdrop */}
//             <div
//               className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
//               onClick={() =>
//                 setDeleteModal({ open: false, id: null, name: "" })
//               }
//             />

//             {/* Modal */}
//             <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all">
//               <div className="text-center">
//                 <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <ExclamationTriangleIcon className="w-7 h-7 text-red-600" />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                   Delete User
//                 </h3>
//                 <p className="text-sm text-gray-500 mb-6">
//                   Are you sure you want to delete{" "}
//                   <span className="font-semibold text-gray-700">
//                     "{deleteModal.name}"
//                   </span>
//                   ? This will permanently remove their account and all
//                   associated data. This action cannot be undone.
//                 </p>
//               </div>

//               <div className="flex gap-3">
//                 <button
//                   onClick={() =>
//                     setDeleteModal({ open: false, id: null, name: "" })
//                   }
//                   disabled={deleting}
//                   className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDelete}
//                   disabled={deleting}
//                   className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
//                 >
//                   {deleting ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
//                       Deleting...
//                     </>
//                   ) : (
//                     "Delete User"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// src/features/users/Users.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchUsers, deleteUser } from "../auth/authSlice";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import toast from "react-hot-toast";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  UserIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import {
  UserGroupIcon as UserGroupSolid,
  CheckCircleIcon as CheckCircleSolid,
} from "@heroicons/react/24/solid";

// Role styles
const ROLE_STYLES = {
  ADMIN: {
    bg: "bg-rose-100",
    text: "text-rose-700",
    border: "border-rose-200",
    icon: ShieldCheckIcon,
    label: "Admin",
    gradient: "from-rose-500 to-rose-600",
  },
  MANAGER: {
    bg: "bg-violet-100",
    text: "text-violet-700",
    border: "border-violet-200",
    icon: UserGroupIcon,
    label: "Manager",
    gradient: "from-violet-500 to-violet-600",
  },
  SALES_REP: {
    bg: "bg-sky-100",
    text: "text-sky-700",
    border: "border-sky-200",
    icon: UserIcon,
    label: "Sales Rep",
    gradient: "from-sky-500 to-sky-600",
  },
};

// Status styles
const STATUS_STYLES = {
  active: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    icon: CheckCircleIcon,
  },
  inactive: {
    bg: "bg-rose-100",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500",
    icon: XCircleIcon,
  },
};

export default function Users() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, user: currentUser } = useSelector((state) => state.auth);

  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });
  const [deleting, setDeleting] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers({ showInactive }));
  }, [dispatch, showInactive]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteUser(deleteModal.id)).unwrap();
      toast.success("User deleted successfully");
      setDeleteModal({ open: false, id: null, name: "" });
    } catch (err) {
      toast.error(err || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  // Stats calculation
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const managerCount = users.filter((u) => u.role === "MANAGER").length;

  const prepareExportData = () => {
    return users.map((u) => ({
      UserID: u.id,
      EmployeeID: u.employeeId,
      Name: u.name,
      Username: u.username,
      Email: u.email,
      Role: u.role,
      Status: u.isActive ? "Active" : "Inactive",
      EmailConnected: u.emailProvider ? "Yes" : "No",
      MaxDiscount: u.maxDiscount || 0,
    }));
  };

  const exportCSV = () => {
    const data = prepareExportData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `users_export_${Date.now()}.csv`);
    setShowExportDropdown(false);
  };

  const exportExcel = () => {
    const data = prepareExportData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `users_export_${Date.now()}.xlsx`);
    setShowExportDropdown(false);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        <div className="bg-gradient-to-br from-[#3B2E7E] to-[#2A1F5C] rounded-2xl p-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <UserGroupSolid className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-extrabold">{totalUsers}</p>
              <p className="text-xs font-medium text-purple-200">Total Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-emerald-200 p-4 hover:shadow-lg hover:shadow-emerald-100 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
              <CheckCircleSolid className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-emerald-900">{activeUsers}</p>
              <p className="text-xs font-medium text-emerald-600">Active</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-rose-200 p-4 hover:shadow-lg hover:shadow-rose-100 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center shadow-lg shadow-rose-200">
              <ShieldCheckIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-rose-900">{adminCount}</p>
              <p className="text-xs font-medium text-rose-600">Admins</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-violet-200 p-4 hover:shadow-lg hover:shadow-violet-100 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-200">
              <UserGroupIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-violet-900">{managerCount}</p>
              <p className="text-xs font-medium text-violet-600">Managers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-[#3B2E7E]/10 shadow-sm shadow-[#3B2E7E]/5 flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-[#3B2E7E]/10 flex-shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-800">
                {totalUsers} <span className="font-normal text-slate-500">users</span>
              </span>

              <div className="h-6 w-px bg-slate-200 mx-1" />

              <label className="flex items-center gap-2 cursor-pointer group select-none">
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={showInactive}
                    onChange={(e) => setShowInactive(e.target.checked)}
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3B2E7E]"></div>
                </div>
                <span className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${showInactive ? 'text-[#3B2E7E]' : 'text-slate-400 group-hover:text-slate-600'}`}>
                  Show Inactive
                </span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              {/* Export */}
              <div className="relative">
                <button
                  onClick={() => setShowExportDropdown(!showExportDropdown)}
                  disabled={!users.length}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-white text-slate-600 border-2 border-slate-200 rounded-xl hover:border-[#3B2E7E]/30 transition-all disabled:opacity-40"
                >
                  <ArrowDownTrayIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>

                {showExportDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowExportDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                      <button
                        onClick={exportExcel}
                        className="block w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#3B2E7E]/5 hover:text-[#3B2E7E] transition-colors"
                      >
                        📊 Export Excel
                      </button>
                      <button
                        onClick={exportCSV}
                        className="block w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-[#3B2E7E]/5 hover:text-[#3B2E7E] transition-colors"
                      >
                        📄 Export CSV
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Add User */}
              <Link
                to="/users/create"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#3B2E7E] to-[#2A1F5C] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#3B2E7E]/25 active:scale-[0.98] transition-all"
              >
                <PlusIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Add User</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto min-h-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-[#3B2E7E]/20 rounded-full" />
                  <div className="absolute top-0 left-0 w-12 h-12 border-4 border-[#3B2E7E] border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-sm font-medium text-slate-500">Loading users...</p>
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-gradient-to-br from-[#3B2E7E]/10 to-purple-100 rounded-2xl flex items-center justify-center mb-4">
                <UserGroupSolid className="w-8 h-8 text-[#3B2E7E]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">No users found</h3>
              <p className="text-sm text-slate-500 mb-4">Get started by creating your first user</p>
              <Link
                to="/users/create"
                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-[#3B2E7E] to-[#2A1F5C] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#3B2E7E]/25"
              >
                <PlusIcon className="w-4 h-4 mr-1.5" />
                Create User
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block">
                <table className="w-full">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-white border-[#3B2E7E]/10">
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Employee ID
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Mobile
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Email Status
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Max Discount
                      </th>
                      <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((user, index) => {
                      const roleStyle = ROLE_STYLES[user.role] || ROLE_STYLES.SALES_REP;
                      const RoleIcon = roleStyle.icon;
                      const statusStyle = user.isActive ? STATUS_STYLES.active : STATUS_STYLES.inactive;
                      const isCurrentUser = currentUser?.id === user.id;

                      return (
                        <tr
                          key={user.id}
                          className={`group hover:bg-[#3B2E7E]/5 transition-all duration-150 ${
                            index % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                          }`}
                        >
                          {/* User Info */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              {/* <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleStyle.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                <span className="text-white font-bold text-sm">
                                  {user.name?.charAt(0)?.toUpperCase()}
                                </span>
                              </div> */}
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-bold text-slate-900 group-hover:text-[#3B2E7E] transition-colors">
                                    {user.name}
                                  </p>
                                  {isCurrentUser && (
                                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#3B2E7E] text-white rounded uppercase">
                                      You
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-400 mt-0.5">@{user.username}</p>
                              </div>
                            </div>
                          </td>

                          {/* Employee ID */}
                          <td className="px-5 py-4">
                            <span className="text-sm font-medium text-slate-600">
                              {user.employeeId || "—"}
                            </span>
                          </td>

                          {/* Email */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <EnvelopeIcon className="w-4 h-4 text-slate-400" />
                              <a
                                href={`mailto:${user.email}`}
                                className="text-sm text-slate-600 hover:text-[#3B2E7E] transition-colors"
                              >
                                {user.email}
                              </a>
                            </div>
                          </td>
 
                          {/* Mobile */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <PhoneIcon className="w-4 h-4 text-slate-400" />
                              <span className="text-sm text-slate-600">
                                {user.mobile || "—"}
                              </span>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${roleStyle.bg} ${roleStyle.text} border ${roleStyle.border}`}>
                              <RoleIcon className="w-3.5 h-3.5" />
                              {roleStyle.label}
                            </span>
                          </td>

                          {/* Email Connection Status */}
                          <td className="px-5 py-4">
                            {user.emailProvider ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                <CheckCircleIcon className="w-3.5 h-3.5" />
                                Connected
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                <XCircleIcon className="w-3.5 h-3.5" />
                                Not Connected
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>

                          {/* Max Discount */}
                          <td className="px-5 py-4">
                            <span className="text-sm font-bold text-slate-700">
                              {user.role === "ADMIN" ? (
                                <span className="text-emerald-600">Unlimited</span>
                              ) : (
                                `${user.maxDiscount || 0}%`
                              )}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <Link
                                to={`/users/${user.id}`}
                                className="p-2 text-slate-400 hover:text-[#3B2E7E] hover:bg-[#3B2E7E]/10 rounded-lg transition-all"
                                title="Edit User"
                              >
                                <PencilSquareIcon className="w-4 h-4" />
                              </Link>
                              {currentUser?.role !== "SALES_REP" && (
                                <button
                                  onClick={() => setDeleteModal({ open: true, id: user.id, name: user.name })}
                                  disabled={isCurrentUser}
                                  className={`p-2 rounded-lg transition-all ${
                                    isCurrentUser
                                      ? "text-slate-300 cursor-not-allowed"
                                      : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                  }`}
                                  title={isCurrentUser ? "Cannot delete yourself" : "Delete User"}
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden divide-y divide-slate-100">
                {users.map((user) => {
                  const roleStyle = ROLE_STYLES[user.role] || ROLE_STYLES.SALES_REP;
                  const RoleIcon = roleStyle.icon;
                  const statusStyle = user.isActive ? STATUS_STYLES.active : STATUS_STYLES.inactive;
                  const isCurrentUser = currentUser?.id === user.id;

                  return (
                    <div key={user.id} className="p-4 hover:bg-[#3B2E7E]/5 transition-colors">
                      {/* Header Row */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${roleStyle.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                            <span className="text-white font-bold text-lg">
                              {user.name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-slate-900">{user.name}</p>
                              {isCurrentUser && (
                                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#3B2E7E] text-white rounded uppercase">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mt-1">
                              Limit: {user.maxDiscount || 0}% Discount
                            </p>
                          </div>
                        </div>
                        <span className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${roleStyle.bg} ${roleStyle.text}`}>
                          <RoleIcon className="w-3 h-3" />
                          {roleStyle.label}
                        </span>
                      </div>

                      {/* Footer Row */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-bold ${statusStyle.bg} ${statusStyle.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                          {user.emailProvider && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700">
                              <CheckCircleIcon className="w-3 h-3" />
                              Email
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/users/${user.id}`}
                            className="p-2 text-slate-400 hover:text-[#3B2E7E] hover:bg-[#3B2E7E]/10 rounded-lg transition-all"
                          >
                            <PencilSquareIcon className="w-4 h-4" />
                          </Link>
                          {currentUser?.role !== "SALES_REP" && (
                            <button
                              onClick={() => setDeleteModal({ open: true, id: user.id, name: user.name })}
                              disabled={isCurrentUser}
                              className={`p-2 rounded-lg transition-all ${
                                isCurrentUser
                                  ? "text-slate-300 cursor-not-allowed"
                                  : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              }`}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setDeleteModal({ open: false, id: null, name: "" })}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-100 to-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <ExclamationTriangleIcon className="w-7 h-7 text-rose-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Delete User</h3>
                <p className="text-sm text-slate-600 mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-bold text-slate-800">"{deleteModal.name}"</span>?
                  <br />
                  <span className="text-xs text-rose-500 mt-1 inline-block">This cannot be undone.</span>
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ open: false, id: null, name: "" })}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-all disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
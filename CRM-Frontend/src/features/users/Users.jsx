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
  PhoneIcon,
  SparklesIcon,
  BriefcaseIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import {
  UserGroupIcon as UserGroupSolid,
  CheckCircleIcon as CheckCircleSolid,
} from "@heroicons/react/24/solid";
import AdminResetPasswordModal from "../auth/AdminResetPasswordModal";

// Role styles
const ROLE_STYLES = {
  SUPER_ADMIN: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    icon: ShieldCheckIcon,
    label: "Super Admin",
    gradient: "from-rose-500 to-rose-600",
  },
  TSL: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    icon: SparklesIcon,
    label: "TSL",
    gradient: "from-emerald-500 to-emerald-600",
  },
  MANAGER: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    icon: UserGroupIcon,
    label: "Manager",
    gradient: "from-violet-500 to-violet-600",
  },
  KAM: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    icon: UserIcon,
    label: "KAM",
    gradient: "from-amber-500 to-amber-600",
  },
  TSE: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    icon: BriefcaseIcon,
    label: "TSE",
    gradient: "from-sky-500 to-sky-600",
  },
};

// Status styles
const STATUS_STYLES = {
  active: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    icon: CheckCircleIcon,
  },
  inactive: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-500",
    icon: XCircleIcon,
  },
};

export default function Users() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, user: currentUser } = useSelector((state) => state.auth);

  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });
  const [resetModal, setResetModal] = useState({ open: false, user: null });
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
  const adminCount = users.filter((u) => ["SUPER_ADMIN", "TSL"].includes(u.role)).length;
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
    <div className="h-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Team Management</h1>
          <p className="text-sm text-slate-500 font-medium">Manage organization hierarchy and access control</p>
        </div>
        <div className="flex items-center gap-3">
           {/* EXPORT */}
           <div className="relative">
            <button
              onClick={() => setShowExportDropdown(!showExportDropdown)}
              disabled={!users.length}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-600 text-sm font-bold rounded-xl border-2 border-slate-100 hover:border-[#3B2E7E]/30 transition-all disabled:opacity-40"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              <span>Export</span>
            </button>

            {showExportDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowExportDropdown(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden p-1">
                  <button onClick={exportExcel} className="flex items-center w-full px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                    Excel Spreadsheet
                  </button>
                  <button onClick={exportCSV} className="flex items-center w-full px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                    CSV Document
                  </button>
                </div>
              </>
            )}
          </div>

          <Link
            to="/users/create"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#3B2E7E] text-white text-sm font-bold rounded-xl hover:bg-[#2A1F5C] shadow-lg shadow-[#3B2E7E]/20 transition-all"
          >
            <PlusIcon className="w-5 h-5" />
            Add User
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#3B2E7E] to-[#2A1F5C] rounded-2xl p-5 text-white relative overflow-hidden shadow-lg shadow-[#3B2E7E]/10">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <UserGroupSolid className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-extrabold">{totalUsers}</p>
              <p className="text-xs font-bold text-purple-200 uppercase tracking-wider">Total Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-emerald-100 p-5 hover:shadow-xl hover:shadow-emerald-500/5 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
              <CheckCircleSolid className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900">{activeUsers}</p>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Active</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-rose-100 p-5 hover:shadow-xl hover:shadow-rose-500/5 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-200">
              <ShieldCheckIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900">{adminCount}</p>
              <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Admins</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-violet-100 p-5 hover:shadow-xl hover:shadow-violet-500/5 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500 flex items-center justify-center shadow-lg shadow-violet-200">
              <UserGroupIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900">{managerCount}</p>
              <p className="text-xs font-bold text-violet-600 uppercase tracking-wider">Managers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-800">
                {totalUsers} <span className="font-normal text-slate-500">registered users</span>
              </span>
              <div className="h-4 w-px bg-slate-300" />
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={showInactive}
                    onChange={(e) => setShowInactive(e.target.checked)}
                  />
                  <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3B2E7E]"></div>
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors uppercase tracking-wider">
                  Show Inactive
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-12 h-12 border-4 border-[#3B2E7E] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-bold text-slate-500">Synchronizing team data...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24">
               <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-4">
                <UserGroupIcon className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No users found</h3>
              <p className="text-sm text-slate-500 mb-6">Start building your team by adding a new user</p>
              <Link to="/users/create" className="px-6 py-2.5 bg-[#3B2E7E] text-white text-sm font-bold rounded-xl hover:bg-[#2A1F5C] transition-all">
                Create First User
              </Link>
            </div>
          ) : (
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">User</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Employee ID</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Contact</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Role</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Email Status</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Max Discount</th>
                      <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {users.map((user) => {
                      const roleStyle = ROLE_STYLES[user.role] || ROLE_STYLES.KAM;
                      const RoleIcon = roleStyle.icon;
                      const statusStyle = user.isActive ? STATUS_STYLES.active : STATUS_STYLES.inactive;
                      const isCurrentUser = currentUser?.id === user.id;
                      const canReset = (currentUser.role === "SUPER_ADMIN") || (currentUser.role === "TSL" && user.role !== "SUPER_ADMIN");

                      return (
                        <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-6 py-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                                {isCurrentUser && (
                                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#3B2E7E] text-white rounded-md uppercase">You</span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5">@{user.username}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-semibold text-slate-600">{user.employeeId || "—"}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                <EnvelopeIcon className="w-3.5 h-3.5" />
                                <span>{user.email}</span>
                              </div>
                              {user.mobile && (
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                  <PhoneIcon className="w-3.5 h-3.5" />
                                  <span>{user.mobile}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${roleStyle.bg} ${roleStyle.text}`}>
                              <RoleIcon className="w-3.5 h-3.5" />
                              {roleStyle.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {user.emailProvider ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                                <CheckCircleIcon className="w-4 h-4" />
                                Connected
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                <XCircleIcon className="w-4 h-4" />
                                Not Connected
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${statusStyle.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-bold ${["SUPER_ADMIN", "TSL"].includes(user.role) ? 'text-emerald-600' : 'text-slate-700'}`}>
                              {["SUPER_ADMIN", "TSL"].includes(user.role) ? "Unlimited" : `${user.maxDiscount || 0}%`}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {canReset && !isCurrentUser && (
                                <button
                                  onClick={() => setResetModal({ open: true, user })}
                                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                  title="Force Password Reset"
                                >
                                  <KeyIcon className="w-4 h-4" />
                                </button>
                              )}
                              <Link
                                to={`/users/${user.id}`}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                title="Edit User"
                              >
                                <PencilSquareIcon className="w-4 h-4" />
                              </Link>
                              {!isCurrentUser && ["SUPER_ADMIN", "TSL"].includes(currentUser?.role) && (
                                <button
                                  onClick={() => setDeleteModal({ open: true, id: user.id, name: user.name })}
                                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                  title="Delete User"
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
            </div>
          )}
        </div>
      </div>

      <AdminResetPasswordModal
        open={resetModal.open}
        onClose={() => setResetModal({ open: false, user: null })}
        userToReset={resetModal.user}
      />

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setDeleteModal({ open: false, id: null, name: "" })} />
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ExclamationTriangleIcon className="w-10 h-10 text-rose-600" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mb-2">Confirm Deletion</h3>
              <p className="text-sm text-slate-500 font-medium px-4">
                Are you sure you want to delete <span className="text-slate-900 font-bold">"{deleteModal.name}"</span>? This action cannot be undone.
              </p>
            </div>
            <div className="p-4 bg-slate-50 flex items-center gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, id: null, name: "" })}
                className="flex-1 py-3 px-6 rounded-2xl text-sm font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-3 px-6 rounded-2xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
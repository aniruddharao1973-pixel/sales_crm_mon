import { useState } from "react";
import { useDispatch } from "react-redux";
import { resetUserPassword } from "./authSlice";
import toast from "react-hot-toast";
import Modal from "../../components/Modal";
import {
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const AdminResetPasswordModal = ({ open, onClose, userToReset }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({
    newPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const res = await dispatch(
        resetUserPassword({
          id: userToReset.id,
          newPassword: form.newPassword,
        })
      ).unwrap();

      toast.success(res.message || `Password for ${userToReset.name} updated`);
      setForm({ newPassword: "" });
      onClose();
    } catch (err) {
      toast.error(err || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Administrative Control" size="sm">
      <div className="p-1">
        <div className="flex items-center gap-4 mb-8 bg-rose-50 p-4 rounded-2xl border border-rose-100">
          <div className="w-12 h-12 rounded-xl bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-200">
            <LockClosedIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Force Password Reset</h3>
            <p className="text-xs text-slate-500 font-medium">
              Manually update password for <span className="text-rose-600 font-bold">{userToReset?.name}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
              New Password
            </label>
            <div className="relative group">
              <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-rose-600 transition-colors" />
              <input
                type={showNew ? "text" : "password"}
                required
                autoFocus
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-rose-600 transition-all outline-none"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-slate-600 transition-colors"
              >
                {showNew ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 px-6 rounded-2xl text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-3.5 px-6 rounded-2xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Resetting...</span>
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AdminResetPasswordModal;

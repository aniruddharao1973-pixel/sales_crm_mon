
// src/features/auth/Login.jsx
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, clearError } from "./authSlice";
import toast from "react-hot-toast";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  ShieldCheckIcon,
  BriefcaseIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import bgImage from "../../assets/register.png";
import { CheckIcon } from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, user } = useSelector((state) => state.auth);
  const hasNavigated = useRef(false);

  useEffect(() => {
    if (user && !hasNavigated.current) {
      hasNavigated.current = true;
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [user, location.state, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      return toast.error("Please fill in all fields");
    }
    dispatch(loginUser(form));
  };

  if (user) return null;

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      {/* LEFT SIDE - Hero Section (Visible on LG up) */}
      <div className="hidden lg:flex w-1/2 relative bg-white overflow-hidden">
        {/* Background Image/Illustration */}
        <div className="absolute inset-0 z-0">
          <img
            src={bgImage}
            alt="Login Illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 w-full h-full flex flex-col p-12">
          {/* Logo Branding */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#1e3a5f] rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">M</span>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Micrologic Edge
              </h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                Sales Intelligence Platform
              </p>
            </div>
          </div>

          {/* Marketing Content */}
          {/* <div className="mt-24 max-w-lg">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-10 border border-white/50 shadow-2xl shadow-blue-900/5">
              <h2 className="text-4xl font-black leading-tight text-slate-900 mb-2">
                Close deals faster.
              </h2>
              <h2 className="text-4xl font-black leading-tight text-[#1e3a5f] mb-6">
                Manage everything in one place.
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                Powerful pipeline tracking, customer management and team
                performance analytics designed for scale.
              </p>
            </div>
          </div> */}

          {/* Footer Branding */}
          <div className="mt-auto">
            <p className="text-sm text-slate-400 font-bold tracking-wide">
              © 2026 Micrologic Edge
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo Branding (Visible only on mobile/tablet) */}
          <div className="lg:hidden flex flex-col items-center mb-12">
            <div className="w-16 h-16 bg-[#1e3a5f] rounded-2xl flex items-center justify-center shadow-2xl mb-4">
              <span className="text-3xl font-bold text-white">M</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900">Micrologic Edge</h1>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">
              Sales Intelligence Platform
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-slate-100 p-8 sm:p-12 transition-all duration-300">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back</h2>
              <p className="text-slate-400 mt-2 font-medium">
                Sign in to your account to continue
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Username
                </label>
                <div className="relative group">
                  <UserIcon
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                      focusedField === "username" ? "text-[#1e3a5f]" : "text-slate-300"
                    }`}
                  />
                  <input
                    type="text"
                    required
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your username"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#1e3a5f] focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">
                  Password
                </label>
                <div className="relative group">
                  <LockClosedIcon
                    className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                      focusedField === "password" ? "text-[#1e3a5f]" : "text-slate-300"
                    }`}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••••••"
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-2xl text-sm font-semibold text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-[#1e3a5f] focus:bg-white transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-[#1e3a5f] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#152943] hover:shadow-2xl hover:shadow-blue-900/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Copyright for Mobile */}
          <p className="lg:hidden text-center text-sm font-bold text-slate-400 mt-12">
            © 2026 Micrologic Edge
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
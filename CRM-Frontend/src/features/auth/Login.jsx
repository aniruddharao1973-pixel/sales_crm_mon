// import { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { loginUser, clearError } from "./authSlice";
// import toast from "react-hot-toast";

// const Login = () => {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { loading, error, user } = useSelector((state) => state.auth);
//   const hasNavigated = useRef(false);

//   useEffect(() => {
//     if (user && !hasNavigated.current) {
//       hasNavigated.current = true;
//       const from = location.state?.from?.pathname || "/";
//       navigate(from, { replace: true });
//     }
//   }, [user, navigate, location]);

//   useEffect(() => {
//     if (error) {
//       toast.error(error);
//       dispatch(clearError());
//     }
//   }, [error, dispatch]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!form.email || !form.password) {
//       return toast.error("Please fill in all fields");
//     }
//     dispatch(loginUser(form));
//   };

//   const fillDemo = (email) => {
//     setForm({ email, password: "password123" });
//   };

//   if (user) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
//       <div className="w-full max-w-md">
//         <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
//           <div className="text-center mb-8">
//             <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
//               <span className="text-white text-2xl font-bold">CRM</span>
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
//             <p className="text-gray-500 mt-1">Sign in to your CRM account</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label className="label">Email Address</label>
//               <input
//                 type="email"
//                 className="input-field"
//                 placeholder="you@example.com"
//                 value={form.email}
//                 onChange={(e) => setForm({ ...form, email: e.target.value })}
//                 autoComplete="email"
//                 required
//               />
//             </div>

//             <div>
//               <label className="label">Password</label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   className="input-field pr-20"
//                   placeholder="••••••••"
//                   value={form.password}
//                   onChange={(e) => setForm({ ...form, password: e.target.value })}
//                   autoComplete="current-password"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-gray-700 font-medium"
//                 >
//                   {showPassword ? "Hide" : "Show"}
//                 </button>
//               </div>
//             </div>

//             <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 text-base">
//               {loading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
//                   </svg>
//                   Signing in...
//                 </span>
//               ) : (
//                 "Sign In"
//               )}
//             </button>
//           </form>

//           <p className="mt-6 text-center text-sm text-gray-500">
//             Don't have an account?{" "}
//             <Link to="/register" className="text-blue-600 font-medium hover:text-blue-500">
//               Create one
//             </Link>
//           </p>
//         </div>

//         <div className="mt-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200">
//           <p className="text-xs font-semibold text-gray-500 mb-3 text-center">QUICK LOGIN</p>
//           <div className="grid grid-cols-3 gap-2">
//             {[
//               { label: "Admin", email: "admin@crm.com" },
//               { label: "Manager", email: "sarah@crm.com" },
//               { label: "Sales", email: "john@crm.com" },
//             ].map((demo) => (
//               <button
//                 key={demo.email}
//                 type="button"
//                 onClick={() => fillDemo(demo.email)}
//                 className="px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all text-gray-600"
//               >
//                 {demo.label}
//               </button>
//             ))}
//           </div>
//           <p className="text-xs text-gray-400 text-center mt-2">Password: password123</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


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

  const fillDemo = (username) => {
    setForm({ username, password: "password123" });
  };

  if (user) return null;

  const demoAccounts = [
    {
      label: "Admin",
      username: "admin_user",
      icon: ShieldCheckIcon,
      color: "red",
      description: "Full access",
    },
    {
      label: "Manager",
      username: "manager_user",
      icon: UserIcon,
      color: "purple",
      description: "Team access",
    },
    {
      label: "Sales Rep",
      username: "sales_user",
      icon: BriefcaseIcon,
      color: "blue",
      description: "Basic access",
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE - Background Image with Text */}
      <div className="hidden lg:flex w-1/2 relative">
        {/* Background Image */}
        <img
          src={bgImage}
          alt="Login Background"
          className="w-full h-full object-cover"
        />

        {/* Text Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          {/* Top Section - Logo & Branding */}
          <div>
            <div className="flex items-center gap-3 mb-16">
              <div className="w-12 h-12 bg-[#1e3a5f] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">F</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                  FactEyes CRM
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  Sales Intelligence Platform
                </p>
              </div>
            </div>

            {/* Main Heading */}
            <div className="max-w-lg bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-xl ml-auto text-left">
              <h2 className="text-4xl font-bold leading-tight mb-2 text-gray-900">
                Close deals faster.
              </h2>
              <h2 className="text-4xl font-bold leading-tight text-[#1e3a5f] mb-6">
                Manage everything in one place.
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Powerful pipeline tracking, customer management and team
                performance analytics.
              </p>
            </div>
          </div>

          {/* Bottom Section - Footer */}
          <div>
            <p className="text-sm text-gray-600 font-medium">
              © 2026 FactEyes CRM
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-50 relative overflow-hidden p-6">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2" />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a87] rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-white">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Micrologic</h1>
              <p className="text-xs text-gray-500">CRM Platform</p>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
              <p className="text-gray-500 mt-1">
                Sign in to your account to continue
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <UserIcon
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === "username"
                        ? "text-indigo-600"
                        : "text-gray-400"
                      }`}
                  />
                  <input
                    type="text"
                    required
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value })
                    }
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your username"
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <LockClosedIcon
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === "password"
                        ? "text-indigo-600"
                        : "text-gray-400"
                      }`}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#1e3a5f] to-[#2d5a87] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRightIcon className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Quick Demo Access
                </span>
              </div>
            </div>

            {/* Demo Accounts */}
            <div className="grid grid-cols-3 gap-3">
              {demoAccounts.map((demo) => {
                const colorClasses = {
                  red: "hover:border-red-300 hover:bg-red-50 group-hover:text-red-600",
                  purple:
                    "hover:border-purple-300 hover:bg-purple-50 group-hover:text-purple-600",
                  blue: "hover:border-blue-300 hover:bg-blue-50 group-hover:text-blue-600",
                };
                const iconColorClasses = {
                  red: "bg-red-100 text-red-600",
                  purple: "bg-purple-100 text-purple-600",
                  blue: "bg-blue-100 text-blue-600",
                };

                return (
                  <button
                    key={demo.username}
                    type="button"
                    onClick={() => fillDemo(demo.username)}
                    className={`group flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-200 bg-white transition-all duration-200 ${colorClasses[demo.color]}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColorClasses[demo.color]}`}
                    >
                      <demo.icon className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-900">
                        {demo.label}
                      </p>
                      <p className="text-xs text-gray-500">{demo.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer for mobile */}
          <p className="lg:hidden text-center text-sm text-gray-500 mt-6">
            © 2026 FactEyes CRM
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
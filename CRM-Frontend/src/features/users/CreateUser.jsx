// // src/features/users/CreateUser.jsx

// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate, Link } from "react-router-dom";
// import { registerUser, fetchUsers } from "../auth/authSlice";
// import toast from "react-hot-toast";
// import {
//   ArrowLeftIcon,
//   UserIcon,
//   EnvelopeIcon,
//   LockClosedIcon,
//   ShieldCheckIcon,
//   ChevronRightIcon,
//   EyeIcon,
//   EyeSlashIcon,
//   UserGroupIcon,
//   BriefcaseIcon,
//   CheckIcon,
// } from "@heroicons/react/24/outline";

// // Form Section Component
// const FormSection = ({ title, subtitle, icon: Icon, children }) => (
//   <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//     <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
//       <div className="flex items-center gap-3">
//         {Icon && (
//           <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
//             <Icon className="w-4 h-4 text-indigo-600" />
//           </div>
//         )}
//         <div>
//           <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
//           {subtitle && (
//             <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
//           )}
//         </div>
//       </div>
//     </div>
//     <div className="p-5">{children}</div>
//   </div>
// );

// // Form Field Component
// const FormField = ({ label, required, children, error, hint }) => (
//   <div>
//     <label className="block text-sm font-medium text-gray-700 mb-1.5">
//       {label}
//       {required && <span className="text-red-500 ml-0.5">*</span>}
//     </label>
//     {children}
//     {hint && !error && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
//     {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
//   </div>
// );

// // Input Component
// const Input = ({
//   name,
//   value,
//   onChange,
//   type = "text",
//   placeholder,
//   required,
//   icon: Icon,
//   rightElement,
//   error,
// }) => (
//   <div className="relative">
//     {Icon && (
//       <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//     )}
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       required={required}
//       className={`
//         w-full px-3 py-2.5 text-sm bg-white border rounded-lg
//         placeholder:text-gray-400
//         focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
//         transition-all duration-200
//         ${Icon ? "pl-10" : ""}
//         ${rightElement ? "pr-10" : ""}
//         ${error ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" : "border-gray-300"}
//       `}
//     />
//     {rightElement && (
//       <div className="absolute right-3 top-1/2 -translate-y-1/2">
//         {rightElement}
//       </div>
//     )}
//   </div>
// );

// // Role options with descriptions
// const ROLE_OPTIONS = [
//   {
//     value: "SALES_REP",
//     label: "Sales Rep",
//     description: "Can manage their own deals, contacts, and tasks",
//     icon: BriefcaseIcon,
//     color: "blue",
//   },
//   {
//     value: "MANAGER",
//     label: "Manager",
//     description: "Can view and manage team's data and reports",
//     icon: UserGroupIcon,
//     color: "purple",
//   },
//   {
//     value: "ADMIN",
//     label: "Admin",
//     description: "Full access to all features, users, and settings",
//     icon: ShieldCheckIcon,
//     color: "red",
//   },
// ];

// // Role Card Component
// const RoleCard = ({ option, selected, onSelect }) => {
//   const colorClasses = {
//     blue: {
//       selected: "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20",
//       icon: "bg-blue-100 text-blue-600",
//       check: "border-blue-600 bg-blue-600",
//     },
//     purple: {
//       selected: "border-purple-500 bg-purple-50 ring-2 ring-purple-500/20",
//       icon: "bg-purple-100 text-purple-600",
//       check: "border-purple-600 bg-purple-600",
//     },
//     red: {
//       selected: "border-red-500 bg-red-50 ring-2 ring-red-500/20",
//       icon: "bg-red-100 text-red-600",
//       check: "border-red-600 bg-red-600",
//     },
//   };

//   const colors = colorClasses[option.color];

//   return (
//     <button
//       type="button"
//       onClick={() => onSelect(option.value)}
//       className={`
//         w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200
//         ${selected ? colors.selected : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}
//       `}
//     >
//       <div
//         className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.icon}`}
//       >
//         <option.icon className="w-5 h-5" />
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className={`text-sm font-semibold ${selected ? "text-gray-900" : "text-gray-700"}`}>
//           {option.label}
//         </p>
//         <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
//       </div>
//       <div
//         className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
//           selected ? colors.check : "border-gray-300"
//         }`}
//       >
//         {selected && <CheckIcon className="w-3 h-3 text-white" strokeWidth={3} />}
//       </div>
//     </button>
//   );
// };

// export default function CreateUser() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     username: "",
//     employeeId: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: "SALES_REP",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//     // Clear error on change
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleRoleChange = (role) => {
//     setForm((prev) => ({ ...prev, role }));
//   };

//   const validate = () => {
//     const newErrors = {};

//     if (!form.name.trim()) {
//       newErrors.name = "Name is required";
//     } else if (form.name.trim().length < 2) {
//       newErrors.name = "Name must be at least 2 characters";
//     }

//     if (!form.username?.trim()) {
//       newErrors.username = "Username is required";
//     }

//     if (!form.employeeId?.trim()) {
//       newErrors.employeeId = "Employee ID is required";
//     }

//     if (!form.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
//       newErrors.email = "Please enter a valid email address";
//     }

//     if (!form.password) {
//       newErrors.password = "Password is required";
//     } else if (form.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }

//     if (form.password !== form.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validate()) {
//       toast.error("Please fix the errors in the form");
//       return;
//     }

//     setSubmitting(true);

//     try {
//       const payload = {
//         name: form.name.trim(),
//         username: form.username.trim(),
//         employeeId: form.employeeId.trim(),
//         email: form.email.trim().toLowerCase(),
//         password: form.password,
//         role: form.role,
//       };

//       const res = await dispatch(registerUser(payload));

//       if (!res.error) {
//         toast.success("User created successfully");
//         dispatch(fetchUsers());
//         navigate("/users");
//       } else {
//         toast.error(res.payload || "Failed to create user");
//       }
//     } catch (err) {
//       toast.error("Something went wrong");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto">
//       {/* Breadcrumb */}
//       <nav className="flex items-center gap-2 text-sm mb-6">
//         <Link
//           to="/users"
//           className="text-gray-500 hover:text-gray-700 transition-colors"
//         >
//           Users
//         </Link>
//         <ChevronRightIcon className="w-4 h-4 text-gray-400" />
//         <span className="text-gray-900 font-medium">Create User</span>
//       </nav>

//       {/* Header */}
//       <div className="flex items-center gap-4 mb-6">
//         <button
//           onClick={() => navigate("/users")}
//           className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
//         >
//           <ArrowLeftIcon className="w-5 h-5 text-gray-500" />
//         </button>
//         <div>
//           <h1 className="text-xl font-bold text-gray-900">Create New User</h1>
//           <p className="text-sm text-gray-500 mt-0.5">
//             Add a new team member to the system
//           </p>
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Basic Information */}
//         <FormSection
//           title="Basic Information"
//           subtitle="User's name and contact details"
//           icon={UserIcon}
//         >
//           <div className="space-y-5">
//             <FormField label="Full Name" required error={errors.name}>
//               <Input
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 placeholder="Enter full name"
//                 icon={UserIcon}
//                 error={errors.name}
//                 required
//               />
//             </FormField>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <FormField label="Username" required error={errors.username}>
//                 <Input
//                   name="username"
//                   value={form.username}
//                   onChange={handleChange}
//                   placeholder="Enter username"
//                   icon={UserIcon}
//                   error={errors.username}
//                   required
//                 />
//               </FormField>

//               <FormField label="Employee ID" required error={errors.employeeId}>
//                 <Input
//                   name="employeeId"
//                   value={form.employeeId}
//                   onChange={handleChange}
//                   placeholder="EMP-001"
//                   icon={BriefcaseIcon}
//                   error={errors.employeeId}
//                   required
//                 />
//               </FormField>
//             </div>

//             <FormField label="Email Address" required error={errors.email}>
//               <Input
//                 name="email"
//                 type="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 placeholder="Enter email address"
//                 icon={EnvelopeIcon}
//                 error={errors.email}
//                 required
//               />
//             </FormField>
//           </div>
//         </FormSection>

//         {/* Password Section */}
//         <FormSection
//           title="Set Password"
//           subtitle="Create a secure password for the user"
//           icon={LockClosedIcon}
//         >
//           <div className="space-y-5">
//             <FormField
//               label="Password"
//               required
//               error={errors.password}
//               hint="Minimum 6 characters"
//             >
//               <Input
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 value={form.password}
//                 onChange={handleChange}
//                 placeholder="Create password"
//                 icon={LockClosedIcon}
//                 error={errors.password}
//                 required
//                 rightElement={
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="text-gray-400 hover:text-gray-600 transition-colors"
//                   >
//                     {showPassword ? (
//                       <EyeSlashIcon className="w-4 h-4" />
//                     ) : (
//                       <EyeIcon className="w-4 h-4" />
//                     )}
//                   </button>
//                 }
//               />
//             </FormField>

//             <FormField
//               label="Confirm Password"
//               required
//               error={errors.confirmPassword}
//             >
//               <Input
//                 name="confirmPassword"
//                 type={showConfirmPassword ? "text" : "password"}
//                 value={form.confirmPassword}
//                 onChange={handleChange}
//                 placeholder="Confirm password"
//                 icon={LockClosedIcon}
//                 error={errors.confirmPassword}
//                 required
//                 rightElement={
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="text-gray-400 hover:text-gray-600 transition-colors"
//                   >
//                     {showConfirmPassword ? (
//                       <EyeSlashIcon className="w-4 h-4" />
//                     ) : (
//                       <EyeIcon className="w-4 h-4" />
//                     )}
//                   </button>
//                 }
//               />
//             </FormField>
//           </div>
//         </FormSection>

//         {/* Role Selection */}
//         <FormSection
//           title="User Role"
//           subtitle="Select the access level for this user"
//           icon={ShieldCheckIcon}
//         >
//           <div className="space-y-3">
//             {ROLE_OPTIONS.map((option) => (
//               <RoleCard
//                 key={option.value}
//                 option={option}
//                 selected={form.role === option.value}
//                 onSelect={handleRoleChange}
//               />
//             ))}
//           </div>
//         </FormSection>

//         {/* Actions */}
//         <div className="flex items-center justify-end gap-3 pt-4 pb-8 border-t border-gray-200">
//           <button
//             type="button"
//             onClick={() => navigate("/users")}
//             className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={submitting}
//             className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
//           >
//             {submitting ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                 Creating...
//               </>
//             ) : (
//               <>
//                 <UserIcon className="w-4 h-4" />
//                 Create User
//               </>
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
// src/features/users/CreateUser.jsx

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, fetchUsers } from "../auth/authSlice";
import toast from "react-hot-toast";
import {
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  EyeIcon,
  EyeSlashIcon,
  UserGroupIcon,
  BriefcaseIcon,
  CheckIcon,
  SparklesIcon,
  UserPlusIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckCircleSolid } from "@heroicons/react/24/solid";

// Form Section Component
const FormSection = ({ title, subtitle, icon: Icon, gradient = "purple", children }) => {
  const gradients = {
    purple: "from-[#3B2E7E] to-[#2A1F5C]",
    emerald: "from-emerald-500 to-emerald-600",
    amber: "from-amber-500 to-amber-600",
    rose: "from-rose-500 to-rose-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-[#3B2E7E]/10 shadow-sm shadow-[#3B2E7E]/5 overflow-hidden">
      <div className="px-6 py-5 border-b border-[#3B2E7E]/10 bg-gradient-to-r from-[#3B2E7E]/5 to-transparent">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradients[gradient]} flex items-center justify-center shadow-lg`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          )}
          <div>
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{title}</h2>
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

// Form Field Component
const FormField = ({ label, required, children, error, hint }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
      {label}
      {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
    {hint && !error && (
      <p className="flex items-center gap-1.5 text-xs text-slate-400">
        <InformationCircleIcon className="w-3.5 h-3.5 flex-shrink-0" />
        {hint}
      </p>
    )}
    {error && (
      <p className="flex items-center gap-1.5 text-xs text-rose-500 font-medium">
        <ExclamationCircleIcon className="w-3.5 h-3.5 flex-shrink-0" />
        {error}
      </p>
    )}
  </div>
);

// Input Component
const Input = ({
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  icon: Icon,
  rightElement,
  error,
}) => (
  <div className="relative group">
    {Icon && (
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#3B2E7E] transition-colors" />
    )}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`
        w-full px-4 py-3.5 text-sm font-medium bg-white border-2 rounded-xl
        placeholder:text-slate-400 placeholder:font-normal text-slate-800
        focus:outline-none focus:ring-4 focus:ring-[#3B2E7E]/10 focus:border-[#3B2E7E]
        transition-all duration-200
        ${Icon ? "pl-12" : ""}
        ${rightElement ? "pr-12" : ""}
        ${error ? "border-rose-300 focus:ring-rose-100 focus:border-rose-500" : "border-slate-200 hover:border-[#3B2E7E]/30"}
      `}
    />
    {rightElement && (
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        {rightElement}
      </div>
    )}
  </div>
);

// Role options with descriptions
const ROLE_OPTIONS = [
  {
    value: "SALES_REP",
    label: "Sales Rep",
    description: "Can manage their own deals, contacts, and tasks",
    icon: BriefcaseIcon,
    gradient: "from-sky-500 to-sky-600",
    bgLight: "bg-sky-50",
    borderActive: "border-sky-500",
    ringActive: "ring-sky-200",
  },
  {
    value: "MANAGER",
    label: "Manager",
    description: "Can view and manage team's data and reports",
    icon: UserGroupIcon,
    gradient: "from-violet-500 to-violet-600",
    bgLight: "bg-violet-50",
    borderActive: "border-violet-500",
    ringActive: "ring-violet-200",
  },
  {
    value: "ADMIN",
    label: "Admin",
    description: "Full access to all features, users, and settings",
    icon: ShieldCheckIcon,
    gradient: "from-[#3B2E7E] to-[#2A1F5C]",
    bgLight: "bg-[#3B2E7E]/5",
    borderActive: "border-[#3B2E7E]",
    ringActive: "ring-[#3B2E7E]/20",
  },
];

// Role Card Component
const RoleCard = ({ option, selected, onSelect }) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      className={`
        w-full flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all duration-200
        ${selected 
          ? `${option.borderActive} ${option.bgLight} ring-4 ${option.ringActive}` 
          : "border-slate-200 hover:border-[#3B2E7E]/30 hover:bg-slate-50"
        }
      `}
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
        <option.icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1 min-w-0 pt-1">
        <p className={`text-sm font-bold ${selected ? "text-slate-900" : "text-slate-700"}`}>
          {option.label}
        </p>
        <p className="text-xs text-slate-500 mt-1">{option.description}</p>
      </div>
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all mt-1 ${
        selected 
          ? `${option.borderActive} bg-gradient-to-br ${option.gradient}` 
          : "border-slate-300"
      }`}>
        {selected && <CheckIcon className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
      </div>
    </button>
  );
};

// Form Progress Component
const FormProgress = ({ form }) => {
  const fields = [
    { key: "name", label: "Full Name" },
    { key: "username", label: "Username" },
    { key: "employeeId", label: "Employee ID" },
    { key: "email", label: "Email" },
    { key: "password", label: "Password" },
    { key: "role", label: "Role" },
  ];

  const filled = fields.filter((f) => form[f.key]).length;
  const pct = Math.round((filled / fields.length) * 100);

  return (
    <div className="bg-gradient-to-br from-[#3B2E7E] to-[#2A1F5C] rounded-2xl p-6 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-200">
            Form Progress
          </h4>
          <span className={`text-2xl font-extrabold ${pct === 100 ? "text-emerald-400" : "text-white"}`}>
            {pct}%
          </span>
        </div>

        <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden mb-4">
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${
              pct === 100
                ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                : "bg-gradient-to-r from-white/80 to-white"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="space-y-2">
          {fields.map((f) => {
            const done = Boolean(form[f.key]);
            return (
              <div key={f.key} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                  done ? "bg-emerald-400/20 text-emerald-400" : "bg-white/10 text-white/40"
                }`}>
                  {done ? <CheckIcon className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />}
                </div>
                <span className={`text-sm font-medium transition-all ${done ? "text-white" : "text-white/50"}`}>
                  {f.label}
                </span>
                {done && <CheckCircleSolid className="w-4 h-4 text-emerald-400 ml-auto" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function CreateUser() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    employeeId: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "SALES_REP",
    maxDiscount: 0,
    mobile: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRoleChange = (role) => {
    setForm((prev) => ({ ...prev, role }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!form.username?.trim()) {
      newErrors.username = "Username is required";
    }

    if (!form.employeeId?.trim()) {
      newErrors.employeeId = "Employee ID is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (form.maxDiscount < 0 || form.maxDiscount > 100) {
      newErrors.maxDiscount = "Discount limit must be between 0 and 100";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: form.name.trim(),
        username: form.username.trim(),
        employeeId: form.employeeId.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
        maxDiscount: form.maxDiscount,
      };

      const res = await dispatch(registerUser(payload));

      if (!res.error) {
        toast.success("User created successfully");
        dispatch(fetchUsers());
        navigate("/users");
      } else {
        toast.error(res.payload || "Failed to create user");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full mx-auto pb-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-6">
        <Link
          to="/users"
          className="flex items-center gap-2 text-slate-500 hover:text-[#3B2E7E] transition-colors font-medium"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Users
        </Link>
        <ChevronRightIcon className="w-4 h-4 text-slate-300" />
        <span className="text-slate-800 font-semibold">Create User</span>
      </nav>

      {/* Header */}
      <div className="relative bg-gradient-to-b from-[#3B2E7E] to-[#2A1F5C] rounded-3xl p-8 mb-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-300 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        {/* Decorative Circles */}
        <div className="absolute top-6 right-6 w-20 h-20 border border-white/10 rounded-full" />
        <div className="absolute top-10 right-10 w-12 h-12 border border-white/10 rounded-full" />

        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/10">
            <UserPlusIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Create New User
            </h1>
            <p className="text-purple-200 mt-1">
              Add a new team member to the system
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <FormSection
            title="Basic Information"
            subtitle="User's name and contact details"
            icon={UserIcon}
            gradient="purple"
          >
            <div className="space-y-5">
              <FormField label="Full Name" required error={errors.name}>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  icon={UserIcon}
                  error={errors.name}
                  required
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField label="Username" required error={errors.username}>
                  <Input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    icon={UserIcon}
                    error={errors.username}
                    required
                  />
                </FormField>

                <FormField label="Employee ID" required error={errors.employeeId}>
                  <Input
                    name="employeeId"
                    value={form.employeeId}
                    onChange={handleChange}
                    placeholder="EMP-001"
                    icon={BriefcaseIcon}
                    error={errors.employeeId}
                    required
                  />
                </FormField>
              </div>

              <FormField label="Email Address" required error={errors.email}>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  icon={EnvelopeIcon}
                  error={errors.email}
                  required
                />
              </FormField>

              <FormField label="Mobile Number" error={errors.mobile}>
                <Input
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="Enter mobile number"
                  icon={PhoneIcon}
                  error={errors.mobile}
                />
              </FormField>
            </div>
          </FormSection>

          {/* Password Section */}
          <FormSection
            title="Set Password"
            subtitle="Create a secure password for the user"
            icon={LockClosedIcon}
            gradient="amber"
          >
            <div className="space-y-5">
              <FormField
                label="Password"
                required
                error={errors.password}
                hint="Minimum 6 characters"
              >
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  icon={LockClosedIcon}
                  error={errors.password}
                  required
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-[#3B2E7E] transition-colors p-1"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  }
                />
              </FormField>

              <FormField
                label="Confirm Password"
                required
                error={errors.confirmPassword}
              >
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  icon={LockClosedIcon}
                  error={errors.confirmPassword}
                  required
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-slate-400 hover:text-[#3B2E7E] transition-colors p-1"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  }
                />
              </FormField>
            </div>
          </FormSection>

          {/* Role Selection */}
          <FormSection
            title="User Role"
            subtitle="Select the access level for this user"
            icon={ShieldCheckIcon}
            gradient="rose"
          >
            <div className="space-y-3">
              {ROLE_OPTIONS.map((option) => (
                <RoleCard
                  key={option.value}
                  option={option}
                  selected={form.role === option.value}
                  onSelect={handleRoleChange}
                />
              ))}
            </div>
          </FormSection>

          {/* Commercial Settings */}
          <FormSection
            title="Commercial Settings"
            subtitle="Define financial limits and permissions"
            icon={SparklesIcon}
            gradient="amber"
          >
            <div className="space-y-5">
              <FormField
                label="Maximum Allowable Discount (%)"
                hint="Limit individual item and overall quotation discounts"
                error={errors.maxDiscount}
              >
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-400 group-focus-within:text-amber-500 transition-colors pointer-events-none">
                    <SparklesIcon className="w-5 h-5" />
                  </div>
                  <input
                    type={form.role === "ADMIN" ? "text" : "number"}
                    name="maxDiscount"
                    value={form.role === "ADMIN" ? "" : form.maxDiscount}
                    onChange={handleChange}
                    placeholder={form.role === "ADMIN" ? "Unlimited (Admin)" : "e.g. 10"}
                    disabled={form.role === "ADMIN"}
                    min="0"
                    max="100"
                    step="0.1"
                    className={`
                      w-full pl-12 pr-4 py-3.5 text-sm font-bold border-2 rounded-xl
                      placeholder:text-slate-400 placeholder:font-normal text-slate-800
                      focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500
                      transition-all duration-200
                      ${form.role === "ADMIN" ? "bg-slate-50 border-slate-200 cursor-not-allowed" : "bg-white"}
                      ${errors.maxDiscount ? "border-rose-300 focus:ring-rose-100 focus:border-rose-500" : "border-slate-200 hover:border-amber-500/30"}
                    `}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    {form.role === "ADMIN" ? "EXEMPT" : "PERCENT (%)"}
                  </div>
                </div>
              </FormField>
            </div>
          </FormSection>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/users")}
              className="flex-1 px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-[#3B2E7E] to-[#2A1F5C] rounded-xl hover:shadow-lg hover:shadow-[#3B2E7E]/30 transition-all disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4" />
                  Create
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Form Progress */}
          <FormProgress form={form} />

          {/* Selected Role Preview */}
          <div className="bg-white rounded-2xl border border-[#3B2E7E]/10 p-5 shadow-sm">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
              Selected Role
            </h4>
            {(() => {
              const role = ROLE_OPTIONS.find((r) => r.value === form.role);
              return (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-[#3B2E7E]/5 to-purple-50 border border-[#3B2E7E]/10">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-lg`}>
                    <role.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{role.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{role.description}</p>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <SparklesIcon className="w-4 h-4 text-amber-600" />
              </div>
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Tips
              </h4>
            </div>
            <ul className="space-y-2 text-xs text-amber-700">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                Use a strong password with letters, numbers, and symbols
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                Choose the appropriate role based on responsibilities
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                Email will be used for login and notifications
              </li>
            </ul>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex flex-col gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-[#3B2E7E] to-[#2A1F5C] rounded-xl hover:shadow-lg hover:shadow-[#3B2E7E]/30 transition-all disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating User...
                </>
              ) : (
                <>
                  <UserPlusIcon className="w-5 h-5" />
                  Create User
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/users")}
              className="w-full px-6 py-3 text-sm font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 hover:border-[#3B2E7E]/30 transition-all text-center"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
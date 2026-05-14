// // src/features/users/EditUser.jsx

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { updateUser, fetchUsers } from "../auth/authSlice";
// import toast from "react-hot-toast";

// export default function EditUser() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { users, loading } = useSelector((state) => state.auth);

//   const [form, setForm] = useState({
//     name: "",
//     username: "",
//     employeeId: "",
//     email: "",
//     role: "SALES_REP",
//     isActive: true,
//   });

//   const [saving, setSaving] = useState(false);

//   /* Load users if not already loaded */
//   useEffect(() => {
//     if (!users.length) {
//       dispatch(fetchUsers());
//     }
//   }, [dispatch, users.length]);

//   /* Find selected user */
//   useEffect(() => {
//     const user = users.find((u) => u.id === id);

//     if (user) {
//       setForm({
//         name: user.name || "",
//         username: user.username || "",
//         employeeId: user.employeeId || "",
//         email: user.email || "",
//         role: user.role || "SALES_REP",
//         isActive: user.isActive ?? true,
//       });
//     }
//   }, [users, id]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       setSaving(true);

//       await dispatch(
//         updateUser({
//           id,
//           userData: form,
//         }),
//       ).unwrap();

//       toast.success("User updated successfully");

//       navigate("/users");
//     } catch (err) {
//       toast.error(err || "Failed to update user");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading && !users.length) {
//     return (
//       <div className="flex items-center justify-center py-20">
//         <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
//       <h1 className="text-xl font-bold text-gray-900 mb-6">Edit User</h1>

//       <form onSubmit={handleSubmit} className="space-y-5">
//         {/* Name */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Name
//           </label>
//           <input
//             type="text"
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             required
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//           />
//         </div>

//         {/* Username */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Username
//           </label>
//           <input
//             type="text"
//             name="username"
//             value={form.username}
//             onChange={handleChange}
//             required
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//           />
//         </div>

//         {/* Employee ID */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Employee ID
//           </label>
//           <input
//             type="text"
//             name="employeeId"
//             value={form.employeeId}
//             onChange={handleChange}
//             required
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//           />
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Email
//           </label>
//           <input
//             type="email"
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             required
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//           />
//         </div>

//         {/* Role */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Role
//           </label>

//           <select
//             name="role"
//             value={form.role}
//             onChange={handleChange}
//             className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//           >
//             <option value="ADMIN">Admin</option>
//             <option value="MANAGER">Manager</option>
//             <option value="SALES_REP">Sales Rep</option>
//           </select>
//         </div>

//         {/* Active Status */}
//         <div className="flex items-center gap-3">
//           <input
//             type="checkbox"
//             name="isActive"
//             checked={form.isActive}
//             onChange={handleChange}
//             className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
//           />

//           <label className="text-sm text-gray-700">User is active</label>
//         </div>

//         {/* Buttons */}
//         <div className="flex items-center gap-3 pt-4">
//           <button
//             type="submit"
//             disabled={saving}
//             className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
//           >
//             {saving ? "Updating..." : "Update User"}
//           </button>

//           <button
//             type="button"
//             onClick={() => navigate("/users")}
//             className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
// src/features/users/EditUser.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, fetchUsers } from "../auth/authSlice";
import toast from "react-hot-toast";
import Spinner from "../../components/Spinner";
import {
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  UserGroupIcon,
  BriefcaseIcon,
  CheckIcon,
  SparklesIcon,
  PencilSquareIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalendarDaysIcon,
  ClockIcon,
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
  error,
  disabled,
}) => (
  <div className="relative group">
    {Icon && (
      <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
        disabled ? "text-slate-300" : "text-slate-400 group-focus-within:text-[#3B2E7E]"
      }`} />
    )}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`
        w-full px-4 py-3.5 text-sm font-medium bg-white border-2 rounded-xl
        placeholder:text-slate-400 placeholder:font-normal text-slate-800
        focus:outline-none focus:ring-4 focus:ring-[#3B2E7E]/10 focus:border-[#3B2E7E]
        disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed disabled:border-slate-200
        transition-all duration-200
        ${Icon ? "pl-12" : ""}
        ${error ? "border-rose-300 focus:ring-rose-100 focus:border-rose-500" : "border-slate-200 hover:border-[#3B2E7E]/30"}
      `}
    />
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

// Status Toggle Component
const StatusToggle = ({ isActive, onChange }) => {
  return (
    <div className="flex items-center justify-between p-5 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
          isActive 
            ? "bg-gradient-to-br from-emerald-500 to-emerald-600" 
            : "bg-gradient-to-br from-slate-400 to-slate-500"
        }`}>
          {isActive ? (
            <CheckCircleIcon className="w-6 h-6 text-white" />
          ) : (
            <XCircleIcon className="w-6 h-6 text-white" />
          )}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">
            {isActive ? "Active User" : "Inactive User"}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {isActive ? "User can access the system" : "User cannot login or access data"}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange({ target: { name: "isActive", type: "checkbox", checked: !isActive } })}
        className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
          isActive ? "bg-emerald-500" : "bg-slate-300"
        }`}
      >
        <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${
          isActive ? "left-7" : "left-1"
        }`} />
      </button>
    </div>
  );
};

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { users, loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    username: "",
    employeeId: "",
    email: "",
    role: "SALES_REP",
    isActive: true,
    maxDiscount: 0,
    mobile: "",
  });

  const [originalUser, setOriginalUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!users.length) {
      dispatch(fetchUsers());
    }
  }, [dispatch, users.length]);

  useEffect(() => {
    const user = users.find((u) => u.id === id);

    if (user) {
      setOriginalUser(user);
      setForm({
        name: user.name || "",
        username: user.username || "",
        employeeId: user.employeeId || "",
        email: user.email || "",
        role: user.role || "SALES_REP",
        isActive: user.isActive ?? true,
        maxDiscount: user.maxDiscount || 0,
        mobile: user.mobile || "",
      });
    }
  }, [users, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

    if (form.maxDiscount < 0 || form.maxDiscount > 100) {
      newErrors.maxDiscount = "Discount limit must be between 0 and 100";
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

    try {
      setSaving(true);

      await dispatch(
        updateUser({
          id,
          userData: form,
        }),
      ).unwrap();

      toast.success("User updated successfully");
      navigate("/users");
    } catch (err) {
      toast.error(err || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !users.length) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-sm text-slate-500 mt-4">Loading user...</p>
        </div>
      </div>
    );
  }

  if (!originalUser && users.length > 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-rose-50 rounded-2xl flex items-center justify-center mb-4">
          <ExclamationCircleIcon className="w-8 h-8 text-rose-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">User Not Found</h3>
        <p className="text-sm text-slate-500 mb-4">The user you're looking for doesn't exist.</p>
        <Link
          to="/users"
          className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-[#3B2E7E] to-[#2A1F5C] text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-[#3B2E7E]/25"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Users
        </Link>
      </div>
    );
  }

  const selectedRole = ROLE_OPTIONS.find((r) => r.value === form.role);

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
        <span className="text-slate-800 font-semibold truncate">{originalUser?.name || "Edit User"}</span>
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

        <div className="relative flex items-center gap-5">
          {/* User Avatar */}
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/10 text-2xl font-bold text-white">
              {originalUser?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center border-2 border-[#2A1F5C] ${
              form.isActive ? "bg-emerald-500" : "bg-slate-400"
            }`}>
              {form.isActive ? (
                <CheckIcon className="w-3.5 h-3.5 text-white" />
              ) : (
                <XCircleIcon className="w-3.5 h-3.5 text-white" />
              )}
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Edit User
            </h1>
            <p className="text-purple-200 mt-1">
              Update {originalUser?.name}'s profile and settings
            </p>
            {originalUser?.employeeId && (
              <span className="inline-flex items-center mt-2 px-2.5 py-1 rounded-lg bg-white/10 text-xs font-mono text-white/80 border border-white/10">
                {originalUser.employeeId}
              </span>
            )}
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

          {/* Account Status */}
          <FormSection
            title="Account Status"
            subtitle="Control user access to the system"
            icon={CheckCircleIcon}
            gradient="emerald"
          >
            <StatusToggle isActive={form.isActive} onChange={handleChange} />
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
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-[#3B2E7E] to-[#2A1F5C] rounded-xl hover:shadow-lg hover:shadow-[#3B2E7E]/30 transition-all disabled:opacity-60"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4" />
                  Save
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* User Preview Card */}
          <div className="bg-gradient-to-br from-[#3B2E7E] to-[#2A1F5C] rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-200 mb-4">
                User Preview
              </h4>

              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-bold">
                  {form.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-bold truncate">{form.name || "Name"}</p>
                  <p className="text-sm text-purple-200 truncate">@{form.username || "username"}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-t border-white/10">
                  <span className="text-sm text-purple-200">Email</span>
                  <span className="text-sm font-medium truncate ml-4">{form.email || "—"}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-white/10">
                  <span className="text-sm text-purple-200">Role</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-white/20`}>
                    {selectedRole?.icon && <selectedRole.icon className="w-3.5 h-3.5" />}
                    {selectedRole?.label}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-white/10">
                  <span className="text-sm text-purple-200">Status</span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                    form.isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-500/20 text-slate-300"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${form.isActive ? "bg-emerald-400" : "bg-slate-400"}`} />
                    {form.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Info */}
          {originalUser && (
            <div className="bg-white rounded-2xl border border-[#3B2E7E]/10 p-5 shadow-sm">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                Account Information
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#3B2E7E] to-[#5A4A9C] flex items-center justify-center shadow-sm">
                    <CalendarDaysIcon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Created</p>
                    <p className="text-sm font-semibold text-slate-800">
                      {originalUser.createdAt 
                        ? new Date(originalUser.createdAt).toLocaleDateString() 
                        : "—"
                      }
                    </p>
                  </div>
                </div>
                {originalUser.emailProvider && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
                      <EnvelopeIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-emerald-600">Email Connected</p>
                      <p className="text-sm font-semibold text-emerald-800">
                        {originalUser.emailProvider}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

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
                Changing role will affect user's access immediately
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                Inactive users cannot login to the system
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                Email changes may require re-verification
              </li>
            </ul>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex flex-col gap-3">
            <button
              type="submit"
              disabled={saving}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-[#3B2E7E] to-[#2A1F5C] rounded-xl hover:shadow-lg hover:shadow-[#3B2E7E]/30 transition-all disabled:opacity-60"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <PencilSquareIcon className="w-5 h-5" />
                  Save Changes
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
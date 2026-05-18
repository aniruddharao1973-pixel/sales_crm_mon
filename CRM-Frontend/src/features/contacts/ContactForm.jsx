

// src/features/contacts/ContactForm.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  createContact,
  updateContact,
  fetchContact,
  clearCurrentContact,
} from "./contactSlice";
import { fetchUsers } from "../auth/authSlice";
import { fetchAccountsDropdown, fetchAccounts } from "../accounts/accountSlice";
import { LEAD_SOURCES, SALUTATIONS } from "../../constants";
import ImageUpload from "../../components/ImageUpload";
import toast from "react-hot-toast";
import {
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  DocumentTextIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";

const initialForm = {
  salutation: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  mobile: "",
  title: "",
  department: "",
  accountId: "",
  contactOwnerId: "",
  leadSource: "",
  image: "",
  mailingFlat: "",
  mailingStreet: "",
  mailingCity: "",
  mailingState: "",
  mailingZip: "",
  mailingCountry: "",
  description: "",
};

const ContactForm = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { contact, detailLoading } = useSelector((s) => s.contacts);
  const { users, user } = useSelector((s) => s.auth);
  const { dropdown: accountDropdown, accounts } = useSelector(
    (s) => s.accounts,
  );

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAccountsDropdown());
    dispatch(fetchAccounts({ page: 1, limit: 1000 }));
    if (isEdit) dispatch(fetchContact(id));
    return () => dispatch(clearCurrentContact());
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && contact) {
      const formData = {};
      Object.keys(initialForm).forEach((key) => {
        formData[key] = contact[key] ?? "";
      });
      setForm(formData);
    } else if (!isEdit) {
      setForm((prev) => ({
        ...prev,
        contactOwnerId: user?.id || "",
        accountId: searchParams.get("accountId") || "",
      }));
    }
  }, [contact, isEdit, user, searchParams]);

  useEffect(() => {
    if (!form.accountId || isEdit) return;
    if (!accounts?.length) return;

    const selectedAccount = accounts.find((a) => a.id === form.accountId);

    if (!selectedAccount) return;

    setForm((prev) => ({
      ...prev,

      // 🔥 Always update on account change
      mailingFlat: selectedAccount.billingStreet || "", // best available fallback

      mailingStreet: selectedAccount.billingStreet || "",
      mailingCity: selectedAccount.billingCity || "",
      mailingState: selectedAccount.billingState || "",
      mailingZip: selectedAccount.billingPincode || "",
      mailingCountry: selectedAccount.billingCountry || "",
    }));
  }, [form.accountId, accounts, isEdit]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (imageData) => {
    setForm((prev) => ({ ...prev, image: imageData }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {};
      Object.entries(form).forEach(([k, v]) => {
        payload[k] = v === "" ? null : v;
      });
      payload.firstName = form.firstName;
      payload.email = form.email;
      payload.accountId = form.accountId;
      payload.contactOwnerId = form.contactOwnerId || user.id;

      if (isEdit) {
        await dispatch(updateContact({ id, ...payload })).unwrap();
        toast.success("Contact updated successfully");
      } else {
        await dispatch(createContact(payload)).unwrap();
        toast.success("Contact created successfully");
      }
      navigate("/contacts");
    } catch (err) {
      toast.error(err || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && detailLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading contact...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-4 sm:p-6 pb-10">
      {/* ─── HEADER ─── */}
      <div className="relative bg-gradient-to-b from-[#3B2E7E] to-[#2A1F5C] rounded-3xl p-3 lg:p-4 mb-6 mx-0 lg:mx-8 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-300 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
        </div>

        {/* Decorative Circles */}
        <div className="absolute top-4 right-4 w-16 h-16 border border-white/10 rounded-full" />
        <div className="absolute top-8 right-8 w-10 h-10 border border-white/10 rounded-full" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/contacts")}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all border border-white/10"
            >
              <ArrowLeftIcon className="w-4.5 h-4.5 text-white" />
            </button>

            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                  isEdit
                    ? "bg-gradient-to-br from-blue-400 to-blue-600"
                    : "bg-white/20 backdrop-blur-sm"
                }`}
              >
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-extrabold text-white tracking-tight">
                  {isEdit ? "Edit Contact" : "Create New Contact"}
                </h1>
                <p className="text-[11px] font-bold text-purple-200 uppercase tracking-wider mt-0.5">
                  {isEdit
                    ? `Updating contact details`
                    : "Add a new person to your CRM"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/contacts")}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl text-sm font-semibold transition-all border border-white/10"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-3 bg-white text-[#3B2E7E] rounded-xl text-sm font-bold hover:bg-purple-50 active:scale-[0.98] transition-all shadow-lg shadow-[#2A1F5C]/30 disabled:opacity-50"
            >
              {submitting ? "Saving..." : isEdit ? "Update Contact" : "Create Contact"}
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto px-0 lg:px-8">
        {/* Contact Photo */}
        <SectionCard
          icon={CameraIcon}
          title="Contact Photo"
          subtitle="Upload a profile picture for this contact"
          gradient="indigo"
        >
          <ImageUpload
            value={form.image}
            onChange={handleImageChange}
            label="Profile Photo"
            shape="circle"
          />
        </SectionCard>

        {/* Contact Information */}
        <SectionCard
          icon={UserIcon}
          title="Contact Information"
          subtitle="Basic details and contact methods"
          gradient="blue"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Salutation & First Name */}
            <div className="flex gap-3">
              <div className="w-24">
                <FormLabel label="Salutation" />
                <select
                  name="salutation"
                  value={form.salutation}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-[#3B2E7E]/10 focus:border-[#3B2E7E] bg-white transition-all duration-200"
                >
                  <option value="">None</option>
                  {SALUTATIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <FormLabel label="First Name" required />
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#3B2E7E]/10 focus:border-[#3B2E7E] transition-all duration-200"
                  placeholder="Enter first name"
                  required
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <FormLabel label="Last Name" />
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#3B2E7E]/10 focus:border-[#3B2E7E] transition-all duration-200"
                placeholder="Enter last name"
              />
            </div>

            {/* Email */}
            <div>
              <FormLabel label="Email" required />
              <div className="relative">
                <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#3B2E7E]/10 focus:border-[#3B2E7E] transition-all duration-200"
                  placeholder="email@example.com"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <FormLabel label="Phone" />
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#3B2E7E]/10 focus:border-[#3B2E7E] transition-all duration-200"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* Mobile */}
            <div>
              <FormLabel label="Mobile" />
              <div className="relative">
                <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#3B2E7E]/10 focus:border-[#3B2E7E] transition-all duration-200"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <FormLabel label="Title / Designation" />
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#3B2E7E]/10 focus:border-[#3B2E7E] transition-all duration-200"
                placeholder="e.g., CEO, Manager"
              />
            </div>

            {/* Department */}
            <div>
              <FormLabel label="Department" />
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#3B2E7E]/10 focus:border-[#3B2E7E] transition-all duration-200"
                placeholder="e.g., Sales, Engineering"
              />
            </div>

            {/* Account */}
            <div>
              <FormLabel label="Account" required />
              <div className="relative">
                <BuildingOfficeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <select
                  name="accountId"
                  value={form.accountId}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 border-2 border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-4 focus:ring-[#3B2E7E]/10 focus:border-[#3B2E7E] transition-all duration-200 appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select Account</option>
                  {accountDropdown.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.accountName}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Contact Owner */}
            <div>
              <FormLabel label="Contact Owner" />
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <select
                  name="contactOwnerId"
                  value={form.contactOwnerId}
                  onChange={handleChange}
                  disabled={!["SUPER_ADMIN", "TSL", "MANAGER"].includes(user?.role)}
                  className="w-full pl-10 pr-10 py-2.5 border-2 border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-4 focus:ring-[#3B2E7E]/10 focus:border-[#3B2E7E] transition-all duration-200 appearance-none cursor-pointer disabled:bg-slate-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select Owner</option>
                  {!["SUPER_ADMIN", "TSL", "MANAGER"].includes(user?.role) ? (
                    <option value={user?.id}>{user?.name}</option>
                  ) : (
                    users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))
                  )}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Lead Source */}
            <div>
              <FormLabel label="Lead Source" />
              <div className="relative">
                <select
                  name="leadSource"
                  value={form.leadSource}
                  onChange={handleChange}
                  className="w-full px-4 pr-10 py-2.5 border-2 border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-4 focus:ring-[#3B2E7E]/10 focus:border-[#3B2E7E] transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="">Select Lead Source</option>
                  {LEAD_SOURCES.map((source) => (
                    <option key={source.value} value={source.value}>
                      {source.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Mailing Address */}
        <SectionCard
          icon={MapPinIcon}
          title="Mailing Address"
          subtitle="Contact's mailing address details"
          gradient="emerald"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Flat / Building */}
            <div>
              <FormLabel label="Flat / Building" />
              <input
                name="mailingFlat"
                value={form.mailingFlat}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#3B2E7E]/10 focus:border-[#3B2E7E] transition-all duration-200"
                placeholder="Flat/Building number"
              />
            </div>

            {/* Street */}
            <div>
              <FormLabel label="Street" />
              <input
                name="mailingStreet"
                value={form.mailingStreet}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#3B2E7E]/10 focus:border-[#3B2E7E] transition-all duration-200"
                placeholder="Street address"
              />
            </div>

            {/* City */}
            <div>
              <FormLabel label="City" />
              <input
                name="mailingCity"
                value={form.mailingCity}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#3B2E7E]/10 focus:border-[#3B2E7E] transition-all duration-200"
                placeholder="City"
              />
            </div>

            {/* State */}
            <div>
              <FormLabel label="State" />
              <input
                name="mailingState"
                value={form.mailingState}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#3B2E7E]/10 focus:border-[#3B2E7E] transition-all duration-200"
                placeholder="State/Province"
              />
            </div>

            {/* PIN Code */}
            <div>
              <FormLabel label="PIN Code" />
              <input
                name="mailingZip"
                value={form.mailingZip}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#3B2E7E]/10 focus:border-[#3B2E7E] transition-all duration-200"
                placeholder="PIN/ZIP Code"
              />
            </div>

            {/* Country */}
            <div>
              <FormLabel label="Country" />
              <input
                name="mailingCountry"
                value={form.mailingCountry}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#3B2E7E]/10 focus:border-[#3B2E7E] transition-all duration-200"
                placeholder="India"
              />
            </div>
          </div>
        </SectionCard>

        {/* Description */}
        <SectionCard
          icon={DocumentTextIcon}
          title="Description"
          subtitle="Additional notes and information"
          gradient="amber"
        >
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#3B2E7E]/10 focus:border-[#3B2E7E] transition-all duration-200 resize-none"
            rows={4}
            placeholder="Additional notes about this contact..."
          />
        </SectionCard>

        {/* Form Actions Footer */}
        <div className="flex items-center justify-between py-4 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-400">
            <span className="text-rose-500 font-bold">*</span> Required fields
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/contacts")}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-gradient-to-r from-[#3B2E7E] to-[#2A1F5C] text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-[#3B2E7E]/30 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {submitting ? "Saving..." : isEdit ? "Update Contact" : "Create Contact"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

/* ────────────────── SUB-COMPONENTS ────────────────── */

const SectionCard = ({
  icon: Icon,
  title,
  subtitle,
  children,
  gradient = "purple",
}) => {
  const gradients = {
    purple: "from-[#3B2E7E] to-[#2A1F5C]",
    blue: "from-blue-500 to-blue-600",
    emerald: "from-emerald-500 to-emerald-600",
    amber: "from-amber-500 to-amber-600",
    indigo: "from-indigo-500 to-indigo-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-[#3B2E7E]/10 shadow-sm shadow-[#3B2E7E]/5 overflow-hidden">
      <div className="px-6 py-4 border-b border-[#3B2E7E]/10 bg-gradient-to-r from-[#3B2E7E]/5 to-transparent">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradients[gradient]} flex items-center justify-center shadow-lg`}
          >
            <Icon className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              {title}
            </h3>
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

const FormLabel = ({ label, required }) => (
  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
    {label}
    {required && <span className="text-rose-500 ml-1">*</span>}
  </label>
);

export default ContactForm;

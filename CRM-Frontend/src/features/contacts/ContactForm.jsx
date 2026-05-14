

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
    <div className="w-full mx-auto pb-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/contacts")}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Contacts
        </button>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <UserIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? "Edit Contact" : "Create New Contact"}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEdit
                ? "Update contact information and details"
                : "Add a new contact to your CRM"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Photo */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CameraIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Contact Photo
                </h2>
                <p className="text-sm text-gray-500">
                  Upload a profile picture for this contact
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <ImageUpload
              value={form.image}
              onChange={handleImageChange}
              label="Profile Photo"
              shape="circle"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Contact Information
                </h2>
                <p className="text-sm text-gray-500">
                  Basic details and contact methods
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Salutation & First Name */}
              <div className="flex gap-3">
                <div className="w-24">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Salutation
                  </label>
                  <select
                    name="salutation"
                    value={form.salutation}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter first name"
                    required
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Last Name
                </label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter last name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Mobile
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Title / Designation
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., CEO, Manager"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Department
                </label>
                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Sales, Engineering"
                />
              </div>

              {/* Account */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Account <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <BuildingOfficeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <select
                    name="accountId"
                    value={form.accountId}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
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
                      className="w-5 h-5 text-gray-400"
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Contact Owner
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <select
                    name="contactOwnerId"
                    value={form.contactOwnerId}
                    onChange={handleChange}
                    disabled={user?.role === "SALES_REP"}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Owner</option>
                    {user?.role === "SALES_REP" ? (
                      <option value={user.id}>{user.name}</option>
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
                      className="w-5 h-5 text-gray-400"
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Lead Source
                </label>
                <div className="relative">
                  <select
                    name="leadSource"
                    value={form.leadSource}
                    onChange={handleChange}
                    className="w-full px-4 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
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
                      className="w-5 h-5 text-gray-400"
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
          </div>
        </div>

        {/* Mailing Address */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <MapPinIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Mailing Address
                </h2>
                <p className="text-sm text-gray-500">
                  Contact's mailing address details
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Flat / Building */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Flat / Building
                </label>
                <input
                  name="mailingFlat"
                  value={form.mailingFlat}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Flat/Building number"
                />
              </div>

              {/* Street */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Street
                </label>
                <input
                  name="mailingStreet"
                  value={form.mailingStreet}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Street address"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  City
                </label>
                <input
                  name="mailingCity"
                  value={form.mailingCity}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="City"
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  State
                </label>
                <input
                  name="mailingState"
                  value={form.mailingState}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="State/Province"
                />
              </div>

              {/* PIN Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  PIN Code
                </label>
                <input
                  name="mailingZip"
                  value={form.mailingZip}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="PIN/ZIP Code"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Country
                </label>
                <input
                  name="mailingCountry"
                  value={form.mailingCountry}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="India"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <DocumentTextIcon className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Description
                </h2>
                <p className="text-sm text-gray-500">
                  Additional notes and information
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              rows={4}
              placeholder="Additional notes about this contact..."
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="bg-white rounded-xl border border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              <span className="text-red-500">*</span> Required fields
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/contacts")}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : isEdit ? (
                  "Update Contact"
                ) : (
                  "Create Contact"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;

// // src/constants/index.js
// export const STAGE_COLORS = {
//   RFQ: "bg-gray-100 text-gray-800",
//   VISIT_MEETING: "bg-blue-100 text-blue-800",
//   PREVIEW: "bg-indigo-100 text-indigo-800",
//   REGRETTED: "bg-red-100 text-red-800",
//   TECHNICAL_PROPOSAL: "bg-purple-100 text-purple-800",
//   COMMERCIAL_PROPOSAL: "bg-yellow-100 text-yellow-800",
//   REVIEW_FEEDBACK: "bg-orange-100 text-orange-800",
//   MOVED_TO_PURCHASE: "bg-cyan-100 text-cyan-800",
//   NEGOTIATION: "bg-amber-100 text-amber-800",
//   CLOSED_WON: "bg-green-100 text-green-800",
//   CLOSED_LOST: "bg-red-100 text-red-800",
//   CLOSED_LOST_TO_COMPETITION: "bg-rose-100 text-rose-800",
// };

// export const DEAL_STAGES = [
//   "RFQ",
//   "VISIT_MEETING",
//   "PREVIEW",
//   "REGRETTED",
//   "TECHNICAL_PROPOSAL",
//   "COMMERCIAL_PROPOSAL",
//   "REVIEW_FEEDBACK",
//   "MOVED_TO_PURCHASE",
//   "NEGOTIATION",
//   "CLOSED_WON",
//   "CLOSED_LOST",
//   "CLOSED_LOST_TO_COMPETITION",
// ];

// src/constants/index.js
export const STAGE_COLORS = {
  RFQ: {
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200",
    dot: "bg-slate-500",
  },
  VISIT_MEETING: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-100",
    dot: "bg-blue-500",
  },
  PREVIEW: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-100",
    dot: "bg-indigo-500",
  },
  REGRETTED: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-100",
    dot: "bg-red-500",
  },
  TECHNICAL_PROPOSAL: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-100",
    dot: "bg-purple-500",
  },
  COMMERCIAL_PROPOSAL: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-100",
    dot: "bg-yellow-500",
  },
  REVIEW_FEEDBACK: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-100",
    dot: "bg-orange-500",
  },
  MOVED_TO_PURCHASE: {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-100",
    dot: "bg-cyan-500",
  },
  NEGOTIATION: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-100",
    dot: "bg-amber-500",
  },
  CLOSED_WON: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-100",
    dot: "bg-emerald-500",
  },
  CLOSED_LOST: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-100",
    dot: "bg-red-500",
  },
  CLOSED_LOST_TO_COMPETITION: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-100",
    dot: "bg-rose-500",
  },
};

export const DEAL_STAGES = [
  "RFQ",
  "VISIT_MEETING",
  "PREVIEW",
  "REGRETTED",
  "TECHNICAL_PROPOSAL",
  "COMMERCIAL_PROPOSAL",
  "REVIEW_FEEDBACK",
  "MOVED_TO_PURCHASE",
  "NEGOTIATION",
  "CLOSED_WON",
  "CLOSED_LOST",
  "CLOSED_LOST_TO_COMPETITION",
];
export const DEAL_STATUSES = [
  "IN_PROGRESS",
  "PENDING_AT_CUSTOMER",
  "REGRETTED",
  "CLOSED",
];

export const STATUS_COLORS = {
  IN_PROGRESS: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-100",
    dot: "bg-blue-500",
  },
  PENDING_AT_CUSTOMER: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-100",
    dot: "bg-amber-500",
  },
  REGRETTED: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-100",
    dot: "bg-red-500",
  },
  CLOSED: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-100",
    dot: "bg-emerald-500",
  },
};
export const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatLabel = (str) => {
  if (!str) return "";
  return str
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};
export const PIPELINE_STAGES = [
  { key: "RFQ", label: "RFQ", color: "border-gray-400", bg: "bg-gray-400" },
  {
    key: "VISIT_MEETING",
    label: "Visit / Meeting",
    color: "border-blue-400",
    bg: "bg-blue-400",
  },
  {
    key: "PREVIEW",
    label: "Preview",
    color: "border-indigo-400",
    bg: "bg-indigo-400",
  },
  {
    key: "TECHNICAL_PROPOSAL",
    label: "Technical Proposal",
    color: "border-purple-400",
    bg: "bg-purple-400",
  },
  {
    key: "COMMERCIAL_PROPOSAL",
    label: "Commercial Proposal",
    color: "border-yellow-400",
    bg: "bg-yellow-400",
  },
  {
    key: "REVIEW_FEEDBACK",
    label: "Review / Feedback",
    color: "border-orange-400",
    bg: "bg-orange-400",
  },
  {
    key: "MOVED_TO_PURCHASE",
    label: "Moved to Purchase",
    color: "border-cyan-400",
    bg: "bg-cyan-400",
  },
  {
    key: "NEGOTIATION",
    label: "Negotiation",
    color: "border-amber-400",
    bg: "bg-amber-400",
  },

  {
    key: "CLOSED_WON",
    label: "Closed Won",
    color: "border-green-400",
    bg: "bg-green-400",
  },
  {
    key: "CLOSED_LOST",
    label: "Closed Lost",
    color: "border-red-400",
    bg: "bg-red-400",
  },
  {
    key: "CLOSED_LOST_TO_COMPETITION",
    label: "Lost to Competition",
    color: "border-rose-400",
    bg: "bg-rose-400",
  },
];

export const PROGRESS_STAGES = [
  "RFQ",
  "VISIT_MEETING",
  "PREVIEW",
  "TECHNICAL_PROPOSAL",
  "COMMERCIAL_PROPOSAL",
  "REVIEW_FEEDBACK",
  "MOVED_TO_PURCHASE",
  "NEGOTIATION",
  "CLOSED_WON",
  "CLOSED_LOST",
  "CLOSED_LOST_TO_COMPETITION",
];

export const ACCOUNT_TYPES = [
  "PROSPECT",
  "CUSTOMER_DIRECT",
  "CUSTOMER_CHANNEL",
  "CHANNEL_PARTNER",
  "INSTALLATION_PARTNER",
  "TECHNOLOGY_PARTNER",
  "OTHER",
];



export const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Real Estate",
  "Energy",
  "Telecommunications",
  "Consulting",
  "Media",
  "Transportation",
  "Agriculture",
  "Automotive",
  "Pharmaceuticals",
  "Banking",
  "Insurance",
  "E-commerce",
  "Hospitality",
  "Other",
];

// Lead Sources for Contacts and Deals
export const LEAD_SOURCES = [
  { value: "WEB", label: "Website" },
  { value: "PHONE_INQUIRY", label: "Phone Inquiry" },
  { value: "PARTNER_REFERRAL", label: "Partner Referral" },
  { value: "EMPLOYEE_REFERRAL", label: "Employee Referral" },
  { value: "COLD_CALL", label: "Cold Call" },
  { value: "TRADE_SHOW", label: "Trade Show" },
  { value: "ADVERTISEMENT", label: "Advertisement" },
  { value: "SOCIAL_MEDIA", label: "Social Media" },
  { value: "EMAIL_CAMPAIGN", label: "Email Campaign" },
  { value: "PURCHASED_LIST", label: "Purchased List" },
  { value: "OTHER", label: "Other" },
];

export const DEAL_TYPES = [
  { value: "NEW_BUSINESS", label: "New Business" },
  { value: "EXISTING_BUSINESS", label: "Existing Business" },
];

// Format currency in Indian Rupees
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "—";

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format large numbers in Indian style (lakhs, crores)
export const formatIndianNumber = (num) => {
  if (num === null || num === undefined) return "—";
  if (num >= 10000000) {
    return `₹${(num / 10000000).toFixed(2)} Cr`;
  } else if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} L`;
  } else if (num >= 1000) {
    return `₹${(num / 1000).toFixed(2)} K`;
  }
  return `₹${num}`;
};

// export const formatDate = (date) => {
//   if (!date) return "—";
//   return new Date(date).toLocaleDateString("en-IN", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// };

// export const formatLabel = (str) => {
//   if (!str) return "—";
//   return str.replace(/_/g, " ");
// };

export const getInitials = (firstName, lastName) => {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
};

// File size validator (max 5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const validateImageFile = (file) => {
  if (!file) return { valid: false, error: "No file selected" };

  const validTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Please select a valid image (JPEG, PNG, GIF, WebP)",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "Image size should be less than 5MB" };
  }

  return { valid: true, error: null };
};

// Convert file to base64
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const SALUTATIONS = ["Mr.", "Ms.", "Mrs.", "Dr.", "Prof."];

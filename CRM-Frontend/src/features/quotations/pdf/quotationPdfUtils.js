// src/features/quotations/pdf/quotationPdfUtils.js

export function formatMoney(value) {
  const n = Number(value || 0);
  return `Rs. ${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)}`;
}

export function safeText(value, fallback = "-") {
  if (value === null || value === undefined || value === "") return fallback;
  return String(value);
}

export function normalizeLines(value, fallbackLines = []) {
  if (Array.isArray(value) && value.length) {
    return value.filter(Boolean).map(String);
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);
  }

  return fallbackLines;
}

export function fmtDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? safeText(value, "-")
    : d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
}

export function lineAmount(item) {
  const qty = Number(item?.qty ?? item?.quantity ?? 0);
  const price = Number(item?.price ?? 0);
  const discount = Number(item?.discount ?? 0);

  const net =
    item?.net !== undefined && item?.net !== null
      ? Number(item.net)
      : item?.lineTotal !== undefined && item?.lineTotal !== null
        ? Number(item.lineTotal)
        : qty * price - discount;

  return Number.isFinite(net) ? net : 0;
}

export function splitText(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  return String(value)
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}
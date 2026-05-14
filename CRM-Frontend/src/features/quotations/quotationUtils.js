// src/features/quotations/quotationUtils.js

export const DUMMY_PRODUCTS = [
  { id: "P-1001", name: "Industrial Sensor", sku: "SEN-01", price: 1250 },
  { id: "P-1002", name: "Control Relay", sku: "REL-02", price: 780 },
  { id: "P-1003", name: "Panel Cable Set", sku: "CAB-03", price: 420 },
  { id: "P-1004", name: "Power Supply Unit", sku: "PSU-04", price: 2100 },
  { id: "P-1005", name: "HMI Display", sku: "HMI-05", price: 8900 },
];

export const DUMMY_ACCOUNTS = [
  { id: "A-1001", name: "ABC Pvt Ltd" },
  { id: "A-1002", name: "XYZ Industries" },
  { id: "A-1003", name: "Micrologic Systems" },
  { id: "A-1004", name: "Prime Automation" },
];

export function formatINR(value = 0) {
  const num = Number(value || 0);
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export function createQuotationNumber() {
  const now = new Date();
  const y = String(now.getFullYear()).slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const t = String(Date.now()).slice(-4);
  return `QT-${y}${m}${d}-${t}`;
}

export function calcLineTotal(item) {
  const qty = Number(item.qty || 0);
  const price = Number(item.price || 0);
  const discount = Number(item.discount || 0);

  const gross = qty * price;
  const net = Math.max(gross * (1 - discount / 100), 0);

  return {
    gross,
    net,
  };
}

export function calcQuotationTotals(form) {
  const rows = (form.items || []).map((item) => {
    const hasSubItems =
      Array.isArray(item.selectedSubItems) && item.selectedSubItems.length > 0;

    // ✅ SUB ITEMS TOTAL
    const subTotal = hasSubItems
      ? item.selectedSubItems.reduce((sum, sub) => {
          const qty = Number(sub.qty || 1);
          const price = Number(sub.price || 0);
          const discount = Number(sub.discount || 0);

          return sum + Math.max(0, qty * price * (1 - discount / 100));
        }, 0)
      : 0;

    // ✅ PARENT TOTAL
    const parentTotal =
      Number(item.qty || 1) *
      Number(item.price || 0) *
      (1 - Number(item.discount || 0) / 100);

    // ✅ FINAL LINE TOTAL (CRITICAL FIX)
    const base = parentTotal + subTotal;

    return {
      ...item,
      net: base,
      lineTotal: base,
    };
  });

  // ✅ SUBTOTAL
  const subtotal = rows.reduce((sum, row) => sum + Number(row.net || 0), 0);

  // ✅ HEADER DISCOUNT
  const discount = Number(form.headerDiscount || 0);

  const taxable = Math.max(subtotal - discount, 0);

  // ✅ GRAND TOTAL
  const grandTotal = taxable;

  return {
    rows,
    subtotal,
    discount,
    taxable,
    grandTotal,
  };
}

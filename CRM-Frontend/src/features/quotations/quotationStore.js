// src/features/quotations/quotationStore.js

const STORAGE_KEY = "facteyes_quotations_v1";

export function getQuotations() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveQuotations(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function addQuotation(quotation) {
  const list = getQuotations();
  saveQuotations([quotation, ...list]);
}

export function updateQuotation(id, patch) {
  const list = getQuotations().map((q) =>
    q.id === id ? { ...q, ...patch } : q,
  );
  saveQuotations(list);
}

export function getQuotationById(id) {
  return getQuotations().find((q) => q.id === id) || null;
}

export function seedQuotationsIfEmpty(seed = []) {
  const existing = getQuotations();
  if (existing.length === 0 && seed.length > 0) {
    saveQuotations(seed);
  }
}
// src/features/quotations/quotationSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

/* =========================================================
   ✅ HELPERS
========================================================= */
const normalize = (res) => res?.data?.data || res?.data;

// ✅ ENSURE ITEM SNAPSHOT CONSISTENCY
const normalizeQuotation = (q) => {
  if (!q) return q;

  return {
    ...q,
    paymentTerms: Array.isArray(q.paymentTerms) ? q.paymentTerms : [],

    deliveryTerms: Array.isArray(q.deliveryTerms) ? q.deliveryTerms : [],

    importantNotes: Array.isArray(q.importantNotes) ? q.importantNotes : [],

    items: (q.items || []).map((it) => ({
      ...it,

      remarks: it.remarks ?? "",

      category: it.category || it.item?.category || null,
      make: it.make || it.item?.make || null,
      mfgPartNo: it.mfgPartNo || it.item?.mfgPartNo || null,
      uom: it.uom || it.item?.uom || null,

      // ✅ NEW: normalize subItems
      subItems: it.subItems || [],

      // selectedSubItems: (it.subItems || []).map((sub) => ({
      //   ...sub,
      //   id: sub.itemId || sub.id,

      //   // ✅ ADD THESE
      //   sku: sub.sku || "",
      //   category: sub.category || null,

      //   qty: sub.quantity,
      //   price: sub.price,
      //   discount: sub.discount,
      // })),
      selectedSubItems: (it.subItems || []).map((sub) => {
        const qty = Number(sub.quantity || 0);
        const price = Number(sub.price || 0);
        const discount = Number(sub.discount || 0);

        const lineTotal = qty * price * (1 - discount / 100);

        return {
          ...sub,
          id: sub.itemId || sub.id,

          // 🔥 ADD THESE (FINAL FIX)
          sku: sub.sku || "",
          category: sub.category || null,
          make: sub.make || null,
          mfgPartNo: sub.mfgPartNo || null,
          uom: sub.uom || null,

          remarks: sub.remarks || "",

          qty,
          price,
          discount,
          lineTotal,
        };
      }),
    })),
  };
};

/* =========================================================
   ✅ FETCH ALL
========================================================= */
export const fetchQuotations = createAsyncThunk(
  "quotations/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/quotations");
      return normalize(res);
    } catch (err) {
      return rejectWithValue(err.response?.data || "Fetch failed");
    }
  },
);

/* =========================================================
   ✅ FETCH ONE (NEW)
========================================================= */
export const fetchQuotationById = createAsyncThunk(
  "quotations/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.get(`/quotations/${id}`);
      return normalize(res);
    } catch (err) {
      return rejectWithValue(err.response?.data || "Fetch failed");
    }
  },
);

/* =========================================================
   ✅ CREATE
========================================================= */
export const createQuotation = createAsyncThunk(
  "quotations/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/quotations", data);
      return normalize(res);
    } catch (err) {
      return rejectWithValue(err.response?.data || "Create failed");
    }
  },
);

/* =========================================================
   ✅ DELETE (NEW)
========================================================= */
export const deleteQuotation = createAsyncThunk(
  "quotations/delete",
  async (id, { getState, rejectWithValue }) => {
    const user = getState().auth?.user; // 🔥 FIX PATH

    if (user?.role?.toLowerCase() !== "admin") {
      return rejectWithValue("Only admin can delete");
    }

    try {
      await API.delete(`/quotations/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Delete failed");
    }
  },
);

export const updateQuotation = createAsyncThunk(
  "quotations/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/quotations/${id}`, data);
      return normalize(res);
    } catch (err) {
      return rejectWithValue(err.response?.data || "Update failed");
    }
  },
);

/* ================= SUBMIT ================= */
export const submitQuotation = createAsyncThunk(
  "quotations/submit",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.post(`/quotations/${id}/submit`);
      return { id, ...normalize(res) };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Submit failed");
    }
  },
);

/* ================= APPROVE ================= */
export const approveQuotation = createAsyncThunk(
  "quotations/approve",
  async (id, { rejectWithValue }) => {
    try {
      const res = await API.post(`/quotations/${id}/approve`);
      return { id, ...normalize(res) };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Approve failed");
    }
  },
);

/* ================= REJECT ================= */
export const rejectQuotation = createAsyncThunk(
  "quotations/reject",
  async ({ id, comment }, { rejectWithValue }) => {
    try {
      const res = await API.post(`/quotations/${id}/reject`, { comment });
      return { id, ...normalize(res), comment };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Reject failed");
    }
  },
);

/* ================= FETCH HISTORY ================= */
export const fetchQuotationHistory = createAsyncThunk(
  "quotations/fetchHistory",
  async (quotationNo, { rejectWithValue }) => {
    try {
      const res = await API.get(`/quotations/history/${quotationNo}`);
      return normalize(res);
    } catch (err) {
      return rejectWithValue(err.response?.data || "Fetch history failed");
    }
  },
);

/* ================= REVISE ================= */
export const reviseQuotation = createAsyncThunk(
  "quotations/revise",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const res = await API.post(`/quotations/${id}/revise`, { reason });
      return normalize(res);
    } catch (err) {
      return rejectWithValue(err.response?.data || "Revision failed");
    }
  },
);

/* ================= QUOTATION ANALYTICS ================= */

export const fetchQuotationStatusSummary = createAsyncThunk(
  "quotations/fetchStatusSummary",

  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/quotations/analytics/status-summary");

      return normalize(res);
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Fetch status summary failed",
      );
    }
  },
);

export const fetchQuotationLifecycle = createAsyncThunk(
  "quotations/fetchLifecycle",

  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/quotations/analytics/lifecycle");

      return normalize(res);
    } catch (err) {
      return rejectWithValue(err.response?.data || "Fetch lifecycle failed");
    }
  },
);

export const fetchQuotationValueTrend = createAsyncThunk(
  "quotations/fetchValueTrend",

  async (months = 6, { rejectWithValue }) => {
    try {
      const res = await API.get(
        `/quotations/analytics/value-trend?months=${months}`,
      );

      return normalize(res);
    } catch (err) {
      return rejectWithValue(err.response?.data || "Fetch value trend failed");
    }
  },
);

/* =========================================================
   ✅ SLICE
========================================================= */
const quotationSlice = createSlice({
  name: "quotations",

  initialState: {
    list: [],
    selected: null,

    history: [], // 🔥 NEW

    quotationStatusSummary: null,
    quotationLifecycle: [],
    quotationValueTrend: [],

    loading: false,
    error: null,
  },

  reducers: {
    clearQuotationError: (state) => {
      state.error = null;
    },
    clearSelectedQuotation: (state) => {
      state.selected = null;
    },

    clearQuotationHistory: (state) => {
      // 🔥 ADD HERE
      state.history = [];
    },
  },

  extraReducers: (builder) => {
    builder

      /* ================= FETCH ALL ================= */
      .addCase(fetchQuotations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuotations.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload)
          ? action.payload.map(normalizeQuotation)
          : [];
      })
      .addCase(fetchQuotations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= FETCH ONE ================= */
      .addCase(fetchQuotationById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuotationById.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = normalizeQuotation(action.payload);
      })
      .addCase(fetchQuotationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= CREATE ================= */
      .addCase(createQuotation.pending, (state) => {
        state.loading = true;
      })
      .addCase(createQuotation.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(normalizeQuotation(action.payload));
      })
      .addCase(createQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateQuotation.fulfilled, (state, action) => {
        const updated = normalizeQuotation(action.payload);

        // 🔥 remove old version (same quotationNo)
        state.list = state.list.filter(
          (q) => q.quotationNo !== updated.quotationNo,
        );

        // 🔥 add latest on top
        state.list.unshift(updated);

        // update selected
        state.selected = updated;
      })

      /* ================= SUBMIT ================= */
      .addCase(submitQuotation.pending, (state) => {
        // state.loading = true; (🔥 Removed to prevent UI flicker)
      })
      .addCase(submitQuotation.fulfilled, (state, action) => {
        state.loading = false;
        const updated = normalizeQuotation(action.payload);
        const id = updated.id;

        // update list
        state.list = state.list.map((q) => (q.id === id ? updated : q));

        // update selected
        if (state.selected?.id === id) {
          state.selected = updated;
        }
      })
      .addCase(submitQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= APPROVE ================= */
      .addCase(approveQuotation.pending, (state) => {
        // state.loading = true;
      })
      .addCase(approveQuotation.fulfilled, (state, action) => {
        state.loading = false;
        const updated = normalizeQuotation(action.payload);
        const id = updated.id;

        state.list = state.list.map((q) => (q.id === id ? updated : q));

        if (state.selected?.id === id) {
          state.selected = updated;
        }
      })
      .addCase(approveQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= REJECT ================= */
      .addCase(rejectQuotation.pending, (state) => {
        // state.loading = true;
      })
      .addCase(rejectQuotation.fulfilled, (state, action) => {
        state.loading = false;
        const updated = normalizeQuotation(action.payload);
        const id = updated.id;

        state.list = state.list.map((q) => (q.id === id ? updated : q));

        if (state.selected?.id === id) {
          state.selected = updated;
        }
      })
      .addCase(rejectQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= FETCH HISTORY ================= */
      .addCase(fetchQuotationHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuotationHistory.fulfilled, (state, action) => {
        state.loading = false;

        state.history = Array.isArray(action.payload)
          ? action.payload.map(normalizeQuotation)
          : [];
      })
      .addCase(fetchQuotationHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= DELETE ================= */
      .addCase(deleteQuotation.fulfilled, (state, action) => {
        state.list = state.list.filter((q) => q.id !== action.payload);
        state.error = null; // ✅ clear old error
      })

      .addCase(deleteQuotation.rejected, (state, action) => {
        state.error = action.payload || "Delete not allowed";
      })
      /* ================= REVISE ================= */
      .addCase(reviseQuotation.pending, (state) => {
        // state.loading = true;
      })
      .addCase(reviseQuotation.fulfilled, (state, action) => {
        state.loading = false;
        const revised = normalizeQuotation(action.payload);
        state.list.unshift(revised);
        // state.selected = revised; (🔥 Removed to prevent re-fetch loop in QuotationDetail)
      })
      .addCase(reviseQuotation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      /* ================= STATUS SUMMARY ================= */

      .addCase(fetchQuotationStatusSummary.fulfilled, (state, action) => {
        state.quotationStatusSummary = action.payload;
      })

      /* ================= LIFECYCLE ================= */

      .addCase(fetchQuotationLifecycle.fulfilled, (state, action) => {
        state.quotationLifecycle = action.payload || [];
      })

      /* ================= VALUE TREND ================= */

      .addCase(fetchQuotationValueTrend.fulfilled, (state, action) => {
        state.quotationValueTrend = action.payload || [];
      });
  },
});

export const {
  clearQuotationError,
  clearSelectedQuotation,
  clearQuotationHistory,
} = quotationSlice.actions;

export default quotationSlice.reducer;

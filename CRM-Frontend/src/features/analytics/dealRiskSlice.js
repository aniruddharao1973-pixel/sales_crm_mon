// src/features/analytics/dealRiskSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

/**
 * GET /api/analytics/deal-risk/:dealId
 */
export const fetchDealRisk = createAsyncThunk(
  "dealRisk/fetchDealRisk",
  async (dealId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/analytics/deal-risk/${dealId}`);

      const data = res.data.data;

      if (!data) return null;

      // 🔹 Normalize backend response for UI stability
      return {
        score: data.score,
        riskLevel: data.riskLevel,

        // Map new backend keys to existing UI keys
        factors: data.metrics || data.factors || {},
        playbook: data.systemPlaybook || data.playbook || [],

        // Hybrid AI layer
        ai: data.ai || null,
      };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch deal risk"
      );
    }
  }
);

/**
 * GET /api/analytics/deal-risk?level=HIGH
 */
export const fetchTopRiskDeals = createAsyncThunk(
  "dealRisk/fetchTopRiskDeals",
  async (level, { rejectWithValue }) => {
    try {
      const query = level ? `?level=${level}` : "";
      const res = await axios.get(`/analytics/deal-risk${query}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch top risk deals"
      );
    }
  }
);

/**
 * POST /api/analytics/deal-risk/recalculate
 */
export const recalculateDealRisk = createAsyncThunk(
  "dealRisk/recalculateDealRisk",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(`/analytics/deal-risk/recalculate`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          "Failed to recalculate deal risks"
      );
    }
  }
);

const dealRiskSlice = createSlice({
  name: "dealRisk",
  initialState: {
    currentDealRisk: null,
    topRiskDeals: [],
    loading: false,
    error: null,
    recalculating: false,
  },
  reducers: {
    clearDealRisk(state) {
      state.currentDealRisk = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch single deal risk
      .addCase(fetchDealRisk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDealRisk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDealRisk = action.payload;
      })
      .addCase(fetchDealRisk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Fetch top risky deals
      .addCase(fetchTopRiskDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopRiskDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.topRiskDeals = action.payload;
      })
      .addCase(fetchTopRiskDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Recalculate risks
      .addCase(recalculateDealRisk.pending, (state) => {
        state.recalculating = true;
        state.error = null;
      })
      .addCase(recalculateDealRisk.fulfilled, (state) => {
        state.recalculating = false;
      })
      .addCase(recalculateDealRisk.rejected, (state, action) => {
        state.recalculating = false;
        state.error = action.payload;
      });
  },
});

export const { clearDealRisk } = dealRiskSlice.actions;
export default dealRiskSlice.reducer;
// features\analytics\analyticsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

/* ============================================================
    THUNKS
  ============================================================ */

export const fetchDashboardAnalytics = createAsyncThunk(
  "analytics/dashboard",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/analytics/dashboard");
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard",
      );
    }
  },
);

export const fetchDealsByStage = createAsyncThunk(
  "analytics/dealsByStage",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/analytics/deals-by-stage");
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch stage data",
      );
    }
  },
);

export const fetchMonthlyTrend = createAsyncThunk(
  "analytics/monthlyTrend",
  async (months = 6, { rejectWithValue }) => {
    try {
      const { data } = await API.get(
        `/analytics/monthly-trend?months=${months}`,
      );
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch trend data",
      );
    }
  },
);

export const fetchTopPerformers = createAsyncThunk(
  "analytics/topPerformers",
  async (limit = 5, { rejectWithValue }) => {
    try {
      const { data } = await API.get(
        `/analytics/top-performers?limit=${limit}`,
      );
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch performers",
      );
    }
  },
);

export const fetchDealsBySource = createAsyncThunk(
  "analytics/dealsBySource",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/analytics/deals-by-source");
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch source data",
      );
    }
  },
);

export const fetchRecentActivities = createAsyncThunk(
  "analytics/recentActivities",
  async (limit = 10, { rejectWithValue }) => {
    try {
      const { data } = await API.get(
        `/analytics/recent-activities?limit=${limit}`,
      );
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch activities",
      );
    }
  },
);

export const fetchDealsByIndustry = createAsyncThunk(
  "analytics/dealsByIndustry",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/analytics/deals-by-industry");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const fetchKpiMetrics = createAsyncThunk(
  "analytics/kpiMetrics",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/analytics/kpi-metrics");
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch KPI metrics",
      );
    }
  },
);

export const fetchDealMomentum = createAsyncThunk(
  "analytics/dealMomentum",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/analytics/deal-momentum");
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch deal momentum",
      );
    }
  },
);

export const fetchOverdueDeals = createAsyncThunk(
  "analytics/overdueDeals",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/analytics/overdue-deals");
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch overdue deals",
      );
    }
  },
);
/* ============================================================
    SLICE
  ============================================================ */

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    dashboard: null,
    dealsByStage: [],
    monthlyTrend: [],
    topPerformers: [],
    dealsBySource: [],
    dealsByIndustry: [],
    overdueDeals: [],
    recentActivities: null,

    dealMomentum: [],
    // dealMomentumCount: 0,
    dealMomentumLoading: false,
    overdueDealsLoading: false,

    /* NEW */
    kpis: {
      conversionRate: 0,
      revenueWon: 0,
      overdueDealsPercent: 0, // ✅ NEW
      revenueRealizationRate: 0,

      calculation: {
        wonDeals: 0,
        lostDeals: 0,
        closedDeals: 0,
        revenueWon: 0,
        revenueLost: 0,

        totalActiveDeals: 0, // ✅ NEW
        overdueDeals: 0, // ✅ NEW
      },
    },

    dashboardLoading: false,
    loading: false,
    error: null,
  },

  reducers: {
    clearAnalyticsError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ---------------- Dashboard ---------------- */
      .addCase(fetchDashboardAnalytics.pending, (state) => {
        state.dashboardLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboard = action.payload;
      })
      .addCase(fetchDashboardAnalytics.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.error = action.payload;
      })

      /* ---------------- Stage ---------------- */
      .addCase(fetchDealsByStage.fulfilled, (state, action) => {
        state.dealsByStage = action.payload;
      })

      /* ---------------- Monthly Trend ---------------- */
      .addCase(fetchMonthlyTrend.fulfilled, (state, action) => {
        state.monthlyTrend = action.payload;
      })

      /* ---------------- Top Performers ---------------- */
      .addCase(fetchTopPerformers.fulfilled, (state, action) => {
        state.topPerformers = action.payload;
      })

      /* ---------------- Source ---------------- */
      .addCase(fetchDealsBySource.fulfilled, (state, action) => {
        state.dealsBySource = action.payload;
      })

      /* ---------------- Recent Activities ---------------- */
      .addCase(fetchRecentActivities.fulfilled, (state, action) => {
        state.recentActivities = action.payload;
      })
      // Deals by industry
      .addCase(fetchDealsByIndustry.fulfilled, (state, action) => {
        state.dealsByIndustry = action.payload;
      })

      /* ---------------- KPI Metrics ---------------- */
      .addCase(fetchKpiMetrics.fulfilled, (state, action) => {
        state.kpis = {
          ...state.kpis,
          ...action.payload,
        };
      })

      /* ---------------- Deal Momentum Engine ---------------- */

      .addCase(fetchDealMomentum.pending, (state) => {
        state.dealMomentumLoading = true;
      })

      .addCase(fetchDealMomentum.fulfilled, (state, action) => {
        state.dealMomentumLoading = false;
        state.dealMomentum = action.payload;
      })

      .addCase(fetchDealMomentum.rejected, (state, action) => {
        state.dealMomentumLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchOverdueDeals.pending, (state) => {
        state.overdueDealsLoading = true;
      })

      .addCase(fetchOverdueDeals.fulfilled, (state, action) => {
        state.overdueDealsLoading = false;
        state.overdueDeals = action.payload;
      })

      .addCase(fetchOverdueDeals.rejected, (state, action) => {
        state.overdueDealsLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAnalyticsError } = analyticsSlice.actions;
export default analyticsSlice.reducer;

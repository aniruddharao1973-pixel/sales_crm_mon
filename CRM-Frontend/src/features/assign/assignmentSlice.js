// src/features/assign/assignmentSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

/* ================= FETCH MATRIX ================= */
export const fetchAssignments = createAsyncThunk(
  "assignment/fetch",
  async (type, { rejectWithValue }) => {
    try {
      const res = await API.get(`/assignment/${type}`);
      return { type, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

/* ================= TOGGLE ================= */
export const toggleAssignment = createAsyncThunk(
  "assignment/toggle",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await API.post("/assignment/toggle", payload);
      return { ...payload, ...res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const assignmentSlice = createSlice({
  name: "assignment",
  initialState: {
    users: [],
    records: [],
    loading: false,
    toggleLoadingMap: {},
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* FETCH */
      .addCase(fetchAssignments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.records = action.payload.records.map((r) => ({
          ...r,
          lifecycle: r.lifecycle || "ACTIVE", // ✅ correct field
        }));
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* TOGGLE */
      .addCase(toggleAssignment.pending, (state, action) => {
        const { recordId, userId } = action.meta.arg;
        state.toggleLoadingMap[`${recordId}_${userId}`] = true;
      })

      .addCase(toggleAssignment.fulfilled, (state, action) => {
        const { recordId, userId, assigned } = action.payload;

        state.toggleLoadingMap[`${recordId}_${userId}`] = false;

        const record = state.records.find((r) => r.id === recordId);

        if (record) {
          // ✅ SIMPLE TOGGLE
          record.assignments[userId] = assigned;
        }
      })

      .addCase(toggleAssignment.rejected, (state, action) => {
        const { recordId, userId } = action.meta.arg;

        state.toggleLoadingMap[`${recordId}_${userId}`] = false;
        state.error = action.payload;
      });
  },
});

export default assignmentSlice.reducer;

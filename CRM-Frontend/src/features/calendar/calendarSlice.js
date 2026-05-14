// src/features/calendar/calendarSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

/*
────────────────────────────────────────────
HELPER: NORMALIZE MEETING (🔥 CORE FIX)
────────────────────────────────────────────
*/
const normalizeMeeting = (m) => ({
  id: m.id,
  title: m.title,

  // ✅ ALWAYS convert to JS Date
  start: m.startTime || m.start,
  end: m.endTime || m.end,

  extendedProps: {
    description: m.description || m.extendedProps?.description,
    meetingLink: m.meetingLink || m.extendedProps?.meetingLink,
    location: m.location || m.extendedProps?.location,
    status: m.status || m.extendedProps?.status,
    // ✅ ADD THIS
    provider: m.provider || m.extendedProps?.provider,

    contact: m.contact || m.extendedProps?.contact,
    account: m.account || m.extendedProps?.account,
    deal: m.deal || m.extendedProps?.deal,
    attendees: m.attendees || m.extendedProps?.attendees,
  },
});

/*
────────────────────────────────────────────
CREATE MEETING
────────────────────────────────────────────
*/
export const createMeeting = createAsyncThunk(
  "calendar/createMeeting",
  async (meetingData, { rejectWithValue }) => {
    try {
      const res = await api.post("/calendar/create-meeting", meetingData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create meeting",
      );
    }
  },
);

/*
────────────────────────────────────────────
FETCH MEETINGS
────────────────────────────────────────────
*/
export const fetchCalendarMeetings = createAsyncThunk(
  "calendar/fetchCalendarMeetings",
  async ({ start, end }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/calendar/calendar?start=${start}&end=${end}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch meetings",
      );
    }
  },
);

/*
────────────────────────────────────────────
UPDATE MEETING
────────────────────────────────────────────
*/
export const updateMeeting = createAsyncThunk(
  "calendar/updateMeeting",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/calendar/update-meeting/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update meeting",
      );
    }
  },
);

/*
────────────────────────────────────────────
DELETE MEETING
────────────────────────────────────────────
*/
export const deleteMeeting = createAsyncThunk(
  "calendar/deleteMeeting",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/calendar/delete-meeting/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete meeting",
      );
    }
  },
);

/*
────────────────────────────────────────────
INITIAL STATE
────────────────────────────────────────────
*/
const initialState = {
  meetings: [],
  loading: false,
  error: null,
  createdMeeting: null,
};

/*
────────────────────────────────────────────
SLICE
────────────────────────────────────────────
*/
const calendarSlice = createSlice({
  name: "calendar",
  initialState,

  reducers: {
    clearMeetingState: (state) => {
      state.createdMeeting = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /*
      ───────── CREATE ─────────
      */
      .addCase(createMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createMeeting.fulfilled, (state, action) => {
        state.loading = false;
        state.createdMeeting = action.payload;

        // ✅ NORMALIZE BEFORE STORING
        if (action.payload) {
          state.meetings.unshift(normalizeMeeting(action.payload));
        }
      })

      .addCase(createMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /*
      ───────── FETCH ─────────
      */
      .addCase(fetchCalendarMeetings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCalendarMeetings.fulfilled, (state, action) => {
        state.loading = false;

        // 🔥 CRITICAL FIX: normalize ALL meetings
        state.meetings = action.payload.map(normalizeMeeting);
      })

      .addCase(fetchCalendarMeetings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /*
      ───────── UPDATE ─────────
      */
      .addCase(updateMeeting.pending, (state) => {
        state.loading = true;
      })

      .addCase(updateMeeting.fulfilled, (state, action) => {
        state.loading = false;

        const updated = normalizeMeeting(action.payload);

        state.meetings = state.meetings.map((m) =>
          m.id === updated.id ? updated : m,
        );
      })

      .addCase(updateMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /*
      ───────── DELETE ─────────
      */
      .addCase(deleteMeeting.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteMeeting.fulfilled, (state, action) => {
        state.loading = false;

        const id = action.payload;
        state.meetings = state.meetings.filter((m) => m.id !== id);
      })

      .addCase(deleteMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

/*
────────────────────────────────────────────
EXPORTS
────────────────────────────────────────────
*/
export const { clearMeetingState } = calendarSlice.actions;

export default calendarSlice.reducer;

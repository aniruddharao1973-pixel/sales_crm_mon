// src\features\notifications\notificationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async () => {
    const { data } = await API.get("/notifications");
    return data;
  }
);

export const markAsRead = createAsyncThunk(
  "notifications/read",
  async (id) => {
    await API.patch(`/notifications/${id}/read`);
    return id;
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    loading: false,
  },

  reducers: {
    // ✅ REALTIME ADD
    addNotification: (state, action) => {
      const exists = state.items.find((n) => n.id === action.payload.id);
      if (!exists) {
        state.items.unshift(action.payload);
      }
    },

    markAllAsReadLocal: (state) => {
      state.items.forEach((n) => (n.isRead = true));
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(markAsRead.fulfilled, (state, action) => {
        const n = state.items.find((i) => i.id === action.payload);
        if (n) n.isRead = true;
      });
  },
});

export const { addNotification, markAllAsReadLocal } =
  notificationSlice.actions;

export default notificationSlice.reducer;
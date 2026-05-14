// src\features\contacts\contactSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

export const fetchContacts = createAsyncThunk(
  "contacts/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/contacts", { params });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch contacts",
      );
    }
  },
);

export const fetchContact = createAsyncThunk(
  "contacts/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/contacts/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch contact",
      );
    }
  },
);

export const createContact = createAsyncThunk(
  "contacts/create",
  async (contactData, { rejectWithValue }) => {
    try {
      const { data } = await API.post("/contacts", contactData);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create contact",
      );
    }
  },
);

export const updateContact = createAsyncThunk(
  "contacts/update",
  async ({ id, ...contactData }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/contacts/${id}`, contactData);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update contact",
      );
    }
  },
);

export const deleteContact = createAsyncThunk(
  "contacts/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/contacts/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete contact",
      );
    }
  },
);

export const fetchContactsDropdown = createAsyncThunk(
  "contacts/dropdown",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/contacts/dropdown/list", { params });
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

export const importContacts = createAsyncThunk(
  "contacts/import",
  async (file, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await API.post("/contacts/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(fetchContacts({ page: 1, limit: 10, search: "" }));
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to import contacts",
      );
    }
  },
);

const contactSlice = createSlice({
  name: "contacts",
  initialState: {
    contacts: [],
    contact: null,
    dropdown: [],
    pagination: null,
    loading: false,
    detailLoading: false,
    error: null,
  },
  reducers: {
    clearContactError: (state) => {
      state.error = null;
    },
    clearCurrentContact: (state) => {
      state.contact = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchContact.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchContact.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.contact = action.payload;
      })
      .addCase(fetchContact.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.contacts.unshift(action.payload);
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        const idx = state.contacts.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.contacts[idx] = action.payload;
        if (state.contact?.id === action.payload.id)
          state.contact = action.payload;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter((c) => c.id !== action.payload);
      })
      .addCase(fetchContactsDropdown.fulfilled, (state, action) => {
        state.dropdown = action.payload;
      });
  },
});

export const { clearContactError, clearCurrentContact } = contactSlice.actions;
export default contactSlice.reducer;

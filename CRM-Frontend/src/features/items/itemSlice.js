// // src/features/items/itemSlice.js

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import API from "../../api/axios";

// /* ================= NORMALIZER ================= */
// const normalize = (res) => res?.data?.data || res?.data;

// /* ================= CREATE ITEM ================= */
// export const createItem = createAsyncThunk(
//   "items/create",
//   async (data, { rejectWithValue }) => {
//     try {
//       const res = await API.post("/items", data);
//       return normalize(res);
//     } catch (err) {
//       return rejectWithValue(err.response?.data || "Create item failed");
//     }
//   },
// );

// /* ================= FETCH ALL ITEMS ================= */
// export const fetchItems = createAsyncThunk(
//   "items/fetchAll",
//   async (category, { rejectWithValue }) => {
//     try {
//       const res = await API.get("/items", {
//         params: category ? { category } : {},
//       });
//       return normalize(res);
//     } catch (err) {
//       return rejectWithValue(err.response?.data || "Fetch items failed");
//     }
//   },
// );

// /* ================= UPDATE ITEM ================= */
// export const updateItem = createAsyncThunk(
//   "items/update",
//   async ({ id, data }, { rejectWithValue }) => {
//     try {
//       const res = await API.put(`/items/${id}`, data);
//       return normalize(res);
//     } catch (err) {
//       return rejectWithValue(err.response?.data || "Update failed");
//     }
//   },
// );

// /* ================= DELETE ITEM ================= */
// export const deleteItem = createAsyncThunk(
//   "items/delete",
//   async (id, { getState, rejectWithValue }) => {
//     const user = getState().auth?.user; // 🔥 FIX PATH

//     if (user?.role?.toLowerCase() !== "admin") {
//       return rejectWithValue("Only admin can delete items");
//     }

//     try {
//       await API.delete(`/items/${id}`);
//       return id;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || "Delete failed");
//     }
//   },
// );

// /* ================= IMPORT ITEMS ================= */
// export const importItems = createAsyncThunk(
//   "items/import",
//   async ({ file, category, importType }, { rejectWithValue }) => {
//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("category", category);
//       formData.append("importType", importType);

//       const res = await API.post("/items/import", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       return normalize(res);
//     } catch (err) {
//       return rejectWithValue(err.response?.data || "Import failed");
//     }
//   },
// );

// /* ================= SEARCH ITEMS ================= */
// export const searchItems = createAsyncThunk(
//   "items/search",
//   async (query, { rejectWithValue }) => {
//     try {
//       const res = await API.get("/items/search", {
//         params: { q: query },
//       });

//       return normalize(res);
//     } catch (err) {
//       return rejectWithValue(err.response?.data || "Search failed");
//     }
//   },
// );

// /* ================= HIERARCHY HELPER ================= */
// export const buildItemTree = (items) => {
//   const map = {};
//   const roots = [];

//   items.forEach((item) => {
//     map[item.id] = { ...item, children: [] };
//   });

//   items.forEach((item) => {
//     if (item.parentId) {
//       map[item.parentId]?.children.push(map[item.id]);
//     } else {
//       roots.push(map[item.id]);
//     }
//   });

//   return roots;
// };

// /* ================= SLICE ================= */
// const itemSlice = createSlice({
//   name: "items",
//   initialState: {
//     list: [],
//     searchResults: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},

//   extraReducers: (builder) => {
//     builder

//       /* ===== FETCH ===== */
//       .addCase(fetchItems.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchItems.fulfilled, (state, action) => {
//         state.loading = false;

//         // ✅ backend already returns TREE → use directly
//         state.list = Array.isArray(action.payload)
//           ? action.payload.map((item) => ({
//               pricingMode: "parent_only",
//               ...item,
//             }))
//           : [];
//       })
//       .addCase(fetchItems.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       /* ===== SEARCH ===== */
//       .addCase(searchItems.pending, (state) => {
//         state.loading = true;
//       })

//       .addCase(searchItems.fulfilled, (state, action) => {
//         state.loading = false;
//         state.searchResults = Array.isArray(action.payload)
//           ? action.payload
//           : [];
//       })

//       .addCase(searchItems.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       /* ===== CREATE ===== */
//       .addCase(createItem.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(createItem.fulfilled, (state, action) => {
//         state.loading = false;
//         state.list.unshift(action.payload); // ✅ includes category automatically
//       })
//       .addCase(createItem.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       /* ===== UPDATE ===== */
//       .addCase(updateItem.fulfilled, (state, action) => {
//         const updateRecursive = (items) =>
//           items.map((item) => {
//             if (item.id === action.payload.id) {
//               return {
//                 ...item,
//                 ...action.payload,
//                 children: item.children || [], // preserve children
//               };
//             }

//             if (item.children?.length) {
//               return {
//                 ...item,
//                 children: updateRecursive(item.children),
//               };
//             }

//             return item;
//           });

//         state.list = updateRecursive(state.list);
//       })

//       /* ===== IMPORT ===== */
//       .addCase(importItems.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(importItems.fulfilled, (state) => {
//         state.loading = false;
//         // 🔥 IMPORTANT: don't mutate list blindly
//         // instead trigger refetch from UI after import
//       })
//       .addCase(importItems.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       /* ===== DELETE ===== */
//       .addCase(deleteItem.fulfilled, (state, action) => {
//         state.list = state.list.filter((i) => i.id !== action.payload);
//         state.error = null;
//       })
//       .addCase(deleteItem.rejected, (state, action) => {
//         state.error = action.payload || "Delete not allowed";
//       });
//   },
// });

// export default itemSlice.reducer;

// src/features/items/itemSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

/* ================= NORMALIZER ================= */
const normalize = (res) => res?.data?.data || res?.data;

/* ================= CREATE ITEM ================= */
export const createItem = createAsyncThunk(
  "items/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await API.post("/items", data);
      return normalize(res);
    } catch (err) {
      return rejectWithValue(err.response?.data || "Create item failed");
    }
  },
);

/* ================= FETCH ALL ITEMS ================= */
export const fetchItems = createAsyncThunk(
  "items/fetchAll",
  async (category, { rejectWithValue }) => {
    try {
      const res = await API.get("/items", {
        params: category ? { category } : {},
      });
      return normalize(res);
    } catch (err) {
      return rejectWithValue(err.response?.data || "Fetch items failed");
    }
  },
);

/* ================= UPDATE ITEM ================= */
export const updateItem = createAsyncThunk(
  "items/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const isFormData = data instanceof FormData;

      const res = await API.put(`/items/${id}`, data, {
        headers: isFormData
          ? {
              "Content-Type": "multipart/form-data",
            }
          : {},
      });
      return normalize(res);
    } catch (err) {
      return rejectWithValue(err.response?.data || "Update failed");
    }
  },
);

/* ================= DELETE ITEM ================= */
export const deleteItem = createAsyncThunk(
  "items/delete",
  async (id, { getState, rejectWithValue }) => {
    const user = getState().auth?.user; // 🔥 FIX PATH

    if (user?.role?.toLowerCase() !== "admin") {
      return rejectWithValue("Only admin can delete items");
    }

    try {
      await API.delete(`/items/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Delete failed");
    }
  },
);

/* ================= IMPORT ITEMS ================= */
export const importItems = createAsyncThunk(
  "items/import",
  async ({ file, category, importType }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      formData.append("importType", importType);

      const res = await API.post("/items/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return normalize(res);
    } catch (err) {
      return rejectWithValue(err.response?.data || "Import failed");
    }
  },
);

/* ================= SEARCH ITEMS ================= */
export const searchItems = createAsyncThunk(
  "items/search",
  async (query, { rejectWithValue }) => {
    try {
      const res = await API.get("/items/search", {
        params: { q: query },
      });

      return normalize(res);
    } catch (err) {
      return rejectWithValue(err.response?.data || "Search failed");
    }
  },
);

/* ================= HIERARCHY HELPER ================= */
export const buildItemTree = (items) => {
  const map = {};
  const roots = [];

  items.forEach((item) => {
    map[item.id] = { ...item, children: [] };
  });

  items.forEach((item) => {
    if (item.parentId) {
      map[item.parentId]?.children.push(map[item.id]);
    } else {
      roots.push(map[item.id]);
    }
  });

  return roots;
};

/* ================= SLICE ================= */
const itemSlice = createSlice({
  name: "items",
  initialState: {
    list: [],
    searchResults: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder

      /* ===== FETCH ===== */
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;

        // ✅ backend already returns TREE → use directly
        state.list = Array.isArray(action.payload)
          ? action.payload.map((item) => ({
              pricingMode: "parent_only",
              ...item,
              imageUrl: item.imageUrl || null,
            }))
          : [];
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== SEARCH ===== */
      .addCase(searchItems.pending, (state) => {
        state.loading = true;
      })

      .addCase(searchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = Array.isArray(action.payload)
          ? action.payload
          : [];
      })

      .addCase(searchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== CREATE ===== */
      .addCase(createItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload); // ✅ includes category automatically
      })
      .addCase(createItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== UPDATE ===== */
      .addCase(updateItem.fulfilled, (state, action) => {
        const updateRecursive = (items) =>
          items.map((item) => {
            if (item.id === action.payload.id) {
              return {
                ...item,
                ...action.payload,
                children: item.children || [], // preserve children
              };
            }

            if (item.children?.length) {
              return {
                ...item,
                children: updateRecursive(item.children),
              };
            }

            return item;
          });

        state.list = updateRecursive(state.list);
      })

      /* ===== IMPORT ===== */
      .addCase(importItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(importItems.fulfilled, (state) => {
        state.loading = false;
        // 🔥 IMPORTANT: don't mutate list blindly
        // instead trigger refetch from UI after import
      })
      .addCase(importItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== DELETE ===== */
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.list = state.list.filter((i) => i.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.error = action.payload || "Delete not allowed";
      });
  },
});

export default itemSlice.reducer;

// // src\features\deals\dealSlice.js
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import API from "../../api/axios";

// /* ================= FETCH ALL ================= */
// export const fetchDeals = createAsyncThunk(
//   "deals/fetchAll",
//   async (params, { rejectWithValue }) => {
//     try {
//       const { data } = await API.get("/deals", { params });
//       return data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to fetch deals",
//       );
//     }
//   },
// );

// /* ================= FETCH ONE ================= */
// export const fetchDeal = createAsyncThunk(
//   "deals/fetchOne",
//   async (id, { rejectWithValue }) => {
//     try {
//       const { data } = await API.get(`/deals/${id}`);
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to fetch deal",
//       );
//     }
//   },
// );

// /* ================= CREATE ================= */
// export const createDeal = createAsyncThunk(
//   "deals/create",
//   async (dealData, { rejectWithValue }) => {
//     try {
//       const { data } = await API.post("/deals", dealData);
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to create deal",
//       );
//     }
//   },
// );

// /* ================= UPDATE ================= */
// export const updateDeal = createAsyncThunk(
//   "deals/update",
//   async ({ id, ...dealData }, { rejectWithValue }) => {
//     try {
//       const { data } = await API.put(`/deals/${id}`, dealData);
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to update deal",
//       );
//     }
//   },
// );

// /* ⭐ QUICK STAGE UPDATE (for progress bar click) */
// export const updateDealStage = createAsyncThunk(
//   "deals/updateStage",
//   async ({ id, stage }, { rejectWithValue }) => {
//     try {
//       const { data } = await API.put(`/deals/${id}`, { stage });
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to update stage",
//       );
//     }
//   },
// );

// /* ================= DELETE ================= */
// export const deleteDeal = createAsyncThunk(
//   "deals/delete",
//   async (id, { rejectWithValue }) => {
//     try {
//       await API.delete(`/deals/${id}`);
//       return id;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to delete deal",
//       );
//     }
//   },
// );

// /* ⭐ BULK DELETE */
// export const bulkDeleteDeals = createAsyncThunk(
//   "deals/bulkDelete",
//   async (ids, { rejectWithValue }) => {
//     try {
//       await API.post("/deals/bulk-delete", { ids });
//       return ids;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to delete deals",
//       );
//     }
//   },
// );

// /* ================= PIPELINE ================= */
// export const fetchPipelineStats = createAsyncThunk(
//   "deals/pipeline",
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await API.get("/deals/pipeline/stats");
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data?.message);
//     }
//   },
// );

// /* ================= IMPORT ================= */
// export const importDeals = createAsyncThunk(
//   "deals/import",
//   async (file, { rejectWithValue, dispatch }) => {
//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       const { data } = await API.post("/deals/import", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       dispatch(fetchDeals({ page: 1, limit: 10, search: "" }));
//       return data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to import deals",
//       );
//     }
//   },
// );

// /* ================= UPDATE STAGE HISTORY NOTE ================= */
// export const updateStageHistoryNote = createAsyncThunk(
//   "deals/updateStageHistoryNote",
//   async ({ id, description }, { rejectWithValue }) => {
//     try {
//       const { data } = await API.put(`/deals/stage-history/${id}`, {
//         description,
//       });
//       return data.data;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data?.message || "Failed to update note",
//       );
//     }
//   },
// );

// /* ======================================================= */

// const dealSlice = createSlice({
//   name: "deals",
//   initialState: {
//     deals: [],
//     deal: null,
//     pipelineStats: null,
//     pagination: null,

//     loading: false,
//     detailLoading: false,
//     actionLoading: false,

//     error: null,
//   },

//   reducers: {
//     clearDealError: (state) => {
//       state.error = null;
//     },
//     clearCurrentDeal: (state) => {
//       state.deal = null;
//     },
//   },

//   extraReducers: (builder) => {
//     builder

//       /* ================= FETCH LIST ================= */
//       .addCase(fetchDeals.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchDeals.fulfilled, (state, action) => {
//         state.loading = false;
//         state.deals = action.payload.data;
//         state.pagination = action.payload.pagination;
//       })
//       .addCase(fetchDeals.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       /* ================= FETCH ONE ================= */
//       .addCase(fetchDeal.pending, (state) => {
//         state.detailLoading = true;
//       })
//       .addCase(fetchDeal.fulfilled, (state, action) => {
//         state.detailLoading = false;
//         state.deal = action.payload;
//       })
//       .addCase(fetchDeal.rejected, (state, action) => {
//         state.detailLoading = false;
//         state.error = action.payload;
//       })

//       /* ================= CREATE ================= */
//       .addCase(createDeal.pending, (state) => {
//         state.actionLoading = true;
//       })
//       .addCase(createDeal.fulfilled, (state, action) => {
//         state.actionLoading = false;
//         state.deals.unshift(action.payload);
//       })
//       .addCase(createDeal.rejected, (state, action) => {
//         state.actionLoading = false;
//         state.error = action.payload;
//       })

//       /* ================= UPDATE ================= */
//       .addCase(updateDeal.pending, (state) => {
//         state.actionLoading = true;
//       })
//       .addCase(updateDeal.fulfilled, (state, action) => {
//         state.actionLoading = false;

//         const idx = state.deals.findIndex((d) => d.id === action.payload.id);
//         if (idx !== -1) state.deals[idx] = action.payload;

//         if (state.deal?.id === action.payload.id) {
//           state.deal = {
//             ...action.payload,
//             stageHistory:
//               action.payload.stageHistory || state.deal.stageHistory,
//           };
//         }
//       })
//       .addCase(updateDeal.rejected, (state, action) => {
//         state.actionLoading = false;
//         state.error = action.payload;
//       })

//       /* ⭐ STAGE QUICK UPDATE */
//       .addCase(updateDealStage.fulfilled, (state, action) => {
//         state.deal = action.payload;
//       })

//       /* ⭐ STAGE HISTORY NOTE UPDATE */
//       .addCase(updateStageHistoryNote.fulfilled, (state, action) => {
//         const updated = action.payload;

//         if (state.deal?.stageHistory) {
//           const idx = state.deal.stageHistory.findIndex(
//             (s) => s.id === updated.id,
//           );
//           if (idx !== -1) {
//             state.deal.stageHistory[idx] = updated;
//           }
//         }
//       })

//       /* ================= DELETE ================= */
//       .addCase(deleteDeal.fulfilled, (state, action) => {
//         state.deals = state.deals.filter((d) => d.id !== action.payload);
//       })

//       /* ⭐ BULK DELETE */
//       .addCase(bulkDeleteDeals.fulfilled, (state, action) => {
//         const deletedIds = action.payload; // array of ids
//         state.deals = state.deals.filter((d) => !deletedIds.includes(d.id));
//       })

//       /* ================= PIPELINE ================= */
//       .addCase(fetchPipelineStats.fulfilled, (state, action) => {
//         state.pipelineStats = action.payload;
//       });
//   },
// });

// export const { clearDealError, clearCurrentDeal } = dealSlice.actions;
// export default dealSlice.reducer;

// src/features/deals/dealSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

/* ================= FETCH ALL ================= */
export const fetchDeals = createAsyncThunk(
  "deals/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/deals", { params });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch deals",
      );
    }
  },
);

/* ================= FETCH ONE ================= */
export const fetchDeal = createAsyncThunk(
  "deals/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await API.get(`/deals/${id}`);
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch deal",
      );
    }
  },
);

/* ================= PIPELINE ================= */
export const fetchPipelineStats = createAsyncThunk(
  "deals/pipeline",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/deals/pipeline/stats");
      return data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

/* ================= CREATE ================= */
export const createDeal = createAsyncThunk(
  "deals/create",
  async (dealData, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await API.post("/deals", dealData);

      // ✅ refresh stats AFTER success
      dispatch(fetchPipelineStats());

      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create deal",
      );
    }
  },
);

/* ================= UPDATE ================= */
export const updateDeal = createAsyncThunk(
  "deals/update",
  async ({ id, ...dealData }, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await API.put(`/deals/${id}`, dealData);

      dispatch(fetchPipelineStats());

      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update deal",
      );
    }
  },
);

/* ================= STAGE UPDATE ================= */
export const updateDealStage = createAsyncThunk(
  "deals/updateStage",
  async ({ id, stage }, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await API.put(`/deals/${id}`, { stage });

      dispatch(fetchPipelineStats());

      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update stage",
      );
    }
  },
);

/* ================= DELETE ================= */
export const deleteDeal = createAsyncThunk(
  "deals/delete",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await API.delete(`/deals/${id}`);

      dispatch(fetchPipelineStats());

      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete deal",
      );
    }
  },
);

/* ================= BULK DELETE ================= */
export const bulkDeleteDeals = createAsyncThunk(
  "deals/bulkDelete",
  async (ids, { rejectWithValue, dispatch }) => {
    try {
      await API.post("/deals/bulk-delete", { ids });

      dispatch(fetchPipelineStats());

      return ids;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete deals",
      );
    }
  },
);

/* ================= IMPORT ================= */
export const importDeals = createAsyncThunk(
  "deals/import",
  async (file, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await API.post("/deals/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(fetchDeals({ page: 1, limit: 10, search: "" }));
      dispatch(fetchPipelineStats()); // ✅ also refresh stats

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to import deals",
      );
    }
  },
);

/* ================= UPDATE NOTE ================= */
export const updateStageHistoryNote = createAsyncThunk(
  "deals/updateStageHistoryNote",
  async ({ id, description }, { rejectWithValue }) => {
    try {
      const { data } = await API.put(`/deals/stage-history/${id}`, {
        description,
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update note",
      );
    }
  },
);

/* ================= FETCH BY ACCOUNT ================= */
export const fetchDealsByAccount = createAsyncThunk(
  "deals/fetchByAccount",
  async (accountId, { rejectWithValue }) => {
    try {
      const { data } = await API.get("/deals", {
        params: { accountId },
      });

      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch deals by account",
      );
    }
  },
);

/* ======================================================= */

const dealSlice = createSlice({
  name: "deals",
  initialState: {
    deals: [],
    deal: null,
    pipelineStats: null,
    pagination: null,

    loading: false,
    detailLoading: false,
    actionLoading: false,

    error: null,
  },

  reducers: {
    clearDealError: (state) => {
      state.error = null;
    },
    clearCurrentDeal: (state) => {
      state.deal = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ================= FETCH LIST ================= */
      .addCase(fetchDeals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.deals = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= FETCH ONE ================= */
      .addCase(fetchDeal.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(fetchDeal.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.deal = action.payload;
      })
      .addCase(fetchDeal.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })

      /* ================= CREATE ================= */
      .addCase(createDeal.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(createDeal.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.deals.unshift(action.payload);
      })
      .addCase(createDeal.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      /* ================= UPDATE ================= */
      .addCase(updateDeal.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateDeal.fulfilled, (state, action) => {
        state.actionLoading = false;

        const idx = state.deals.findIndex((d) => d.id === action.payload.id);
        if (idx !== -1) state.deals[idx] = action.payload;

        if (state.deal?.id === action.payload.id) {
          state.deal = {
            ...action.payload,
            stageHistory:
              action.payload.stageHistory || state.deal.stageHistory,
          };
        }
      })
      .addCase(updateDeal.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      /* ================= STAGE UPDATE ================= */
      .addCase(updateDealStage.fulfilled, (state, action) => {
        state.deal = action.payload;
      })

      /* ================= NOTE UPDATE ================= */
      .addCase(updateStageHistoryNote.fulfilled, (state, action) => {
        const updated = action.payload;

        if (state.deal?.stageHistory) {
          const idx = state.deal.stageHistory.findIndex(
            (s) => s.id === updated.id,
          );
          if (idx !== -1) {
            state.deal.stageHistory[idx] = updated;
          }
        }
      })

      /* ================= FETCH BY ACCOUNT ================= */
      .addCase(fetchDealsByAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDealsByAccount.fulfilled, (state, action) => {
        state.loading = false;

        // 🔥 overwrite with filtered deals
        state.deals = action.payload.data;
      })
      .addCase(fetchDealsByAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= DELETE ================= */
      .addCase(deleteDeal.fulfilled, (state, action) => {
        state.deals = state.deals.filter((d) => d.id !== action.payload);
      })

      /* ================= BULK DELETE ================= */
      .addCase(bulkDeleteDeals.fulfilled, (state, action) => {
        state.deals = state.deals.filter((d) => !action.payload.includes(d.id));
      })

      /* ================= PIPELINE ================= */
      .addCase(fetchPipelineStats.fulfilled, (state, action) => {
        state.pipelineStats = action.payload;
      });
  },
});

export const { clearDealError, clearCurrentDeal } = dealSlice.actions;
export default dealSlice.reducer;

// CRM-Frontend/src/features/email/emailSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../api/axios";

/*
=====================================================
API BASE
=====================================================
*/
const EMAIL_API = "/email";

/*
=====================================================
FETCH EMAIL TEMPLATES
=====================================================
*/
export const fetchEmailTemplates = createAsyncThunk(
  "email/fetchTemplates",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get(`${EMAIL_API}/templates`);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch templates",
      );
    }
  },
);

/*
=====================================================
CREATE EMAIL TEMPLATE
=====================================================
*/
export const createEmailTemplate = createAsyncThunk(
  "email/createTemplate",
  async (templateData, { rejectWithValue }) => {
    try {
      const res = await API.post(`${EMAIL_API}/templates`, templateData);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create template",
      );
    }
  },
);

/*
=====================================================
GENERATE EMAIL TEMPLATE WITH AI
=====================================================
*/
export const generateEmailTemplateAI = createAsyncThunk(
  "email/generateTemplateAI",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await API.post(`${EMAIL_API}/templates/generate-ai`, payload);

      return res.data.data; // <-- IMPORTANT FIX
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "AI template generation failed",
      );
    }
  },
);
/*
=====================================================
SEND EMAIL
=====================================================
*/
export const sendEmail = createAsyncThunk(
  "email/sendEmail",
  async (emailData, { rejectWithValue }) => {
    try {
      // FIXED ENDPOINT
      const res = await API.post(`${EMAIL_API}/send`, emailData);

      console.log("EMAIL API RESPONSE:", res.data);

      if (!res.data.success) {
        throw new Error(res.data.message || "Email API failed");
      }

      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send email",
      );
    }
  },
);

/*
=====================================================
FETCH EMAIL LOGS
=====================================================
*/
export const fetchEmailLogs = createAsyncThunk(
  "email/fetchLogs",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await API.get(`${EMAIL_API}/logs?${params}`);

      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch email logs",
      );
    }
  },
);

export const deleteEmailTemplate = createAsyncThunk(
  "email/deleteTemplate",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`${EMAIL_API}/templates/${id}`);

      return { id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete template",
      );
    }
  },
);

export const updateEmailTemplate = createAsyncThunk(
  "email/updateTemplate",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/email/templates/${id}`, data);
      return res.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update template",
      );
    }
  },
);

/*
=====================================================
SEND BULK EMAIL CAMPAIGN
=====================================================
*/
export const sendEmailCampaign = createAsyncThunk(
  "email/sendCampaign",
  async (campaignData, { rejectWithValue }) => {
    try {
      const res = await API.post(`${EMAIL_API}/campaign/send`, campaignData);

      if (!res.data.success) {
        throw new Error(res.data.message || "Campaign failed");
      }

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send campaign",
      );
    }
  },
);

/*
=====================================================
FETCH CAMPAIGN STATUS (POLLING FOR PROGRESS BAR)
=====================================================
*/
export const fetchCampaignStatus = createAsyncThunk(
  "email/fetchCampaignStatus",
  async (campaignId, { rejectWithValue }) => {
    try {
      const res = await API.get(`${EMAIL_API}/campaign/${campaignId}/status`);

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch campaign status",
      );
    }
  },
);

/*
=====================================================
DELETE EMAIL LOG
=====================================================
*/
export const deleteEmailLog = createAsyncThunk(
  "email/deleteLog",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`${EMAIL_API}/logs/${id}`);

      return { id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete email log",
      );
    }
  },
);

/*
=====================================================
UPLOAD ATTACHMENTS
=====================================================
*/
export const uploadAttachments = createAsyncThunk(
  "email/uploadAttachments",
  async (files, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("files", file);
      });

      const res = await API.post(`${EMAIL_API}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Upload failed");
    }
  },
);

/*
=====================================================
INITIAL STATE
=====================================================
*/
const initialState = {
  templates: [],
  logs: [],
  attachments: [],

  loadingTemplates: false,
  loadingLogs: false,
  sendingEmail: false,
  sendingCampaign: false,

  generatingTemplate: false,
  uploadingAttachments: false,

  sendSuccess: false,
  campaignResult: null,

  campaignProgress: 0,
  campaignTotal: 0,
  campaignSent: 0,
  campaignFailed: 0,

  generatedTemplate: null,

  error: null,
};
/*
=====================================================
SLICE
=====================================================
*/
const emailSlice = createSlice({
  name: "email",
  initialState,

  // reducers: {
  //   clearEmailError: (state) => {
  //     state.error = null;
  //   },

  //   resetSendStatus: (state) => {
  //     state.sendSuccess = false;
  //   },
  // },

  reducers: {
    clearEmailError: (state) => {
      state.error = null;
    },

    resetSendStatus: (state) => {
      state.sendSuccess = false;
    },

    setAttachments: (state, action) => {
      state.attachments = action.payload;
    },

    removeAttachment: (state, action) => {
      state.attachments = state.attachments.filter(
        (file) => file.fileUrl !== action.payload,
      );
    },

    clearAttachments: (state) => {
      state.attachments = [];
    },

    /*
  =========================================
  CAMPAIGN PROGRESS UPDATE (POLLING)
  =========================================
  */
    updateCampaignProgress: (state, action) => {
      state.campaignProgress = action.payload.progress;
      state.campaignTotal = action.payload.total;
      state.campaignSent = action.payload.sent;
      state.campaignFailed = action.payload.failed;
    },

    resetCampaignProgress: (state) => {
      state.campaignProgress = 0;
      state.campaignTotal = 0;
      state.campaignSent = 0;
      state.campaignFailed = 0;
    },
  },

  extraReducers: (builder) => {
    /*
    =====================================================
    FETCH TEMPLATES
    =====================================================
    */
    builder
      .addCase(fetchEmailTemplates.pending, (state) => {
        state.loadingTemplates = true;
      })
      .addCase(fetchEmailTemplates.fulfilled, (state, action) => {
        state.loadingTemplates = false;
        state.templates = action.payload;
      })
      .addCase(fetchEmailTemplates.rejected, (state, action) => {
        state.loadingTemplates = false;
        state.error = action.payload;
      });

    /*
    =====================================================
    CREATE TEMPLATE
    =====================================================
    */
    builder
      .addCase(createEmailTemplate.fulfilled, (state, action) => {
        state.templates.unshift(action.payload);
      })
      .addCase(createEmailTemplate.rejected, (state, action) => {
        state.error = action.payload;
      });

    /*
    =====================================================
    SEND EMAIL
    =====================================================
    */
    builder
      .addCase(sendEmail.pending, (state) => {
        state.sendingEmail = true;
        state.sendSuccess = false;
      })
      .addCase(sendEmail.fulfilled, (state, action) => {
        state.sendingEmail = false;
        state.sendSuccess = true;
        state.logs.unshift(action.payload);
      })
      .addCase(sendEmail.rejected, (state, action) => {
        state.sendingEmail = false;
        state.error = action.payload;
      });

    /*
    =====================================================
    FETCH EMAIL LOGS
    =====================================================
    */
    builder
      .addCase(fetchEmailLogs.pending, (state) => {
        state.loadingLogs = true;
      })
      .addCase(fetchEmailLogs.fulfilled, (state, action) => {
        state.loadingLogs = false;
        state.logs = action.payload;
      })
      .addCase(fetchEmailLogs.rejected, (state, action) => {
        state.loadingLogs = false;
        state.error = action.payload;
      });

    /*
=====================================================
GENERATE TEMPLATE AI
=====================================================
*/
    // builder
    //   .addCase(generateEmailTemplateAI.pending, (state) => {
    //     state.generatingTemplate = true;
    //   })
    //   .addCase(generateEmailTemplateAI.fulfilled, (state, action) => {
    //     state.generatingTemplate = false;
    //     state.generatedTemplate = action.payload;
    //   })
    //   .addCase(generateEmailTemplateAI.rejected, (state, action) => {
    //     state.generatingTemplate = false;
    //     state.error = action.payload;
    //   });

    /*
=====================================================
GENERATE TEMPLATE AI
=====================================================
*/
    builder
      .addCase(generateEmailTemplateAI.pending, (state) => {
        state.generatingTemplate = true;
        state.generatedTemplate = null;
      })
      .addCase(generateEmailTemplateAI.fulfilled, (state, action) => {
        state.generatingTemplate = false;

        // Only store generated template for preview
        state.generatedTemplate = action.payload;

        // DO NOT add it to saved templates list
      })
      .addCase(generateEmailTemplateAI.rejected, (state, action) => {
        state.generatingTemplate = false;
        state.error = action.payload;
      })

      /*
=====================================================
DELETE TEMPLATE
=====================================================
*/
      .addCase(deleteEmailTemplate.fulfilled, (state, action) => {
        state.templates = state.templates.filter(
          (t) => t.id !== action.payload.id,
        );
      })

      .addCase(updateEmailTemplate.fulfilled, (state, action) => {
        state.templates = state.templates.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        );
      });

    /*
=====================================================
SEND EMAIL CAMPAIGN
=====================================================
*/
    builder
      .addCase(sendEmailCampaign.pending, (state) => {
        state.sendingCampaign = true;
        state.campaignResult = null;

        state.campaignProgress = 0;
        state.campaignSent = 0;
        state.campaignFailed = 0;
      })
      .addCase(sendEmailCampaign.fulfilled, (state, action) => {
        state.sendingCampaign = false;
        state.campaignResult = action.payload;

        // ✅ optional improvement
        state.campaignSent = action.payload.data?.sent || 0;
        state.campaignFailed = action.payload.data?.failed || 0;
      })
      .addCase(sendEmailCampaign.rejected, (state, action) => {
        state.sendingCampaign = false;
        state.error = action.payload;
      });
    /*
=====================================================
FETCH CAMPAIGN STATUS
=====================================================
*/
    builder.addCase(fetchCampaignStatus.fulfilled, (state, action) => {
      state.campaignProgress = action.payload.progress;
      state.campaignTotal = action.payload.total;
      state.campaignSent = action.payload.sent;
      state.campaignFailed = action.payload.failed;
    });

    /*
=====================================================
DELETE EMAIL LOG
=====================================================
*/
    builder.addCase(deleteEmailLog.fulfilled, (state, action) => {
      state.logs = state.logs.filter((log) => log.id !== action.payload.id);
    });

    /*
=====================================================
UPLOAD EMAIL FILES
=====================================================
*/

    builder
      .addCase(uploadAttachments.pending, (state) => {
        state.uploadingAttachments = true;
      })
      .addCase(uploadAttachments.fulfilled, (state, action) => {
        state.uploadingAttachments = false;

        // Append new files
        const newFiles = action.payload.filter(
          (newFile) =>
            !state.attachments.some(
              (existing) => existing.fileUrl === newFile.fileUrl,
            ),
        );

        state.attachments.push(...newFiles);
      })
      .addCase(uploadAttachments.rejected, (state, action) => {
        state.uploadingAttachments = false;
        state.error = action.payload;
      });
  },
});

// export const { clearEmailError, resetSendStatus } = emailSlice.actions;

export const {
  clearEmailError,
  resetSendStatus,
  updateCampaignProgress,
  resetCampaignProgress,
  setAttachments,
  removeAttachment,
  clearAttachments,
} = emailSlice.actions;

export default emailSlice.reducer;

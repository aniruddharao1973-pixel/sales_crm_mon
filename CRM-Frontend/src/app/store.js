// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "../features/auth/authSlice";
// import accountReducer from "../features/accounts/accountSlice";
// import contactReducer from "../features/contacts/contactSlice";
// import dealReducer from "../features/deals/dealSlice";

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     accounts: accountReducer,
//     contacts: contactReducer,
//     deals: dealReducer,
//   },
//   devTools: import.meta.env.DEV,
// });



// src/app/store.js

import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import accountReducer from "../features/accounts/accountSlice";
import contactReducer from "../features/contacts/contactSlice";
import dealReducer from "../features/deals/dealSlice";

import analyticsReducer from "../features/analytics/analyticsSlice";
import dealRiskReducer from "../features/analytics/dealRiskSlice";


import emailReducer from "../features/email/emailSlice";
import calendarReducer from "../features/calendar/calendarSlice";

import assignmentReducer from "../features/assign/assignmentSlice";

/* ✅ ADD THESE TWO */
import quotationReducer from "../features/quotations/quotationSlice";
import itemReducer from "../features/items/itemSlice";
import notificationReducer from "../features/notifications/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountReducer,
    contacts: contactReducer,
    deals: dealReducer,

    analytics: analyticsReducer,
    dealRisk: dealRiskReducer,



    email: emailReducer,
    calendar: calendarReducer,

    assignment: assignmentReducer,

    /* ✅ IMPORTANT */
    quotation: quotationReducer,
    items: itemReducer,
    notifications: notificationReducer,
  },

  devTools: import.meta.env.DEV,
});

import { Buffer } from "buffer";   // ✅ ADD THIS
window.Buffer = Buffer;            // ✅ ADD THIS

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { store } from "./app/store.js";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1f2937",
              color: "#f9fafb",
              borderRadius: "0.75rem",
              padding: "12px 16px",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#f9fafb" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#f9fafb" },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
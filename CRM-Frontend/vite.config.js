import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  define: {
    global: "window", // ✅ ADD THIS
  },

  server: {
    host: true, // allows LAN access (keep this)
    port: 5173,

    // ✅ ONLY for local dev convenience
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});

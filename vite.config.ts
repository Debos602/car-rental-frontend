import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), "");

  // Backend URL (VITE_BASE_URL থেকে নেয়া, fallback localhost)
  const backend = env.VITE_BASE_URL || "http://localhost:5000";

  return {
    plugins: [react()],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    server: {
      // Proxy settings for both API and Socket.IO
      proxy: {
        // API calls (যেমন /api/users)
        "/api": {
          target: backend,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, "/api"), // optional, যদি backend-এ /api না থাকে তাহলে রিমুভ করো
        },

        // Socket.IO proxy (খুব জরুরি websocket-এর জন্য)
        "/socket.io": {
          target: backend,
          ws: true,                    // WebSocket support চালু
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,     // path ঠিক রাখে
        },
      },
    },

    // Optional: build time-এ base URL set করতে চাইলে
    base: env.VITE_BASE || "/",
  };
});
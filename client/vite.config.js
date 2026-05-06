import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This tells Vite: "If a request starts with /api, send it to the Express server"
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        // This removes the '/api' prefix before sending it to your backend
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});

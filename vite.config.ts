import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
  server: {
    proxy: {
      "/api2": {
        target: "http://192.168.16.32:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api2/, ""),
      },
    },
  },
});

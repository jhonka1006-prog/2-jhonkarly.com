import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  base: "/",
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  /* Acepta fotos con extensión en MAYÚSCULAS (como las guarda el iPhone:
     IMG_1234.JPEG) para que basten pegarlas en las carpetas de imágenes. */
  assetsInclude: ["**/*.JPEG", "**/*.JPG", "**/*.PNG", "**/*.WEBP", "**/*.GIF", "**/*.AVIF"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          supabase: ["@supabase/supabase-js"],
          charts: ["recharts"],
        },
      },
    },
  },
}));

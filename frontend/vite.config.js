import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
    server: {
    proxy: {
      "/passport": {
        target: "https://passport-v2.k8.isw.la",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/passport/, "/passport"),
      },
      "/api": {
        target: "https://api-marketplace-routing.k8.isw.la",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/marketplace-routing/api"),
      },
    },
  },
})

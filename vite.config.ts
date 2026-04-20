import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: "/ignitia-live-website/",  // ✅ IMPORTANT for dev
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },
})
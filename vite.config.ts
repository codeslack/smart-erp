// filename: vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    flowbiteReact()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    hmr: {
      protocol: "wss",
      clientPort: 443,
      host: "smart-erp.test",
      path: '/@vite/ws',
    },
    // Add your new domain here
    allowedHosts: ["smart-erp.test"],
  },
});
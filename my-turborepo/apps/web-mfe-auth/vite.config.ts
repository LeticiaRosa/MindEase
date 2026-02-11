import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import { resolve } from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "auth",
      filename: "remoteEntry.js",
      manifest: true,
      dts: false,
      exposes: {
        "./auth": "./src/App.tsx",
      },
      shared: {
        react: {
          requiredVersion: "^18.3.1",
          singleton: true,
        },
        "react-dom": {
          requiredVersion: "^18.3.1",
          singleton: true,
        },
      },
    }),
  ],
  server: {
    port: 3001,
    origin: "http://localhost:3001",
    cors: true,
    strictPort: true,
  },
  preview: {
    port: 3001,
    strictPort: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  build: {
    target: "esnext",
    minify: true,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});

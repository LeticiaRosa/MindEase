import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import { resolve } from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    viteReact(),
    federation({
      name: "host",
      filename: "remoteEntry.js",
      manifest: true,
      dts: false,
      exposes: {
        "./host": "./src/App.tsx",
      },
      remotes: {
        auth: {
          type: "module",
          name: "auth",
          entry: `http://localhost:3001/remoteEntry.js`,
        },
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
    port: 3000,
    strictPort: true,
  },
  preview: {
    port: 3000,
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

import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  // This repository is deployed at /naruto-online-mobile/ on GitHub Pages.
  // Set VITE_BASE_PATH=/ for a custom domain or an account-level Pages site.
  base: process.env.VITE_BASE_PATH ?? (mode === "production" ? "/naruto-online-mobile/" : "/"),
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
}));

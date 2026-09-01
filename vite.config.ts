import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Vercel serves the app from the domain root, so '/' is correct there (and
  // is what vercel.json's SPA rewrite assumes). GitHub Pages instead serves
  // this repo from https://<user>.github.io/priya-portfolio/, so the GH
  // Pages workflow (.github/workflows/deploy.yml) sets GITHUB_PAGES=true to
  // switch the base — main.tsx reads the same value back via
  // import.meta.env.BASE_URL for the router's basename, so both deploy
  // targets resolve routes and asset paths correctly without further changes.
  base: process.env.GITHUB_PAGES === "true" ? "/priya-portfolio/" : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Lets components copied from motion-primitives.com resolve `@/lib/utils`
      // and `@/components/...` without editing their imports.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});

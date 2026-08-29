import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // Lets components copied from motion-primitives.com resolve `@/lib/utils`
      // and `@/components/...` without editing their imports.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});

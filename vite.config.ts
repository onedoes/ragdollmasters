//

import React from "@vitejs/plugin-react";
import { resolve } from "node:path";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";

//

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  plugins: [React(), UnoCSS()],
});

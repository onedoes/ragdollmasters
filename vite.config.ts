//

import React from "@vitejs/plugin-react";
import { resolve } from "node:path";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";

//

export default defineConfig({
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "./src"),
      },
      {
        find: /^@1\.(.*)/,
        replacement: resolve(__dirname, "./@1/$1"),
      },
    ],
  },
  plugins: [React(), UnoCSS()],
});

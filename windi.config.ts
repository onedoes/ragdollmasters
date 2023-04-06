//

import defaultTheme from "windicss/defaultTheme";
import { defineConfig } from "windicss/helpers";

//

export default defineConfig({
  alias: {
    hstack: "flex items-center",
    vstack: "flex flex-col",
  },
  theme: {
    extend: {
      animation: {
        "text-color-rainbow": "textColorRainbow 6.66s infinite ease-in-out",
      },
      keyframes: {
        textColorRainbow: {
          "0%": {
            color: "hsl(0, 0%, 100%)",
          },
          "12.5%": {
            color: "hsl(45, 100%, 50%)",
          },
          "25%": {
            color: "hsl(90, 100%, 50%)",
          },
          "37.5%": {
            color: "hsl(135, 100%, 50%)",
          },
          "50%": {
            color: "hsl(180, 100%, 100%)",
          },
          "62.5%": {
            color: "hsl(225, 100%, 50%)",
          },
          "75%": {
            color: "hsl(270, 100%, 50%)",
          },
          "87.5%": {
            color: "hsl(315, 100%, 50%)",
          },
          "100%": {
            color: "hsl(360, 0%, 100%)",
          },
        },
      },
      fontFamily: {
        ...defaultTheme.fontFamily,
        sans: ["Anton", ...defaultTheme.fontFamily["sans"]!],
      },
    },
  },
});

//

import { defineConfig, presetUno, presetWebFonts } from "unocss";

//
export default defineConfig({
  shortcuts: {
    hstack: "flex items-center",
    vstack: "flex flex-col",
  },
  presets: [
    presetUno(),
    // presetAttributify({ prefixedOnly: true }), // To slow on my vscode...
    presetWebFonts({
      fonts: {
        sans: "Anton",
      },
    }),
  ],
  theme: {
    animation: {
      keyframes: {
        "text-color-rainbow": text_color_rainbow_keyframes(),
      },
      timingFns: {
        "text-color-rainbow": "ease-in-out",
      },
      durations: {
        "text-color-rainbow": "10s",
      },
      counts: {
        "text-color-rainbow": "infinite",
      },
    },
  },
});

function text_color_rainbow_keyframes() {
  return `
  {
    0%    {color: hsl(0,   0%,   100%);}
    12.5% {color: hsl(45,  100%, 33%);}
    25%   {color: hsl(90,  100%, 50%);}
    37.5% {color: hsl(135, 100%, 33%);}
    50%   {color: hsl(180, 100%, 100%);}
    62.5% {color: hsl(225, 100%, 33%);}
    75%   {color: hsl(270, 100%, 50%);}
    87.5% {color: hsl(315, 100%, 33%);}
    100%  {color: hsl(360, 0%,   100%);}
  }
  `;
}

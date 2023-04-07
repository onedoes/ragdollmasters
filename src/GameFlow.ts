//

import { createMachine } from "xstate";

//

export const GameFlow = createMachine({
  id: "GameFlow",
  initial: "idle",
  schema: {
    events: {} as
      | { type: "ABOUT" }
      | { type: "BACK" }
      | { type: "CONTROLS" }
      | { type: "OPTIONS" }
      | { type: "PLAY_1" }
      | { type: "PLAY_2CO-OP" }
      | { type: "PLAY_2VS" }
      | { type: "PLAY" }
      | { type: "SCORES" },
  },
  tsTypes: {} as import("./GameFlow.typegen").Typegen0,
  states: {
    idle: {
      on: {
        PLAY: "play_mode",
        ABOUT: "about",
        OPTIONS: "options",
        SCORES: "score",
      },
    },
    play_mode: {
      initial: "idle",

      states: {
        idle: {
          on: {
            BACK: "#GameFlow.idle",
            PLAY_1: "1 Player",
            PLAY_2VS: "2 Players VS",
            "PLAY_2CO-OP": "2 Players CO-OP",
          },
        },
        "1 Player": {},
        "2 Players VS": {},
        "2 Players CO-OP": {},
      },
    },
    about: {},
    options: {},
    score: {},
  },
});

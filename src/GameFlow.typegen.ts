// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {};
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {};
  matchesStates:
    | "about"
    | "idle"
    | "options"
    | "play_mode"
    | "play_mode.1 Player"
    | "play_mode.2 Players CO-OP"
    | "play_mode.2 Players VS"
    | "play_mode.idle"
    | "score"
    | { play_mode?: "1 Player" | "2 Players CO-OP" | "2 Players VS" | "idle" };
  tags: never;
}

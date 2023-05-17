//

import type { States } from "@/GameContext";
import { lazy } from "react";

export const routes = new Map<States, ReturnType<typeof lazy>>([
  ["idle", lazy(() => import("./Menu"))],
  ["play_mode.1 Player", lazy(() => import("./Battle1Player"))],
  ["play_mode", lazy(() => import("./GameMode"))],
]);

//

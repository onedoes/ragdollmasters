//

import { Engine, type IEventTimestamped } from "matter-js";
import { type DependencyList } from "react";
import { useEngineEvent } from "./useEvent";

//

export function useEventAfterUpdate(
  callback: (e: IEventTimestamped<Engine>) => void,
  deps?: DependencyList
) {
  useEngineEvent("afterUpdate", callback, deps);
}

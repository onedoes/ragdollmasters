//

import { Engine, type IEventTimestamped } from "matter-js";
import { type DependencyList } from "react";
import { useEngineEvent } from "./useEvent";

//

export function useEventBeforeUpdate(
  callback: (e: IEventTimestamped<Engine>) => void,
  deps?: DependencyList
) {
  useEngineEvent("beforeUpdate", callback, deps);
}

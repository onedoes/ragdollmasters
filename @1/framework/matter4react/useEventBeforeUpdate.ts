//

import { Events } from "matter-js";
import { type DependencyList } from "react";
import { useEvent } from "./useEvent";

//

type Params = Parameters<typeof Events.on>;
export function useEventBeforeUpdate(
  callback: Params[2],
  deps?: DependencyList
) {
  useEvent("beforeUpdate", callback, deps);
}

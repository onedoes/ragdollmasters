//

import { Events } from "matter-js";
import { useEffect, type DependencyList } from "react";
import { useEngine } from "./EngineContext";

//

type Params = Parameters<typeof Events.on>;
export function useEvent(
  name: Params[1],
  callback: Params[2],
  deps?: DependencyList
) {
  const engine = useEngine();
  useEffect(() => {
    Events.on(engine, name, callback);
    return () => Events.off(engine, name, callback);
  }, [engine.world.id, ...(deps ?? [])]);
}

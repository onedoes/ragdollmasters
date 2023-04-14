//

import debug from "debug";
import { Events } from "matter-js";
import { useEffect, type DependencyList } from "react";
import { useEngine } from "./EngineContext";
import { useRender } from "./RenderContext";

//

const log = debug("@1.framework:matter4react:useEvent");

//

type Params = Parameters<typeof Events.on>;
export function useEvent(
  obj: Params[0] | null,
  name: Params[1],
  callback: Params[2],
  deps?: DependencyList
) {
  useEffect(() => {
    log("+ useEffect", { obj, name, deps });
    if (!obj) return;
    log("+ useEffect", { obj, name });
    Events.on(obj, name, callback);
    return () => Events.off(obj, name, callback);
  }, deps);
}

export function useEngineEvent(
  name: Params[1],
  callback: Params[2],
  deps?: DependencyList
) {
  const engine = useEngine();
  useEvent(engine, name, callback, [engine.world.id, ...(deps ?? [])]);
}

export function useRenderEvent(
  name: Params[1],
  callback: Params[2],
  deps?: DependencyList
) {
  const render = useRender();
  useEvent(render, name, callback, [render, ...(deps ?? [])]);
}

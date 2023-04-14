//

import { Engine, type IEventCollision } from "matter-js";
import { type DependencyList } from "react";
import { useEngineEvent } from "./useEvent";

//
// type Params = Parameters<typeof Events.on> extends [infer _ObjType, 'beforeAdd', infer CallbackType] ? CallbackType : never;

export function useEventCollisionStart(
  callback: (e: IEventCollision<Engine>) => void,
  deps?: DependencyList
) {
  useEngineEvent("collisionStart", callback, deps);
}

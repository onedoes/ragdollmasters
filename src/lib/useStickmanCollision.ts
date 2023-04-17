//

import { useEventCollisionStart } from "@1.framework/matter4react";
import debug from "debug";
import type { Body, Composite, Engine, IEventCollision, Pair } from "matter-js";
import { useRef, type DependencyList } from "react";

//

export const log = debug("@:lib:useStickmanCollision");

//

type ImpactStrengthPair = [Body, number];
export function useStickmanCollision(
  composites: Composite[],
  callbacks: {
    onCollisionStart: (
      event: IEventCollision<Engine>,
      data: { pair: Pair; compositeA: number; compositeB: number }
    ) => void;
  },
  deps: DependencyList
) {
  log("!");
  const body_group_ref = useRef(new Map<number, number>());
  const body_colors_ref = useRef(new Map<number, string>());

  useEventCollisionStart((event) => {
    // log("useEventCollisionStart", event);
    const bodyId_to_color = body_colors_ref.current;
    const body_group = body_group_ref.current;

    for (const pair of event.pairs) {
      const { bodyA, bodyB } = pair;

      if (bodyA.isStatic || bodyB.isStatic) {
        continue; // ignore collisions with static bodies
      }

      if (bodyA.collisionFilter.group === bodyB.collisionFilter.group) {
        continue; // ignore collisions with self
      }

      [bodyA, bodyB]
        .filter((body) => !body_group.has(body.id))
        .forEach((body) => {
          const composite = composites.find((c) => c.bodies.includes(body));
          if (!composite) {
            return;
          }
          body_group.set(body.id, composite.id);
        });

      const compositeA = body_group.get(bodyA.id);
      const compositeB = body_group.get(bodyB.id);
      if (compositeA === compositeB) {
        continue; // ignore collisions with same group
      }
      if (!(compositeA && compositeB)) {
        continue; // ensure they are both composites
      }
      callbacks.onCollisionStart(event, {
        pair,
        compositeA,
        compositeB,
      });
    }
  }, deps);
}

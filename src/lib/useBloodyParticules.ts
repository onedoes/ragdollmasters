//

import { Particle } from "@/old/Particle";
import {
  useEngineEvent,
  useEventBeforeUpdate,
} from "@1.framework/matter4react";
import debug from "debug";
import { Body, Common, Composite, Vector } from "matter-js";
import { useRef, type DependencyList } from "react";
import { isSaveBody } from "./isSaveBody";
import { useStickmanCollision } from "./useStickmanCollision";

//

export const log = debug("@:lib:useBloodyParticules");

//

export function useBloodyParticules(
  composites: Composite[],
  deps: DependencyList
) {
  log("!");
  const particules = useRef<Particle[]>([]);
  const dead_particules = useRef<Particle[]>([]);

  useStickmanCollision(
    composites,
    {
      onCollisionStart: (event, { pair }) => {
        const contact = pair.collision.supports.at(0);
        if (!contact) return;

        // No bleeding from stickman safe bodies labels
        if ([pair.bodyA, pair.bodyB].every(isSaveBody)) {
          return;
        }

        const imp = 1 / 10000;
        const impactVelocity = Vector.magnitude(pair.collision.penetration) * 2;
        const particleCount = Math.max(50, Math.floor(impactVelocity));
        particules.current = Array.from({ length: particleCount })
          .map(() => new Particle(contact.x, contact.y, 2))
          .map((p) => {
            Composite.add(event.source.world, p.body);
            Body.applyForce(p.body, p.body.position, {
              x: Common.random(-imp, imp),
              y: Common.random(-imp, imp),
            });
            return p;
          })
          .concat(particules.current);
      },
    },
    deps
  );

  useEventBeforeUpdate((event) => {
    dead_particules.current = [];

    const active_particules = particules.current;
    particules.current = [];
    for (const p of active_particules) {
      p.update(event);
      if (p.life <= 0) {
        dead_particules.current.push(p);
        continue;
      }
      particules.current.push(p);
    }

    //
  }, deps);

  useEngineEvent(
    "afterUpdate",
    (event) => {
      for (const p of dead_particules.current) {
        Composite.remove(event.source.world, p.body);
      }
    },
    deps
  );
}

//

import { useEventBeforeUpdate } from "@1.framework/matter4react";
import * as colorString from "color-string";
import debug from "debug";
import { cubicIn } from "eases";
import { Body, Composite, Vector } from "matter-js";
import { useRef, type DependencyList } from "react";
import { isSaveBody } from "./isSaveBody";
import { moveBody } from "./moveBody";
import { useStickmanCollision } from "./useStickmanCollision";

//

export const log = debug("@:lib:useImpactHandler");

//

type ImpactStrengthPair = [Body, number, Vector];
const SPEED = -30; // 1 / 5_000; //6666;
const TIMESCALE_LIMIT = 0.22;

export function useImpactHandler(
  composites: Composite[],
  deps: DependencyList
) {
  log("!");
  const body_colors_ref = useRef(new Map<number, string>());
  const impactedBody = useRef<ImpactStrengthPair[]>([]);

  useStickmanCollision(
    composites,
    {
      onCollisionStart: (event, { pair: { bodyA, bodyB, collision } }) => {
        const bodyId_to_color = body_colors_ref.current;

        const contact = collision.supports.at(0);
        if (!contact) return;

        const impulse = Vector.normalise(
          Vector.sub(bodyA.position, bodyB.position)
        );

        // save the original color of the two bodies in a map if we don't know it yet
        bodyId_to_color.has(bodyA.id) ||
          bodyId_to_color.set(bodyA.id, bodyA.render.fillStyle!);
        bodyId_to_color.has(bodyB.id) ||
          bodyId_to_color.set(bodyB.id, bodyB.render.fillStyle!);

        // No bleeding from stickman safe bodies labels
        if ([bodyA, bodyB].every(isSaveBody)) {
          return;
        }

        impactedBody.current.push([
          bodyA,
          1,
          Vector.mult(impulse, 10 * bodyB.mass),
        ]);
        impactedBody.current.push([
          bodyB,
          1,
          Vector.mult(Vector.neg(impulse), 10 * bodyA.mass),
        ]);
      },
    },
    deps
  );

  useEventBeforeUpdate((event) => {
    const timeScale = (event as any).delta / 1_000;
    const bodyId_to_color = body_colors_ref.current;

    const { current: impacts } = impactedBody;
    const nextImpactedBody: ImpactStrengthPair[] = [];

    while (impacts.length > 0) {
      const impact = impacts.pop();
      if (!impact) {
        break;
      }
      const [body, strength, vec] = impact;

      //

      const color = bodyId_to_color.get(body.id);
      if (!color) {
        continue;
      }
      if (!isSaveBody(body)) {
        let [r, g, b] = colorString.get.rgb(color);
        r += strength * 255;
        g -= strength * g;
        b -= strength * b;
        body.render.fillStyle = colorString.to.hex([Math.min(r, 255), g, b]);
      }

      //

      moveBody(body)(event, vec, SPEED);

      //

      if (strength > 0) {
        nextImpactedBody.push([
          body,
          strength - timeScale,
          Vector.mult(vec, strength),
        ]);
      }
    }

    //

    if (!nextImpactedBody.length && event.source.timing.timeScale < 0.66) {
      event.source.timing.timeScale = 1;
    } else if (nextImpactedBody.length) {
      const lastImpact = nextImpactedBody.at(-1);
      const [, ratio] = lastImpact || [null, 0];
      // log(easingFactor);
      // log("Math.exp(1 - ratio)", ratio, Math.exp(1 - ratio), Math.exp(ratio));

      // slow motion effect

      event.source.timing.timeScale = Math.min(
        1,
        Math.max(TIMESCALE_LIMIT, cubicIn(1 - ratio * ratio))
      );
      // log(ratio, event.source.timing.timeScale);
    }
    //

    impactedBody.current = nextImpactedBody;

    //
  }, deps);
}

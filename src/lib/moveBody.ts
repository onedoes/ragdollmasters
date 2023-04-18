//

import { Body, Engine, Vector, type IEventTimestamped } from "matter-js";

//

const SPEED = 20;

//

export function moveBody(body: Body) {
  return (
    event: IEventTimestamped<Engine>,
    direction: Vector,
    speed = SPEED
  ) => {
    const dt = (event as any).delta * 1_000;
    Body.applyForce(
      body,
      body.position,
      Vector.mult(direction, (-1 * speed * body.mass) / dt)
    );
  };
}

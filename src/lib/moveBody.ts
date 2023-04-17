import { Body, Engine, Vector, type IEventTimestamped } from "matter-js";

const SPEED = 20;
const MAX = 1 / 1_000;
export function moveBody(body: Body) {
  return (
    event: IEventTimestamped<Engine>,
    direction: Vector,
    speed = SPEED
  ) => {
    const dt = (event as any).delta * 1_000;
    // console.log(vector);
    Body.applyForce(
      body,
      body.position,
      Vector.mult(direction, (-1 * speed * body.inverseMass) / dt)
    );
    const force = Math.min(
      Math.max(Vector.magnitudeSquared(body.force), body.mass * MAX)
    );
    const normal = Vector.normalise(body.force);
    // console.log(force, normal, body.force);

    // cap the force vector
    body.force = Vector.mult(normal, force);
  };
}

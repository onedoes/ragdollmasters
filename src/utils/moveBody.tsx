import { Body, Engine, Vector, type IEventTimestamped } from "matter-js";

const SPEED = 0.5;
export function moveBody(body: Body) {
  return (event: IEventTimestamped<Engine>, vector: Vector) => {
    const dt = (event as any).delta * 1_000;
    const force = Vector.sub(
      body.velocity,
      Vector.mult(vector, body.mass * SPEED)
    );

    Body.applyForce(body, body.position, Vector.mult(vector, -20 / dt));
  };
}

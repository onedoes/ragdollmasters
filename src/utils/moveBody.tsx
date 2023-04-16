import { Body, Vector } from "matter-js";

const SPEED = 0.5;
export function moveBody(body: Body) {
  return (vector: Vector) => {
    const force = Vector.sub(
      body.velocity,
      Vector.mult(vector, body.mass * SPEED)
    );

    Body.applyForce(body, body.position, Vector.mult(vector, -15 / 10_500));
  };
}

import { type IEventCollision } from "matter-js";

export function defaultCollisionBehavior(
  event: IEventCollision<Matter.Engine>
) {
  for (const pair of event.pairs) {
    if (pair.bodyA.isStatic || pair.bodyB.isStatic) return;
    const ratio = -0.05;
    // const normal = Matter.Vector.normalise(pair.collision.normal);
    const impulse = {
      x: (pair.bodyB.position.x - pair.bodyA.position.x) * ratio,
      y: (pair.bodyB.position.y - pair.bodyA.position.y) * ratio,
    };
    // Body.setVelocity(pair.bodyA, Vector.mult(impulse, pair.bodyB.mass));
    // Body.setVelocity(
    //   pair.bodyB,
    //   Vector.mult(Vector.neg(impulse), pair.bodyA.mass * -2)
    // );
  }
}

import { Body, Engine, Vector, type IEventTimestamped } from "matter-js";

const SPEED = 20;
const MIN_FACTOR = 5 / 1_000;
const MIN = 5 / 1_000;
const MAX = 5 / 1_000; /// 1_000;
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
      Vector.mult(direction, (-1 * speed * body.mass) / dt)
    );
    // const force = Math.min(
    //   body.mass * MIN,
    //   Math.max(Vector.magnitudeSquared(body.force), body.mass * MAX)
    // );
    // const force =
    // const normal = Vector.normalise(body.force);
    // const reinforce = Vector.mult(normal, body.mass * MIN_FACTOR);
    // // console.log(force, normal, body.force);

    // // cap the force vector
    // body.force = Vector.add(reinforce, Vector.mult(normal, 0));
  };
}

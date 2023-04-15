import {
  Composite,
  useEventAfterUpdate,
  useEventBeforeUpdate,
  useEventCollisionStart,
} from "@1.framework/matter4react";
import { to } from "color-string";
import Matter, { Body } from "matter-js";
import { forwardRef, useMemo, useRef } from "react";
import { Particle } from "./Particle";
import { RRRR } from "./RRRR";

const dead = Matter.Body.nextCategory();

const P1 = forwardRef<Body, { x: number; y: number }>(function P1(
  { x, y }: any,
  ref
) {
  const rgb = useRef({ r: 255, g: 255, b: 255 });
  const impact = useRef(0);
  const impactedBody = useRef<[Body, number][]>([]);
  const particules = useRef<Particle[]>([]);
  const object = useMemo(() => {
    let { r, g, b } = rgb.current;
    const radius = 10;

    const fillStyle = to.hex([r, g, b]);

    const head = Matter.Bodies.circle(x, y, radius * 2, {
      label: "head",
      // density: 0.04,
      // restitution: 0.5,
      // friction: 0.5,
      density: 0.001,
      restitution: 0.99,
      render: { fillStyle },
    });
    //
    // NOT
    //
    // const torso = Matter.Composites.stack(
    //   x,
    //   y,
    //   1,
    //   4,
    //   0,
    //   0,
    //   (x: number, y: number) => {
    //     return Matter.Bodies.circle(x - radius, y, radius, {
    //       label: "torso" + y,
    //       density: 0.001,
    //       restitution: 0.99,
    //       // density: 0.001,
    //       // restitution: 0.5,
    //       // friction: 0.5,
    //     });
    //   }
    // );
    return Matter.Body.create({
      parts: [head],
      label: "test",
    });
  }, [x, y]);
  const { head, constraints, bodies } = useMemo(
    () => RRRR({ x, y, radius: 10 }),
    [x, y]
  );
  const parts = bodies;
  useEventAfterUpdate(
    (event) => {
      // if (impactedBody.current.length) {
      //   event.source.timing.timeScale = 0.5;
      // } else {
      //   event.source.timing.timeScale = 1;
      // }
    },
    [object.id]
  );
  useEventBeforeUpdate(
    (event) => {
      const timeScale = ((event as any).delta || 1000 / 60) / 1000;

      const { current: impacts } = impactedBody;
      impactedBody.current = [];
      // console.log({timeScale});
      for (const [body, impact] of impacts) {
        let { r, g, b } = rgb.current;
        r += impact * 255;
        g -= impact * 255;
        b -= impact * 255;
        body.render.fillStyle = to.hex([Math.min(r, 255), g, b]);
        if (impact > 0) {
          impactedBody.current.push([body, impact - timeScale]);
        }
      }

      if (!impactedBody.current.length && event.source.timing.timeScale < 1) {
        event.source.timing.timeScale = 1;
      } else {
        const lastImpact = impactedBody.current.at(-1);
        const [, ratio] = lastImpact || [null, 0];

        event.source.timing.timeScale = Math.max(
          0.33,
          event.source.timing.timeScale -
            (ratio / timeScale) * impactedBody.current.length
        );
      }

      const dead_particules = [] as Particle[];
      const active_particules = particules.current;
      particules.current = [];
      for (const p of active_particules) {
        p.update(event);
        if (p.life <= 0) {
          dead_particules.push(p);
          continue;
        }
        particules.current.push(p);
      }
      for (const p of dead_particules) {
        Matter.Composite.remove(event.source.world, p.body);
      }
    },
    [object.id]
  );
  const onCollide = (body: Body, other: Body, pair: Matter.Pair) => {
    if (other.isStatic) return;
    // log(
    //   `Ì, ${object.label} (${object.id}), collided with ${other.label} (${other.id})`
    // );
    impactedBody.current.push([body, 1]);

    // const repulsion = Vector.mult(pair.collision.tangent, -5);
    // Body.setVelocity(
    //   body,
    //   Vector.add(body.velocity, repulsion)
    // );
    // Body.setVelocity(
    //   other,
    //   Vector.add(other.velocity, Vector.neg(repulsion))
    // );
  };
  useEventCollisionStart(
    (event) => {
      var pairs = event.pairs;

      for (const pair of pairs) {
        const { bodyA, bodyB } = pair;
        if (bodyA.isStatic || bodyB.isStatic) {
          continue; // ignore collisions with static bodies
        }
        if (bodyA.collisionFilter.group === bodyB.collisionFilter.group) {
          continue; // ignore collisions with self
        }
        if (
          bodyA.collisionFilter.category === dead ||
          bodyB.collisionFilter.category === dead
        ) {
          continue; // ignore collisions with dead bodies
        }
        const isBodyA = parts.includes(bodyA);
        const isBodyB = parts.includes(bodyB);
        if (isBodyB) onCollide(bodyB, bodyA, pair);
        if (isBodyA) onCollide(bodyA, bodyB, pair);
        //
        let ppair: [Body, Body] | undefined;
        if (isBodyB) ppair = [bodyB, bodyA];
        if (isBodyA) ppair = [bodyA, bodyB];
        if (!ppair) continue;
        //
        const [body, otherbody] = ppair;
        const contact = pair.collision.supports.at(0);
        if (!contact) continue;

        const imp = 1 / 10000;
        const impactVelocity =
          Matter.Vector.magnitude(pair.collision.penetration) * 2;
        const particleCount = Math.max(50, Math.floor(impactVelocity));
        particules.current = Array.from({ length: particleCount })
          .map(() => new Particle(contact.x, contact.y, 2))
          .map((p) => {
            Matter.Composite.add(event.source.world, p.body);
            Matter.Body.applyForce(p.body, p.body.position, {
              x: Matter.Common.random(-imp, imp),
              y: Matter.Common.random(-imp, imp),
            });
            return p;
          })
          .concat(particules.current);
        // const blood = new Particle(contact.x, contact.y, 2);
        // particules.current.push(blood);
        // }
      }
      // log(pairs);
    },
    [object.id]
  );
  return (
    <>
      <Composite.add object={head} ref={ref} />
      {bodies
        .filter((body) => body !== head)
        .map((body, index) => (
          <Composite.add key={index} object={body} />
        ))}
      {constraints.map((constraint, index) => (
        <Composite.add key={index} object={constraint} />
      ))}
    </>
  );
});

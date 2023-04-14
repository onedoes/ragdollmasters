//

import { GameContext } from "@/GameContext";
import { Renderer } from "@/components/Renderer";
import { Viewport } from "@/components/Viewport";
import {
  Circle,
  Composite,
  PlayerInput,
  SurroundingWalls,
  useEventAfterUpdate,
  useEventBeforeUpdate,
  useEventCollisionStart,
} from "@1.framework/matter4react";
import { to } from "color-string";
import debug from "debug";
import Matter, { Body, Vector } from "matter-js";
import {
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import { useKeyPressEvent } from "react-use";

//

const log = debug("src:routes:LeveL1");

//

const SPEED = 1 / 5;
const dead = Matter.Body.nextCategory();
const players = Matter.Body.nextCategory();
// const parti = Matter.Body.nextCategory()
class Particle {
  body: Body;
  life = 1;
  constructor(x: number, y: number, r: number) {
    this.body = Matter.Bodies.circle(x, y, r, {
      friction: 0,
      restitution: 0.5,
      frictionAir: 0.001,
      density: 0.001,
      render: { fillStyle: "#f00", opacity: 1 },
      collisionFilter: { category: 0 },
    });
    // Matter.World.add(world, this.body);
  }
  update(event: Matter.IEventTimestamped<Matter.Engine>) {
    const timeScale = ((event as any).delta || 1000 / 60) / 10_000;
    this.life -= timeScale;
    this.body.render.opacity = this.life;
  }
}

// const handleWindowResize = (render: Render) => {
//   log("handleWindowResize", render);
// };
// window.addEventListener("resize", (event) => {})
const RRRChain = ({
  x,
  y,
  radius,
  group,
  xLength = 1,
  yLength = 2,
}: {
  x: number;
  y: number;
  radius: number;
  group: number;
  xLength?: number;
  yLength?: number;
}) => {
  const { bodies } = Matter.Composites.stack(
    x,
    y,
    xLength,
    yLength,
    0,
    0,
    (x: number, y: number) => {
      return Matter.Bodies.circle(x, y, radius, {
        collisionFilter: { group },
      });
    }
  );
  const constraints = [
    // Matter.Constraint.create({
    //   bodyA: bodies.at(0),
    //   // pointA: { x: 0, y: radius * 2 },
    //   bodyB: bodies.at(-1), // the top circle of the torso stack
    //   // pointB: { x: 0, y: -radius },
    //   stiffness: 1,
    //   // length: radius * 2,
    // }),
  ] as Matter.Constraint[];
  for (const [bodyId, bodyB] of bodies.entries()) {
    if (bodyId === 0) continue;
    const bodyA = bodies[bodyId - 1]!;
    const common = {
      bodyA,
      bodyB,
      // damping: 0.5,
      stiffness: 1,
      // length: radius * 2,
    } as Matter.IConstraintDefinition;
    constraints.push(
      Matter.Constraint.create({
        ...common,
        // stiffness: 0.01,
        length: radius * 2,
      })
    );
    constraints.push(
      Matter.Constraint.create({
        ...common,
        pointA: { x: 0, y: radius },
        pointB: { x: 0, y: -radius },
        // stiffness: 0.01,
      })
    );
    // constraints.push(
    //   Matter.Constraint.create({
    //     ...common,
    //     pointA: { x: radius, y: 0 },
    //     pointB: { x: radius, y: 0 },
    //   })
    // );
    // constraints.push(
    //   Matter.Constraint.create({
    //     ...common,
    //     pointA: { x: -radius, y: 0 },
    //     pointB: { x: -radius, y: 0 },
    //   })
    // );
  }

  return { bodies, constraints };
};
const RRRR = ({ x, y, radius }: { x: number; y: number; radius: number }) => {
  const group = Matter.Body.nextGroup(true);
  const head = Matter.Bodies.circle(x, y, radius * 2, {
    collisionFilter: { group },
  });

  //
  const torsoLength = 5;
  const torso = RRRChain({
    x: x - radius,
    y: y + radius * 2,
    radius,
    group,
    yLength: torsoLength,
  });

  //

  const upperRightArm = RRRChain({
    x: x - radius,
    y: y + radius * 4,
    radius,
    group,
  });
  const lowerRightArm = RRRChain({
    x: upperRightArm.bodies.at(0)!.position.x,
    y: upperRightArm.bodies.at(0)!.position.y + radius * 2,
    radius,
    group,
  });

  //

  const upperLeftArm = RRRChain({
    x: x - radius,
    y: y + radius * 4,
    radius,
    group,
  });
  const lowerLeftArm = RRRChain({
    x: upperLeftArm.bodies.at(0)!.position.x - radius,
    y: upperLeftArm.bodies.at(0)!.position.y + radius * 3,
    radius,
    group,
  });

  //

  const constraints = [
    Matter.Constraint.create({
      bodyA: head,
      pointA: { x: -radius * 2, y: 0 },
      bodyB: torso.bodies.at(0),
      pointB: { x: 0, y: 0 },
      stiffness: 1,
      length: 0,
    }),
    Matter.Constraint.create({
      bodyA: head,
      bodyB: torso.bodies.at(0),
      pointB: { x: 0, y: 0 },
      stiffness: 1,
      length: radius * 2,
    }),
    // Matter.Constraint.create({
    //   bodyA: head,
    //   bodyB: torso.bodies.at(-1),
    //   stiffness: 0.5,
    //   length: radius * 6,
    // }),
    ...torso.constraints,

    //
    //
    //

    Matter.Constraint.create({
      bodyA: torso.bodies.at(1),
      // pointA: { x: -radius, y: 0 },
      bodyB: upperRightArm.bodies.at(0),
      // pointB: { x: radius, y: 0 },
      stiffness: 1,
      // length: 1,
    }),
    // Matter.Constraint.create({
    //   bodyA: torso.bodies.at(0),
    //   pointA: { x: -radius, y: 0 },
    //   bodyB: upperRightArm.bodies.at(0),
    //   pointB: { x: 0, y: radius },
    //   stiffness: 1,
    // }),

    //
    ...upperRightArm.constraints,
    Matter.Constraint.create({
      bodyA: upperRightArm.bodies.at(-1),
      bodyB: lowerRightArm.bodies.at(0),
      stiffness: 1,
    }),
    // Matter.Constraint.create({
    //   bodyA: upperRightArm.bodies.at(-1),
    //   pointA: { x: 0, y: radius },
    //   bodyB: lowerRightArm.bodies.at(0),
    //   pointB: { x: 0, y: -radius },
    //   stiffness: 1,
    // }),

    ...lowerRightArm.constraints,
    //

    Matter.Constraint.create({
      bodyA: torso.bodies.at(1),
      // pointA: { x: -radius, y: 0 },
      bodyB: upperLeftArm.bodies.at(0),
      // pointB: { x: radius, y: 0 },
      stiffness: 1,
      // length: 1,
    }),
    ...upperLeftArm.constraints,
    Matter.Constraint.create({
      bodyA: upperLeftArm.bodies.at(-1),
      bodyB: lowerLeftArm.bodies.at(0),
      stiffness: 0.01,
    }),
    ...lowerLeftArm.constraints,
  ];
  return {
    head,
    bodies: [
      head,
      ...torso.bodies,
      ...upperRightArm.bodies,
      ...lowerRightArm.bodies,
      ...upperLeftArm.bodies,
      ...lowerLeftArm.bodies,
    ],
    constraints,
    group,
  };
};
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

        const imp = 1 / 10_000;
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
export function LeveL1() {
  log("!");

  const _protagonists = useRef<Body[]>([]);
  const [protagonists, setProtagonists] = useState<Body[]>([]);
  const playerBody = useRef<Body>(null);
  const opponentBody = useRef<Body>(null);

  //

  const onMove = (vector: Vector) => {
    if (!playerBody.current) return;
    const { current: bodies } = playerBody;
    const body = bodies.parts[0]!;
    const force = Vector.sub(
      body.velocity,
      Vector.mult(vector, body.mass * SPEED)
    );

    Body.setVelocity(body, force);
  };

  const opponentBehavior = () => {
    if (!opponentBody.current) return;
    if (!playerBody.current) return;
    const { current: body } = opponentBody;
    const { position: target } = playerBody.current;

    const vector = Vector.normalise(Vector.sub(body.position, target));

    const force = Vector.sub(body.velocity, Vector.mult(vector, SPEED));

    // Body.setVelocity(body, force);
  };

  //

  useEventBeforeUpdate(opponentBehavior, [playerBody, opponentBody]);
  useEventCollisionStart(
    (event) => {
      for (const pair of event.pairs) {
        if (pair.bodyA.isStatic || pair.bodyB.isStatic) return;
        const ratio = -0.05;
        // const normal = Matter.Vector.normalise(pair.collision.normal);
        const impulse = {
          x: (pair.bodyB.position.x - pair.bodyA.position.x) * ratio,
          y: (pair.bodyB.position.y - pair.bodyA.position.y) * ratio,
        };
        // var forceMagnitude = (0.05 * pair.inverseMass) * timeScale;
        // const impulse = Vector.mult(
        //   Vector.normalise(pair.collision.normal),
        //   ratio
        //   // pair.inverseMass
        // );
        // apply the repulsion vector to the bodies
        log(pair.collision.depth, pair.collision.normal, impulse);
        // Matter.Body.applyForce(pair.bodyA, pair.bodyA.position, impulse);
        // Matter.Body.applyForce(
        //   pair.bodyB,
        //   pair.bodyB.position,
        //   Matter.Vector.neg(impulse)
        // );
        Matter.Body.setVelocity(
          pair.bodyA,
          Matter.Vector.mult(impulse, pair.bodyB.mass)
        );
        Matter.Body.setVelocity(
          pair.bodyB,
          Matter.Vector.mult(Matter.Vector.neg(impulse), pair.bodyA.mass)
        );
      }
      // if (![p1.current, p2.current, p3.current, p4.current].every(Boolean))
      //   return;

      // var pairs = event.pairs;
      // for (const pair of pairs) { const {bodyA} = pair
      //   const compositeA = Matter.Body.get(p1.current!, bodyA.id, 'body');
      //   const composite = Matter.Composite.in
      //   const compositeB = Matter.Composite.get(ragdoll, bodyB.id, 'body');

      // }
      return;
      if (!opponentBody.current) return;
      if (!playerBody.current) return;
      var pairs = event.pairs;
      for (const pair of pairs) {
        // const { bodyA, bodyB } = par;
        if (pair.bodyA.id === pair.bodyB.id) continue;
        if (pair.bodyA.parent.id === pair.bodyB.parent.id) continue;
        if (pair.bodyA.parent.label === pair.bodyB.parent.label) continue;
        pair.bodyA.render.fillStyle = "#333";
        pair.bodyB.render.fillStyle = "#333";
      }
      // for (var i = 0; i < pairs.length; i++) {
      //     var pair = pairs[i];
      //     pair.bodyA.render.fillStyle = '#333';
      //     pair.bodyB.render.fillStyle = '#333';
      // }
      // log(event);
    },
    [playerBody, opponentBody]
  );

  const p1 = useRef<Matter.Body>(null);

  const p2 = useRef<Matter.Body>(null);
  const p3 = useRef<Matter.Body>(null);
  const p4 = useRef<Matter.Body>(null);

  useEffect(() => {
    if (![p1.current, p2.current, p3.current, p4.current].every(Boolean))
      return;
    setProtagonists([p1.current!, p2.current!, p3.current!, p4.current!]);
  }, [p1.current, p2.current, p3.current, p4.current]);

  const randomMoves = (body: Body) => (delta: number) => {
    const velocity =
      Math.random() > 0.5
        ? Vector.create(Math.random() - 0.5, Math.random() - 0.5)
        : Vector.create();
    // Body.setVelocity(
    //   body,

    //   Vector.add(body.velocity, Vector.mult(velocity, delta / 50))
    // );

    Matter.Body.applyForce(
      body,
      body.position,
      Vector.mult(velocity, delta / 50_000)
    );
  };
  useEventBeforeUpdate(
    (event) => {
      if (![p1.current, p2.current, p3.current, p4.current].every(Boolean))
        return;

      // randomMoves(p1.current!)((event as any).delta);
      // randomMoves(p2.current!)((event as any).delta);
      // randomMoves(p3.current!)((event as any).delta);
      // randomMoves(p4.current!)((event as any).delta);
    },
    [p1.current, p2.current, p3.current, p4.current]
  );

  const opponent: Matter.IBodyDefinition = {
    // isStatic: false,
    // friction: 0.0001,
    frictionAir: 0,
    density: 0.001,
    restitution: 0.99,
  };
  const onMoveP1 = (vector: Vector) => {
    if (!p1.current) return;
    const { current: body } = p1;
    const force = Vector.sub(body.velocity, Vector.mult(vector, SPEED));
    const mass = body.mass * 2;
    // console.log({ mass });
    // Body.applyForce(body, body.position, force);
    Body.applyForce(body, body.position, Vector.div(vector, -10_000 / mass));
  };
  return (
    <>
      <Viewport
        protagonists={protagonists}
        // bounds={{
        //   min: { x: -300, y: -300 },
        //   max: { x: 1100, y: 900 },
        // }}
      />
      <PlayerInput map="gamepad" event="move" call={onMoveP1} />
      <SurroundingWalls
        thick={600}
        bounds={Matter.Bounds.create([
          { x: -600, y: -600 },
          { x: 1200, y: 1200 },
        ])}
        options={{ render: { fillStyle: "#000" } }}
      />
      <P1 x={600 / 2} y={600 / 2} ref={p1} />
      {/* <Circle
        x={600 / 2}
        y={600 / 2}
        radius={10}
        options={{ isStatic: false }}
        ref={p1}
      /> */}
      <Circle x={600 / 2} y={600 / 2} radius={10} options={opponent} ref={p2} />
      <Circle x={300} y={300} radius={10} options={opponent} ref={p3} />
      <Circle x={600 / 2} y={600 / 2} radius={10} options={opponent} ref={p4} />
      {/*

      <Ragdoll x={222} y={222} ref={playerBody} />
      <Ragdoll x={666} y={222} ref={opponentBody} /> */}
    </>
  );
}

export function Battle1Player({
  ...props
}: ComponentPropsWithoutRef<"section">) {
  // const [app, setApp] = useState<Application>();
  const { sendN } = useContext(GameContext);
  // const viewport = useOnResize();
  // // console.log(app?.resizeTo);
  // useLayoutEffect(() => {
  //   const [width, height] = viewport;
  //   app?.renderer?.resize(width, height);
  //   app?.resize();
  // }, [app, viewport]);

  // const blurFilter = useMemo(() => new BlurFilter(0), []);

  useKeyPressEvent("Escape", sendN("BACK"));

  return (
    <section className="h-100% overflow-hidden grid items-center justify-center">
      <Renderer>
        <LeveL1 />
      </Renderer>
    </section>
  );
}

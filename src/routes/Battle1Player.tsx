//

import { GameContext } from "@/GameContext";
import { Renderer } from "@/components/Renderer";
import { Viewport } from "@/components/Viewport";
import {
  Circle,
  Composite,
  PlayerInput,
  SurroundingWalls,
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
// const handleWindowResize = (render: Render) => {
//   log("handleWindowResize", render);
// };
// window.addEventListener("resize", (event) => {})
const P1 = forwardRef<Body, { x: number; y: number }>(function P1(
  { x, y }: any,
  ref
) {
  const rgb = useRef({ r: 255, g: 255, b: 255 });
  const impact = useRef(0);
  const impactedBody = useRef<[Body, number][]>([]);
  const object = useMemo(() => {
    let { r, g, b } = rgb.current;
    const fillStyle = to.hex([r, g, b]);
    const head = Matter.Bodies.circle(x, y, 20, {
      label: "head",
      // density: 1,
      // friction: 0.1,
      // restitution: 0.8,
      density: 0.001,
      restitution: 0.99,
      render: { fillStyle },
    });
    return Matter.Body.create({ parts: [head], label: "test" });
  }, [x, y]);
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
        const isBodyA = object.parts.includes(bodyA);
        const isBodyB = object.parts.includes(bodyB);
        if (isBodyA) onCollide(bodyA, bodyB, pair);
        if (isBodyB) onCollide(bodyB, bodyA, pair);
      }
      // log(pairs);
    },
    [object.id]
  );
  return <Composite.add object={object} ref={ref} />;
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
    const { current: body } = playerBody;
    const force = Vector.sub(body.velocity, Vector.mult(vector, SPEED));

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

    // Body.applyForce(body, body.position, force);
    Body.applyForce(body, body.position, Vector.div(vector, -10_500));
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

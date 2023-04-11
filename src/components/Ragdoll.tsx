//

import { Circle, Composite, Constraint } from "@1.framework/matter4react";
import debug from "debug";
// import {
//   Body,
//   Constraint,
//   Composite as Matter.Composite,
//   type IBodyDefinition,
import Matter from "matter-js";
import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
} from "react";

//

const log = debug("@1.framework:matter4react:Ragdoll");

//

const RagdollArm = forwardRef<Matter.Composite, Props & { radius: number }>(
  function RagdollChest({ x, y, radius }, ref) {
    const chest = useMemo(() => {
      // const group = Matter.Body.nextGroup(true);

      const stack = Matter.Composites.stack(
        x,
        y,
        4,
        1,
        0,
        0,
        // radius,
        // radius,
        (x: number, y: number) => {
          return Matter.Bodies.circle(x, y, radius, {
            label: "Arm",
            // collisionFilter: { group: group },
          });
        }
      );

      Matter.Composites.chain(stack, 0, 0, 0, 0, {
        stiffness: 1,
        damping: 0,
        // length: 2,
        render: { type: "line" },
      } as Matter.IConstraintDefinition);

      return stack;
    }, [x, y, radius, ref]);

    return <Composite.add object={chest} ref={ref} />;
  }
);
const RagdollChest = forwardRef<Matter.Composite, Props & { radius: number }>(
  function RagdollChest({ x, y, radius }, ref) {
    const chest = useMemo(() => {
      // const group = Matter.Body.nextGroup(true);

      const stack = Matter.Composites.stack(
        x,
        y,
        1,
        5,
        0,
        0,
        (x: number, y: number) => {
          return Matter.Bodies.circle(x, y, radius, {
            label: "Chest",
            // collisionFilter: { group: group },
          });
        }
      );

      Matter.Composites.chain(stack, 0, 0, 0, 0, {
        stiffness: 1,
        damping: 0,
        // length: 2,
        render: { type: "line" },
      } as Matter.IConstraintDefinition);

      return stack;
    }, [x, y, radius, ref]);

    return <Composite.add object={chest} ref={ref} />;
  }
);

export const Ragdoll = forwardRef<Matter.Body, Props>(function Ragdoll(
  { x, y },
  ref
) {
  log("! render");
  const ragdollRef = useRef<ComponentRef<typeof Composite>>(null);

  const [head, setHead] = useState<Matter.Body | null>(null);

  const group = useMemo(
    () => Matter.Body.nextGroup(true),
    [ragdollRef.current?.id]
  );

  const [chest, setChest] = useState<Matter.Composite | null>(null);
  const cervical = useMemo(() => chest?.bodies.at(0) || null, [chest]);
  const clavicle = useMemo(() => chest?.bodies.at(1) || null, [chest]);
  const pelvis = useMemo(() => chest?.bodies.at(-1) || null, [chest]);

  const [rightArm, setRightArm] = useState<Matter.Composite | null>(null);
  const rightHeadOfHumerus = useMemo(
    () => rightArm?.bodies.at(0) || null,
    [chest]
  );

  const [leftArm, setLeftArm] = useState<Matter.Composite | null>(null);
  const leftHeadOfHumerus = useMemo(
    () => leftArm?.bodies.at(-1) || null,
    [chest]
  );

  const [rightFit, setRightFit] = useState<Matter.Composite | null>(null);
  const rightHeadOfFemur = useMemo(
    () => rightFit?.bodies.at(0) || null,
    [chest]
  );
  const [leftFit, setLeftFit] = useState<Matter.Composite | null>(null);
  const leftHeadOfFemur = useMemo(
    () => leftFit?.bodies.at(-1) || null,
    [chest]
  );

  const constraints = useMemo(
    () =>
      [
        [head, cervical],
        [clavicle, rightHeadOfHumerus],
        [clavicle, leftHeadOfHumerus],
        [pelvis, rightHeadOfFemur],
        [pelvis, leftHeadOfFemur],
      ]
        .filter((deps) => deps.every(Boolean))
        .map((deps) => deps as [Matter.Body, Matter.Body])
        .map(([bodyA, bodyB], index) => (
          <Constraint
            key={index}
            options={{
              bodyA,
              bodyB,
              stiffness: 1,
              damping: 0,
            }}
          />
        )),
    [head, chest, clavicle, rightArm, leftArm, leftFit, rightFit]
  );

  const radius = 10;
  const render = { fillStyle: "#eee" };
  const options: Matter.IBodyDefinition = {
    friction: 1 / 1000,
    frictionAir: 1 / 1000,
    restitution: 0.999,
    collisionFilter: { group },
    render,
  };

  useImperativeHandle(ref, () => head!, [head]);

  return (
    <Composite ref={ragdollRef} options={{ label: "Ragdoll" }}>
      <Circle
        x={x}
        y={y}
        radius={radius * 2}
        options={{ ...options, label: "Head" }}
        ref={setHead}
      />
      <RagdollChest x={x} y={y + radius * 2} radius={radius} ref={setChest} />

      <RagdollArm
        x={x + radius * 2}
        y={y + radius * 4}
        radius={radius}
        ref={setRightArm}
      />
      <RagdollArm
        x={x - radius * 8}
        y={y + radius * 4}
        radius={radius}
        ref={setLeftArm}
      />
      <RagdollArm
        x={x + radius * 2}
        y={y + radius * 10}
        radius={radius}
        ref={setRightFit}
      />
      <RagdollArm
        x={x - radius * 8}
        y={y + radius * 10}
        radius={radius}
        ref={setLeftFit}
      />
      {constraints}
    </Composite>
  );
});

//

type Props = { x: number; y: number };

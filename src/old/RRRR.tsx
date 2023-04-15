import Matter from "matter-js";
import { RRRChain } from "./RRRChain";

export const RRRR = ({
  x,
  y,
  radius,
}: {
  x: number;
  y: number;
  radius: number;
}) => {
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

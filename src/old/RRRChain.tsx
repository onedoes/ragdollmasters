import Matter from "matter-js";

// const handleWindowResize = (render: Render) => {
//   log("handleWindowResize", render);
// };
// window.addEventListener("resize", (event) => {})
export const RRRChain = ({
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

import defaults from "defaults";
import Matter from "matter-js";

type BodyPartType = "head" | "body" | "limb";

interface BodyPartOptions {
  x: number;
  y: number;
  radius: number;
  length?: number;

  options?: Matter.IBodyDefinition;
  constraint?: Matter.IConstraintDefinition;
}

interface LimbOptions extends BodyPartOptions {
  length: number;
}

function createCircleBody(
  x: number,
  y: number,
  radius: number,
  options?: Matter.IBodyDefinition
): Matter.Body {
  return Matter.Bodies.circle(x, y, radius, {
    ...options,
    collisionFilter: {
      group: -1,
    },
  });
}

function createStick(_options: BodyPartOptions) {
  const { x, y, radius, length = 2, constraint, options } = _options;
  const { bodies } = Matter.Composites.stack(
    x,
    y,
    length,
    1,
    0,
    0,
    (x: number, y: number) => {
      return Matter.Bodies.circle(x, y, radius, options);
    }
  );

  const constraints = Array.from(bodies.entries())
    .filter(([bodyId]) => bodyId > 0)
    .map(([bodyId, bodyB]) => ({
      ...constraint,
      bodyA: bodies[bodyId - 1]!,
      bodyB,
      damping: 0,
      stiffness: 1,
    }))
    .flatMap((common) => [
      Matter.Constraint.create({
        ...common,
      }),
      Matter.Constraint.create({
        ...common,
        pointA: { x: radius, y: 0 },
        pointB: { x: -radius, y: 0 },
        damping: 0,
        length: 0,
        stiffness: 1,
      }),
    ]);

  return { bodies, constraints };
}
function createBody(_options: BodyPartOptions) {
  const { x, y, radius, constraint, options } = _options;
  const { bodies } = Matter.Composites.stack(
    x,
    y,
    1,
    4,
    0,
    0,
    (x: number, y: number) => {
      return Matter.Bodies.circle(x, y, radius, options);
    }
  );
  const constraints = Array.from(bodies.entries())
    .filter(([bodyId]) => bodyId > 0)
    .map(([bodyId, bodyB]) => ({
      ...constraint,
      bodyA: bodies[bodyId - 1]!,
      bodyB,
      damping: 0,
      stiffness: 1,
    }))
    .flatMap((common) => [
      Matter.Constraint.create({
        ...common,
      }),
      Matter.Constraint.create({
        ...common,
        pointA: { x: 0, y: radius },
        pointB: { x: 0, y: -radius },
        damping: 0,
        length: 0,
        stiffness: 1,
      }),
      // Matter.Constraint.create({
      //   ...common,
      //   pointA: { x: 0, y: radius },
      //   pointB: { x: 0, y: -radius },
      // }),
      // Matter.Constraint.create({
      //   ...common,
      //   pointA: { x: 0, y: -radius },
      //   pointB: { x: 0, y: radius },
      // }),
    ]);
  return { bodies, constraints };
}

function createLimb(
  options: LimbOptions
): [[Matter.Body, Matter.Body], [Matter.Constraint, Matter.Constraint]] {
  const startX = options.x;
  const startY = options.y;
  const endX = startX;
  const endY = startY + options.length;
  const bodyA = createCircleBody(
    startX,
    startY,
    options.radius,
    options.options
  );
  const bodyB = createCircleBody(endX, endY, options.radius, options.options);
  const constraintOptions = {
    stiffness: 0.9,
    length: options.length,
    damping: 0.1,
  };

  const constraintA = Matter.Constraint.create({
    bodyA: bodyA,
    pointA: { x: 0, y: options.radius },
    bodyB: bodyB,
    pointB: { x: 0, y: -options.radius },
    ...constraintOptions,
  });

  const constraintB = Matter.Constraint.create({
    bodyA: bodyA,
    pointA: { x: 0, y: -options.radius },
    bodyB: bodyB,
    pointB: { x: 0, y: options.radius },
    ...constraintOptions,
  });

  return [
    [bodyA, bodyB],
    [constraintA, constraintB],
  ];
}

export function createStickman(
  x: number,
  y: number,
  options?: Partial<{ scale: number; render: Matter.IBodyRenderOptions }>
): Matter.Composite {
  const { scale, render } = defaults(options ?? ({} as any), {
    scale: 1,
    render: {},
  });

  const radius = 10 * scale;

  //
  // HEAD
  //

  const head_group = Matter.Body.nextGroup(true);
  const head = Matter.Bodies.circle(x, y - 3 * radius, 2 * radius, {
    label: "Head",
    collisionFilter: {
      group: head_group,
    },
    render,
    restitution: 0,
  });

  //#region Chest

  //
  // CHEST
  //

  const chest = createBody({
    x: x - radius,
    y: y - radius,
    radius: radius,
    options: {
      label: "Chest",
      collisionFilter: {
        group: Matter.Body.nextGroup(true),
      },
      render,
    },
    constraint: { stiffness: 1, damping: 0 },
  });
  // chest.bodies.at(0)!.collisionFilter.group = head_group;

  const head_x_chest = Matter.Constraint.create({
    bodyA: head,
    pointA: { x: 0, y: radius * 2 },
    bodyB: chest.bodies.at(0),
    pointB: { x: 0, y: -radius },
    stiffness: 1,
    damping: 0,
  });

  //#endregion

  const arm_group = Matter.Body.nextGroup(true);
  //#region Left Arm

  //
  // Left Arm
  //

  // Upper Left Arm

  const upperLeftArm = createStick({
    x: x - radius * 5,
    y: y - radius,
    radius: radius,
    options: {
      label: "Upper Left Arm",
      collisionFilter: {
        group: arm_group,
      },
      render,
      restitution: 0,
      density: 0.0001,
    },
  });

  const upperLeftArm_x_body = [
    Matter.Constraint.create({
      bodyA: upperLeftArm.bodies.at(-1),
      bodyB: chest.bodies.at(0),
      stiffness: 1,
      damping: 0,
    }),
    Matter.Constraint.create({
      bodyA: upperLeftArm.bodies.at(-1),
      pointA: { x: radius, y: 0 },
      bodyB: chest.bodies.at(0),
      pointB: { x: -radius, y: 0 },
      damping: 0,
      length: 0,
      stiffness: 1,
    }),
  ];

  // Lower Left Arm

  const lowerLeftArm = createStick({
    x: x - radius * 11,
    length: 3,
    y: y - radius,
    radius: radius,
    options: {
      label: "Lower Left Arm",
      render,
      collisionFilter: {
        group: arm_group,
      },
    },
  });

  const upperLeftArm_x_lowerLeftArm = [
    Matter.Constraint.create({
      bodyA: upperLeftArm.bodies.at(0),
      bodyB: lowerLeftArm.bodies.at(0),
      damping: 0,
      stiffness: 1,
    }),
    Matter.Constraint.create({
      bodyA: upperLeftArm.bodies.at(-1),
      bodyB: lowerLeftArm.bodies.at(-1),
      damping: 0,
      stiffness: 1,
    }),
    Matter.Constraint.create({
      bodyA: upperLeftArm.bodies.at(0),
      pointA: { x: -radius, y: 0 },
      bodyB: lowerLeftArm.bodies.at(-1),
      pointB: { x: radius, y: 0 },
      damping: 0,
      length: 0,
      stiffness: 1,
    }),
  ];

  //#endregion

  //#region Right Arm

  //
  // RIGHT ARM
  //

  const upperRightArm = createStick({
    x: x + radius,
    y: y - radius,
    radius: radius,
    options: {
      label: "Upper Right Arm",
      collisionFilter: {
        group: arm_group,
      },
      render,
      friction: 1,
      restitution: 0,
      density: 0.0001,
    },
  });

  const upperRightArm_x_body = [
    Matter.Constraint.create({
      bodyA: upperRightArm.bodies.at(0),
      bodyB: chest.bodies.at(0),
      damping: 0,
      stiffness: 1,
    }),
    Matter.Constraint.create({
      bodyA: chest.bodies.at(0),
      pointA: { x: radius, y: 0 },
      bodyB: upperRightArm.bodies.at(0),
      pointB: { x: -radius, y: 0 },
      damping: 0,
      length: 0,
      stiffness: 1,
    }),
  ];

  //

  const lowerRightArm = createStick({
    x: x + radius * 5,
    y: y - radius,
    length: 3,
    radius: radius,
    options: {
      label: "Lower Right Arm",
      collisionFilter: {
        group: arm_group,
      },

      render,
    },
  });

  const upperRightArm_x_lowerRightArm = [
    Matter.Constraint.create({
      bodyA: upperRightArm.bodies.at(0),
      bodyB: lowerRightArm.bodies.at(0),
      damping: 0,
      stiffness: 1,
    }),
    Matter.Constraint.create({
      bodyA: upperRightArm.bodies.at(-1),
      bodyB: lowerRightArm.bodies.at(-1),
      damping: 0,
      stiffness: 1,
    }),
    Matter.Constraint.create({
      bodyA: upperRightArm.bodies.at(-1),
      pointA: { x: radius, y: 0 },
      bodyB: lowerRightArm.bodies.at(0),
      pointB: { x: -radius, y: 0 },
      damping: 0,
      length: 0,
      stiffness: 1,
    }),
  ];

  //#endregion

  const leg_group = Matter.Body.nextGroup(true);

  //#region Left Leg

  //
  //
  //

  const upperLeftLeg = createStick({
    x: x - radius * 5,
    y: y + radius * 7,
    length: 3,
    radius: radius,
    options: {
      label: "Upper Left Leg",
      collisionFilter: {
        group: leg_group,
      },
      render,
      restitution: 0,
      density: 0.0001,
    },
  });

  const upperLeftLeg_x_body = [
    Matter.Constraint.create({
      bodyA: upperLeftLeg.bodies.at(-1),
      pointA: { x: radius, y: -radius },
      bodyB: chest.bodies.at(-1),
      pointB: { x: 0, y: radius },
      stiffness: 1,
      damping: 0,
      length: 0,
    }),
    // Matter.Constraint.create({
    //   bodyA: upperLeftLeg.bodies.at(-1),
    //   pointA: { x: radius, y: 0 },
    //   bodyB: chest.bodies.at(0),
    //   pointB: { x: -radius, y: 0 },
    //   stiffness: 1,
    //   damping: 0,
    //   length: 0,
    // }),
  ];

  //

  const lowerLeftLeg = createStick({
    x: x - radius * 11,
    y: y + radius * 7,
    length: 3,
    radius: radius,
    options: {
      label: "Lower Left Leg",
      collisionFilter: {
        group: Matter.Body.nextGroup(true),
      },
      render,
    },
  });

  const upperLeftLeg_x_lowerLeftLeg = [
    Matter.Constraint.create({
      bodyA: upperLeftLeg.bodies.at(0),
      bodyB: lowerLeftLeg.bodies.at(-1),
    }),
    // Matter.Constraint.create({
    //   bodyA: upperLeftLeg.bodies.at(-1),
    //   bodyB: lowerLeftLeg.bodies.at(-1),
    // }),
    Matter.Constraint.create({
      bodyA: upperLeftLeg.bodies.at(0),
      pointA: { x: -radius, y: 0 },
      bodyB: lowerLeftLeg.bodies.at(-1),
      pointB: { x: radius, y: 0 },
      stiffness: 1,
      damping: 0,
      length: 0,
    }),
  ];
  //#endregion

  //#region Right Leg

  const upperRightLeg = createStick({
    x: x - radius,
    y: y + radius * 7,
    length: 3,
    radius: radius,
    options: {
      label: "Upper Right Leg",
      collisionFilter: {
        group: leg_group,
      },
      render,
      restitution: 0,
      density: 0.0001,
    },
  });

  const upperRightLeg_x_body = [
    Matter.Constraint.create({
      bodyA: upperRightLeg.bodies.at(0),
      pointA: { x: -radius, y: -radius },
      bodyB: chest.bodies.at(-1),
      pointB: { x: 0, y: radius },
      stiffness: 1,
      damping: 0,
      length: 0,
    }),
    // Matter.Constraint.create({
    //   bodyA: chest.bodies.at(0),
    //   pointA: { x: radius, y: 0 },
    //   bodyB: upperRightLeg.bodies.at(0),
    //   pointB: { x: -radius, y: 0 },
    //   stiffness: 1,
    //   damping: 0,
    // }),
  ];

  // //

  const lowerRightLeg = createStick({
    x: x + radius * 5,
    y: y + radius * 7,
    length: 3,
    radius: radius,
    options: {
      label: "Lower Right Leg",
      collisionFilter: {
        group: Matter.Body.nextGroup(true),
      },
      render,
    },
  });

  const upperRightLeg_x_lowerRightLeg = [
    Matter.Constraint.create({
      bodyA: upperRightLeg.bodies.at(0),
      bodyB: lowerRightLeg.bodies.at(0),
    }),
    // Matter.Constraint.create({
    //   bodyA: upperRightLeg.bodies.at(-1),
    //   bodyB: lowerRightLeg.bodies.at(-1),
    // }),
    Matter.Constraint.create({
      bodyA: upperRightLeg.bodies.at(-1),
      pointA: { x: radius, y: 0 },
      bodyB: lowerRightLeg.bodies.at(0),
      pointB: { x: -radius, y: 0 },
      stiffness: 1,
      damping: 0,
      length: 0,
    }),
  ];

  //#endregion

  //

  const upperLeftLeg_x_upperRightLeg = [
    Matter.Constraint.create({
      bodyA: upperRightLeg.bodies.at(0),
      bodyB: upperLeftLeg.bodies.at(-1),
      stiffness: 1,
      damping: 0,
      length: 0,
    }),
  ];
  //

  return Matter.Composite.create({
    bodies: [
      head,
      ...chest.bodies,
      //
      ...upperLeftArm.bodies,
      ...lowerLeftArm.bodies,
      ...upperRightArm.bodies,
      ...lowerRightArm.bodies,
      //
      ...upperLeftLeg.bodies,
      ...lowerLeftLeg.bodies,
      ...upperRightLeg.bodies,
      ...lowerRightLeg.bodies,
    ],
    constraints: [
      head_x_chest,
      ...chest.constraints,
      //
      ...upperLeftArm_x_body,
      ...upperLeftArm.constraints,
      ...upperLeftArm_x_lowerLeftArm,
      ...lowerLeftArm.constraints,
      //
      ...upperRightArm_x_body,
      ...upperRightArm.constraints,
      ...upperRightArm_x_lowerRightArm,
      ...lowerRightArm.constraints,
      //
      ...upperLeftLeg_x_body,
      ...upperLeftLeg.constraints,
      ...upperLeftLeg_x_lowerLeftLeg,
      ...lowerLeftLeg.constraints,
      //
      ...upperRightLeg_x_body,
      ...upperRightLeg.constraints,
      ...upperRightLeg_x_lowerRightLeg,
      ...lowerRightLeg.constraints,
      //
      ...upperLeftLeg_x_upperRightLeg,
    ],
  });
}

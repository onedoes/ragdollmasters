//

import debug from "debug";
import { Bodies } from "matter-js";
import { forwardRef, useMemo, useRef } from "react";
import { Composite } from "./Composite";

//

const log = debug("@1.framework:matter4react:Circle");

//

export const Circle = forwardRef<BodiesCircleReturnType, Props>(function Circle(
  { x, y, radius, options },
  ref
) {
  log("! render", options?.label);
  const optionsRef = useRef(options);
  const object = useMemo(
    () => Bodies.circle(x, y, radius, options),
    [x, y, radius, optionsRef.current]
  );

  return <Composite.add object={object} ref={ref} />;
});

//

type BodiesCircleReturnType = ReturnType<typeof Bodies.circle>;
type BodiesCircleParameters = Parameters<typeof Bodies.circle>;
type Props = {
  x: BodiesCircleParameters[0];
  y: BodiesCircleParameters[1];
  radius: BodiesCircleParameters[2];
  options?: BodiesCircleParameters[3];
};

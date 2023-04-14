//

import debug from "debug";
import { Bodies } from "matter-js";
import { forwardRef } from "react";
import { Composite } from "./Composite";

//

const log = debug("@1.framework:matter4react:Rectangle");

//

export const Rectangle = forwardRef<BodiesRectangleReturnType, Props>(
  function Rectangle({ x, y, width, height, options }, ref) {
    log("!", { x, y, width, height, options });
    const object = Bodies.rectangle(x, y, width, height, options);
    return <Composite.add object={object} ref={ref} />;
  }
);

//

type BodiesRectangleReturnType = ReturnType<typeof Bodies.rectangle>;
type BodiesRectangleParameters = Parameters<typeof Bodies.rectangle>;
type Props = {
  x: BodiesRectangleParameters[0];
  y: BodiesRectangleParameters[1];
  width: BodiesRectangleParameters[2];
  height: BodiesRectangleParameters[3];
  options?: BodiesRectangleParameters[4];
};

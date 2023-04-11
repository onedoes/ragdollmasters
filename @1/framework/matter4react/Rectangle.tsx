//

import { Bodies } from "matter-js";
import { forwardRef, useMemo, useRef } from "react";
import { Composite } from "./Composite";

//

export const Rectangle = forwardRef<BodiesRectangleReturnType, Props>(
  function Rectangle({ x, y, width, height, options }, ref) {
    const optionsRef = useRef(options);
    const object = useMemo(
      () => Bodies.rectangle(x, y, width, height, options),
      [x, y, width, height, optionsRef.current]
    );

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

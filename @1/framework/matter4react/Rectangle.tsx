//

import { Bodies } from "matter-js";
import { useEffect, useRef, useState } from "react";
import { Body } from "./Body";

//

export function Rectangle({ x, y, width, height, options }: Props) {
  const [object, setObject] = useState<ReturnType<
    typeof Bodies.rectangle
  > | null>(null);
  const optionsRef = useRef(options);

  useEffect(() => {
    const body = Bodies.rectangle(x, y, width, height, options);
    setObject(body);
    return () => setObject(null);
  }, [x, y, width, height, optionsRef.current]);

  if (!object) return null;
  return <Body objectRef={object} />;
}

//

type BodiesRectangleParameters = Parameters<typeof Bodies.rectangle>;
type Props = {
  x: BodiesRectangleParameters[0];
  y: BodiesRectangleParameters[1];
  width: BodiesRectangleParameters[2];
  height: BodiesRectangleParameters[3];
  options?: BodiesRectangleParameters[4];
};

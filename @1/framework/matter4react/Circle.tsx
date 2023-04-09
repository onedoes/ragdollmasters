//

import { Bodies } from "matter-js";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Body } from "./Body";

//

export const Circle = forwardRef<BodiesCircleReturnType, Props>(function Circle(
  { x, y, radius, options },
  ref
) {
  const [object, setObject] = useState<BodiesCircleReturnType | null>(null);
  const optionsRef = useRef(options);

  useImperativeHandle(ref, () => object!, [object]);

  useEffect(() => {
    const body = Bodies.circle(x, y, radius, options);
    setObject(body);
    return () => setObject(null);
  }, [x, y, radius, optionsRef.current]);

  // const object = useMemo(
  //   () => Bodies.circle(x, y, radius, options),
  //   [x, y, radius, options]
  // );
  // log(object.id);

  // useLayoutEffect(() => {
  //   const body = ref.current!;
  //   Body.setPosition(body, { x: sizes.x, y: sizes.y });
  // }, [ref, sizes.x, sizes.y]);
  // return ref.current ? (
  //   <Body {...props} ref={ref} key={ref.current.id} />
  // ) : null;
  if (!object) return null;
  return <Body objectRef={object} />;
});

//

type BodiesCircleReturnType = ReturnType<typeof Bodies.circle>;
type BodiesCircleParameters = Parameters<typeof Bodies.circle>;
type Props = {
  x: BodiesCircleParameters[0];
  y: BodiesCircleParameters[1];
  radius: BodiesCircleParameters[2];
  options?: BodiesCircleParameters[3];
  ref: {};
};

//

import debug from "debug";
import { Bodies } from "matter-js";
import {
  Component,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Body } from "./Body";

//

const log = debug("@1.framework:matter4react:Circle");

//
export class Circle3 extends Component<Props> {
  // override state: Readonly<{ engine?: MatterEngine }> = {};

  override componentDidMount(): void {
    // const { objectRef } = this.props;
    // const parent = this.context;
    log("+ componentDidMount.", {});
    // Composite.add(parent, objectRef);
    // log("Composite.add", { });
  }
  override componentWillUnmount(): void {
    // const { objectRef } = this.props;
    // const parent = this.context;
    log("- componentWillUnmount.", {});
    // Composite.remove(parent, objectRef);
    // log("Composite.remove", { parent, objectRef });
  }
  override render() {
    return null;
  }
}
export const Circle = forwardRef<BodiesCircleReturnType, Props>(function Circle(
  { x, y, radius, options },
  ref
) {
  log("! render..");
  // const ref = useRef<Body>() as MutableRefObject<Body>;
  // const objectRef = useRef<renderType>(null) as MutableRefObject<renderType>;
  const [object, setObject] = useState<BodiesCircleReturnType | null>(null);
  const optionsRef = useRef(options);

  useImperativeHandle(ref, () => object!, [object]);

  useEffect(() => {
    log("+ useEffect.", [x, y, radius, options]);
    const body = Bodies.circle(x, y, radius, options);
    // body.label;
    log("!!! ", body.id, body.label, { body });
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

//

import debug from "debug";
import { Bodies } from "matter-js";
import { useEffect, useRef, useState } from "react";
import { Body } from "./Body";

//

const log = debug("@1.framework:matter4react:Rectangle");

//

export function Rectangle({ x, y, width, height, options }: Props) {
  const [object, setObject] = useState<ReturnType<
    typeof Bodies.rectangle
  > | null>(null);
  const optionsRef = useRef(options);

  useEffect(() => {
    log("+ useEffect.", [x, y, width, height, options]);
    const body = Bodies.rectangle(x, y, width, height, options);
    // body.label;
    log("!!! ", body.id, body.label, { body });
    setObject(body);
    return () => setObject(null);
  }, [x, y, width, height, optionsRef.current]);

  log("! render..");
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

// &
// Partial<Body>;
/*
const Rectangle = ({
  x,
  y,
  width,
  height,
  clone = false,
  options,
  bodyRef,
  cloneProps,
  ...props
}: Props) => {
  const rerender = useRerender();
  const ref = useForwardRef(bodyRef);
  const sizes = useMapSizes({
    x,
    y,
    width,
    height,
  });

  useValueEffect(() => {
    const { x, y, width, height } = sizes;
    const body = shallow(Matter.Bodies.rectangle(x, y, width, height, options));
    ref.current = body;
    if (clone) {
      const ref = createRef<SVGRectElement>();
      const el = (
        <g {...cloneProps} ref={ref} key={body.id}>
          <rect x={-width / 2} y={-height / 2} width={width} height={height} />
        </g>
      );
      body[cloneKey] = {
        key: svgKey,
        ref,
        el,
      };
    }
    rerender();
  }, [options]);
  useEffect(() => {
    const body = ref.current!;
    Matter.Body.setPosition(body, { x: sizes.x, y: sizes.y });
  }, [x, y, ref, sizes.x, sizes.y]);

  return ref.current ? (
    <Body {...props} bodyRef={ref} key={ref.current.id} />
  ) : null;
};

export default valueMemo(Rectangle);

type Props = {
  x: number;
  y: number;
  width: number;
  height: number;
  clone?: boolean;
  options?: IChamferableBodyDefinition;
  cloneProps?: SVGProps<SVGGElement>;
} & React.ComponentProps<typeof Body>;
*/

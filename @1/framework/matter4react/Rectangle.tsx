//

import { Bodies } from "matter-js";
import { useEffect, useRef } from "react";

//

export function Rectangle({ x, y, width, height, options }: Props) {
  const ref = useRef<Body>();
  useEffect(() => {
    Bodies.rectangle(x, y, width, height, options);
  }, []);

  // return ref.current ? (
  //   <Body {...props} ref={ref} key={ref.current.id} />
  // ) : null;
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

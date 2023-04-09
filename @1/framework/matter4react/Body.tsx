//

import debug from "debug";
import { Composite } from "matter-js";
import {
  Component,
  useContext,
  useDebugValue,
  useEffect,
  type ContextType,
  type PropsWithRef,
} from "react";
import { CompositeContext } from "./Composite";

//

const log = debug("@1.framework:matter4react:Body");

//
class BodyWrapper3 extends Component<PropsWithRef<Props>> {
  // override state: Readonly<{ engine?: MatterEngine }> = {};
  static override contextType = CompositeContext;
  declare context: ContextType<typeof CompositeContext>;

  override componentDidMount(): void {
    const { objectRef } = this.props;
    const parent = this.context;
    log("+ componentDidMount.", { parent, objectRef });
    Composite.add(parent, objectRef);
    log("+ Composite.add", { parent, objectRef });
  }
  override componentWillUnmount(): void {
    const { objectRef } = this.props;
    const parent = this.context;
    log("- componentWillUnmount.", { parent, objectRef });
    Composite.remove(parent, objectRef);
    log("- Composite.remove", { parent, objectRef });
  }
  override render() {
    return null;
  }
}
export function BodyWrapper({ objectRef }: PropsWithRef<Props>) {
  log("! render..");
  const parent = useContext(CompositeContext);
  useDebugValue(parent);
  useDebugValue(objectRef);

  useEffect(() => {
    log("+ useEffect.", { parent, objectRef });
    Composite.add(parent, objectRef);
    log("Composite.add", { parent, objectRef });
    return () => {
      log("- useEffect.", { parent, objectRef });
      Composite.remove(parent, objectRef);
      log("Composite.remove", { parent, objectRef });
    };
  }, [parent, objectRef]);
  return null;
}

export { BodyWrapper as Body };
//

type CompositeAddParameters = Parameters<typeof Composite.remove>;
type Props = { objectRef: CompositeAddParameters[1] };

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

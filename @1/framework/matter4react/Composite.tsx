//

import debug from "debug";
import Matter from "matter-js";
import {
  forwardRef,
  useContext,
  useDebugValue,
  useEffect,
  useImperativeHandle,
  useState,
  type PropsWithChildren,
} from "react";
import { CompositeContext } from "./CompositeContext";

//

const log = debug("@1.framework:matter4react:Composite");

//

const Composite_ = forwardRef<Ref, Props>(function CompositeW(
  { options, children },
  ref
) {
  log("! render", options?.label);
  const parent = useContext(CompositeContext);
  const [composite] = useState(Matter.Composite.create(options));

  useDebugValue(parent);
  useDebugValue(composite);

  return (
    <>
      <Composite.add object={composite} ref={ref} />
      <CompositeContext.Provider value={composite}>
        {children}
      </CompositeContext.Provider>
    </>
  );
});

//

const add = forwardRef<RemoveParameters[1], { object: RemoveParameters[1] }>(
  function add({ object }, ref) {
    log("add ! render", object.label);
    const parent = useContext(CompositeContext);

    useEffect(() => {
      log("add + useEffect", object.label);
      Matter.Composite.add(parent, object);

      return () => {
        log("add - useEffect", object.label);
        Matter.Composite.remove(parent, object);
      };
    }, [parent.id, object.id]);

    useImperativeHandle(ref, () => object, [parent.id, object.id]);

    return null;
  }
);

//

export const Composite = Object.assign(Composite_, {
  add,
});

//

type CreateParameters = Parameters<typeof Matter.Composite.create>;
type CreateReturnType = ReturnType<typeof Matter.Composite.create>;
type RemoveParameters = Parameters<typeof Matter.Composite.remove>;
type Ref = CreateReturnType;
type Props = PropsWithChildren<{
  options?: CreateParameters[0];
}>;

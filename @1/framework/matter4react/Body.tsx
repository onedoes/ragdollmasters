//

import { Composite } from "matter-js";
import { useContext, useDebugValue, useEffect, type PropsWithRef } from "react";
import { CompositeContext } from "./Composite";

//

export function BodyWrapper({ objectRef }: PropsWithRef<Props>) {
  const parent = useContext(CompositeContext);
  useDebugValue(parent);
  useDebugValue(objectRef);

  useEffect(() => {
    Composite.add(parent, objectRef);
    return () => {
      Composite.remove(parent, objectRef);
    };
  }, [parent, objectRef]);
  return null;
}

export { BodyWrapper as Body };

//

type CompositeAddParameters = Parameters<typeof Composite.remove>;
type Props = { objectRef: CompositeAddParameters[1] };

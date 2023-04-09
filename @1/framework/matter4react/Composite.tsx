//

import debug from "debug";
import { Composite } from "matter-js";
import {
  createContext,
  useContext,
  useDebugValue,
  useLayoutEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useEngine } from "./EngineContext";

//

const log = debug("@1.framework:matter4react:Composite");

//

export const CompositeContext = createContext<Composite>(null as any);

export const WorldCompositeProvider = ({ children }: PropsWithChildren) => {
  const engine = useEngine();
  log("! WorldCompositeProvider", { world_id: engine.world.id });
  return (
    <CompositeContext.Provider value={engine.world}>
      {children}
    </CompositeContext.Provider>
  );
};

function CompositeWrapper({ options, children }: PropsWithChildren<Props>) {
  const parent = useContext(CompositeContext);
  const [composite, setComposite] = useState<Composite | null>(null);
  useDebugValue(parent);
  useDebugValue(composite);

  useLayoutEffect(() => {
    log("+ useLayoutEffect.", { pid: parent.id });
    const composite = Composite.create(options);
    setComposite(composite);
    Composite.add(parent, composite);
    log("+ Composite.add", { parent, composite });
    return () => {
      log("- useLayoutEffect.", { pid: parent.id });
      Composite.remove(parent, composite);
      log("- Composite.remove", { parent, composite });
    };
  }, [parent]);

  //

  log("! render..", { parent, composite });
  if (!composite) return null;

  return (
    <CompositeContext.Provider value={composite}>
      {children}
    </CompositeContext.Provider>
  );
}

type Props = {
  options?: Parameters<typeof Composite.create>[0];
};

export { CompositeWrapper as Composite };

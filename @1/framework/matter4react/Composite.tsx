//

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

export const CompositeContext = createContext<Composite>(null as any);

export const WorldCompositeProvider = ({ children }: PropsWithChildren) => {
  const engine = useEngine();
  return (
    <CompositeContext.Provider value={engine.world}>
      {children}
    </CompositeContext.Provider>
  );
};

//

function CompositeWrapper({ options, children }: PropsWithChildren<Props>) {
  const parent = useContext(CompositeContext);
  const [composite, setComposite] = useState<Composite | null>(null);
  useDebugValue(parent);
  useDebugValue(composite);

  useLayoutEffect(() => {
    const composite = Composite.create(options);
    setComposite(composite);
    Composite.add(parent, composite);
    return () => {
      Composite.remove(parent, composite);
    };
  }, [parent]);

  //

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

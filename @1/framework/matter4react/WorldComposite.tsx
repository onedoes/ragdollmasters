//

import { type PropsWithChildren } from "react";
import { CompositeContext } from "./CompositeContext";
import { useEngine } from "./EngineContext";

//

export const WorldComposite = ({ children }: PropsWithChildren) => {
  const engine = useEngine();
  return (
    <CompositeContext.Provider value={engine.world}>
      {children}
    </CompositeContext.Provider>
  );
};

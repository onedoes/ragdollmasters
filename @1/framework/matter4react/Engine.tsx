//

import {
  Engine as MatterEngine,
  World,
  type IEngineDefinition,
} from "matter-js";
import { useEffect, useState, type PropsWithChildren } from "react";
import { EngineContext } from "./EngineContext";

//

export function Engine({ options = {}, children }: Props) {
  const [engine, setEngine] = useState<MatterEngine | null>(null);

  useEffect(() => {
    console.log("> Engine.useLayoutEffect...");
    const engine = MatterEngine.create(options);
    setEngine(engine);

    return () => {
      console.log("< Engine.useLayoutEffect.");
      World.clear(engine.world, false);
      MatterEngine.clear(engine);
      // engine.enabled = false;
    };
  }, [options]);

  if (!engine) return null;

  return (
    <EngineContext.Provider value={engine}>{children}</EngineContext.Provider>
  );
}

//

type Props = PropsWithChildren<{
  options?: IEngineDefinition;
}>;

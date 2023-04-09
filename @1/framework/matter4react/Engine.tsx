//

import {
  Engine as MatterEngine,
  World,
  type IEngineDefinition,
} from "matter-js";
import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import { EngineContext } from "./EngineContext";

//

export function Engine({ options, children }: PropsWithChildren<Props>) {
  const [engine, setEngine] = useState<MatterEngine | null>(null);
  const optionsRef = useRef(options);

  useEffect(() => {
    const { current: options } = optionsRef;
    if (!options) throw new Error("0_o : options not found.");
    const instance = MatterEngine.create(options);
    setEngine(instance);

    return () => {
      World.clear(instance.world, false);
      MatterEngine.clear(instance);
      setEngine(null);
    };
  }, [optionsRef.current]);

  if (!engine) return null;

  return (
    <EngineContext.Provider value={engine}>{children}</EngineContext.Provider>
  );
}

//

type Props = PropsWithChildren<{
  options?: IEngineDefinition;
}>;

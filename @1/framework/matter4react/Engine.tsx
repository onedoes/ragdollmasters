//

import debug from "debug";
import Matter from "matter-js";
import { useState, type PropsWithChildren } from "react";

import { useDeepCompareEffect } from "react-use";
import { EngineContext } from "./EngineContext";

//

const log = debug("@1.framework:matter4react:Engine");

//

export function Engine({ options, children }: Props) {
  const [engine, setEngine] = useState<Matter.Engine | null>(null);

  useDeepCompareEffect(() => {
    log("+ useDeepCompareEffect", { options });
    if (!options) throw new Error("0_o : options not found.");
    const instance = Matter.Engine.create(options);
    setEngine(instance);

    return () => {
      log("- useDeepCompareEffect", { options });
      Matter.World.clear(instance.world, false);
      Matter.Engine.clear(instance);
      setEngine(null);
    };
  }, [options]);

  log("!", engine ? { engineId: engine.world.id } : { engine });
  if (!engine) return null;

  return (
    <EngineContext.Provider value={engine}>{children}</EngineContext.Provider>
  );
}

//

type Props = PropsWithChildren<{
  options?: Matter.IEngineDefinition;
}>;

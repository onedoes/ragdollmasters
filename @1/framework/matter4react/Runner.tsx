//

import { useEngine } from "@1.framework/matter4react";
import debug from "debug";
import Matter from "matter-js";
import { useDeepCompareEffect } from "react-use";

//

const log = debug("@1.framework:matter4react:Runner");

//

export function Runner({ options = {} }: Props) {
  log("!");
  const engine = useEngine();

  useDeepCompareEffect(() => {
    log("+ useDeepCompareEffect", [engine.world.id, options]);
    const instance = Matter.Runner.create(options);
    Matter.Runner.run(instance, engine);
    return () => {
      log("- useDeepCompareEffect", { instance });
      Matter.Runner.stop(instance);
    };
  }, [engine.world.id, options]);

  return null;
}

//

type Props = {
  options?: Matter.IRunnerOptions;
};

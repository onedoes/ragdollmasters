//

import { useEngine } from "@1.framework/matter4react";
import debug from "debug";
import { Runner } from "matter-js";
import { useEffect, useRef, useState } from "react";

//

const log = debug("@1.framework:matter4react:RunnerWrapper");

//

function RunnerWrapper({
  options = {},
}: {
  options?: Parameters<typeof Runner.create>[0];
}) {
  log("! render..");
  const engine = useEngine();
  const [, setRunner] = useState<Runner | null>(null);
  const optionsRef = useRef(options);

  // useEffect(() => {
  //   log("+ useEffect.", { wid: engine.world.id });
  //   return () => {
  //     log("- useEffect..", { wid: engine.world.id });
  //   };
  // }, [engine, options]);
  useEffect(() => {
    log("+ useLayoutEffect.", { wid: engine.world.id });
    const instance = Runner.create(options);
    Runner.run(instance, engine);
    setRunner(instance);
    return () => {
      log("- useLayoutEffect.", { wid: engine.world.id });
      Runner.stop(instance);
      setRunner(null);
    };
  }, [engine, optionsRef]);

  return null;
}

export { RunnerWrapper as Runner };

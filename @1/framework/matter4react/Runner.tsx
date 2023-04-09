//

import { useEngine } from "@1.framework/matter4react";
import { Runner } from "matter-js";
import { useEffect, useRef, useState } from "react";

//

function RunnerWrapper({
  options = {},
}: {
  options?: Parameters<typeof Runner.create>[0];
}) {
  const engine = useEngine();
  const [, setRunner] = useState<Runner | null>(null);
  const optionsRef = useRef(options);

  useEffect(() => {
    const instance = Runner.create(options);
    Runner.run(instance, engine);
    setRunner(instance);
    return () => {
      Runner.stop(instance);
      setRunner(null);
    };
  }, [engine.world.id, optionsRef]);

  return null;
}

export { RunnerWrapper as Runner };

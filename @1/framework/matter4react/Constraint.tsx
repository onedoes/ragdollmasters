//

import debug from "debug";
import Matter from "matter-js";
import { forwardRef, useMemo } from "react";
import { Composite } from "./Composite";

//

const log = debug("@1.framework:matter4react:Constraint");

//

export const Constraint = forwardRef<Matter.Constraint, Props>(
  function Constraint({ options }, ref) {
    log("! render", options);
    const { bodyA, bodyB } = options;
    if (!bodyA) return null;
    if (!bodyB) return null;

    const object = useMemo(
      () => Matter.Constraint.create(options),
      [...Object.values(options)]
    );

    return <Composite.add object={object} ref={ref} />;
  }
);

//

type Options = Parameters<typeof Matter.Constraint.create>[0];
type Props = { options: Options }; //{ bodyA: Options["bodyA"] | null; bodyB: Options["bodyB"] | null };

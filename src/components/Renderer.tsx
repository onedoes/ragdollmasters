//

import { MatterCollisionEventsPlugin } from "@1.framework/matter-collision-events";
import { Engine, Render, Runner } from "@1.framework/matter4react";
import { WorldComposite } from "@1.framework/matter4react/WorldComposite";
import debug from "debug";
import defaults from "defaults";
import Matter from "matter-js";
import { type ComponentProps, type PropsWithChildren } from "react";

//

Matter.Plugin.register(MatterCollisionEventsPlugin);
Matter.use(MatterCollisionEventsPlugin.name);

//

const log = debug("@:components:Renderer");

//

export function Renderer({
  children,
  engine = {},
  render = {},
  runner = {},
}: Props) {
  log("!");

  const engineOps: Matter.IEngineDefinition = defaults(
    engine as Record<string, unknown>,
    {
      gravity: { x: 0, y: 1 / 10, scale: 1 / 1_000 },
      constraintIterations: 20,
    } satisfies Matter.IEngineDefinition
  );

  const renderOps = defaults(render as Record<string, unknown>, {
    // bounds: {
    //   min: {
    //     x: 0,
    //     y: 0,
    //   },
    //   max: {
    //     x: 6666,
    //     y: 6666,
    //   },
    // },

    options: {
      background: "#111",

      // hasBounds: true,
      // showSleeping: true,
      // showVelocity: true,

      // showCollisions: true,
      showDebug: true,
      wireframes: false,
      // showBounds: true,
    },
  } satisfies ComponentProps<typeof Render>["options"]);

  const runnerOps: Matter.IRunnerOptions = defaults(
    runner as Record<string, unknown>,
    { enabled: true } satisfies Matter.IRunnerOptions
    // { enabled: false } satisfies Matter.IRunnerOptions
  );

  return (
    <Engine options={engineOps}>
      <Render options={renderOps}>
        <WorldComposite>{children}</WorldComposite>
      </Render>
      <Runner options={runnerOps} />
    </Engine>
  );
}

//

type Props = PropsWithChildren<{
  engine?: Matter.IEngineDefinition;
  render?: Matter.IRendererOptions;
  runner?: Matter.IRunnerOptions;
}>;

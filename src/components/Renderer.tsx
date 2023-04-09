//

import { Engine, Render, Runner } from "@1.framework/matter4react";
import { WorldCompositeProvider } from "@1.framework/matter4react/Composite";
import {
  createContext,
  type ComponentProps,
  type PropsWithChildren,
} from "react";

//

const SIZE = 666;
const DEPTH = 66;

const MATTER_ENGINE_OPTIONS: NonNullable<
  ComponentProps<typeof Engine>["options"]
> = {
  gravity: { x: 0, y: 1, scale: 0.0001 },
};

const MATTER_RENDER_OPTIONS: NonNullable<
  ComponentProps<typeof Render>["options"]
> = {
  background: "#666",
  hasBounds: true,
  showPerformance: true,
  wireframes: false,
};

const MATTER_RUNNER_OPTIONS: NonNullable<
  ComponentProps<typeof Runner>["options"]
> = {};

//

export const GameContext = createContext({});

export function Renderer({ children }: PropsWithChildren) {
  return (
    <Engine options={MATTER_ENGINE_OPTIONS}>
      <Render options={MATTER_RENDER_OPTIONS}>
        <WorldCompositeProvider>{children}</WorldCompositeProvider>
      </Render>
      <Runner options={MATTER_RUNNER_OPTIONS} />
    </Engine>
  );
}

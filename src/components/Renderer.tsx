//

// import { E } from "@1.framwork/"
import { Engine, Render, Runner } from "@1.framework/matter4react";
import { WorldCompositeProvider } from "@1.framework/matter4react/Composite";
import Debug from "debug";
import {
  createContext,
  type ComponentProps,
  type PropsWithChildren,
} from "react";

//

const debug = Debug("@1.framework:matter4react:Renderer");

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
  debug("! render.");

  return (
    <Engine options={MATTER_ENGINE_OPTIONS}>
      <Render options={MATTER_RENDER_OPTIONS}>
        <WorldCompositeProvider>{children}</WorldCompositeProvider>
      </Render>
      <Runner options={MATTER_RUNNER_OPTIONS} />
    </Engine>
  );
}
// export class Renderer2 extends Component<PropsWithChildren> {
//   engineRef = createRef<MatterEngine>() as MutableRefObject<MatterEngine>;

//   override componentDidMount(): void {
//     const { current: engine } = this.engineRef;
//     debug("< Renderer.componentDidMount.", { engine });
//   }

//   override componentWillUnmount(): void {
//     const { current: engine } = this.engineRef;
//     debug("> Renderer.componentWillUnmount.", { engine });
//   }

//   override render() {
//     const { children } = this.props;
//     debug("! render.");

//     return (
//       <Engine options={MATTER_ENGINE_OPTIONS}>
//         <Render
//           options={{ background: "#666", wireframes: false, hasBounds: true }}
//         />
//         <RRunner />
//         {children}
//       </Engine>
//     );
//   }
// }

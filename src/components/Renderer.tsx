//

// import { E } from "@1.framwork/"
import { Engine } from "@1.framework/matter4react";
import type { IEngineDefinition } from "matter-js";
import { createContext, type PropsWithChildren } from "react";

//

const SIZE = 666;
const DEPTH = 66;
const MATTER_ENGINE_OPTIONS: IEngineDefinition = {
  gravity: { x: 0, y: 1, scale: 0.0001 },
};

//

export const GameContext = createContext({});

export function Renderer({ children }: PropsWithChildren) {
  // const [width, height] = useWindowViewport();
  // const viewportRef = useRef();
  // const [playerPosition, setPlayerPosition] = useState(
  //   new Point(SIZE / 2, SIZE / 2)
  // );
  // useKey("ArrowUp", () =>
  //   setPlayerPosition(new Point(playerPosition.x, playerPosition.y - 1))
  // );
  // return (
  //   <Stage width={width} height={height} options={STAGE_OPTIONS}>
  //     <PixiViewport
  //       screenWidth={width}
  //       screenHeight={height}
  //       worldWidth={SIZE}
  //       worldHeight={SIZE}
  //     >
  //       <Stadium></Stadium>
  //       <Head x={playerPosition.x} y={playerPosition.y}></Head>
  //     </PixiViewport>
  //   </Stage>
  // );
  return (
    <Engine options={MATTER_ENGINE_OPTIONS}>
      {/* <Walls x={0} y={0} width={width} height={height} wallWidth={25} /> */}
      {children}
    </Engine>
  );
}

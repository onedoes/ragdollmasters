//

import { PixiComponent, Stage, useApp } from "@pixi/react";
import { Viewport, type IViewportOptions } from "pixi-viewport";
import { Application, Graphics, Point } from "pixi.js";
import {
  createContext,
  forwardRef,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

import { useKey } from "react-use";

//

const SIZE = 666;
const DEPTH = 66;

const STAGE_OPTIONS = {
  antialias: true,
  autoDensity: true,
  backgroundAlpha: 0,
};
type ViewportPluginNames = "drag" | "pinch" | "wheel" | "decelerate";
const PixiViewportComponent = PixiComponent("Viewport", {
  create(
    props: PropsWithChildren<
      Partial<IViewportOptions> & {
        app: Application;
      }
    >
  ) {
    const { app, events, children, ...viewportProps } = props;

    const viewport = new Viewport({
      ticker: props.app.ticker,
      events: events || props.app.renderer.events,
      ...viewportProps,
    });

    // console.log({ viewport });
    // viewport.clampZoom({
    //   maxHeight: SIZE,
    //   maxWidth: SIZE,
    //   minHeight: DEPTH,
    //   minWidth: DEPTH,
    // });
    // viewport.clamp({ direction: "all", underflow: "center" });

    // // activate plugins

    // plugins.forEach((plugin) => {
    //   viewport[plugin]();
    // });

    viewport
      .drag()
      .pinch()
      .wheel()
      .clamp({ direction: "all" })
      .clampZoom({ minScale: 0.5, maxScale: 1 })
      .decelerate();

    return viewport;
  },
  applyProps(viewport, _oldProps, _newProps) {
    const {
      plugins: oldPlugins,
      children: oldChildren,
      ...oldProps
    } = _oldProps;
    const {
      plugins: newPlugins,
      children: newChildren,
      ...newProps
    } = _newProps;

    // Object.keys(newProps).forEach((p) => {
    //   if (oldProps[p] !== newProps[p]) {
    //     viewport[p] = newProps[p];
    //   }
    // });
  },
  didMount() {
    console.log("viewport mounted");
  },
});
const PixiViewport = forwardRef<
  Viewport,
  PropsWithChildren<Partial<IViewportOptions>>
>(function PixiViewport({ children, ...props }, ref) {
  const app = useApp();
  return (
    <PixiViewportComponent ref={ref} app={app} {...props}>
      {children}
    </PixiViewportComponent>
  );
});

const Head = PixiComponent<{ x: number; y: number }, Graphics>("Head", {
  create: () => new Graphics(),
  applyProps: (ins, _, props) => {
    ins.beginFill("#000");
    ins.drawCircle(props.x, props.y, 33);
    ins.endFill();
  },
});

const Stadium = PixiComponent<{}, Graphics>("Stadium", {
  create: () => new Graphics(),
  applyProps: (ins, _, props) => {
    ins.beginFill("#f0f");
    ins.moveTo(DEPTH, DEPTH);
    ins.lineTo(SIZE - DEPTH, DEPTH);
    ins.lineTo(SIZE - DEPTH, SIZE - DEPTH);
    ins.lineTo(DEPTH, SIZE - DEPTH);
    ins.closePath();
    ins.endFill();
  },
});

//
export const GameContext = createContext({});

export function useWindowViewport() {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight] as [
    number,
    number
  ]);

  const listener = () => setSize([window.innerWidth, window.innerHeight]);

  useEffect(() => {
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, []);

  return size;
}
export function Renderer() {
  const [width, height] = useWindowViewport();
  const viewportRef = useRef();
  const [playerPosition, setPlayerPosition] = useState(
    new Point(SIZE / 2, SIZE / 2)
  );
  useKey("ArrowUp", () =>
    setPlayerPosition(new Point(playerPosition.x, playerPosition.y - 1))
  );
  return (
    <Stage width={width} height={height} options={STAGE_OPTIONS}>
      <PixiViewport
        screenWidth={width}
        screenHeight={height}
        worldWidth={SIZE}
        worldHeight={SIZE}
      >
        <Stadium></Stadium>
        <Head x={playerPosition.x} y={playerPosition.y}></Head>
      </PixiViewport>
    </Stage>
  );
}

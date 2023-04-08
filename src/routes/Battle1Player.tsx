//

import { Renderer } from "@/components/Renderer";
import { useWindowViewport } from "@/components/useWindowViewport";
import { useEngine } from "@1.framework/matter4react";
import {
  Bodies,
  Composite,
  Render,
  Runner,
  type IRendererOptions,
  type IRunnerOptions,
} from "matter-js";
import {
  useLayoutEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react";
import { useBoolean, useInterval } from "react-use";

//

function RRender({ options = {} }: { options?: IRendererOptions }) {
  const elementRef = useRef<HTMLCanvasElement>(null);
  const [render, setRender] = useState<Render>();
  const engine = useEngine();

  useLayoutEffect(() => {
    console.log("> Render.useLayoutEffect.", { wid: engine.world.id });
    const { current: canvas } = elementRef;
    if (!canvas) throw new Error("0_o : <canvas> not found.");

    const render = Render.create({
      canvas,
      engine,
      options,
    });
    setRender(render);
    Render.run(render);

    Render.lookAt(render, {
      min: { x: 0, y: 0 },
      max: { x: 800, y: 600 },
    });
    return () => {
      console.log("< Render.useLayoutEffect.", { wid: engine.world.id });
      return Render.stop(render);
    };
  }, [elementRef, engine, options]);

  const screenSize = useWindowViewport();
  useLayoutEffect(() => {
    render;
  }, [screenSize]);

  return <canvas ref={elementRef} />;
}
function RRunner({ options = {} }: { options?: IRunnerOptions }) {
  const engine = useEngine();

  useLayoutEffect(() => {
    console.log("> Runner.useLayoutEffect.", { wid: engine.world.id });
    const runner = Runner.create(options);
    Runner.run(runner, engine);
    return () => {
      console.log("< Runner.useLayoutEffect.", { wid: engine.world.id });
      Runner.stop(runner);
    };
  }, [engine, options]);

  return null;
}

function LOL() {
  const engine = useEngine();
  const world = engine.world;
  const WallBodyStyle = { fillStyle: "#111" };
  const Player1BodyStyle = { fillStyle: "#eee" };

  useLayoutEffect(() => {
    console.log("> LOL.useLayoutEffect...", {
      wid: world.id,
      bodies_count: world.bodies,
      world,
    });
    console.log("---");
    const playerHead = Composite.add(
      world,
      Bodies.circle(50, 50, 15, { restitution: 1, render: Player1BodyStyle })
    );
    // return () => {
    //   console.log("destroy previous worlddd");
    //   Composite.remove(world, playerHead);
    // };
    return () => {
      console.log("< LOL.useLayoutEffect...", { wid: engine.world.id });
      Composite.remove(world, playerHead);
    };
  }, [world.id]);
  //   const walls = Composite.add(world, [
  //     // walls
  //     Bodies.rectangle(400, 0, 800, 50, {
  //       isStatic: true,
  //       render: WallBodyStyle,
  //     }),
  //     Bodies.rectangle(400, 600, 800, 50, {
  //       isStatic: true,
  //       render: WallBodyStyle,
  //     }),
  //     Bodies.rectangle(800, 300, 50, 600, {
  //       isStatic: true,
  //       render: WallBodyStyle,
  //     }),
  //     Bodies.rectangle(0, 300, 50, 600, {
  //       isStatic: true,
  //       render: WallBodyStyle,
  //     }),
  //   ]);

  //   const playerHead = Composite.add(
  //     world,
  //     Bodies.circle(50, 50, 15, { restitution: 1, render: Player1BodyStyle })
  //   );
  //   return () => {
  //     console.log("omposite.remove(world, walls)  ");
  //     // Composite.remove(world, walls);
  //     console.log("omposite.remove(world, playerHead)  ");
  //     // Composite.remove(world, playerHead);
  //   };
  // }, []);
  return null;
}

export function LeveL1() {
  const [isVisible, toggleIsVisible] = useBoolean(false);
  useInterval(() => {
    toggleIsVisible();
  }, 1000);
  return (
    <Renderer>
      <>{isVisible ? <LOL /> : null}</>
    </Renderer>
  );
}

export function Battle1Player({
  ...props
}: ComponentPropsWithoutRef<"section">) {
  // const [app, setApp] = useState<Application>();
  // const { sendN } = useContext(GameContext);
  // const viewport = useOnResize();
  // // console.log(app?.resizeTo);
  // useLayoutEffect(() => {
  //   const [width, height] = viewport;
  //   app?.renderer?.resize(width, height);
  //   app?.resize();
  // }, [app, viewport]);

  // const blurFilter = useMemo(() => new BlurFilter(0), []);

  return (
    <div className="h-100% overflow-hidden">
      <LeveL1 />
    </div>
  );
}

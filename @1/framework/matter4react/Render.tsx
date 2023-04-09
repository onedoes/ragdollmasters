import { RenderContext, useEngine } from "@1.framework/matter4react";
import debug from "debug";
import { Render } from "matter-js";
import { useEffect, useRef, useState, type PropsWithChildren } from "react";

//

const log = debug("@1.framework:matter4react:RenderWrapper");

//

export function RenderWrapper({
  children,
  options = {},
}: PropsWithChildren<Props>) {
  // log("! render.");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [render, setRender] = useState<Render>(null as any);
  const engine = useEngine();

  // useEffect(() => {
  //   log("< useEffect.", { wid: engine.world.id });
  //   return () => {
  //     log("> useEffect.", { wid: engine.world.id });
  //   };
  // }, [engine.world.id, canvasRef.current, options]);
  useEffect(() => {
    log("+ useEffect.", { wid: engine.world.id });
    const { current: canvas } = canvasRef;
    if (!canvas) throw new Error("0_o : <canvas> not found.");

    const instance = Render.create({
      canvas,
      engine,
      options,
    });
    Render.run(instance);

    Render.lookAt(instance, {
      min: { x: 0, y: 0 },
      max: { x: 800, y: 600 },
    });

    setRender(instance);
    // log("! setRender(render)", instance);

    return () => {
      log("- useEffect.");
      // const { current: render } = renderRef;
      // if (!canvas) throw new Error("0_o : <canvas> not found.");
      Render.stop(instance);
    };
  }, [engine]);

  // const screenSize = useWindowViewport();
  // useLayoutEffect(() => {
  //   render;
  log("! render.", { canvasRef });
  // }, [screenSize]);
  return (
    <RenderContext.Provider value={render}>
      <canvas ref={canvasRef}>{render ? children : null}</canvas>
    </RenderContext.Provider>
  );
}

export { RenderWrapper as Render };

//

type Props = {
  options?: Parameters<typeof Render.create>[0]["options"];
};

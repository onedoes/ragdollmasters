import { RenderContext, useEngine } from "@1.framework/matter4react";
import debug from "debug";
import Matter from "matter-js";
import { useRef, useState, type PropsWithChildren } from "react";
import { useDeepCompareEffect } from "react-use";

//

const log = debug("@1.framework:matter4react:Render");

//

export function Render({ children, options = {} }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [render, setRender] = useState<Matter.Render | null>(null);
  const engine = useEngine();
  log("!", { engineId: engine.world.id });

  useDeepCompareEffect(() => {
    log("+ useDeepCompareEffect", [
      canvasRef.current,
      engine.world.id,
      options,
      setRender,
    ]);

    const { current: canvas } = canvasRef;
    if (!canvas) throw new Error("0_o : <canvas> not found..");

    const instance = Matter.Render.create({
      ...options,
      canvas,
      // https://github.com/liabru/matter-js/issues/241
      // @ts-ignore
      engine: undefined,
    });

    // @ts-ignore
    instance.engine = engine;
    setRender(instance);
    Matter.Render.run(instance);
    return () => {
      log("- useDeepCompareEffect", { instance });
      Matter.Render.stop(instance);
      setRender(null);
    };
  }, [canvasRef.current, engine.world.id, options, setRender]);

  return (
    <>
      <canvas ref={canvasRef}></canvas>
      {render && (
        <RenderContext.Provider value={render}>
          {children}
        </RenderContext.Provider>
      )}
    </>
  );
}

//

type Props = PropsWithChildren<{
  options?: Omit<Matter.IRenderDefinition, "engine" | "canvas">;
}>;

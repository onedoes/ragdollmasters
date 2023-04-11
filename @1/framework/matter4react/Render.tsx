import { RenderContext, useEngine } from "@1.framework/matter4react";
import { Render } from "matter-js";
import { useEffect, useRef, useState, type PropsWithChildren } from "react";

//

export function RenderWrapper({
  children,
  options = {},
}: PropsWithChildren<Props>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [render, setRender] = useState<Render | null>(null);
  const engine = useEngine();

  useEffect(() => {
    const { current: canvas } = canvasRef;
    if (!canvas) throw new Error("0_o : <canvas> not found.");
    if (render) return;

    const instance = Render.create({
      canvas,
      options,
      engine,
    });

    setRender(instance);
  }, [engine.world.id, canvasRef.current, setRender]);

  useEffect(() => {
    if (!render) return;
    Render.run(render);
    return () => {
      Render.stop(render);
      setRender(null);
    };
  }, [render]);

  return (
    <>
      <canvas ref={canvasRef}></canvas>
      {render ? (
        <RenderContext.Provider value={render}>
          {children}
        </RenderContext.Provider>
      ) : null}
    </>
  );
}

export { RenderWrapper as Render };

//

type Props = {
  options?: Parameters<typeof Render.create>[0]["options"];
};

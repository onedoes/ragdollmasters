//

import { useRender, useRenderEvent } from "@1.framework/matter4react";
import debug from "debug";
import Matter, { Body, Vector } from "matter-js";
import { useLayoutEffect } from "react";
import { useEvent } from "react-use";

//

const log = debug("@1.framework:matter4react:Viewport");

//

const padding = Vector.create(90, 90);
export function Viewport({ extents: _extents, protagonists }: Props) {
  log("!");
  const render = useRender();

  const extents = _extents ?? { min: { x: 0, y: 0 }, max: { x: 0, y: 0 } };
  const resize = () => {
    const [width, height] = [window.innerWidth, window.innerHeight];
    // TODO(douglasduteil): remove this when Render.setSize is released
    // https://github.com/liabru/matter-js/commit/fc0583975d07f74a7c45e7a84bd3a94b3a2068be
    const size = Math.min(width, height);
    render.options.width = size;
    render.options.height = size;

    render.canvas.width = size;
    render.canvas.height = size;
  };
  useEvent("resize", resize);
  useLayoutEffect(resize, [render]);

  useRenderEvent(
    "beforeRender",
    () => {
      Matter.Render.lookAt(render, protagonists, padding, true);
    },
    [render, protagonists]
  );
  // console.log(protagonists);
  // useEffect(() => {
  //   const beforeRender = () => {
  //     // Render.lookAt(render, protagonists, padding, true);
  //   };
  //   Events.on(render, "beforeRender", beforeRender);

  //   return () => Events.off(render, "beforeRender", beforeRender);
  // }, [render]);
  // useEvent(
  //   "beforeRender",
  //   () => {
  //     log("beforeRender", protagonists);
  //     if (!protagonists.length) {
  //       Matter.Render.lookAt(render, protagonists, padding, true);
  //       return;
  //     }
  //   },
  //   []
  // );
  return null;
}

//

type Props = { extents?: { min: Vector; max: Vector }; protagonists: Body[] };

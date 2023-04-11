//

import { useRender } from "@1.framework/matter4react";
import { Body, Events, Vector } from "matter-js";
import { useEffect } from "react";

//

const padding = Vector.create(50, 50);
export function Viewport({ extents: _extents, protagonists }: Props) {
  const render = useRender();
  const extents = _extents ?? { min: { x: 0, y: 0 }, max: { x: 0, y: 0 } };
  // console.log(protagonists);
  useEffect(() => {
    const beforeRender = () => {
      // Render.lookAt(render, protagonists, padding, true);
    };
    Events.on(render, "beforeRender", beforeRender);

    return () => Events.off(render, "beforeRender", beforeRender);
  }, [render]);
  return null;
}

//

type Props = { extents?: { min: Vector; max: Vector }; protagonists: Body[] };

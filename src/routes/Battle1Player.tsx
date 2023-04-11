//

import { GameContext } from "@/GameContext";
import { Ragdoll } from "@/components/Ragdoll";
import { Renderer } from "@/components/Renderer";
import { Viewport } from "@/components/Viewport";
import { PlayerInput, SurroundingWalls } from "@1.framework/matter4react";
import debug from "debug";
import { Body, Vector } from "matter-js";
import { useContext, useRef, type ComponentPropsWithoutRef } from "react";
import { useKeyPressEvent } from "react-use";

//

const log = debug("@1.framework:matter4react:LeveL1");

//

const SPEED = 10 / 66;

export function LeveL1() {
  const protagonists = useRef<Body[]>([]);
  const playerBody = useRef<Body>(null);

  const onMove = (vector: Vector) => {
    if (!playerBody.current) return;
    const { current: body } = playerBody;
    const force = Vector.sub(body.velocity, Vector.mult(vector, SPEED));

    Body.setVelocity(body, force);
  };

  return (
    <Renderer>
      <PlayerInput map="gamepad" event="move" call={onMove} />
      <Viewport
        protagonists={protagonists.current}
        // bounds={{
        //   min: { x: -300, y: -300 },
        //   max: { x: 1100, y: 900 },
        // }}
      />
      <SurroundingWalls
        thick={10}
        options={{ render: { fillStyle: "#333" } }}
      />
      <Ragdoll x={222} y={222} ref={playerBody} />
    </Renderer>
  );
}

export function Battle1Player({
  ...props
}: ComponentPropsWithoutRef<"section">) {
  // const [app, setApp] = useState<Application>();
  const { sendN } = useContext(GameContext);
  // const viewport = useOnResize();
  // // console.log(app?.resizeTo);
  // useLayoutEffect(() => {
  //   const [width, height] = viewport;
  //   app?.renderer?.resize(width, height);
  //   app?.resize();
  // }, [app, viewport]);

  // const blurFilter = useMemo(() => new BlurFilter(0), []);

  useKeyPressEvent("Escape", sendN("BACK"));

  return (
    <section className="h-100% overflow-hidden">
      <LeveL1 />
    </section>
  );
}

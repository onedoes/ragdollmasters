//

import { Renderer } from "@/components/Renderer";
import { Circle, SurroundingWalls } from "@1.framework/matter4react";
import { Body } from "matter-js";
import { type ComponentPropsWithoutRef } from "react";

//

export function LeveL1() {
  return (
    <Renderer>
      <SurroundingWalls
        thick={66}
        options={{ render: { fillStyle: "#333" } }}
      />

      <Circle
        x={50}
        y={55}
        radius={20}
        options={{
          // mass: 1,
          angle: Math.PI * Math.random(),
          friction: 0,
          frictionAir: 0,
          restitution: 1,
          render: { fillStyle: "#00F" },
        }}
        ref={(body) => {
          if (!body) return;
          body.label = "Blue";
          Body.setVelocity(body, { x: -5, y: 0 });
        }}
      />

      <Circle
        x={400}
        y={25}
        radius={15}
        options={{ render: { fillStyle: "#F0F" } }}
        ref={(body) => {
          if (!body) return;
          body.label = "Pinky";
        }}
      />
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
    <section className="h-100% overflow-hidden">
      <LeveL1 />
    </section>
  );
}

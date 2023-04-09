//

import { Renderer } from "@/components/Renderer";
import { Circle, SurroundingWalls, useEngine } from "@1.framework/matter4react";
import { Bodies, Body, Composite } from "matter-js";
import { useLayoutEffect, type ComponentPropsWithoutRef } from "react";
import { useBoolean, useInterval } from "react-use";

//

function LOL({ x, y }: { x: number; y: number }) {
  const engine = useEngine();
  const { world } = engine;
  const WallBodyStyle = { fillStyle: "#111" };
  const Player1BodyStyle = { fillStyle: "#eee" };

  useLayoutEffect(() => {
    console.log("+ LOL.useLayoutEffect..", {
      wid: world.id,
      bodies_count: world.bodies,
      world,
    });
    console.log("---");
    const playerHead = Bodies.circle(x, y, 15, {
      restitution: 1,
      render: Player1BodyStyle,
    });
    Composite.add(world, playerHead);

    return () => {
      console.log("- LOL.useLayoutEffect...", {
        wid: engine.world.id,
        world,
        playerHead,
      });
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
  // useInterval(() => {
  //   console.log("---");
  //   toggleIsVisible();
  // }, 6_666);

  // window.toggleIsVisible = toggleIsVisible;

  return (
    <Renderer>
      <SurroundingWalls thick={50} />

      {isVisible ? (
        <Circle
          x={200}
          y={10}
          radius={15}
          options={{ render: { fillStyle: "#F00" } }}
        />
      ) : null}
      <Circle
        x={500}
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
      <LOL x={300} y={100} />
    </Renderer>
  );
}

export function LeveL2() {
  const [isVisible, toggleIsVisible] = useBoolean(false);
  useInterval(() => {
    toggleIsVisible();
  }, 4444);

  return (
    <Renderer>
      {isVisible ? <LOL x={60} y={10} /> : null}
      <LOL x={50} y={50} />
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
  const [nextLevel, toggleIsVisible] = useBoolean(false);
  useInterval(() => {
    toggleIsVisible();
  }, 11_1111);

  return (
    <div className="h-100% overflow-hidden">
      <LeveL1 />
    </div>
  );
}

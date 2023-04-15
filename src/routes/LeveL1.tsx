import { Viewport } from "@/components/Viewport";
import { createStickman } from "@/utils/createStickman";
import {
  Composite,
  PlayerInput,
  SurroundingWalls,
  useEventCollisionStart,
} from "@1.framework/matter4react";
import Matter, { Body } from "matter-js";
import { useEffect, useMemo, useRef, useState } from "react";
import { defaultCollisionBehavior } from "../utils/defaultCollisionBehavior";
import { moveBody } from "../utils/moveBody";
import { log } from "./Battle1Player";

export const SPEED = 1 / 5;
export const SIZE = 1000;
export function LeveL1() {
  log("!");

  const _protagonists = useRef<Body[]>([]);
  const [protagonists, setProtagonists] = useState<Body[]>([]);
  const [player, setPlayer] = useState<Matter.Composite>();
  const [opponent, setOpponent] = useState<Matter.Composite>();
  const playerHead = useRef<Body>();
  const opponentBody = useRef<Body>(null);

  //

  useEffect(() => {
    const stickman_left = createStickman((1 / 3) * SIZE, (1 / 2) * SIZE, {
      render: { fillStyle: "#ddd" },
    });
    const stickman_right = createStickman((2 / 3) * SIZE, (1 / 2) * SIZE, {
      scale: 2,
      render: { fillStyle: "#333" },
    });

    setPlayer(stickman_left);
    setOpponent(stickman_right);
    playerHead.current = stickman_left.bodies.at(0);
    setProtagonists([...stickman_right.bodies, ...stickman_left.bodies]);
  }, []);

  const onMove = useMemo(() => {
    if (!playerHead.current) return () => {};

    return moveBody(playerHead.current);
  }, [playerHead.current]);

  //

  useEventCollisionStart(defaultCollisionBehavior, [playerHead, opponentBody]);

  return (
    <>
      <Viewport protagonists={protagonists} />
      <PlayerInput map="gamepad" event="move" call={onMove} />
      <SurroundingWalls
        thick={SIZE}
        bounds={Matter.Bounds.create([
          { x: 0, y: 0 },
          { x: SIZE, y: SIZE },
        ])}
        options={{ render: { fillStyle: "#333" } }}
      />
      {player && <Composite.add object={player} />}
      {opponent && <Composite.add object={opponent} />}
    </>
  );
}

//

import { Viewport } from "@/components/Viewport";
import { useImpactHandler } from "@/lib/handleImpacts";
import { moveBody } from "@/lib/moveBody";
import { useAIMoves } from "@/lib/useAIMoves";
import { useBloodyParticules } from "@/lib/useBloodyParticules";
import { createStickman } from "@/utils/createStickman";
import {
  Composite,
  PlayerInput,
  SurroundingWalls,
} from "@1.framework/matter4react";
import debug from "debug";
import Matter, { Body } from "matter-js";
import { useEffect, useMemo, useRef, useState } from "react";

//

export const log = debug("@:routes:LeveL1");

//

export const SPEED = 1 / 5;
export const SIZE = 1000;
export function LeveL1() {
  log("!");

  const [protagonists, setProtagonists] = useState<Body[]>([]);
  const [impactComposites, setImpactComposites] = useState<Matter.Composite[]>(
    []
  );
  const [player, setPlayer] = useState<Matter.Composite>();
  const [opponent, setOpponent] = useState<Matter.Composite>();
  const playerHead = useRef<Body>();
  const opponentHead = useRef<Body>();

  //

  useEffect(() => {
    const stickman_left = createStickman((1 / 3) * SIZE, (1 / 2) * SIZE, {
      render: { fillStyle: "#ddd" },
    });
    const stickman_right = createStickman((2 / 3) * SIZE, (1 / 2) * SIZE, {
      scale: 1,
      render: { fillStyle: "#333" },
    });

    setPlayer(stickman_left);
    setOpponent(stickman_right);

    playerHead.current = stickman_left.bodies.at(0);
    opponentHead.current = stickman_right.bodies.at(0);

    setProtagonists([...stickman_right.bodies, ...stickman_left.bodies]);
    setImpactComposites([stickman_left, stickman_right]);
  }, []);

  const onMove = useMemo(() => {
    if (!playerHead.current) return () => {};

    return moveBody(playerHead.current);
  }, [playerHead.current]);

  //

  useImpactHandler(impactComposites, [player?.id, opponent?.id]);
  useBloodyParticules(impactComposites, [player?.id, opponent?.id]);
  useAIMoves(opponentHead, playerHead);

  //

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

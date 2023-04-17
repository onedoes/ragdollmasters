import { useEventBeforeUpdate } from "@1.framework/matter4react";
import debug from "debug";
import { Body, Engine, Vector, type IEventTimestamped } from "matter-js";
import { type MutableRefObject } from "react";
import { moveBody } from "./moveBody";

//

export const log = debug("@:lib:useAIMoves");

//
const SPEED = 15;
export function useAIMoves(
  headRef: MutableRefObject<Body | undefined>,
  playerRef: MutableRefObject<Body | undefined>
) {
  // const onMove = useCallback(moveBody(headRef.current), [
  //   headRef.current,
  //   playerRef.current,
  // ]);

  useEventBeforeUpdate(
    (event: IEventTimestamped<Engine>) => {
      const { current: head } = headRef;
      const { current: player } = playerRef;
      if (!(head && player)) return;

      const direction = Vector.normalise(
        Vector.sub(head.position, player.position)
      );

      moveBody(head)(event, direction, SPEED);
    },
    [headRef.current, playerRef.current]
  );
}

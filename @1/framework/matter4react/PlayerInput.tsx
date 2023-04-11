//

import { Vector } from "matter-js";
import { useEventBeforeUpdate } from "./useEventBeforeUpdate";
import { useKeyPressRef } from "./useKeyPressRef";

//

export function PlayerInput({ map, event, call }: Props) {
  const ArrowUp = useKeyPressRef("ArrowUp");
  const ArrowDown = useKeyPressRef("ArrowDown");
  const ArrowLeft = useKeyPressRef("ArrowLeft");
  const ArrowRight = useKeyPressRef("ArrowRight");

  useEventBeforeUpdate(() => {
    let vector = Vector.create();
    // TODO(douglasduteil): You can do better then 4 if here bro...
    if (ArrowUp.current) vector = Vector.add(vector, { x: 0, y: 1 });
    if (ArrowDown.current) vector = Vector.add(vector, { x: 0, y: -1 });
    if (ArrowLeft.current) vector = Vector.add(vector, { x: 1, y: 0 });
    if (ArrowRight.current) vector = Vector.add(vector, { x: -1, y: 0 });
    call(vector);
  }, [map, event, call]);

  return null;
}

//

type Props = {
  map: string;
  event: string;
  call: (vector: Vector) => void;
};

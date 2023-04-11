import { useRef } from "react";
import useKey from "react-use/lib/useKey";

//
export function useKeyPressRef(key: Parameters<typeof useKey>[0]) {
  const ref = useRef(false);
  useKey(
    key,
    () => {
      ref.current = true;
    },
    { event: "keydown" },
    [ref]
  );
  useKey(
    key,
    () => {
      ref.current = false;
    },
    { event: "keyup" },
    [ref]
  );

  return ref;
}

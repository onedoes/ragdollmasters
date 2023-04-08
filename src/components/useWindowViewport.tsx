import { useEffect, useState } from "react";

export function useWindowViewport() {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight] as [
    number,
    number
  ]);

  const listener = () => setSize([window.innerWidth, window.innerHeight]);

  useEffect(() => {
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, []);

  return size;
}

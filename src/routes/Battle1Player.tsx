//

import { GameContext } from "@/GameContext";
import { Renderer } from "@/components/Renderer";
import debug from "debug";
import { useContext, type ComponentPropsWithoutRef } from "react";
import { useKeyPressEvent } from "react-use";
import { LeveL1 } from "./LeveL1";

//

export const log = debug("@:routes:Battle1Player");

//

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
    <section className="h-100% overflow-hidden grid items-center justify-center">
      <Renderer>
        <LeveL1 />
      </Renderer>
    </section>
  );
}

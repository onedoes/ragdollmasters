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
  const { sendN } = useContext(GameContext);

  useKeyPressEvent("Escape", sendN("BACK"));

  return (
    <section className="h-100% overflow-hidden grid items-center justify-center">
      <Renderer>
        <LeveL1 />
      </Renderer>
    </section>
  );
}

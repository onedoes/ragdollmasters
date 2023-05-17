//

import { GameContext } from "@/GameContext";
import { Back } from "@/components/Back";
import { MenuButton } from "@/components/Button";
import { useContext, type ComponentPropsWithoutRef } from "react";
import { useKeyPressEvent } from "react-use";

//

export default GameMode;
export function GameMode({ ...props }: ComponentPropsWithoutRef<"section">) {
  const { sendN } = useContext(GameContext);

  useKeyPressEvent("Escape", sendN("BACK"));

  return (
    <div className="vstack h-100%">
      <Back />
      <section
        {...props}
        className={[
          "vstack",
          "flex-1",
          "justify-around",
          "h-100%",
          props.className,
        ].join(" ")}
      >
        <ul className="vstack items-center ">
          <li className="w-66%">
            <MenuButton onClick={sendN("PLAY_1")}>1 Player</MenuButton>
          </li>
          <li className="w-66%">
            <MenuButton disabled onClick={sendN("PLAY_2VS")}>
              2 Players VS
            </MenuButton>
          </li>
          <li className="w-66%">
            <MenuButton disabled onClick={sendN("PLAY_2CO-OP")}>
              2 Players CO-OP
            </MenuButton>
          </li>
        </ul>
      </section>
    </div>
  );
}

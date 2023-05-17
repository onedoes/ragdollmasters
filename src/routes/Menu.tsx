//

import { GameContext } from "@/GameContext";
import { MenuButton } from "@/components/Button";
import { useContext, type ComponentPropsWithoutRef } from "react";

//

export default Menu;
export function Menu({ ...props }: ComponentPropsWithoutRef<"section">) {
  const { sendN } = useContext(GameContext);
  return (
    <section
      {...props}
      className={["vstack", "justify-around", "h-100%", props.className].join(
        " "
      )}
    >
      <h1 className="font-medium text-center my-1 text-size-4rem uppercase  ">
        OneDoes{" "}
        <span className="animate-text-color-rainbow">Ragdoll Masters</span>
      </h1>
      <ul className="vstack items-center ">
        <li className="w-66%">
          <MenuButton onClick={sendN("PLAY")}>Play</MenuButton>
        </li>
        <li className="w-66%">
          <MenuButton disabled onClick={sendN("OPTIONS")}>
            Options
          </MenuButton>
        </li>
        <li className="w-66%">
          <MenuButton disabled onClick={sendN("CONTROLS")}>
            Controls
          </MenuButton>
        </li>
        <li className="w-66%">
          <MenuButton disabled onClick={sendN("SCORES")}>
            Scores
          </MenuButton>
        </li>
        <li className="w-66%">
          <MenuButton disabled onClick={sendN("ABOUT")}>
            About
          </MenuButton>
        </li>
      </ul>
    </section>
  );
}

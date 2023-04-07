//

import { GameContext } from "@/GameContext";
import { useContext, type ComponentPropsWithoutRef, type FC } from "react";
import { Button } from "./Button";

//

export const Back: FC<ComponentPropsWithoutRef<"button">> = (props) => {
  const { sendN } = useContext(GameContext);
  return (
    <Button {...props} className="w-50" onClick={sendN("BACK")}>
      {"<"} Back
    </Button>
  );
};

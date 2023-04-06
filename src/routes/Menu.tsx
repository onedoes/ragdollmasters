//

import { useCallback, type ComponentPropsWithoutRef, type FC } from "react";

//

const MenuButton: FC<ComponentPropsWithoutRef<"button">> = ({
  children,
  ...props
}) => (
  <button
    className="font-medium text-center py-5 animate-text-color-rainbow text-size-3.5rem uppercase"
    {...props}
  >
    {children}
  </button>
);
export function Menu({ ...props }: ComponentPropsWithoutRef<"section">) {
  // const [selected, setSelected] = useState("");
  const willSend = useCallback(
    (type: string) => () => {
      console.log("lol", { type });
    },
    []
  );
  return (
    <section {...props}>
      <h1 className="font-medium text-center py-5 text-size-4rem uppercase">
        OneDoes{" "}
        <span className="animate-text-color-rainbow">Ragdoll Masters</span>
      </h1>
      <nav>
        <ul>
          <li>
            <MenuButton onClick={willSend("PLAY")}>Play</MenuButton>
            <MenuButton onClick={willSend("OPTIONS")}>Options</MenuButton>
            <MenuButton onClick={willSend("REGISTER")}>Register</MenuButton>
            <MenuButton onClick={willSend("CONTROLS")}>Controls</MenuButton>
            <MenuButton onClick={willSend("CONTROLS")}>Controls</MenuButton>
          </li>
        </ul>
      </nav>
    </section>
  );
}

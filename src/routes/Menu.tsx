//

import { useCallback, type ComponentPropsWithoutRef, type FC } from "react";

//

const MenuButton: FC<ComponentPropsWithoutRef<"button">> = ({
  children,
  ...props
}) => (
  <button
    className="w-100% font-sans text-white text-center opacity-66 hover:opacity-100  focus:animate-text-color-rainbow text-size-2rem uppercase bg-dark-900 border-none "
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
          <MenuButton onClick={willSend("PLAY")}>Play</MenuButton>
        </li>
        <li className="w-66%">
          <MenuButton onClick={willSend("OPTIONS")}>Options</MenuButton>
        </li>
        <li className="w-66%">
          <MenuButton onClick={willSend("REGISTER")}>Register</MenuButton>
        </li>
        <li className="w-66%">
          <MenuButton onClick={willSend("CONTROLS")}>Controls</MenuButton>
        </li>
        <li className="w-66%">
          <MenuButton onClick={willSend("CONTROLS")}>Controls</MenuButton>
        </li>
      </ul>
    </section>
  );
}

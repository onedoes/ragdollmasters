//

import type { ComponentPropsWithoutRef, FC } from "react";

//

export const MenuButton: FC<ComponentPropsWithoutRef<"button">> = ({
  children,
  ...props
}) => (
  <Button {...props} className={[props.className, "w-100% "].join(" ")}>
    {children}
  </Button>
);

export const Button: FC<ComponentPropsWithoutRef<"button">> = ({
  children,
  ...props
}) => (
  <button
    {...props}
    className={[
      props.className,
      "font-sans text-white text-center opacity-66 hover:opacity-100  focus:animate-text-color-rainbow text-size-2rem uppercase bg-dark-900 border-none ",
    ].join(" ")}
  >
    {children}
  </button>
);

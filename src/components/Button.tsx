//

import type { ComponentPropsWithoutRef, FC, PropsWithChildren } from "react";

//

export const MenuButton: FC<
  PropsWithChildren<ComponentPropsWithoutRef<"button">>
> = ({ children, ...props }) => (
  <Button {...props} className={[props.className, "w-100% "].join(" ")}>
    {children}
  </Button>
);

export const Button: FC<
  PropsWithChildren<ComponentPropsWithoutRef<"button">>
> = ({ children, ...props }) => (
  <button
    {...props}
    className={[
      props.className,
      [
        "bg-dark-900",
        "border-none",
        "focus:animate-text-color-rainbow",
        "font-sans",
        "hover:not-disabled:opacity-100",
        "disabled:line-through",
        "disabled:line-through",
        "opacity-66",
        "text-center",
        "text-size-2rem",
        "text-white",
        "uppercase",
      ].join(" "),
    ].join(" ")}
  >
    {children}
  </button>
);

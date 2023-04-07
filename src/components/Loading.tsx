//

import type { ComponentPropsWithoutRef, FC } from "react";

//

export const Loading: FC<ComponentPropsWithoutRef<"div">> = (props) => (
  <div
    className="h-12 w-12 animate-spin animate-duration-2s b-solid b-current b-t-2 b-r-2 b-rd-100%"
    {...props}
  >
    <span className="sr-only">Loading...</span>
  </div>
);

// uno:bg="blue-400 hover:blue-500 dark:blue-500 dark:hover:blue-600"
// uno:h="12"
// uno:w="12"
// uno:animate="bounce"
// uno:border="2 rounded current"

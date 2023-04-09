//

import type { Render } from "matter-js";
import { createContext, useContext } from "react";

//

export const RenderContext = createContext<Render>(null as any);
export const useRender = () => useContext(RenderContext);

//

import type { Engine } from "matter-js";
import { createContext, useContext } from "react";

//

export const EngineContext = createContext<Engine>(null as any);
export const useEngine = () => useContext(EngineContext);

//

import { useInterpret } from "@xstate/react";
import { createContext, type PropsWithChildren } from "react";
import type { InterpreterFrom, StateValueFrom } from "xstate";
import { GameFlow } from "./GameFlow";

//

export type GameFlowMachineType = typeof GameFlow;
export type GameFlowMachineInterpreter = InterpreterFrom<GameFlowMachineType>;
export type GameFlowMachineStateValues = StateValueFrom<GameFlowMachineType>;
export type States = StateValueFrom<GameFlowMachineType>;

export type GameFlowMachineSendFn = GameFlowMachineInterpreter["send"];

//

export const GameContext = createContext(
  {} as {
    sendN: (
      ...params: Parameters<GameFlowMachineSendFn>
    ) => () => ReturnType<GameFlowMachineSendFn>;
    gameM: GameFlowMachineInterpreter;
  }
);

//

export function GameContextProvider({ children }: PropsWithChildren) {
  const game_flow = useInterpret(GameFlow);
  const sendN =
    (...params: Parameters<typeof game_flow["send"]>) =>
    () =>
      game_flow.send(...params);

  return (
    <GameContext.Provider value={{ sendN, gameM: game_flow }}>
      {children}
    </GameContext.Provider>
  );
}

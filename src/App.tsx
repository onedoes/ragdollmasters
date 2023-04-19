//

import { useActor } from "@xstate/react";
import { Suspense, lazy, useContext, useMemo } from "react";
import { GameContext, GameContextProvider, type States } from "./GameContext";
import { Loading } from "./components/Loading";
import { routes } from "./routes";

//

function Router({ routes }: { routes: Map<States, ReturnType<typeof lazy>> }) {
  const { gameM } = useContext(GameContext);
  const [gameA] = useActor(gameM);

  const match = useMemo(
    () => Array.from(routes).find(([state]) => gameA.matches(state)),
    [gameA]
  );

  if (!match) {
    return <>{gameA.value.toString()} not found</>;
  }

  const [state, Component] = match;
  console.log({ state, Component });
  return <Component />;
}

const LoadingScreen = () => (
  <div className="vstack h-100% items-center justify-center">
    <Loading />
  </div>
);

export default function App() {
  return (
    <GameContextProvider>
      <main className="h-screen">
        <Suspense fallback={<LoadingScreen />}>
          <Router routes={routes} />
        </Suspense>
      </main>
    </GameContextProvider>
  );
}

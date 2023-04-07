//

import { useActor } from "@xstate/react";
import { Suspense, lazy, useContext, useMemo } from "react";
import { GameContext, GameContextProvider, type States } from "./GameContext";
import { Loading } from "./components/Loading";
// import { Menu } from "./routes/Menu";

//

const Menu = lazy(() =>
  import("./routes/Menu").then(({ Menu }) => ({ default: Menu }))
);

const GameMode = lazy(() =>
  import("./routes/GameMode").then(({ GameMode }) => ({ default: GameMode }))
);

const Battle1Player = lazy(() =>
  import("./routes/Battle1Player").then(({ Battle1Player }) => ({
    default: Battle1Player,
  }))
);
const routes = new Map<States, typeof Menu>([
  ["idle", Menu],
  ["play_mode.1 Player", Battle1Player],
  ["play_mode", GameMode],
]);
function Router() {
  const { gameM } = useContext(GameContext);
  const [gameA] = useActor(gameM);
  // const state = gameA.value as States;
  // console.log({ state });

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
          <Router />
        </Suspense>
      </main>
    </GameContextProvider>
  );
}

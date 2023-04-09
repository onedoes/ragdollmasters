//

import debug from "debug";
import {
  Engine as MatterEngine,
  World,
  type IEngineDefinition,
} from "matter-js";
import { Component, useEffect, useState, type PropsWithChildren } from "react";
import { EngineContext } from "./EngineContext";

//

const log = debug("@1.framework:matter4react:Engine");

//

export function Engine({ options, children }: PropsWithChildren<Props>) {
  const [engine, setEngine] = useState<MatterEngine | null>(null);

  useEffect(() => {
    log("+ useEffect.");
    const instance = MatterEngine.create(options);
    log("+", { world_id: instance.world.id });
    setEngine(instance);

    return () => {
      log("- useEffect.", { pid: instance.world.id });
      World.clear(instance.world, false);
      MatterEngine.clear(instance);
      setEngine(null);
    };
  }, [options]);

  log("! render.", { engine });
  if (!engine) return null;

  return (
    <EngineContext.Provider value={engine}>{children}</EngineContext.Provider>
  );
}

export class Engine2 extends Component<PropsWithChildren<Props>> {
  override state: Readonly<{ engine?: MatterEngine }> = {};

  override componentDidMount(): void {
    log("+ componentWillUnmount.");
    const engine = MatterEngine.create(this.props.options);
    log("+", { world_id: engine.world.id });
    this.setState({ engine });
  }

  override componentWillUnmount(): void {
    log("- componentWillUnmount.");
    const { engine } = this.state;
    if (!engine) return;
    log("- componentWillUnmount.", { world_id: engine.world.id });
    World.clear(engine.world, false);
    MatterEngine.clear(engine);
    this.setState({ engine: undefined });
  }

  override render() {
    const { children } = this.props;
    const { engine } = this.state;

    log("! render.", { engine });
    if (!engine) return null;

    return (
      <EngineContext.Provider value={engine}>{children}</EngineContext.Provider>
    );
  }
}

//

type Props = PropsWithChildren<{
  options?: IEngineDefinition;
}>;

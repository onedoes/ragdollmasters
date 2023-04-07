//

import { Renderer } from "@/components/Renderer";
import { type ComponentPropsWithoutRef } from "react";

//

export function Battle1Player({
  ...props
}: ComponentPropsWithoutRef<"section">) {
  // const [app, setApp] = useState<Application>();
  // const { sendN } = useContext(GameContext);
  // const viewport = useOnResize();
  // // console.log(app?.resizeTo);
  // useEffect(() => {
  //   const [width, height] = viewport;
  //   app?.renderer?.resize(width, height);
  //   app?.resize();
  // }, [app, viewport]);

  // const blurFilter = useMemo(() => new BlurFilter(0), []);

  return (
    <div className="h-100% overflow-hidden">
      <Renderer></Renderer>
    </div>
  );
}

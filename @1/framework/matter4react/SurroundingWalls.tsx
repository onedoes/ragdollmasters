//

import { useMemo, useRef, type ComponentProps } from "react";
import { Composite } from "./Composite";
import { Rectangle } from "./Rectangle";
import { useRender } from "./RenderContext";

//

export function SurroundingWalls(props: Props) {
  const {
    bounds: { min, max },
  } = useRender();

  const { top, right, bottom, left, thick, options } = { thick: 5, ...props };
  const optionsRef = useRef({ isStatic: true, ...(options ?? {}) });

  const rectangleProps: WallsProps = useMemo(
    () => [
      // top
      { x: max.x / 2, y: min.y + (top ?? 0), width: max.x, height: thick * 2 },
      // right
      {
        x: max.x - (right ?? 0),
        y: max.y / 2,
        width: thick * 2,
        height: max.y,
      },
      // bottom
      {
        x: max.x / 2,
        y: max.y - (bottom ?? 0),
        width: max.x,
        height: thick * 2,
      },
      // left
      { x: min.x + (left ?? 0), y: max.y / 2, width: thick * 2, height: max.y },
    ],
    [min, max, top, right, bottom, left, thick]
  );

  return (
    <Composite options={{ label: "Walls" }}>
      {rectangleProps.map((props, id) => (
        <Rectangle key={id} {...props} options={optionsRef.current} />
      ))}
    </Composite>
  );
}

//

type RectangleProps = ComponentProps<typeof Rectangle>;

type Props = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  thick?: number;
  options?: ComponentProps<typeof Rectangle>["options"];
};

type WallsProps = [
  RectangleProps,
  RectangleProps,
  RectangleProps,
  RectangleProps
];

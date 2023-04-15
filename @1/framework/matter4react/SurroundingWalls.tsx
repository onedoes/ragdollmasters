//

import debug from "debug";
import defaults from "defaults";
import Matter from "matter-js";
import { useMemo, type ComponentProps } from "react";
import { Composite } from "./Composite";
import { Rectangle } from "./Rectangle";

//

const log = debug("@1.framework:matter4react:SurroundingWalls");

//

export function SurroundingWalls(props: Props) {
  const {
    top,
    right,
    bottom,
    left,
    thick,
    bounds: { min, max },
  } = { thick: 5, ...props };
  log("!", { min, max });
  const options: Matter.IChamferableBodyDefinition = defaults(
    (props.options as Record<string, unknown>) ?? {},
    {
      isStatic: true,
      label: "Wall",
    } satisfies Matter.IChamferableBodyDefinition
  );

  const rectangleProps: WallsProps = useMemo(
    () => [
      // top
      {
        x: max.x / 2,
        y: min.y - thick / 2 + (top ?? 0),
        width: max.x + thick,
        height: thick,
      },
      // right
      {
        x: max.x + thick / 2 - (right ?? 0),
        y: max.y / 2,
        width: thick,
        height: max.y,
      },
      // bottom
      {
        x: max.x / 2,
        y: max.y + thick / 2 - (bottom ?? 0),
        width: max.x + thick,
        height: thick,
      },
      // left
      {
        x: min.x - thick / 2 + (left ?? 0),
        y: max.y / 2,
        width: thick,
        height: max.y,
      },
    ],
    [min.x, min.y, max.x, max.y, top, right, bottom, left, thick]
  );

  return (
    <Composite options={{ label: "Walls" }}>
      {rectangleProps.map((props, id) => (
        <Rectangle key={id} {...props} options={options} />
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
  bounds: Matter.Bounds;
  options?: ComponentProps<typeof Rectangle>["options"];
};

type WallsProps = [
  RectangleProps,
  RectangleProps,
  RectangleProps,
  RectangleProps
];

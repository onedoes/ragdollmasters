//

import debug from "debug";
import { useCallback, useRef, type ComponentProps } from "react";
import { Composite } from "./Composite";
import { Rectangle } from "./Rectangle";
import { useRender } from "./RenderContext";

//

const log = debug("@1.framework:matter4react:SurroundingWalls");

//

export function SurroundingWalls(props: Props) {
  const {
    bounds: { min, max },
  } = useRender();
  // const {
  //   render: {
  //     bounds: { min, max },
  //   },
  // } = engine;
  const { top, right, bottom, left, thick, options } = { thick: 5, ...props };
  const optionsRef = useRef(options);
  log(min, max);
  // log("bounds", bounds);
  const Bottom = useCallback(
    () => [
      () => (
        <Rectangle
          x={400}
          y={600}
          width={800}
          height={5}
          options={{ render: { fillStyle: "#333" }, isStatic: true }}
        />
      ),
    ],
    [top, right, bottom, left, thick, optionsRef]
  );
  const wallOptions = { render: { fillStyle: "#333" }, isStatic: true };
  const rectangleProps: WallsProps = [
    // top
    { x: max.x / 2, y: min.y, width: max.x, height: thick * 2 },
    // right
    { x: max.x, y: max.y / 2, width: thick * 2, height: max.y },
    // bottom
    { x: max.x / 2, y: max.y, width: max.x, height: thick * 2 },
    // left
    { x: min.x, y: max.y / 2, width: thick * 2, height: max.y },
  ];
  return (
    <Composite options={{ label: "Walls" }}>
      {rectangleProps.map((props, id) => (
        <Rectangle key={id} {...props} options={wallOptions} />
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
/*
const Walls = ({ options, ...props }: Props) => {
  const defaultProps = {
    options: {
      ...options,
      isStatic: true,
    },
  };

  const { x, y, width, height, wallWidth } = useMapSizes(pickSizes(props));

  const top = {
    ...defaultProps,
    x: x + width / 2,
    y: y + wallWidth / 2,
    width: width,
    height: wallWidth,
  };
  const bottom = {
    ...defaultProps,
    ...top,
    y: height - wallWidth / 2,
  };
  const left = {
    ...defaultProps,
    x: x + wallWidth / 2,
    y: y + height / 2,
    height: height,
    width: wallWidth,
  };
  const right = {
    ...defaultProps,
    ...left,
    x: width - wallWidth / 2,
  };

  return (
    <Fragment>
      <Rectangle {...top} />
      <Rectangle {...bottom} />
      <Rectangle {...left} />
      <Rectangle {...right} />
    </Fragment>
  );
};

export default Walls;

type Props = {
  x: Size;
  y: Size;
  width: Size;
  height: Size;
  wallWidth?: Size;
  options?: React.ComponentProps<typeof Rectangle>['options'];
};

const pickSizes = ({
  x,
  y,
  width,
  height,
  wallWidth = 100,
}: Pick<Props, 'x' | 'y' | 'width' | 'height' | 'wallWidth'>) => ({
  x,
  y,
  width,
  height,
  wallWidth,
});
*/

import { P5CanvasInstance } from "react-p5-wrapper";
import { showGrid } from "./Grid";
import { toGamePos, toScreenPos } from "./Window/UnitConverter";
import {
  mouseWheel,
  mouseDragged,
  MouseData,
  mouseMoved,
} from "./Window/Mouse";
import { getWindowSize } from "./Window/Window";
import { Vector } from "p5";

export function FliesenPlanner(p5: P5CanvasInstance) {
  let tileDims: Vector = new Vector(30, 30);
  let drawLength: number = 100;

  const points: Vector[] = [];

  p5.updateWithProps = (props) => {
    if (props.tileDims) {
      const dims = props.tileDims as number[];
      if (dims[0] > 0 && dims[1] > 0) {
        tileDims = new Vector(dims[0], dims[1]);
      }
    }
    if (props.drawLength) {
      drawLength = props.drawLength as number;
    }
  };

  p5.setup = () => {
    const { width, height } = getWindowSize();
    points.push(new Vector(0, 0));

    p5.createCanvas(width, height, p5.P2D);
  };

  p5.draw = () => {
    //automatic resize
    const { width, height, updated } = getWindowSize();
    if (updated) {
      p5.resizeCanvas(width, height);
    }

    p5.background(51);
    p5.translate(width / 2, height / 2);

    showGrid(p5, tileDims);

    for (let point of points) {
      p5.fill(255, 0, 0);
      const worldPos = toScreenPos(point);
      p5.circle(worldPos.x, worldPos.y, 10);
    }

    // showText();
    // setMouse();

    // showPolygon();
    // showDrawing();
    // showMeasure();
    // Util();
  };

  p5.mouseWheel = mouseWheel;
  p5.mouseDragged = mouseDragged;
  p5.mouseMoved = mouseMoved;

  p5.mouseClicked = () => {
    const { gamePos } = MouseData;

    points.push(gamePos.copy());
  };
}

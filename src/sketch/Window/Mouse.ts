import { Vector } from "p5";
import { WindowData } from "./Window";
import { toGamePos } from "./UnitConverter";

export const MouseData = {
  screenPos: new Vector(0, 0),
  gamePos: new Vector(0, 0),
};

export function mouseMoved(e: MouseEvent) {
  const { width, height } = WindowData;
  const { offsetX, offsetY } = e;
  const x = offsetX - width / 2;
  const y = offsetY - height / 2;
  MouseData.screenPos.set(x, y);
  MouseData.gamePos = toGamePos(MouseData.screenPos);
}

export function mouseWheel(e: WheelEvent) {
  const signum = Math.sign(e.deltaY);
  WindowData.scale *= 1 - signum * 0.1;
}

export function mouseDragged(e: MouseEvent) {
  const { scale } = WindowData;
  const vec = new Vector(e.movementX, -e.movementY);
  vec.div(scale);
  WindowData.transOffset.add(vec);
}

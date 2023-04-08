import { Vector } from "p5";
import { P5CanvasInstance } from "react-p5-wrapper";
import { toGamePos } from "./UnitConverter";
import { WindowData } from "./Window";

export const MouseData = {
  mouseScreenPos: new Vector(0, 0),
  mouseGamePos: new Vector(0, 0),
  mouseButton: undefined as "LEFT" | "RIGHT" | "MIDDLE" | undefined,
  outside: false,
};

export function updateMousePos(p5: P5CanvasInstance, e: MouseEvent) {
  const { width, height } = WindowData;

  const offsetX = p5.mouseX;
  const offsetY = p5.mouseY;

  const outside =
    offsetX < 0 || offsetY < 0 || offsetX > width || offsetY > height;

  const x = offsetX - width / 2;
  const y = offsetY - height / 2;

  MouseData.mouseScreenPos.set(x, y);
  MouseData.mouseGamePos = toGamePos(MouseData.mouseScreenPos);
  MouseData.outside = outside;
}

export function mouseWheel(e: WheelEvent) {
  const signum = Math.sign(e.deltaY);
  WindowData.scale *= 1 - signum * 0.1;
}

export function mousePressed(e: MouseEvent) {
  const { outside } = MouseData;

  if (outside) return;

  switch (e.button) {
    case 0:
      MouseData.mouseButton = "LEFT";
      break;
    case 1:
      MouseData.mouseButton = "MIDDLE";
      break;
    case 2:
      MouseData.mouseButton = "RIGHT";
      break;
  }
}

export function mouseReleased(e: MouseEvent) {
  MouseData.mouseButton = undefined;
}

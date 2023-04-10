import { Vector } from "p5";
import { P5CanvasInstance } from "react-p5-wrapper";
import { toGamePos, toScreenPos } from "./UnitConverter";
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
  const oldOffset = WindowData.transOffset.copy();

  const oldMouseGamePos = MouseData.mouseGamePos.copy();
  const oldMouseScreenPos = MouseData.mouseScreenPos.copy();
  WindowData.scale *= 1 - signum * 0.1;

  //change translation to keep mouse position constant
  const newMouseGamePos = toGamePos(oldMouseScreenPos);

  const diff = newMouseGamePos.sub(oldMouseGamePos);

  WindowData.transOffset = oldOffset.add(diff);
}

export function calculatePanMovement(mouseMovement: Vector) {
  // pan such that that the same point on the map is under the mouse
  const { mouseScreenPos: oldMouseScreenPos } = MouseData;

  const newMouseScreenPos = oldMouseScreenPos.copy().add(mouseMovement);

  const oldMouseGamePos = toGamePos(oldMouseScreenPos);
  const newMouseGamePos = toGamePos(newMouseScreenPos);

  const diff = newMouseGamePos.sub(oldMouseGamePos);

  return diff;
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

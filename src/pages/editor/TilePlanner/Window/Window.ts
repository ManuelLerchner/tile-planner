import { Vector } from "p5";
import { toScreenPos } from "./UnitConverter";

export const WindowData = {
  width: 0,
  height: 0,
  range: 1000,
  scale: 1,
  transOffset: new Vector(0, 0),
};

export function getWindowSize(): {
  width: number;
  height: number;
  updated: boolean;
} {
  const sketch_window = document.getElementById("sketch-window");
  const new_width = sketch_window?.clientWidth || 0;
  const new_height = sketch_window?.clientHeight || 0;
  const updated =
    WindowData.width !== new_width || WindowData.height !== new_height;

  WindowData.width = new_width;
  WindowData.height = new_height;
  return { width: new_width, height: new_height, updated };
}

export function isOutsideViewPort(pos: Vector): boolean {
  const { width, height } = WindowData;
  const { transOffset, range, scale } = WindowData;

  const screenPos = toScreenPos(pos);

  const x = screenPos.x + width / 2;
  const y = screenPos.y + height / 2;

  const outside =
    x < 0 ||
    y < 0 ||
    x > width ||
    y > height ||
    Math.abs(transOffset.x) > range / 2 ||
    Math.abs(transOffset.y) > range / 2 ||
    scale < 0.01 ||
    scale > 1;

  return outside;
}

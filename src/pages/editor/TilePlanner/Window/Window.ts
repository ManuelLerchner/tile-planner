import { Vector } from "p5";

export const WindowData = {
  width: 0,
  height: 0,
  range: 20,
  scale: 0.03,
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

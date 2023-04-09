import { Vector } from "p5";
import { WindowData } from "./Window";

export function toScreenPos(gamePos: Vector): Vector {
  const { width, range, scale, transOffset } = WindowData;
  let x = (((gamePos.x + transOffset.x) * width) / range) * scale;
  let y = -(((gamePos.y + transOffset.y) * width) / range) * scale;

  return new Vector(x, y);
}

export function toGamePos(screenPos: Vector): Vector {
  const { width, range, scale, transOffset } = WindowData;
  let x = screenPos.x / scale / (width / range) - transOffset.x;
  let y = -(screenPos.y / scale / (width / range)) - transOffset.y;

  return new Vector(x, y);
}

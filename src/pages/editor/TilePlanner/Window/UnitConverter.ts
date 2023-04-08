import { Vector } from "p5";
import { WindowData } from "./Window";

export function toScreenPos(gamePos: Vector): Vector {
  const { width, range, scale, transOffset } = WindowData;
  let x = ((gamePos.x * width) / range + transOffset.x) * scale;
  let y = -((gamePos.y * width) / range + transOffset.y) * scale;

  return new Vector(x, y);
}

export function toGamePos(screenPos: Vector): Vector {
  const { width, range, scale, transOffset } = WindowData;
  let x = ((screenPos.x / scale - transOffset.x) / width) * range;
  let y = ((-screenPos.y / scale - transOffset.y) / width) * range;

  return new Vector(x, y);
}

import { Vector } from "p5";

export function dist2d(a: Vector, b: Vector) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export function center(a: Vector, b: Vector) {
  return a.copy().add(b).div(2);
}

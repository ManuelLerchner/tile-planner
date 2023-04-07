import { Vector } from "p5";

export function getAreaOfPolygon(polygon: Vector[]): number {
  let area = 0;
  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    area += polygon[i].x * polygon[j].y;
    area -= polygon[i].y * polygon[j].x;
  }
  area /= 2;
  return Math.abs(area) / 10000;
}

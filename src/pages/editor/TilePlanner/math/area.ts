import { Vector } from "p5";

export function getAreaOfPolygon(polygon: Vector[]): number {
  let area = 0;
  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    const xPosMeterCurr = polygon[i].x / 100;
    const yPosMeterCurr = polygon[i].y / 100;
    const xPosMeterNext = polygon[j].x / 100;
    const yPosMeterNext = polygon[j].y / 100;

    area += xPosMeterCurr * yPosMeterNext;
    area -= xPosMeterNext * yPosMeterCurr;
  }
  area /= 2;
  return Math.abs(area);
}

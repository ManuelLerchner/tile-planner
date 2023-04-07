import { P5CanvasInstance } from "react-p5-wrapper";
import { PolygonMesh } from "../../types/Drawing";
import { toScreenPos } from "../Window/UnitConverter";
import { DrawingToVectors, Polygon } from "./DBConverter";
import { WindowData } from "../Window/Window";
import { pairWiseIterator } from "../helper/pairWiseIterator";
import { enumerate } from "../helper/enumerate";

export function drawPolygons(p5: P5CanvasInstance, polygons: Polygon[]) {
  p5.strokeWeight(2);
  p5.stroke(0);

  for (let [i, polygon] of enumerate(polygons)) {
    p5.colorMode(p5.HSB, 360, 100, 100, 100);
    p5.fill(360 * (i / polygons.length), 100, 100, 50);

    p5.beginShape();
    for (let point of polygon) {
      const pos = toScreenPos(point);
      p5.vertex(pos.x, pos.y);
    }
    p5.endShape(p5.CLOSE);

    p5.colorMode(p5.RGB, 255, 255, 255, 255);

    p5.fill(125, 125, 255, 100);
    for (let point of polygon) {
      const pos = toScreenPos(point);
      p5.ellipse(pos.x, pos.y, 8, 8);
    }

    p5.fill(255, 255, 255);
    p5.textAlign(p5.CENTER, p5.CENTER);
    const { scale } = WindowData;

    if (polygon.length < 2) continue;
    for (let [start, end] of pairWiseIterator([...polygon, polygon[0]])) {
      const len = start.dist(end);
      const centerScreenPos = toScreenPos(start.copy().add(end).div(2));

      p5.textSize(8 + len * scale);
      p5.text(p5.nf(len, 0, 1), centerScreenPos.x, centerScreenPos.y);
    }
  }
}

import { P5CanvasInstance } from "react-p5-wrapper";
import { PolygonMesh } from "../../types/Drawing";
import { toScreenPos } from "../Window/UnitConverter";
import { DrawingToVectors, Polygon } from "../data/DBConverter";
import { WindowData } from "../Window/Window";
import { pairWiseIterator } from "../helper/pairWiseIterator";
import { enumerate } from "../helper/enumerate";
import { InterfaceData } from "../FliesenPlanner";

export function drawPolygons(p5: P5CanvasInstance) {
  const { edges, polygons } = InterfaceData.drawData;
  for (let [i, polygon] of enumerate(polygons)) {
    p5.stroke(0);
    p5.strokeWeight(0);

    p5.colorMode(p5.HSB, 360, 100, 100, 100);
    p5.fill(200, 100, 100, 30);

    p5.beginShape();
    for (let point of polygon) {
      const pos = toScreenPos(point);
      p5.vertex(pos.x, pos.y);
    }
    p5.endShape(p5.CLOSE);

    p5.colorMode(p5.RGB, 255, 255, 255, 255);

    p5.strokeWeight(3);
    p5.stroke(255, 255, 255);
    for (let edge of edges) {
      const startScreenPos = toScreenPos(edge.start);
      const endScreenPos = toScreenPos(edge.end);

      p5.line(
        startScreenPos.x,
        startScreenPos.y,
        endScreenPos.x,
        endScreenPos.y
      );
    }

  
    p5.stroke(0);
    p5.strokeWeight(1);
    for (let point of polygon) {
      const pos = toScreenPos(point);
      p5.fill(255);
      p5.circle(pos.x, pos.y, 12);
      p5.fill(0,255,0)
      p5.text(p5.nf(point.z, 0, 0), pos.x, pos.y - 10);
    }

    p5.fill(255, 255, 255);
    p5.stroke(0);
    p5.strokeWeight(1);
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

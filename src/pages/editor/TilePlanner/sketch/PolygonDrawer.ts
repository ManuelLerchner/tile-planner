import { P5CanvasInstance } from "react-p5-wrapper";
import { toScreenPos } from "../Window/UnitConverter";
import { WindowData } from "../Window/Window";
import { InterfaceData } from "../TilePlanner";
import { Vector } from "p5";

export function drawPolygons(p5: P5CanvasInstance) {
  const { edges, polygons } = InterfaceData.drawData;
  const { scale } = WindowData;
  const { tileDims } = InterfaceData;

  p5.textAlign(p5.CENTER, p5.CENTER);

  for (let polygon of polygons) {
    p5.stroke(0);
    p5.strokeWeight(0);

    p5.fill(250, 200, 140, 100);

    p5.beginShape();
    const centerOfMass = new Vector(0, 0);
    for (let point of polygon.vectors) {
      const pos = toScreenPos(point);
      centerOfMass.add(pos);
      p5.vertex(pos.x, pos.y);
    }
    centerOfMass.div(polygon.vectors.length);
    p5.endShape(p5.CLOSE);

    p5.fill(255);
    p5.stroke(0);
    p5.strokeWeight(1);
    for (let point of polygon.vectors) {
      const pos = toScreenPos(point);
      p5.circle(pos.x, pos.y, 12);
    }

    //Area
    if (polygon.vectors.length > 2) {
      p5.strokeWeight(1);
      p5.stroke(0);
      p5.fill(165, 180, 255);

      const pieces = (polygon.area * 10000) / (tileDims.x * tileDims.y);

      p5.textSize(18 + polygon.area * scale);
      p5.text(
        p5.nf(polygon.area, 0, 1) + "m² / " + p5.nf(pieces, 0, 1) + " Stk. ",
        centerOfMass.x,
        centerOfMass.y
      );
    }
  }

  p5.fill(255);

  p5.strokeWeight(3);
  p5.stroke(255, 255, 255);
  for (let edge of edges) {
    const startScreenPos = toScreenPos(edge.start);
    const endScreenPos = toScreenPos(edge.end);

    p5.line(startScreenPos.x, startScreenPos.y, endScreenPos.x, endScreenPos.y);
  }

  p5.strokeWeight(1);
  p5.stroke(0);

  for (let edge of edges) {
    const { start, end } = edge;
    const center = start.copy().add(end).div(2);
    const len = start.dist(end);

    const centerScreenPos = toScreenPos(center);

    const offset = end
      .copy()
      .sub(start)
      .rotate(-p5.HALF_PI)
      .setMag(20 + 20 * scale);

    centerScreenPos.add(offset);

    p5.textSize(14 + (len * scale) / 2);
    p5.text(p5.nf(len, 0, 1), centerScreenPos.x, centerScreenPos.y);
  }
}

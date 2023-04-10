import { P5CanvasInstance } from "react-p5-wrapper";
import { toScreenPos } from "../Window/UnitConverter";
import { WindowData } from "../Window/Window";
import { InterfaceData } from "../TilePlanner";
import { Vector } from "p5";
import { dist2d } from "../math/Vector";
import { MouseData } from "../Window/Mouse";

export function drawPolygons(p5: P5CanvasInstance) {
  const { edges, polygons } = InterfaceData.drawData;
  const { scale } = WindowData;
  const { tileDims, tool } = InterfaceData;
  const { mouseScreenPos } = MouseData;

  p5.textAlign(p5.CENTER, p5.CENTER);

  p5.stroke(0);
  let closestToMouse: Vector | undefined = undefined;
  let closestDist = Infinity;
  for (let polygon of polygons) {
    //area
    p5.strokeWeight(0);
    p5.fill(140, 200, 250, 100);

    p5.beginShape();
    for (let point of polygon.vectors) {
      const pos = toScreenPos(point);
      p5.vertex(pos.x, pos.y);
    }
    p5.endShape(p5.CLOSE);

    // Markers
    p5.fill(255);
    p5.strokeWeight(1);

    for (let point of polygon.vectors) {
      const pos = toScreenPos(point);
      const distToMouse = dist2d(pos, mouseScreenPos);
      if (distToMouse < closestDist && distToMouse < 30) {
        closestDist = distToMouse;
        closestToMouse = point;
      }
      p5.circle(pos.x, pos.y, 12);
    }
  }

  //highlight closest
  if (closestToMouse && tool === "Connect") {
    const pos = toScreenPos(closestToMouse);
    p5.fill(255, 0, 0);
    p5.circle(pos.x, pos.y, 12);
  }

  for (let edge of edges) {
    const { start, end } = edge;
    const center = start.copy().add(end).div(2);

    const startScreenPos = toScreenPos(start);
    const endScreenPos = toScreenPos(end);
    const centerScreenPos = toScreenPos(center);

    const len = start.dist(end);

    //edge
    p5.strokeWeight(3);
    p5.stroke(255, 255, 255);
    p5.line(startScreenPos.x, startScreenPos.y, endScreenPos.x, endScreenPos.y);

    const offset = end
      .copy()
      .sub(start)
      .rotate(-p5.HALF_PI)
      .setMag(20 + 5 * scale);

    centerScreenPos.add(offset);

    //length
    p5.strokeWeight(1);
    p5.stroke(0);
    p5.fill(255);
    p5.textSize(12 + (len / 30) * scale);
    p5.text(p5.round(len, 1), centerScreenPos.x, centerScreenPos.y);
  }

  //Area
  p5.strokeWeight(1);
  p5.stroke(0);
  p5.fill(205, 180, 105);
  for (let polygon of polygons) {
    if (polygon.vectors.length > 2) {
      const pieces = (polygon.area * 10000) / (tileDims.x * tileDims.y);

      const centerOfMass = new Vector(0, 0);
      for (let point of polygon.vectors) {
        const pos = toScreenPos(point);
        centerOfMass.add(pos);
        p5.vertex(pos.x, pos.y);
      }
      centerOfMass.div(polygon.vectors.length);

      p5.textSize(18 + polygon.area * scale);
      p5.text(
        p5.round(polygon.area, 1) + "m² / " + p5.round(pieces, 1) + " Stk. ",
        centerOfMass.x,
        centerOfMass.y
      );
    }
  }
}

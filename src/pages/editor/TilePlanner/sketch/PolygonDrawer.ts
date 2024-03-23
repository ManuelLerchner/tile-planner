import { P5CanvasInstance } from "react-p5-wrapper";
import { toScreenPos } from "../Window/UnitConverter";
import { WindowData } from "../Window/Window";
import { InterfaceData } from "../TilePlanner";
import { Vector } from "p5";
import { dist2d } from "../math/Vector";
import { MouseData } from "../Window/Mouse";
import { Edge } from "../data/DBConverter";

export function drawPolygons(p5: P5CanvasInstance) {
  const { edges, polygons } = InterfaceData.drawData;
  const { scale } = WindowData;
  const { tileDims, tool } = InterfaceData;
  const { mouseScreenPos } = MouseData;

  p5.textAlign(p5.CENTER, p5.CENTER);

  p5.stroke(0);
  let closestVertexToMouse: Vector | undefined = undefined;
  let closestVertexDist = Infinity;
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
      if (distToMouse < closestVertexDist && distToMouse < 30) {
        closestVertexDist = distToMouse;
        closestVertexToMouse = point;
      }
      p5.circle(pos.x, pos.y, 12);
    }
  }

  let closestEdgeToMouse: Edge | undefined = undefined;
  let closestEdgeDist = Infinity;

  for (let edge of edges) {
    const { start, end } = edge;
    const center = start.copy().add(end).div(2);

    const startScreenPos = toScreenPos(start);
    const endScreenPos = toScreenPos(end);
    const centerScreenPos = toScreenPos(center);

    const distToMouse = dist2d(centerScreenPos, mouseScreenPos);
    if (distToMouse < closestEdgeDist && distToMouse < 30) {
      closestEdgeDist = distToMouse;
      closestEdgeToMouse = edge;
    }

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
      const area_tile_m2 = (tileDims.x * tileDims.y) / 10000;
      const pieces = polygon.area / area_tile_m2;

      const centerOfMass = new Vector(0, 0);
      let area = 0;
      for (let i = 0; i < polygon.vectors.length; i++) {
        const p1 = polygon.vectors[i];
        const p2 = polygon.vectors[(i + 1) % polygon.vectors.length];

        const a = p1.x * p2.y - p2.x * p1.y;

        centerOfMass.x += (p1.x + p2.x) * a;
        centerOfMass.y += (p1.y + p2.y) * a;
        area += a;
      }
      centerOfMass.div(3 * area);

      const centerScreenPos = toScreenPos(centerOfMass);

      for (let point of polygon.vectors) {
        const pos = toScreenPos(point);
        p5.vertex(pos.x, pos.y);
      }

      p5.textSize(16 + polygon.area * scale);
      p5.text(
        "OV: " +
          p5.round(polygon.area, 1) +
          "m² ≙ " +
          p5.round(pieces, 1) +
          " Stk.\n" +
          "MV: " +
          p5.round((polygon.overlappingTiles || 0) * area_tile_m2, 1) +
          "m² ≙ " +
          p5.round(polygon.overlappingTiles || 0, 1) +
          " Stk.\n",
        centerScreenPos.x,
        centerScreenPos.y
      );
    }
  }

  //highlight closest
  const edge =
    closestEdgeToMouse !== undefined && closestEdgeDist < closestVertexDist;
  if (edge) {
    if (closestEdgeToMouse && tool === "Delete") {
      const { start, end } = closestEdgeToMouse;
      const startScreenPos = toScreenPos(start);
      const endScreenPos = toScreenPos(end);

      //edge
      p5.strokeWeight(3);
      p5.stroke(255, 0, 0);
      p5.line(
        startScreenPos.x,
        startScreenPos.y,
        endScreenPos.x,
        endScreenPos.y
      );
    }
  } else {
    if (closestVertexToMouse && (tool === "Delete" || tool === "Connect")) {
      const pos = toScreenPos(closestVertexToMouse);
      p5.fill(255, 0, 0);
      p5.circle(pos.x, pos.y, 12);
    }
  }
}

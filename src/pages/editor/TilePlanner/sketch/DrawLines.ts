import { P5CanvasInstance } from "react-p5-wrapper";
import { InterfaceData } from "../TilePlanner";
import { MouseData } from "../Window/Mouse";
import { toScreenPos } from "../Window/UnitConverter";
import { Vector } from "p5";
import { rayIntersectsLine } from "../math/lineIntersection";
import { Edge } from "../data/DBConverter";

function dist2d(a: Vector, b: Vector) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function center(a: Vector, b: Vector) {
  return a.copy().add(b).div(2);
}

export function drawLine(
  p5: P5CanvasInstance,
  drawLength: number,
  showLimited: boolean
) {
  const { selectedPoint, markerMode } = InterfaceData;
  if (!selectedPoint) return;

  const { mouseScreenPos, mouseGamePos } = MouseData;

  const startPoint = toScreenPos(selectedPoint);

  //draw line to mouse
  p5.stroke(255, 0, 0);
  p5.strokeWeight(1);
  p5.line(startPoint.x, startPoint.y, mouseScreenPos.x, mouseScreenPos.y);

  const drawGameVector = mouseGamePos.copy().sub(selectedPoint);
  if (markerMode === "Ortho") {
    const angle = (drawGameVector.heading() + Math.PI * 2) % (Math.PI * 2);
    const roundedAngle = Math.round(angle / (Math.PI / 2)) * (Math.PI / 2);

    const roundedVector = selectedPoint
      .copy()
      .add(new Vector(1, 0).setMag(drawLength).rotate(roundedAngle));

    InterfaceData.newPoint = roundedVector;

    const endPoint = toScreenPos(roundedVector);

    //draw line to rounded point
    if (showLimited) {
      p5.stroke(0, 255, 0);
      p5.strokeWeight(2);
      p5.line(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      p5.ellipse(endPoint.x, endPoint.y, 5, 5);
    }
  } else if (markerMode === "Free") {
    //check for intersection with other lines

    const { edges } = InterfaceData.drawData;

    let closestIntersection: Vector | null = null;
    let closestIntersectionDist = Infinity;
    let clsoestIntersectionEdge: Edge | null = null;

    for (let edge of edges) {
      const { start, end } = edge;

      if (start.equals(selectedPoint) || end.equals(selectedPoint)) continue;

      const intersection = rayIntersectsLine(
        selectedPoint,
        mouseGamePos.copy().sub(selectedPoint),
        start,
        end
      );

      if (intersection) {
        const dist = dist2d(intersection, selectedPoint);
        if (dist < closestIntersectionDist && dist > 5) {
          closestIntersectionDist = dist;
          closestIntersection = intersection;
          clsoestIntersectionEdge = edge;
        }
      }
    }

    if (closestIntersection) {
      const { start, end } = clsoestIntersectionEdge!;

      //distances
      const distIS = dist2d(closestIntersection, start);
      const distIE = dist2d(closestIntersection, end);
      const distMI = dist2d(mouseGamePos, closestIntersection);

      //intersec point
      const intersectPoint = toScreenPos(closestIntersection);

      p5.stroke(255, 0, 0);
      p5.strokeWeight(1);

      //centers
      const centerStartI = center(toScreenPos(start), intersectPoint);
      const centerEndI = center(toScreenPos(end), intersectPoint);
      const centerMouseI = center(mouseScreenPos, intersectPoint);

      p5.stroke(0, 255, 0);
      p5.strokeWeight(2);

      //line origin intersect
      p5.line(startPoint.x, startPoint.y, intersectPoint.x, intersectPoint.y);

      //hit ellipse
      p5.fill(255, 255, 0);
      p5.stroke(0);
      p5.strokeWeight(1);
      p5.ellipse(intersectPoint.x, intersectPoint.y, 10, 10);

      //texts
      p5.fill(255, 0, 255);
      p5.stroke(0);
      p5.textSize(15);

      p5.text(p5.round(distIS, 1), centerStartI.x, centerStartI.y + 10);
      p5.text(p5.round(distIE, 1), centerEndI.x, centerEndI.y + 10);
      p5.text(p5.round(distMI, 1), centerMouseI.x, centerMouseI.y + 10);
    }

    const rayAngleDeg = (drawGameVector.heading() * 180) / Math.PI;

    //mouse ellipse
    p5.fill(255, 255, 0);
    p5.stroke(0);
    p5.strokeWeight(1);
    p5.ellipse(mouseScreenPos.x, mouseScreenPos.y, 10, 10);

    InterfaceData.newPoint = mouseGamePos;

    const distMO = dist2d(mouseGamePos, selectedPoint);
    const centerMouseO = center(mouseScreenPos, startPoint);

    p5.fill(255, 0, 255);
    p5.stroke(0);
    p5.textSize(15);
    p5.text(p5.round(distMO, 1), centerMouseO.x, centerMouseO.y + 10);

    // angle
    p5.fill(0, 255, 255);
    p5.stroke(0);
    p5.strokeWeight(1);
    p5.textSize(15);
    p5.text(
      p5.round(rayAngleDeg, 1) + "°",
      mouseScreenPos.x,
      mouseScreenPos.y + 25
    );
  }
}

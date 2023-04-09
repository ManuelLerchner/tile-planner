import { P5CanvasInstance } from "react-p5-wrapper";
import { InterfaceData } from "../TilePlanner";
import { MouseData } from "../Window/Mouse";
import { toScreenPos } from "../Window/UnitConverter";
import { Vector } from "p5";
import { rayIntersectsLine } from "../math/lineIntersection";
import { Edge } from "../data/DBConverter";
import { center, dist2d } from "../math/Vector";

export function drawMarkerHelpLines(p5: P5CanvasInstance) {
  const { selectedPoint, markerMode, drawLength } = InterfaceData;
  const { mouseScreenPos, mouseGamePos } = MouseData;

  if (!selectedPoint) return;

  const startPoint = toScreenPos(selectedPoint);
  const drawGameVector = mouseGamePos.copy().sub(selectedPoint);
  drawGameVector.z = 0;

  let rayAngle = drawGameVector.heading();

  if (markerMode === "Ortho") {
    const roundedAngle = Math.round(rayAngle / (Math.PI / 4)) * (Math.PI / 4);

    const roundedVector = selectedPoint
      .copy()
      .add(new Vector(1, 0).setMag(drawLength).rotate(roundedAngle));

    InterfaceData.newPoint = roundedVector;

    const endPoint = toScreenPos(roundedVector);

    const limitedMouseScreenPos = toScreenPos(
      drawGameVector.copy().setMag(drawLength).add(selectedPoint)
    );

    console.log(drawGameVector.mag());

    //draw line to mouse
    p5.stroke(255, 0, 0);
    p5.strokeWeight(1);
    p5.line(
      startPoint.x,
      startPoint.y,
      limitedMouseScreenPos.x,
      limitedMouseScreenPos.y
    );

    //draw line to rounded point
    p5.stroke(0, 255, 0);
    p5.strokeWeight(2);
    p5.line(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
    p5.ellipse(endPoint.x, endPoint.y, 5, 5);
  } else if (markerMode === "Free") {
    //check for intersection with other lines

    const roundedAngle = Math.round(rayAngle / (Math.PI / 4)) * (Math.PI / 4);

    let distMO = dist2d(mouseGamePos, selectedPoint);
    let newPointVector = mouseGamePos;

    const snappedVector = mouseGamePos
      .copy()
      .sub(selectedPoint)
      .setMag(distMO)
      .setHeading(roundedAngle)
      .add(selectedPoint);

    const distMouseSnapped = dist2d(toScreenPos(snappedVector), mouseScreenPos);

    //snap to 45°
    if (
      Math.abs(rayAngle - roundedAngle) < Math.PI / 32 &&
      distMouseSnapped < 10
    ) {
      newPointVector = snappedVector;
      distMO = dist2d(newPointVector, selectedPoint);
      rayAngle = roundedAngle;
    }

    const lockedScreenPos = toScreenPos(newPointVector);

    const { edges } = InterfaceData.drawData;

    let closestIntersection: Vector | null = null;
    let closestIntersectionDist = Infinity;
    let clsoestIntersectionEdge: Edge | null = null;

    for (let edge of edges) {
      const { start, end } = edge;

      if (start.equals(selectedPoint) || end.equals(selectedPoint)) continue;

      const intersection = rayIntersectsLine(
        selectedPoint,
        newPointVector.copy().sub(selectedPoint),
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
    } else {
      //draw line to mouse
      p5.stroke(255, 0, 0);
      p5.strokeWeight(1);
      p5.line(startPoint.x, startPoint.y, lockedScreenPos.x, lockedScreenPos.y);
    }

    //mouse ellipse
    p5.fill(255, 255, 0);
    p5.stroke(0);
    p5.strokeWeight(1);
    p5.ellipse(lockedScreenPos.x, lockedScreenPos.y, 10, 10);

    InterfaceData.newPoint = newPointVector;

    const centerMouseO = center(lockedScreenPos, startPoint);

    p5.fill(255, 0, 255);
    p5.stroke(0);
    p5.textSize(15);
    p5.text(p5.round(distMO, 1), centerMouseO.x, centerMouseO.y + 10);

    let rayAngleDeg = (rayAngle * 180) / Math.PI;
    // angle
    p5.fill(0, 255, 255);
    p5.stroke(0);
    p5.strokeWeight(1);
    p5.textSize(15);
    p5.text(
      p5.round(rayAngleDeg, 1) + "°",
      lockedScreenPos.x,
      lockedScreenPos.y + 25
    );
  }
}

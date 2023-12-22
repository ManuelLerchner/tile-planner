import { Vector } from "p5";
import { P5CanvasInstance } from "react-p5-wrapper";
import { toScreenPos } from "../Window/UnitConverter";
import { InterfaceData } from "../TilePlanner";
import { Polygon } from "../data/DBConverter";

function lineIntersectsLine(
  line1Start: Vector,
  line1End: Vector,
  line2Start: Vector,
  line2End: Vector
) {
  const denominator =
    (line2End.y - line2Start.y) * (line1End.x - line1Start.x) -
    (line2End.x - line2Start.x) * (line1End.y - line1Start.y);

  if (denominator === 0) {
    return false;
  }

  const ua =
    ((line2End.x - line2Start.x) * (line1Start.y - line2Start.y) -
      (line2End.y - line2Start.y) * (line1Start.x - line2Start.x)) /
    denominator;
  const ub =
    ((line1End.x - line1Start.x) * (line1Start.y - line2Start.y) -
      (line1End.y - line1Start.y) * (line1Start.x - line2Start.x)) /
    denominator;

  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return false;
  }

  const x = line1Start.x + ua * (line1End.x - line1Start.x);
  const y = line1Start.y + ua * (line1End.y - line1Start.y);

  return new Vector(x, y);
}

function lineIntersectsPolygon(
  lineStart: Vector,
  lineEnd: Vector,
  poly: Vector[]
) {
  for (let i = 0; i < poly.length; i++) {
    const p1 = poly[i];
    const p2 = poly[(i + 1) % poly.length];

    const intersect = lineIntersectsLine(lineStart, lineEnd, p1, p2);
    if (intersect) {
      return true;
    }
  }

  return false;
}

function pointInPolygon(point: Vector, poly: Vector[]) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x,
      yi = poly[i].y;
    const xj = poly[j].x,
      yj = poly[j].y;

    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
}

function rectTouchingPolygon(rect: Vector[], poly: Polygon) {
  let intersects = false;
  for (let i = 0; i < rect.length; i++) {
    const edgeStart = rect[i];
    const edgeEnd = rect[(i + 1) % rect.length];

    if (lineIntersectsPolygon(edgeStart, edgeEnd, poly.vectors)) {
      intersects = true;
      break;
    }
  }

  let inside = false;
  if (!intersects) {
    for (let point of rect) {
      if (pointInPolygon(point.copy(), poly.vectors)) {
        inside = true;
        break;
      }
    }
  }

  if (intersects || inside) {
    poly.overlappingTiles!++;
    return true;
  }

  return false;
}

export function showGrid(p5: P5CanvasInstance) {
  const { tileOffset, tileDims, tileMode } = InterfaceData;
  const { polygons } = InterfaceData.drawData;

  //find the bottom left corner of the grid
  var bottomLeftMost = new Vector(Number.MAX_VALUE, Number.MAX_VALUE);
  var topRightMost = new Vector(-Number.MAX_VALUE, -Number.MAX_VALUE);
  var valid = false;
  for (let i = 0; i < polygons.length; i++) {
    const poly = polygons[i];
    for (const point of poly.vectors) {
      valid = true;
      if (point.x < bottomLeftMost.x) {
        bottomLeftMost.x = point.x;
      }
      if (point.y < bottomLeftMost.y) {
        bottomLeftMost.y = point.y;
      }

      if (point.x > topRightMost.x) {
        topRightMost.x = point.x;
      }
      if (point.y > topRightMost.y) {
        topRightMost.y = point.y;
      }
    }
  }

  if (!valid) {
    return;
  }

  p5.push();
  p5.strokeWeight(2);
  p5.stroke(0);

  for (let poly of polygons) {
    poly.overlappingTiles = 0;
  }

  const GridCorner = bottomLeftMost.copy().add(tileOffset);
  const GridSize = topRightMost.copy().sub(bottomLeftMost);

  const horizontalTiles = Math.ceil(GridSize.x / tileDims.x);
  const verticalTiles = Math.ceil(GridSize.y / tileDims.y);

  const padding = 5;

  p5.rectMode(p5.CORNERS);

  if (tileMode === "Straight") {
    for (let col = -padding; col < horizontalTiles + padding; col++) {
      for (let row = -padding; row < verticalTiles + padding; row++) {
        p5.fill(0, 0, 0, 0);
        const posStart = GridCorner.copy().add(
          new Vector(col * tileDims.x, row * tileDims.y)
        );

        let rect = [
          posStart.copy(),
          posStart.copy().add(new Vector(tileDims.x, 0)),
          posStart.copy().add(tileDims),
          posStart.copy().add(new Vector(0, tileDims.y)),
        ];

        for (let poly of polygons) {
          if (rectTouchingPolygon(rect, poly)) {
            p5.fill(255, 0, 0, 80);
          }
        }

        const S = toScreenPos(posStart);
        const E = toScreenPos(posStart.add(tileDims));

        p5.rect(S.x, S.y, E.x, E.y);
      }
    }
  } else if (tileMode === "Interlaced") {
    for (let col = -padding; col < horizontalTiles + padding; col++) {
      for (let row = -padding; row < verticalTiles + padding; row++) {
        p5.fill(0, 0, 0, 0);
        const posStart = GridCorner.copy().add(
          new Vector(
            col * tileDims.x + (row % 2 === 0 ? 0 : tileDims.x / 2),
            row * tileDims.y
          )
        );

        let rect = [
          posStart.copy(),
          posStart.copy().add(new Vector(tileDims.x, 0)),
          posStart.copy().add(tileDims),
          posStart.copy().add(new Vector(0, tileDims.y)),
        ];

        for (let poly of polygons) {
          if (rectTouchingPolygon(rect, poly)) {
            p5.fill(255, 0, 0, 80);
          }
        }

        const S = toScreenPos(posStart);
        const E = toScreenPos(posStart.add(tileDims));

        p5.rect(S.x, S.y, E.x, E.y);
      }
    }
  }

  p5.pop();
}

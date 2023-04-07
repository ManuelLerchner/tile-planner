import { P5CanvasInstance } from "react-p5-wrapper";
import { PolygonMesh } from "../../types/Drawing";
import { toScreenPos } from "../Window/UnitConverter";
import { WindowData } from "../Window/Window";
import { MouseData } from "../Window/Mouse";
import { Vector } from "p5";
import { InterfaceData } from "../FliesenPlanner";
import { Polygon } from "../data/DBConverter";

export function nearestPoint(screenPos: Vector) {
  const { polygons } = InterfaceData.drawData;

  const points = polygons.map((poly) => poly.vectors).flat();

  const nearestPoint = points.reduce(
    (
      acc: {
        dist: number;
        point?: Vector;
      },
      point: Vector
    ) => {
      const worldPos = toScreenPos(point);
      const dist = worldPos.dist(screenPos);
      if (dist < acc.dist && dist < 30) {
        return { dist, point };
      }
      return acc;
    },
    {
      dist: Infinity,
    }
  );

  return nearestPoint.point;
}

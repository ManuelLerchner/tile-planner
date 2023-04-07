import { P5CanvasInstance } from "react-p5-wrapper";
import { PolygonMesh } from "../../types/Drawing";
import { toScreenPos } from "../Window/UnitConverter";
import { WindowData } from "../Window/Window";
import { MouseData } from "../Window/Mouse";
import { Vector } from "p5";
import { InterfaceData } from "../FliesenPlanner";
import { Polygon } from "./DBConverter";

export function selectPoint() {
  const { mouseScreenPos } = MouseData;
  const { polygons } = InterfaceData;

  const points = polygons.flat();

  const nearestPoint = points.reduce(
    (
      acc: {
        dist: number;
        point?: Vector;
      },
      point: Vector
    ) => {
      const worldPos = toScreenPos(point);
      const dist = worldPos.dist(mouseScreenPos);
      if (dist < acc.dist && dist < 30) {
        return { dist, point };
      }
      return acc;
    },
    {
      dist: Infinity,
    }
  );

  if (nearestPoint.point) InterfaceData.selectedPoint = nearestPoint.point;
}

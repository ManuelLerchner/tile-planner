import { P5CanvasInstance } from "react-p5-wrapper";
import { PolygonMesh, Vertex } from "../../types/Drawing";
import { toScreenPos } from "../Window/UnitConverter";
import { WindowData } from "../Window/Window";
import { MouseData } from "../Window/Mouse";
import { Vector } from "p5";
import { InterfaceData } from "../FliesenPlanner";
import { Edge, Polygon } from "../data/DBConverter";

export function nearestEdge(screenPos: Vector) {
  const { edges } = InterfaceData.drawData;

  const center = edges.map((edge) => {
    const { start, end } = edge;
    const middle = new Vector((start.x + end.x) / 2, (start.y + end.y) / 2);
    return { middle, edge };
  });

  const nearestEdge = center.reduce(
    (
      acc: {
        dist: number;
        edge?: Edge;
      },
      middlePoint: { middle: Vector; edge: Edge }
    ) => {
      const worldPos = toScreenPos(middlePoint.middle);
      const dist = worldPos.dist(screenPos);

      if (dist < acc.dist && dist < 30) {
        return { dist, edge: middlePoint.edge };
      }
      return acc;
    },
    {
      dist: Infinity,
    }
  );

  return nearestEdge.edge;
}

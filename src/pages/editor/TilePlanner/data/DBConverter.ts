import { Vector } from "p5";
import { PolygonMesh } from "../../../../types/Drawing";
import { calculateConnectedComponents } from "../math/graph";
import { getAreaOfPolygon } from "../math/area";

export type Polygon = {
  vectors: Vector[];
  area: number;
};

export type Edge = {
  start: Vector;
  end: Vector;
  id: [number, number];
};

export type FundamentData = {
  polygons: Polygon[];
  edges: Edge[];
};

export function DrawingToVectors(mesh: PolygonMesh): FundamentData {
  const connectedComponents = calculateConnectedComponents(mesh);

  const polygonsVertices = Object.values(connectedComponents).map((members) => {
    const vectors = members
      .map((id) => {
        const vertex = mesh.vertices.find((vertex) => vertex.id === id);
        if (vertex) {
          return new Vector(vertex.x, vertex.y, id);
        } else {
          return undefined;
        }
      })
      .filter((vector) => vector !== undefined) as Vector[];
    return vectors;
  });

  const polygons: Polygon[] = polygonsVertices.map((vertices) => {
    const area = getAreaOfPolygon(vertices);
    return {
      vectors: vertices,
      area,
    };
  });

  const edges: Edge[] = mesh.edges.flatMap((edge) => {
    const start = mesh.vertices.find((vertex) => vertex.id === edge.startID);
    const end = mesh.vertices.find((vertex) => vertex.id === edge.endID);
    if (start && end) {
      return [
        {
          start: new Vector(start.x, start.y, start.id),
          end: new Vector(end.x, end.y, end.id),
          id: [start.id, end.id],
        },
      ];
    }
    return [];
  });

  return {
    polygons,
    edges,
  };
}

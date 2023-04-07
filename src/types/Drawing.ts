import { Vector } from "p5";

export interface Vertex {
  id: number;
  x: number;
  y: number;
}

export interface IDEdge {
  startID: number;
  endID: number;
}

export interface PolygonMesh {
  vertices: Vertex[];
  edges: IDEdge[];
}

export const testMesh: PolygonMesh = {
  vertices: [
    { id: 0, x: 0, y: 0 },
    { id: 1, x: 100, y: 0 },
    { id: 2, x: 100, y: 100 },
  ],
  edges: [
    { startID: 0, endID: 1 },
    { startID: 1, endID: 2 },
  ],
};

export function getFreeID(vertices: Vertex[]) {
  const ids = vertices.map((vertex) => vertex.id);
  const maxID = Math.max(...ids);
  if (maxID === -Infinity) {
    return 0;
  }
  return maxID + 1;
}

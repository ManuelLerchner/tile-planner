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

export function getFreeID(vertices: Vertex[]) {
  const ids = vertices.map((vertex) => vertex.id);
  const maxID = Math.max(...ids);
  if (maxID === -Infinity) {
    return 0;
  }
  return maxID + 1;
}

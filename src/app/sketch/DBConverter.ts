import { Vector } from "p5";
import { PolygonMesh } from "../../types/Drawing";
import { calculateConnectedComponents } from "../math/ConnedtedComponents";

export type Polygon = Vector[];

export function DrawingToVectors(mesh: PolygonMesh): Polygon[] {
  const connectedComponents = calculateConnectedComponents(mesh);

  const polygons = Object.values(connectedComponents).map((members) => {
    const vectors = members
      .map((id) => {
        const vertex = mesh.vertices.find((vertex) => vertex.id === id);
        if (vertex) {
          return new Vector(vertex.x, vertex.y, id);
        }
      })
      .filter((vector) => vector !== undefined) as Vector[];
    return vectors;
  });

  return polygons;
}

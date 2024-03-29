import { Vector } from "p5";
import { InterfaceData } from "../TilePlanner";
import { DrawingToVectors } from "./DBConverter";

export function deletePoint(point: Vector) {
  const { mesh } = InterfaceData;

  mesh.vertices = mesh.vertices.filter((vertex) => vertex.id !== point.z);

  mesh.edges = mesh.edges.filter(
    (edge) => edge.startID !== point.z && edge.endID !== point.z
  );

  InterfaceData.drawData = DrawingToVectors(mesh);
}

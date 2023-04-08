import { InterfaceData } from "../TilePlanner";
import { DrawingToVectors, Edge } from "./DBConverter";

export function deleteEdge(edge: Edge) {
  const { mesh } = InterfaceData;

  mesh.edges = mesh.edges.filter(
    (e) => e.startID !== edge.id[0] && e.endID !== edge.id[1]
  );

  InterfaceData.drawData = DrawingToVectors(mesh);
}

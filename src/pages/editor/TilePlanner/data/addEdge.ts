import { Vector } from "p5";
import { InterfaceData } from "../TilePlanner";
import { DrawingToVectors } from "./DBConverter";

export function addEdge(oldPoint: Vector, newPoint: Vector) {
  const { mesh } = InterfaceData;

  if (oldPoint.z === newPoint.z) {
    return;
  }

  mesh.edges.push({
    startID: oldPoint.z,
    endID: newPoint.z,
  });

  InterfaceData.drawData = DrawingToVectors(mesh);
}

import { Vector } from "p5";
import { getFreeID } from "../../../../types/Drawing";
import { InterfaceData } from "../TilePlanner";
import { DrawingToVectors } from "./DBConverter";

export function addNewPoint(newPoint: Vector) {
  const { mesh } = InterfaceData;
  const id = getFreeID(mesh.vertices);

  mesh.vertices.push({
    id,
    x: newPoint.x,
    y: newPoint.y,
  });

  InterfaceData.drawData = DrawingToVectors(mesh);
}

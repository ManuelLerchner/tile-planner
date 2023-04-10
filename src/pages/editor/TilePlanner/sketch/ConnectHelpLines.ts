import { P5CanvasInstance } from "react-p5-wrapper";
import { InterfaceData } from "../TilePlanner";
import { MouseData } from "../Window/Mouse";
import { toScreenPos } from "../Window/UnitConverter";

export function connectHelpLines(p5: P5CanvasInstance) {
  const { selectedPoint } = InterfaceData;
  if (!selectedPoint) return;

  const { mouseScreenPos } = MouseData;

  const startPoint = toScreenPos(selectedPoint);

  //draw line to mouse
  p5.stroke(255, 0, 0);
  p5.strokeWeight(1);
  p5.line(startPoint.x, startPoint.y, mouseScreenPos.x, mouseScreenPos.y);
}

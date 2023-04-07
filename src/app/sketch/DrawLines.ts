import { P5CanvasInstance } from "react-p5-wrapper";
import { InterfaceData } from "../FliesenPlanner";
import { MouseData } from "../Window/Mouse";
import { toScreenPos } from "../Window/UnitConverter";
import { Vector } from "p5";

export function drawLine(p5: P5CanvasInstance, drawLength: number) {
  const { selectedPoint } = InterfaceData;
  if (!selectedPoint) return;

  const { mouseScreenPos, mouseGamePos } = MouseData;

  const drawGameVector = mouseGamePos.copy().sub(selectedPoint);

  const angle = (drawGameVector.heading() + Math.PI * 2) % (Math.PI * 2);
  const roundedAngle = Math.round(angle / (Math.PI / 2)) * (Math.PI / 2);

  const roundedVector = selectedPoint
    .copy()
    .add(new Vector(1, 0).setMag(drawLength).rotate(roundedAngle));

  InterfaceData.newPoint = roundedVector;

  const startPoint = toScreenPos(selectedPoint);
  const endPoint = toScreenPos(roundedVector);

  //draw line to mouse
  p5.stroke(255, 0, 0);
  p5.strokeWeight(1);
  p5.line(startPoint.x, startPoint.y, mouseScreenPos.x, mouseScreenPos.y);
  
  //draw line to rounded point
  p5.stroke(0, 255, 0);
  p5.strokeWeight(2);
  p5.line(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
  p5.ellipse(endPoint.x, endPoint.y, 5, 5);
}

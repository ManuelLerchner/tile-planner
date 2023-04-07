import { Vector } from "p5";
import { P5CanvasInstance } from "react-p5-wrapper";
import { toScreenPos } from "./Window/UnitConverter";

const fliesenOffset: Vector = new Vector(0, 0);

export function showGrid(p5: P5CanvasInstance, tileDims: Vector) {
  p5.push();
  p5.strokeWeight(1);
  p5.stroke(0);

  const startX = 1000;

  //horizontal
  for (let i = -startX; i <= startX; i += tileDims.x) {
    const posStart = p5.createVector(i, -startX).add(fliesenOffset);
    const posEnd = p5.createVector(i, startX).add(fliesenOffset);

    const S = toScreenPos(posStart);
    const E = toScreenPos(posEnd);

    p5.line(S.x, S.y, E.x, E.y);
  }

  //vertical
  for (let i = -startX; i <= startX; i += tileDims.y) {
    const posStart = p5.createVector(-startX, i).add(fliesenOffset);

    const posEnd = p5.createVector(startX, i).add(fliesenOffset);

    const S = toScreenPos(posStart);
    const E = toScreenPos(posEnd);

    p5.line(S.x, S.y, E.x, E.y);
  }
  p5.pop();
}

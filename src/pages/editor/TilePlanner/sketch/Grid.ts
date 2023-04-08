import { Vector } from "p5";
import { P5CanvasInstance } from "react-p5-wrapper";
import { toScreenPos } from "../Window/UnitConverter";
import { InterfaceData } from "../TilePlanner";

export function showGrid(p5: P5CanvasInstance) {
  const { tileOffset, tileDims } = InterfaceData;

  p5.push();
  p5.strokeWeight(1);
  p5.stroke(0);

  const GridCorner = new Vector(-1000, -1000).add(tileOffset);
  const GridSize = new Vector(2000, 2000);

  //horizontal
  for (let i = GridCorner.x; i <= GridCorner.x + GridSize.x; i += tileDims.x) {
    const posStart = p5.createVector(i, GridCorner.y);
    const posEnd = p5.createVector(i, GridCorner.y + GridSize.y);

    const S = toScreenPos(posStart);
    const E = toScreenPos(posEnd);

    p5.line(S.x, S.y, E.x, E.y);
  }

  //vertical
  for (let i = GridCorner.y; i <= GridCorner.y + GridSize.y; i += tileDims.y) {
    const posStart = p5.createVector(GridCorner.x, i);
    const posEnd = p5.createVector(GridCorner.x + GridSize.x, i);

    const S = toScreenPos(posStart);
    const E = toScreenPos(posEnd);

    p5.line(S.x, S.y, E.x, E.y);
  }

  p5.pop();
}

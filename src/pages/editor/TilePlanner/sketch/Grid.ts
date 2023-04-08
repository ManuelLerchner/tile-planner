import { Vector } from "p5";
import { P5CanvasInstance } from "react-p5-wrapper";
import { toScreenPos } from "../Window/UnitConverter";
import { InterfaceData } from "../TilePlanner";

export function showGrid(p5: P5CanvasInstance) {
  const { tileOffset, tileDims, tileMode } = InterfaceData;

  p5.push();
  p5.strokeWeight(1);
  p5.stroke(0);

  const GridCorner = new Vector(-800, -800).add(tileOffset);
  const GridSize = new Vector(1600, 1600);

  p5.rectMode(p5.CORNER);

  if (tileMode === "Straight") {
    //horizontal
    for (
      let i = GridCorner.x;
      i <= GridCorner.x + GridSize.x;
      i += tileDims.x
    ) {
      const posStart = p5.createVector(i, GridCorner.y);
      const posEnd = p5.createVector(i, GridCorner.y + GridSize.y);

      const S = toScreenPos(posStart);
      const E = toScreenPos(posEnd);

      p5.line(S.x, S.y, E.x, E.y);
    }

    //vertical
    for (
      let i = GridCorner.y;
      i <= GridCorner.y + GridSize.y;
      i += tileDims.y
    ) {
      const posStart = p5.createVector(GridCorner.x, i);
      const posEnd = p5.createVector(GridCorner.x + GridSize.x, i);

      const S = toScreenPos(posStart);
      const E = toScreenPos(posEnd);

      p5.line(S.x, S.y, E.x, E.y);
    }
  } else if (tileMode === "Interlaced") {
    p5.rectMode(p5.CORNERS);
    p5.fill(0, 0, 0, 0);
    for (
      let i = GridCorner.x;
      i <= GridCorner.x + GridSize.x;
      i += tileDims.x
    ) {
      let row = 0;
      for (
        let j = GridCorner.y;
        j <= GridCorner.y + GridSize.y;
        j += tileDims.y
      ) {
        let start = i;
        if (row % 2 === 0) {
          start += tileDims.x / 2;
        }

        const posStart = p5.createVector(start, j);

        const S = toScreenPos(posStart);
        const E = toScreenPos(posStart.add(tileDims));

        p5.rect(S.x, S.y, E.x, E.y);
        row++;
      }
    }
  }

  p5.pop();
}

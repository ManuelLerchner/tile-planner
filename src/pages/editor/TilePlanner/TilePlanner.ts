import { Vector } from "p5";
import { P5CanvasInstance } from "react-p5-wrapper";
import {
  MouseData,
  mousePressed,
  mouseReleased,
  mouseWheel,
  calculatePanMovement,
  updateMousePos,
} from "./Window/Mouse";
import { toGamePos, toScreenPos } from "./Window/UnitConverter";
import { WindowData, getWindowSize } from "./Window/Window";
import { showGrid } from "./sketch/Grid";

import { PolygonMesh } from "../../../types/Drawing";
import { InteractTool } from "../../../types/InteractMode";
import { TileMode } from "../../../types/TileMode";
import { DrawingToVectors, FundamentData } from "./data/DBConverter";
import { addEdge } from "./data/addEdge";
import { addNewPoint } from "./data/addPoint";
import { deleteEdge } from "./data/deleteEdge";
import { deletePoint } from "./data/deletePoint";
import { nearestEdge } from "./helper/nearestEdge";
import { nearestPoint } from "./helper/nearestPoint";
import { drawMarkerHelpLines } from "./sketch/MarkerHelpLines";
import { drawPolygons } from "./sketch/PolygonDrawer";
import { MarkerMode } from "../../../types/MarkerMode";
import { connectHelpLines } from "./sketch/ConnectHelpLines";

export const InterfaceData = {
  mesh: {} as PolygonMesh,
  drawData: {} as FundamentData,
  drawLength: 100 as number,
  selectedPoint: undefined as Vector | undefined,
  newPoint: undefined as Vector | undefined,
  tileOffset: new Vector() as Vector,
  tileDims: new Vector() as Vector,
  tileMode: "Normal" as TileMode,
  markerMode: "Exact" as MarkerMode,
  tool: "Marker" as InteractTool["name"],
};

const arrowKeysPressed = {
  up: false,
  down: false,
  left: false,
  right: false,
};

export function TilePlanner(p5: P5CanvasInstance) {
  p5.updateWithProps = (props) => {
    const dims = props.tileDims as number[];
    if (dims[0] > 0 && dims[1] > 0) {
      InterfaceData.tileDims = new Vector(dims[0], dims[1]);
    }
    InterfaceData.drawLength = props.drawLength as number;
    InterfaceData.tool = props.tool as InteractTool["name"];
    InterfaceData.newPoint = undefined;
    InterfaceData.selectedPoint = undefined;
    InterfaceData.mesh = props.mesh as PolygonMesh;
    InterfaceData.tileOffset = props.tileOffset as Vector;
    InterfaceData.tileMode = props.tileMode as TileMode;
    InterfaceData.drawData = DrawingToVectors(InterfaceData.mesh);
    InterfaceData.markerMode = props.markerMode as MarkerMode;
  };

  p5.setup = () => {
    const { width, height } = getWindowSize();
    p5.createCanvas(width, height, p5.P2D);
  };

  p5.draw = () => {
    //automatic resize
    const { width, height, updated } = getWindowSize();
    if (updated) {
      p5.resizeCanvas(width, height);
    }

    p5.background(51);
    p5.translate(width / 2, height / 2);

    showGrid(p5);
    drawPolygons(p5);

    if (InterfaceData.tool === "Marker") {
      drawMarkerHelpLines(p5);
    }

    if (InterfaceData.tool === "Connect") {
      connectHelpLines(p5);
    }

    //show selectedPoint
    const { selectedPoint } = InterfaceData;
    if (selectedPoint) {
      const screenPos = toScreenPos(selectedPoint);
      p5.fill(255, 0, 0);
      p5.circle(screenPos.x, screenPos.y, 15);
    }

    // move via arrow keys
    const movementVector = new Vector(0, 0);
    movementVector.x += arrowKeysPressed.right ? 1 : 0;
    movementVector.x -= arrowKeysPressed.left ? 1 : 0;
    movementVector.y += arrowKeysPressed.down ? 1 : 0;
    movementVector.y -= arrowKeysPressed.up ? 1 : 0;

    if (movementVector.magSq() > 0) {
      const vec = new Vector(movementVector.x, movementVector.y).mult(10);
      const pan = calculatePanMovement(vec);
      WindowData.transOffset = WindowData.transOffset.sub(pan);
    }
  };

  p5.mouseWheel = mouseWheel;
  p5.mouseReleased = mouseReleased;

  p5.mousePressed = (e: MouseEvent) => {
    mousePressed(e);

    const oldPoint = InterfaceData.selectedPoint?.copy();
    const { mouseScreenPos } = MouseData;

    const [closestPoint, closestPointDist] = nearestPoint(mouseScreenPos);
    InterfaceData.selectedPoint = closestPoint;

    if (MouseData.mouseButton === "LEFT") {
      if (InterfaceData.tool === "Marker") {
        const { newPoint } = InterfaceData;
        if (newPoint) {
          addNewPoint(newPoint);
          InterfaceData.newPoint = undefined;
          InterfaceData.selectedPoint = undefined;
          return;
        } else {
          const { mesh } = InterfaceData;
          if (mesh.vertices.length === 0) {
            addNewPoint(toGamePos(MouseData.mouseScreenPos));
          }
        }
      }

      if (InterfaceData.tool === "Delete") {
        const [closestEdge, closestEdgeDist] = nearestEdge(mouseScreenPos);

        if (closestPoint && closestPointDist < closestEdgeDist) {
          deletePoint(closestPoint);
          InterfaceData.selectedPoint = undefined;
          return;
        } else if (closestEdge) {
          deleteEdge(closestEdge);
          return;
        }
      }

      if (InterfaceData.tool === "Connect") {
        const newPoint = InterfaceData.selectedPoint;

        if (newPoint && oldPoint) {
          if (newPoint.equals(oldPoint)) return;

          addEdge(oldPoint, newPoint);
        }

        return;
      }
    }
  };

  p5.mouseDragged = (e: MouseEvent) => {
    const { outside } = MouseData;
    const { tool } = InterfaceData;

    if (outside) return;

    const vec = new Vector(e.movementX, e.movementY);
    const pan = calculatePanMovement(vec);

    if (tool === "Align") {
      InterfaceData.tileOffset = InterfaceData.tileOffset.add(pan.div(2));
    } else {
      WindowData.transOffset = WindowData.transOffset.add(pan);
    }
  };

  p5.mouseMoved = (e: MouseEvent) => {
    updateMousePos(p5, e);
  };

  p5.keyPressed = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      InterfaceData.selectedPoint = undefined;
      InterfaceData.newPoint = undefined;
    }
    if (e.key === "ArrowUp") {
      arrowKeysPressed.up = true;
    }
    if (e.key === "ArrowDown") {
      arrowKeysPressed.down = true;
    }
    if (e.key === "ArrowLeft") {
      arrowKeysPressed.left = true;
    }
    if (e.key === "ArrowRight") {
      arrowKeysPressed.right = true;
    }
  };

  p5.keyReleased = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      arrowKeysPressed.up = false;
    }
    if (e.key === "ArrowDown") {
      arrowKeysPressed.down = false;
    }
    if (e.key === "ArrowLeft") {
      arrowKeysPressed.left = false;
    }
    if (e.key === "ArrowRight") {
      arrowKeysPressed.right = false;
    }
  };
}

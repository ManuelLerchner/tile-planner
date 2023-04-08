import { Vector } from "p5";
import { P5CanvasInstance } from "react-p5-wrapper";
import {
  MouseData,
  mousePressed,
  mouseReleased,
  mouseWheel,
  updateMousePos,
} from "./Window/Mouse";
import { toGamePos, toScreenPos } from "./Window/UnitConverter";
import { WindowData, getWindowSize } from "./Window/Window";
import { showGrid } from "./sketch/Grid";

import { PolygonMesh } from "../../../types/Drawing";
import { InteractMode } from "../../../types/InteractMode";
import { TileMode } from "../../../types/TileMode";
import {
  DrawingToVectors,
  FundamentData
} from "./data/DBConverter";
import { addEdge } from "./data/addEdge";
import { addNewPoint } from "./data/addPoint";
import { deleteEdge } from "./data/deleteEdge";
import { deletePoint } from "./data/deletePoint";
import { nearestEdge } from "./helper/nearestEdge";
import { nearestPoint } from "./helper/nearestPoint";
import { drawLine } from "./sketch/DrawLines";
import { drawPolygons } from "./sketch/PolygonDrawer";

export const InterfaceData = {
  mesh: {} as PolygonMesh,
  drawData: {} as FundamentData,
  selectedPoint: undefined as Vector | undefined,
  newPoint: undefined as Vector | undefined,
  tileOffset: new Vector() as Vector,
  tileDims: new Vector() as Vector,
  tileMode: "Normal" as TileMode,
};

export function TilePlanner(p5: P5CanvasInstance) {
  let drawLength: number = 100;
  let mode: InteractMode["name"] = "Marker";

  p5.updateWithProps = (props) => {
    const dims = props.tileDims as number[];
    if (dims[0] > 0 && dims[1] > 0) {
      InterfaceData.tileDims = new Vector(dims[0], dims[1]);
    }
    drawLength = props.drawLength as number;
    mode = props.mode as InteractMode["name"];
    InterfaceData.newPoint = undefined;
    InterfaceData.selectedPoint = undefined;
    InterfaceData.mesh = props.mesh as PolygonMesh;
    InterfaceData.tileOffset = props.tileOffset as Vector;
    InterfaceData.tileMode = props.tileMode as TileMode;
    InterfaceData.drawData = DrawingToVectors(InterfaceData.mesh);
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

    if (mode === "Marker" || mode === "Connect") {
      drawLine(p5, drawLength, mode === "Marker");
    }

    //show selectedPoint
    const { selectedPoint } = InterfaceData;
    if (selectedPoint) {
      const screenPos = toScreenPos(selectedPoint);
      p5.fill(255, 0, 0);
      p5.circle(screenPos.x, screenPos.y, 15);
    }

    // showMeasure();
    // Util();
  };

  p5.mouseWheel = mouseWheel;
  p5.mouseReleased = mouseReleased;

  p5.mousePressed = (e: MouseEvent) => {
    mousePressed(e);

    const oldPoint = InterfaceData.selectedPoint?.copy();
    const { mouseScreenPos } = MouseData;

    InterfaceData.selectedPoint = nearestPoint(mouseScreenPos);

    if (MouseData.mouseButton === "LEFT") {
      if (mode === "Marker") {
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

      if (mode === "Delete") {
        const { selectedPoint } = InterfaceData;
        if (selectedPoint) {
          deletePoint(selectedPoint);
          InterfaceData.selectedPoint = undefined;
          return;
        }
        const edge = nearestEdge(mouseScreenPos);
        if (edge) {
          deleteEdge(edge);
          return;
        }
      }

      if (mode === "Connect") {
        const newPoint = InterfaceData.selectedPoint;
        if (newPoint && oldPoint) {
          addEdge(oldPoint, newPoint);
          InterfaceData.selectedPoint = undefined;
        }

        return;
      }
    }
  };

  p5.mouseDragged = (e: MouseEvent) => {
    const { scale } = WindowData;
    const { outside } = MouseData;

    if (outside) return;

    const vec = new Vector(e.movementX, -e.movementY);
    vec.div(scale);

    if (mode === "Align") {
      InterfaceData.tileOffset.add(vec.div(100));
      return;
    }

    WindowData.transOffset.add(vec);
  };
  p5.mouseMoved = (e: MouseEvent) => {
    updateMousePos(p5, e);
  };
}

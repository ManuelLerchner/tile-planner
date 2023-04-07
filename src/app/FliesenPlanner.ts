import { P5CanvasInstance } from "react-p5-wrapper";
import { showGrid } from "./sketch/Grid";
import { toGamePos, toScreenPos } from "./Window/UnitConverter";
import {
  mouseWheel,
  MouseData,
  updateMousePos,
  mousePressed,
  mouseReleased,
} from "./Window/Mouse";
import { WindowData, getWindowSize } from "./Window/Window";
import { Vector } from "p5";

import { PolygonMesh, Vertex, getFreeID, testMesh } from "../types/Drawing";
import { drawPolygons } from "./sketch/PolygonDrawer";
import {
  DrawingToVectors,
  Edge,
  FundamentData,
  Polygon,
} from "./data/DBConverter";
import { drawLine } from "./sketch/DrawLines";
import { Mode } from "../types/Modes";
import { nearestPoint } from "./helper/nearestPoint";
import { addNewPoint } from "./data/addPoint";
import { deletePoint } from "./data/deletePoint";
import { addEdge } from "./data/addEdge";
import { nearestEdge } from "./helper/nearestEdge";
import { deleteEdge } from "./data/deleteEdge";

export const InterfaceData = {
  mesh: {} as PolygonMesh,
  drawData: {} as FundamentData,
  selectedPoint: undefined as Vector | undefined,
  newPoint: undefined as Vector | undefined,
  tileOffset: new Vector() as Vector,
};

export function FliesenPlanner(p5: P5CanvasInstance) {
  let tileDims: Vector = new Vector(30, 30);
  let drawLength: number = 100;
  let mode: Mode["name"] = "Marker";

  p5.updateWithProps = (props) => {
    const dims = props.tileDims as number[];
    if (dims[0] > 0 && dims[1] > 0) {
      tileDims = new Vector(dims[0], dims[1]);
    }
    drawLength = props.drawLength as number;
    mode = props.mode as Mode["name"];
    InterfaceData.newPoint = undefined;
    InterfaceData.selectedPoint = undefined;
    InterfaceData.mesh = props.mesh as PolygonMesh;
    InterfaceData.tileOffset = props.tileOffset as Vector;

    if (InterfaceData.mesh.vertices.length === 0) {
      InterfaceData.mesh.vertices.push({
        id: 0,
        x: 0,
        y: 0,
      });
    }

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

    showGrid(p5, tileDims);
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
        console.log(edge);
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

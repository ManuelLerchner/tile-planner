import { P5CanvasInstance } from "react-p5-wrapper";
import { showGrid } from "./Grid";
import { toGamePos, toScreenPos } from "./Window/UnitConverter";
import {
  mouseWheel,
  mouseDragged,
  MouseData,
  updateMousePos,
  mousePressed,
  mouseReleased,
} from "./Window/Mouse";
import { getWindowSize } from "./Window/Window";
import { Vector } from "p5";

import { PolygonMesh, Vertex, getFreeID, testMesh } from "../types/Drawing";
import { drawPolygons } from "./sketch/PolygonDrawer";
import { DrawingToVectors, Polygon } from "./sketch/DBConverter";
import { drawLine } from "./sketch/DrawLines";
import { selectPoint } from "./sketch/SelectPoint";

export const InterfaceData = {
  polygons: [] as Polygon[],
  selectedPoint: undefined as Vector | undefined,
  newPoint: undefined as Vector | undefined,
  onNewPointConfirmed: (point: Vector) => {},
};

export function FliesenPlanner(p5: P5CanvasInstance) {
  let tileDims: Vector = new Vector(30, 30);
  let drawLength: number = 100;

  const Mode: "DRAW" | "SELECT" = "DRAW";

  p5.updateWithProps = (props) => {
    if (props.tileDims) {
      const dims = props.tileDims as number[];
      if (dims[0] > 0 && dims[1] > 0) {
        tileDims = new Vector(dims[0], dims[1]);
      }
    }
    if (props.drawLength) {
      drawLength = props.drawLength as number;
    }
  };

  p5.setup = () => {
    const { width, height } = getWindowSize();

    p5.createCanvas(width, height, p5.P2D);

    InterfaceData.polygons = DrawingToVectors(testMesh);

    InterfaceData.onNewPointConfirmed = (point: Vector) => {
      const id = getFreeID(testMesh.vertices);
      const { selectedPoint } = InterfaceData;
      console.log(selectedPoint);
      
      if (!selectedPoint) return;

      testMesh.vertices.push({
        id,
        x: point.x,
        y: point.y,
      });

      testMesh.edges.push({
        startID: selectedPoint.z,
        endID: id,
      });

      InterfaceData.polygons = DrawingToVectors(testMesh);
    };
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
    drawPolygons(p5, InterfaceData.polygons);

    if (Mode === "DRAW") {
      drawLine(p5, drawLength);
    }
    // showMeasure();
    // Util();
  };

  p5.mouseWheel = mouseWheel;
  p5.mouseDragged = mouseDragged;
  p5.mouseMoved = (e: MouseEvent) => {
    updateMousePos(p5, e);
  };

  p5.mousePressed = mousePressed;
  p5.mouseReleased = mouseReleased;
}

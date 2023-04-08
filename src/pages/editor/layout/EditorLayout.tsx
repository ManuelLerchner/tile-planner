import SideNav from "./SideNav";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";
import React from "react";
import { Outlet } from "react-router-dom";
import { Mode } from "../../../types/Modes";
import { PolygonMesh } from "../../../types/Drawing";
import { Vector } from "p5";

export default function EditorLayout({
  mode,
  setMode,
  drawLength,
  setDrawLength,
  tileDims,
  setTileDims,
  setShowEdit,
  save,
  mainContentRef,
  children,
}: {
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  drawLength: number;
  setDrawLength: React.Dispatch<React.SetStateAction<number>>;
  tileDims: [number, number];
  setTileDims: React.Dispatch<React.SetStateAction<[number, number]>>;
  setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
  save: () => Promise<void>;
  mainContentRef: React.MutableRefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen ">
      <SideNav currentMode={mode} setMode={setMode} />
      <div className="flex flex-col flex-1 w-full">
        <TopBar
          mainContentRef={mainContentRef}
          save={save}
          setShowEdit={setShowEdit}
        />
        <main className="bg-gray-800 w-full h-full">{children}</main>
        <BottomBar
          drawLength={drawLength}
          setDrawLength={setDrawLength}
          tileDims={tileDims}
          setTileDims={setTileDims}
        />
      </div>
    </div>
  );
}

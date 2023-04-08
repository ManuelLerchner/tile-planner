import SideNav from "./SideNav";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";
import React from "react";
import { Outlet } from "react-router-dom";
import { InteractMode } from "../../../types/InteractMode";
import { PolygonMesh } from "../../../types/Drawing";
import { Vector } from "p5";
import { TileMode } from "../../../types/TileMode";

export default function EditorLayout({
  mode,
  setMode,
  drawLength,
  setDrawLength,
  tileDims,
  setTileDims,
  tileMode,
  setTileMode,
  setShowEdit,
  save,
  mainContentRef,
  children,
}: {
  mode: InteractMode;
  setMode: React.Dispatch<React.SetStateAction<InteractMode>>;
  drawLength: number;
  setDrawLength: React.Dispatch<React.SetStateAction<number>>;
  tileDims: [number, number];
  setTileDims: React.Dispatch<React.SetStateAction<[number, number]>>;
  setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
  tileMode: TileMode;
  setTileMode: React.Dispatch<React.SetStateAction<TileMode>>;
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
          tileMode={tileMode}
          setTileMode={setTileMode}
        />
      </div>
    </div>
  );
}

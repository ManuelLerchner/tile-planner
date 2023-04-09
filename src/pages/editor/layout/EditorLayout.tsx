import React from "react";
import { InteractTool } from "../../../types/InteractMode";
import { TileMode } from "../../../types/TileMode";
import BottomBar from "./BottomBar";
import SideNav from "./SideNav";
import TopBar from "./TopBar";
import { MarkerMode } from "../../../types/MarkerMode";

export default function EditorLayout({
  interactTool,
  setInteractTool,
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
  markerMode,
  setMarkerMode,
}: {
  interactTool: InteractTool;
  setInteractTool: React.Dispatch<React.SetStateAction<InteractTool>>;
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
  markerMode: MarkerMode;
  setMarkerMode: React.Dispatch<React.SetStateAction<MarkerMode>>;
}) {
  return (
    <div className="flex h-screen ">
      <SideNav currentTool={interactTool} setInteractTool={setInteractTool} />
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
          markerMode={markerMode}
          setMarkerMode={setMarkerMode}
        />
      </div>
    </div>
  );
}

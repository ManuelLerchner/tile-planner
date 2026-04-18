import React from "react";
import { TileMode } from "../../../types/TileMode";
import { MarkerMode } from "../../../types/MarkerMode";

const inputCls =
  "bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-teal-500";

export default function BottomBar({
  drawLength,
  setDrawLength,
  tileDims,
  setTileDims,
  tileMode,
  setTileMode,
  markerMode,
  setMarkerMode,
}: {
  drawLength: number;
  setDrawLength: React.Dispatch<React.SetStateAction<number>>;
  tileDims: [number, number];
  setTileDims: React.Dispatch<React.SetStateAction<[number, number]>>;
  tileMode: TileMode;
  setTileMode: React.Dispatch<React.SetStateAction<TileMode>>;
  markerMode: MarkerMode;
  setMarkerMode: React.Dispatch<React.SetStateAction<MarkerMode>>;
}) {
  return (
    <div className="bg-slate-800 border-t border-slate-700 text-white px-6 py-3 flex flex-row flex-wrap gap-4 items-center justify-between flex-shrink-0">
      <div className="flex flex-row flex-wrap gap-2 items-center">
        <label htmlFor="marker_mode" className="text-sm font-semibold text-slate-300 mr-1">
          Marker Mode:
        </label>
        <select
          id="marker_mode"
          className={inputCls + " w-32"}
          value={markerMode}
          onChange={(e) => setMarkerMode(e.target.value as MarkerMode)}
        >
          <option value="Free">Free</option>
          <option value="Ortho">Ortho</option>
        </select>

        {markerMode === "Ortho" && (
          <>
            <input
              type="number"
              className={inputCls + " w-24"}
              value={drawLength}
              onChange={(e) => setDrawLength(parseFloat(e.target.value))}
            />
            <span className="text-sm text-slate-300">cm</span>
          </>
        )}
      </div>

      <div className="flex flex-row flex-wrap gap-2 items-center">
        <label className="text-sm font-semibold text-slate-300 mr-1">Tile:</label>
        <input
          type="number"
          className={inputCls + " w-20"}
          value={tileDims[0]}
          onChange={(e) =>
            setTileDims((old) => [parseFloat(e.target.value), old[1]])
          }
        />
        <span className="text-slate-400">×</span>
        <input
          type="number"
          className={inputCls + " w-20"}
          value={tileDims[1]}
          onChange={(e) =>
            setTileDims((old) => [old[0], parseFloat(e.target.value)])
          }
        />
        <span className="text-sm text-slate-300 mr-2">cm</span>
        <select
          className={inputCls + " w-36"}
          value={tileMode}
          onChange={(e) => setTileMode(e.target.value as TileMode)}
        >
          <option value="Straight">Straight</option>
          <option value="Interlaced 1">Interlaced 1</option>
          <option value="Interlaced 2">Interlaced 2</option>
        </select>
      </div>
    </div>
  );
}

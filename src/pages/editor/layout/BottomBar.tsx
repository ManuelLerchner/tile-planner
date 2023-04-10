import React from "react";
import { TileMode } from "../../../types/TileMode";
import { MarkerMode } from "../../../types/MarkerMode";

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
    <div className="bg-gray-700 text-white text-2xl font-bold p-4 flex flex-row flex-wrap gap-4 items-center justify-between px-8">
      <div className="flex flex-row flex-wrap gap-2 items-center">
        <label htmlFor="marker_mode" className="mr-2 text-xl">
          Marker Mode:
        </label>
        <select
          name="marker_mode"
          id="marker_mode"
          className="bg-gray-800 text-white p-2 rounded-lg text-center w-36"
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
              className="w-32 bg-gray-800 text-white p-2 rounded-lg text-center"
              name="length"
              id="length"
              value={drawLength}
              onChange={(e) => setDrawLength(parseFloat(e.target.value))}
            />
            <span className="text-xl">cm</span>
          </>
        )}
      </div>
      <div className="flex flex-row flex-wrap gap-2 items-center">
        <label htmlFor="tile_width" className="mr-2 text-xl">
          Tile:
        </label>
        <input
          type="number"
          className="w-24 bg-gray-800 text-white p-2 rounded-lg text-center"
          name="tile_width"
          id="tile_width"
          value={tileDims[0]}
          onChange={(e) => {
            const newWidth = parseFloat(e.target.value);
            setTileDims((old) => [newWidth, old[1]]);
          }}
        />
        <span className="text-2xl">x</span>
        <input
          type="number"
          className="w-24 bg-gray-800 text-white p-2 rounded-lg text-center"
          name="tile_width"
          id="tile_width"
          value={tileDims[1]}
          onChange={(e) => {
            const newHeight = parseFloat(e.target.value);
            setTileDims((old) => [old[0], newHeight]);
          }}
        />
        <span className="text-xl mx-2">cm</span>
        <select
          name="tile_mode"
          id="tile_mode"
          className="bg-gray-800 text-white p-2 rounded-lg text-center"
          value={tileMode}
          onChange={(e) => setTileMode(e.target.value as TileMode)}
        >
          <option value="Straight">Straight</option>
          <option value="Interlaced">Interlaced</option>
        </select>
      </div>
    </div>
  );
}

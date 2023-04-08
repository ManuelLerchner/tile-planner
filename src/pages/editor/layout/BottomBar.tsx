import React, { useContext, useState } from "react";

export default function BottomBar({
  drawLength,
  setDrawLength,
  tileDims,
  setTileDims,
}: {
  drawLength: number;
  setDrawLength: React.Dispatch<React.SetStateAction<number>>;
  tileDims: [number, number];
  setTileDims: React.Dispatch<React.SetStateAction<[number, number]>>;
}) {
  return (
    <div className="flex flex-row justify-between items-center bg-gray-700 text-white text-2xl font-bold h-24 px-4">
      <div className="flex flex-row gap-2 items-center">
        <label htmlFor="length">Length</label>
        <input
          type="number"
          className="w-52 bg-gray-800 text-white p-2 rounded-lg"
          name="length"
          id="length"
          value={drawLength}
          onChange={(e) => setDrawLength(parseInt(e.target.value))}
        />
      </div>
      <div className="flex flex-row gap-2 items-center">
        <label htmlFor="tile_width">Tile:</label>
        <input
          type="number"
          className="w-20 bg-gray-800 text-white p-2 rounded-lg"
          name="tile_width"
          id="tile_width"
          value={tileDims[0]}
          onChange={(e) => {
            const newWidth = parseInt(e.target.value);
            setTileDims((old) => [newWidth, old[1]]);
          }}
        />
        <input
          type="number"
          className="w-20 bg-gray-800 text-white p-2 rounded-lg"
          name="tile_width"
          id="tile_width"
          value={tileDims[1]}
          onChange={(e) => {
            const newHeight = parseInt(e.target.value);
            setTileDims((old) => [old[0], newHeight]);
          }}
        />
      </div>
    </div>
  );
}

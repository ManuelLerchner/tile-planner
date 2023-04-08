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
    <div className="bg-gray-700 text-white text-2xl font-bold p-4 h-16 flex flex-row items-center justify-between px-8">
      <div className="flex flex-row gap-2 items-center">
        <label htmlFor="length" className="mr-8">
          Length:
        </label>
        <input
          type="number"
          className="w-32 bg-gray-800 text-white p-2 rounded-lg text-center"
          name="length"
          id="length"
          value={drawLength}
          onChange={(e) => setDrawLength(parseInt(e.target.value))}
        />
        <span className="text-xl">cm</span>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <label htmlFor="tile_width" className="mr-8">
          Tile:
        </label>
        <input
          type="number"
          className="w-20 bg-gray-800 text-white p-2 rounded-lg text-center"
          name="tile_width"
          id="tile_width"
          value={tileDims[0]}
          onChange={(e) => {
            const newWidth = parseInt(e.target.value);
            setTileDims((old) => [newWidth, old[1]]);
          }}
        />
        <span className="text-2xl">x</span>
        <input
          type="number"
          className="w-20 bg-gray-800 text-white p-2 rounded-lg text-center"
          name="tile_width"
          id="tile_width"
          value={tileDims[1]}
          onChange={(e) => {
            const newHeight = parseInt(e.target.value);
            setTileDims((old) => [old[0], newHeight]);
          }}
        />
        <span className="text-xl ml-2">cm</span>
      </div>
    </div>
  );
}

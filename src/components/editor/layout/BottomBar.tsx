import React, { useContext, useState } from "react";
import { GlobalContext } from "../../pages/Editor";

export default function BottomBar() {
  const { drawLengthCM, setDrawLengthCM, setTileDims, tileDims } =
    useContext(GlobalContext);

  return (
    <div className="flex flex-row justify-between items-center bg-gray-700 text-white text-2xl font-bold h-24 px-4">
      <div className="flex flex-row gap-2 items-center">
        <label htmlFor="length">Length</label>
        <input
          type="number"
          className="w-52 bg-gray-800 text-white p-2 rounded-lg"
          name="length"
          id="length"
          value={drawLengthCM}
          onChange={(e) => setDrawLengthCM(parseInt(e.target.value))}
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

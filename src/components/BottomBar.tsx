import React, { useContext, useState } from "react";
import { LengthUnit, LengthUnits } from "../types/LengthUnits";
import { GlobalContext } from "../App";

export default function BottomBar() {
  const { drawLengthCM, setDrawLengthCM, setTileDims, tileDims } =
    useContext(GlobalContext);
  const [length_unit, setLengthUnit] = useState<number>(LengthUnits.cm.cm);

  const [tile_width_unit, setTileWidthUnit] = React.useState<number>(
    LengthUnits.cm.cm
  );

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
          onChange={(e) =>
            setDrawLengthCM(parseInt(e.target.value) * length_unit)
          }
        />
        <select
          name="length_unit"
          id="length_unit"
          className="bg-gray-800 text-white p-2 rounded-lg"
          value={length_unit}
          onChange={(e) => {
            console.log(e.target.value);
            setLengthUnit(parseInt(e.target.value));
          }}
        >
          {Object.values(LengthUnits).map((lengthUnit) => (
            <option key={lengthUnit.name} value={lengthUnit.cm}>
              {lengthUnit.name}
            </option>
          ))}
        </select>
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
            const newWidth = parseInt(e.target.value) * tile_width_unit;
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
            const newHeight = parseInt(e.target.value) * tile_width_unit;
            setTileDims((old) => [old[0], newHeight]);
          }}
        />

        <select
          name="tile_width_unit"
          id="tile_width_unit"
          className="bg-gray-800 text-white p-2 rounded-lg"
          value={tile_width_unit}
          onChange={(e) => {
            console.log(e.target.value);
            setTileWidthUnit(parseInt(e.target.value));
          }}
        >
          {Object.values(LengthUnits).map((lengthUnit) => (
            <option key={lengthUnit.name} value={lengthUnit.cm}>
              {lengthUnit.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

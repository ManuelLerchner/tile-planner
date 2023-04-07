import React, { useContext } from "react";
import { Modes } from "../types/Modes";
import { GlobalContext } from "../App";

export default function SideNav() {
  const { mode: currentMode, setMode } = useContext(GlobalContext);

  return (
    <div className="h-screen w-48 bg-gray-800 text-white z-40 shadow-2xl">
      <div className="flex flex-col items-center">
        <div className="w-full h-16 border-b flex items-center justify-center">
          <h1 className="text-2xl font-bold">Tile-Planner</h1>
        </div>

        <div className="w-full py-12 flex items-center justify-center">
          <ul className="flex flex-col gap-4">
            {Modes.map((mode) => (
              <li
                className={
                  "font-bold cursor-pointer " +
                  (mode.name === currentMode.name ? "text-blue-500" : "")
                }
                key={mode.name}
                onClick={() => setMode(mode)}
              >
                {mode.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

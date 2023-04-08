import React from "react";
import { Mode, Modes } from "../../../types/Modes";
import { useNavigate } from "react-router-dom";

export default function SideNav({
  setMode,
  currentMode,
}: {
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  currentMode: Mode;
}) {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-48 bg-gray-800 text-white z-40 shadow-2xl drop-shadow-lg">
      <div className="flex flex-col items-center">
        <div className="w-full h-16 border-b flex items-center justify-center">
          <h1
            className="text-2xl font-bold cursor-pointer"
            onClick={() => {
              navigate("/");
            }}
          >
            Tile Planner
          </h1>
        </div>

        <div className="w-full py-12 flex items-center justify-center flex-col gap-4">
          <ul className="flex flex-col gap-4">
            {Modes.map((mode) => (
              <li
                className={
                  "cursor-pointer hover:scale-[102%] my-2 " +
                  (mode.name === currentMode.name ? "text-yellow-500" : "")
                }
                key={mode.name}
                onClick={() => setMode(mode)}
              >
                <div className="flex items- gap-4 justify-start font-bold text-xl">
                  <mode.icon />

                  {mode.name}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

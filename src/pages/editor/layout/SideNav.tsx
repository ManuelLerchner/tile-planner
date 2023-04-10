import React from "react";
import { InteractTool, Tools } from "../../../types/InteractMode";
import { useNavigate } from "react-router-dom";

export default function SideNav({
  setInteractTool,
  currentTool,
}: {
  setInteractTool: React.Dispatch<React.SetStateAction<InteractTool>>;
  currentTool: InteractTool;
}) {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-48 bg-gray-800 text-white z-40 shadow-2xl drop-shadow-lg">
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
      <div className="flex flex-col items-center justify-between h-full">
        <ul className="flex flex-col gap-4 my-8">
          {Tools.map((mode) => (
            <li
              className={
                "cursor-pointer hover:scale-[102%] my-2 " +
                (mode.name === currentTool.name ? "text-yellow-500" : "")
              }
              key={mode.name}
              onClick={() => setInteractTool(mode)}
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
  );
}

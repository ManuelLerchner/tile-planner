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
    <div className="h-screen w-44 bg-slate-800 border-r border-slate-700 text-white z-40 shadow-2xl flex flex-col flex-shrink-0">
      <div
        className="h-16 border-b border-slate-700 flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-700 transition-colors flex-shrink-0"
        onClick={() => navigate("/")}
      >
        <div className="grid grid-cols-2 gap-[3px]">
          <div className="w-2 h-2 bg-teal-400 rounded-[2px]" />
          <div className="w-2 h-2 bg-teal-400/40 rounded-[2px]" />
          <div className="w-2 h-2 bg-teal-400/40 rounded-[2px]" />
          <div className="w-2 h-2 bg-teal-400 rounded-[2px]" />
        </div>
        <h1 className="text-base font-bold tracking-tight">Tile Planner</h1>
      </div>

      <ul className="flex flex-col gap-1 p-3 mt-2">
        {Tools.map((mode) => (
          <li
            key={mode.name}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer font-semibold text-sm transition-all ${
              mode.name === currentTool.name
                ? "bg-slate-700 text-teal-400"
                : "text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
            onClick={() => setInteractTool(mode)}
          >
            <mode.icon fontSize="small" />
            {mode.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

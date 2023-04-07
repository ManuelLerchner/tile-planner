import React from "react";

export default function SideNav() {
  return (
    <div className="h-screen w-48 bg-gray-800 text-white z-40 shadow-2xl">
      <div className="flex flex-col items-center">
        <div className="w-full h-16 border-b flex items-center justify-center">
          <h1 className="text-2xl font-bold">Tile-Planner</h1>
        </div>

        <div className="w-full py-12 flex items-center justify-center">
          <ul>
            <li>Test</li>
            <li>Test</li>
            <li>Test</li>
            <li>Test</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

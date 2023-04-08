import React from "react";
import TopBar from "./TopBar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex flex-col flex-1 h-screen w-screen">
      <TopBar />
      <main className="bg-stone-700 h-full p-10 overflow-y-auto">
        {<Outlet />}
      </main>
    </div>
  );
}

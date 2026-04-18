import TopBar from "./TopBar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex flex-col flex-1 h-screen w-screen">
      <TopBar />
      <main className="bg-slate-900 flex-1 p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

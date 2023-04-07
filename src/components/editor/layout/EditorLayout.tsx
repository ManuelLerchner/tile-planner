import SideNav from "./SideNav";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";
import React from "react";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen ">
      <SideNav />
      <div className="flex flex-col flex-1 w-full">
        <TopBar />
        <main className="bg-gray-300 w-full h-full">{children}</main>
        <BottomBar />
      </div>
    </div>
  );
}

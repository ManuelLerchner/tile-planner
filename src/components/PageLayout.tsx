import React from "react";
import SideNav from "./SideNav";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";

export default function PageLayout({
  children,
  mainContentRef,
}: {
  children: React.ReactNode;
  mainContentRef: React.RefObject<any>;
}) {
  return (
    <div className="flex h-screen ">
      <SideNav />
      <div className="flex flex-col flex-1 w-full">
        <TopBar mainContentRef={mainContentRef} />
        <main className="bg-gray-300 w-full h-full">{children}</main>
        <BottomBar />
      </div>
    </div>
  );
}

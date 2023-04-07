import React, { Navigate, Outlet } from "react-router-dom";
import SideNav from "../../editor/layout/SideNav";
import TopBar from "../../editor/layout/TopBar";
import BottomBar from "../../editor/layout/BottomBar";
import { useAuth } from "../../../hooks/useAuth";

export default function ProtectedRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={"/auth/login"} />;
  }

  return <Outlet />;
}

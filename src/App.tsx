import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./components/providers/AuthProvider";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardLayout from "./pages/dashboard/layout/DashboardLayout";
import { Editor } from "./pages/editor/Editor";
import KeepAlive from "./components/KeepAlive";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path={"/auth"}>
            <Route path={"login/"} element={<Login />} />
            <Route path={"keep-alive"} element={<KeepAlive />} />
          </Route>

          <Route path={"/"} element={<ProtectedRoute />}>
            <Route index element={<Navigate to={"/dashboard"} />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
            </Route>

            <Route path={"/editor"}>
              <Route path=":id" element={<Editor />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

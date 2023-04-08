import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Editor } from "./pages/editor/Editor";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { AuthContext, AuthProvider } from "./components/providers/AuthProvider";
import EditorLayout from "./pages/editor/layout/EditorLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path={"/auth"}>
            <Route path={"login/"} element={<Login />} />
          </Route>

          <Route path={"/"} element={<ProtectedRoute />}>
            <Route index element={<Navigate to={"/dashboard"} />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
            </Route>

            <Route path={"/editor"} >
              <Route path=":id" element={<Editor />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

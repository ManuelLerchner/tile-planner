import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Editor } from "./components/pages/Editor";
import Dashboard from "./components/pages/Dashboard";
import Login from "./components/layout/auth/Login";
import { AuthContext, AuthProvider } from "./components/providers/AuthProvider";
import EditorLayout from "./components/editor/layout/EditorLayout";
import ProtectedRoute from "./components/layout/auth/ProtectedRoute";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path={"/auth"}>
            <Route path={"login/"} element={<Login />} />
          </Route>
          <Route path={"/"} element={<Navigate to={"/dashboard"} />} />
          <Route path="/dashboard" element={<ProtectedRoute />}>
            <Route index element={<Dashboard />} />
          </Route>
          <Route path={"/editor"} element={<ProtectedRoute />}>
            <Route
              path=":id"
              element={
                <EditorLayout>
                  <Editor />
                </EditorLayout>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

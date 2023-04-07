import { useContext } from "react";
import { AuthContext } from "../components/providers/AuthProvider";

export const useAuth = () => {
  return useContext(AuthContext);
};

import React from "react";
import { supabase } from "../../database/subabaseClient";
import { useAuth } from "../../../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();

  return (
    <div>
      <button onClick={login}>Sign in with Google</button>
    </div>
  );
}

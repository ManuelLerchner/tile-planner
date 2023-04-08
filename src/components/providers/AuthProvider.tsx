import { Session, User } from "@supabase/supabase-js";
import React, { createContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../database/subabaseClient";

interface AuthContext {
  user: User | null;
  login: () => Promise<[boolean, JSX.Element]>;
  logout: () => void;
}

const defaultAuthContext: AuthContext = {
  user: null,
  login: async () => {
    console.log("Login function not initialized yet");
    return [false, <></>];
  },
  logout: () => {
    console.log("Logout function not initialized yet");
  },
};

export const AuthContext = createContext(defaultAuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const [returnTo, setReturnTo] = useState("/");

  // call this function when you want to authenticate the user
  const login = useMemo(
    () => async (): Promise<[boolean, JSX.Element]> => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) {
        return returnError(error.message);
      }

      return returnSuccess("Login successful");
    },
    []
  );

  // call this function to sign out logged in user
  const logout = useMemo(
    () => () => {
      supabase.auth.signOut();
      setUser(null);
    },
    []
  );

  //Session handling
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // fetch user data
  useEffect(() => {
    if (!session) {
      return;
    }

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, [session]);

  const authState = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [login, logout, user]
  );

  //Return to page after login
  useEffect(() => {
    if (location.pathname.startsWith("/auth")) {
      return;
    }
    setReturnTo(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (user) {
      navigate(returnTo);
    }
  }, [user]);

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};

const returnSuccess = (message: string): [boolean, JSX.Element] => {
  return [
    true,
    <p key={"success"} className="text-green-600">
      {message}
    </p>,
  ];
};

const returnError = (message: string): [boolean, JSX.Element] => {
  return [
    false,
    <p key={"error"} className="text-red-500">
      {message}
    </p>,
  ];
};

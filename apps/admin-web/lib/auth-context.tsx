"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { clearToken, getToken, login as apiLogin, setToken } from "./api";

type AuthContextValue = {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  ready: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTokenState(getToken());
    setReady(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        ready,
        login: async (email, password) => {
          const data = await apiLogin(email, password);
          setToken(data.accessToken);
          setTokenState(data.accessToken);
        },
        logout: () => {
          clearToken();
          setTokenState(null);
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth required");
  return ctx;
}

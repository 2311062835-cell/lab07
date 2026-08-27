import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { loginApi } from "../api/authApi";
import type { LoginRequest, UserSession } from "../types/auth";
import { AuthContext } from "./authContextInstance";

const AUTH_STORAGE_KEY = "crs_auth_session";

function getInitialSession(): UserSession | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as UserSession;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(getInitialSession);
  const isLoading = false;

  useEffect(() => {
    const handleSessionExpired = () => setUser(null);
    window.addEventListener("crs:session-expired", handleSessionExpired);

    return () => window.removeEventListener("crs:session-expired", handleSessionExpired);
  }, []);

  const login = async (payload: LoginRequest) => {
    const session = await loginApi(payload);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    setUser(session);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user?.token),
      login,
      logout,
    }),
    [isLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

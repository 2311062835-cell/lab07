import { createContext } from "react";
import type { LoginRequest, UserSession } from "../types/auth";

export interface AuthContextValue {
  user: UserSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

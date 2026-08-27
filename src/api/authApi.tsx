import axiosClient from "./axiosClient";
import type { LoginRequest, LoginResponse, UserSession } from "../types/auth";

export async function loginApi(payload: LoginRequest): Promise<UserSession> {
  const { data } = await axiosClient.post<LoginResponse>("/api/auth/login", payload);

  return {
    token: data.token,
    username: data.username,
    role: data.role,
  };
}

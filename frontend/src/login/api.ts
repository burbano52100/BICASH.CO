import type { RegisterForm } from "./types";

const API_BASE = "/api/auth";

export interface AuthUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

async function parseResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || "Ocurrió un error inesperado.");
  }
  return data as T;
}

export function login(username: string, password: string): Promise<LoginResponse> {
  return fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  }).then((res) => parseResponse<LoginResponse>(res));
}

export function register(form: RegisterForm): Promise<{ user: AuthUser }> {
  return fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  }).then((res) => parseResponse<{ user: AuthUser }>(res));
}

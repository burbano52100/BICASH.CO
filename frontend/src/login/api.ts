import type { RegisterForm } from "./types";

const API_BASE = "/api/auth";

/** A user account as returned by the backend. */
export interface AuthenticatedUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: AuthenticatedUser;
}

/** Parses a fetch Response as JSON, throwing the backend's `message` on non-2xx. */
async function parseResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || "Ocurrió un error inesperado.");
  }
  return data as T;
}

/** POST /api/auth/login */
export function login(username: string, password: string): Promise<LoginResponse> {
  return fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  }).then((res) => parseResponse<LoginResponse>(res));
}

/** POST /api/auth/register */
export function register(form: RegisterForm): Promise<{ user: AuthenticatedUser }> {
  return fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  }).then((res) => parseResponse<{ user: AuthenticatedUser }>(res));
}

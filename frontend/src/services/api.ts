const API_BASE = "/api/auth";

/** Usuario autenticado tal como lo devuelve el backend. */
export interface SessionUser {
  id: string | number;
  fullName: string;
  username: string;
  email: string;
  role: string;
  password: string;
  phone: string;
  salaryType: "fijo" | "variable";
  salaryAmount: number | null;
  joinDate: string;
}

async function parseResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Ocurrió un error inesperado.");
  return data as T;
}

/** POST /api/auth/login */
export function apiLogin(username: string, password: string) {
  return fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  }).then((res) => parseResponse<{ token: string; user: SessionUser }>(res));
}

/** POST /api/auth/register */
export function apiRegister(form: Record<string, unknown>) {
  return fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  }).then((res) => parseResponse<{ user: SessionUser }>(res));
}

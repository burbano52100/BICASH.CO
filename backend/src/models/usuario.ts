/** Fila de la tabla `users` tal como llega de PostgreSQL. */
export interface Usuario {
  id: number;
  fullName: string;
  username: string;
  email: string;
  role: string;
  password: string;
  phone: string | null;
  salary_type: "fijo" | "variable" | null;
  salary_amount: string | null;
  created_at: string;
}

/** Roles permitidos para una cuenta, igual que el CHECK constraint de database/schema.sql. */
export const ROLES = ["Administrador", "Analista", "Desarrollador", "Operador", "Invitado"] as const;

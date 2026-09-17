/** Which panel is currently shown inside the auth card. */
export type View = "login" | "register";

/** Shape of the registration form's local state. */
export interface RegisterForm {
  fullName: string;
  username: string;
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
}

/** Roles selectable at registration; must match database/schema.sql's `role` CHECK constraint. */
export const ROLES = ["Administrador", "Analista", "Desarrollador", "Operador", "Invitado"];

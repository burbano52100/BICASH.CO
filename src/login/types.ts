export type View = "login" | "register";

export interface RegisterForm {
  fullName: string;
  username: string;
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
}

export const ROLES = ["Administrador", "Analista", "Desarrollador", "Operador", "Invitado"];

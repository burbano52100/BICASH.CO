export type Vista = "inicio" | "registro";

export interface FormularioRegistro {
  nombreCompleto: string;
  usuario: string;
  correo: string;
  rol: string;
  contrasena: string;
  confirmarContrasena: string;
}

export const ROLES = ["Administrador", "Analista", "Desarrollador", "Operador", "Invitado"];

import type { FormularioRegistro } from "./types";

const BASE_API = "/api/autenticacion";

export interface UsuarioAutenticado {
  id: string;
  nombreCompleto: string;
  usuario: string;
  correo: string;
  rol: string;
}

export interface RespuestaInicioSesion {
  token: string;
  usuario: UsuarioAutenticado;
}

async function procesarRespuesta<T>(res: Response): Promise<T> {
  const datos = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(datos?.mensaje || "Ocurrió un error inesperado.");
  }
  return datos as T;
}

export function iniciarSesion(usuario: string, contrasena: string): Promise<RespuestaInicioSesion> {
  return fetch(`${BASE_API}/iniciar-sesion`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, contrasena }),
  }).then((res) => procesarRespuesta<RespuestaInicioSesion>(res));
}

export function registrar(formulario: FormularioRegistro): Promise<{ usuario: UsuarioAutenticado }> {
  return fetch(`${BASE_API}/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formulario),
  }).then((res) => procesarRespuesta<{ usuario: UsuarioAutenticado }>(res));
}

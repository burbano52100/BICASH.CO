import { useState } from "react";
import { CampoTexto, CampoSelector, CajaError, IndicadorCarga, FortalezaContrasena } from "./CamposFormulario";
import { ROLES, type FormularioRegistro } from "./types";
import { registrar } from "./api";

export function PanelRegistro({ alCambiarVista }: { alCambiarVista: () => void }) {
  const [formulario, setFormulario] = useState<FormularioRegistro>({
    nombreCompleto: "", usuario: "", correo: "", rol: "", contrasena: "", confirmarContrasena: "",
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  function establecer(campo: keyof FormularioRegistro) {
    return (v: string) => setFormulario((f) => ({ ...f, [campo]: v }));
  }

  async function manejarEnvio(e: React.FormEvent) {
    e.preventDefault();
    const { nombreCompleto, usuario, correo, rol, contrasena, confirmarContrasena } = formulario;
    if (!nombreCompleto || !usuario || !correo || !rol || !contrasena || !confirmarContrasena) {
      setError("Todos los campos son obligatorios."); return;
    }
    if (contrasena !== confirmarContrasena) { setError("Las contraseñas no coinciden."); return; }
    if (contrasena.length < 8) { setError("La contraseña debe tener al menos 8 caracteres."); return; }
    setError(""); setCargando(true);
    try {
      await registrar(formulario);
      setExito(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la cuenta.");
    } finally {
      setCargando(false);
    }
  }

  if (exito) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "16px 0", textAlign: "center" }}>
        <div style={{
          width: 60, height: 60, borderRadius: "50%",
          background: "rgba(0,255,204,0.08)", border: "2px solid rgba(0,255,204,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path d="M4 13l6.5 6.5L22 6" stroke="#00ffcc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#00ffcc", letterSpacing: "0.1em" }}>
            CUENTA CREADA
          </div>
          <p style={{ fontFamily: "Exo 2, sans-serif", fontSize: "0.875rem", color: "#3a5070", margin: "4px 0 0" }}>
            Tu acceso ha sido registrado exitosamente.
          </p>
        </div>
        <button onClick={alCambiarVista} className="btn-primary"
          style={{ padding: "10px 32px", borderRadius: 8, fontSize: "0.85rem" }}>
          INICIAR SESIÓN
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={manejarEnvio} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <CampoTexto etiqueta="Nombre completo" valor={formulario.nombreCompleto} alCambiar={establecer("nombreCompleto")} marcadorPosicion="Ana Torres" />
        <CampoTexto etiqueta="Usuario" valor={formulario.usuario} alCambiar={establecer("usuario")} marcadorPosicion="usuario@gmail.com" mono />
      </div>
      <CampoTexto etiqueta="Correo electrónico" tipo="email" valor={formulario.correo} alCambiar={establecer("correo")} marcadorPosicion="correo@gmail.com" mono />
      <CampoSelector etiqueta="Rol" valor={formulario.rol} alCambiar={establecer("rol")} opciones={ROLES} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <CampoTexto etiqueta="Contraseña" tipo="password" valor={formulario.contrasena} alCambiar={establecer("contrasena")} marcadorPosicion="Mín. 8 caracteres" />
        <CampoTexto etiqueta="Confirmar" tipo="password" valor={formulario.confirmarContrasena} alCambiar={establecer("confirmarContrasena")} marcadorPosicion="Repetir" />
      </div>
      {formulario.contrasena.length > 0 && <FortalezaContrasena contrasena={formulario.contrasena} />}
      {error && <CajaError mensaje={error} />}
      <button type="submit" disabled={cargando} className="btn-primary"
        style={{ width: "100%", padding: "12px", borderRadius: 8, fontSize: "0.88rem", marginTop: 4 }}>
        {cargando
          ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><IndicadorCarga /> REGISTRANDO...</span>
          : "CREAR CUENTA"}
      </button>
      <p style={{ textAlign: "center", margin: 0, fontFamily: "Exo 2, sans-serif", fontSize: "1rem", color: "#3a5070" }}>
        ¿Ya tienes cuenta?{" "}
        <button type="button" onClick={alCambiarVista} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#00d4ff", fontFamily: "Rajdhani, sans-serif",
          fontWeight: 700, fontSize: "1rem", letterSpacing: "0.08em",
        }}>
          INICIAR SESIÓN
        </button>
      </p>
    </form>
  );
}

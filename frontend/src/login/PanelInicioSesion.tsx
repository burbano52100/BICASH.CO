import { useState } from "react";
import { CampoTexto, CajaError, IndicadorCarga } from "./CamposFormulario";
import { iniciarSesion, type UsuarioAutenticado } from "./api";

export function PanelInicioSesion({ alCambiarVista }: { alCambiarVista: () => void }) {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [recordar, setRecordar] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [usuarioAutenticado, setUsuarioAutenticado] = useState<UsuarioAutenticado | null>(null);

  async function manejarEnvio(e: React.FormEvent) {
    e.preventDefault();
    if (!usuario || !contrasena) { setError("Todos los campos son obligatorios."); return; }
    setError("");
    setCargando(true);
    try {
      const { token, usuario: datosUsuario } = await iniciarSesion(usuario, contrasena);
      (recordar ? localStorage : sessionStorage).setItem("token_bicash", token);
      setUsuarioAutenticado(datosUsuario);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.");
    } finally {
      setCargando(false);
    }
  }

  function manejarCierreSesion() {
    localStorage.removeItem("token_bicash");
    sessionStorage.removeItem("token_bicash");
    setUsuarioAutenticado(null);
    setUsuario("");
    setContrasena("");
  }

  if (usuarioAutenticado) {
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
            SESIÓN INICIADA
          </div>
          <p style={{ fontFamily: "Exo 2, sans-serif", fontSize: "0.875rem", color: "#3a5070", margin: "4px 0 0" }}>
            Bienvenido, {usuarioAutenticado.nombreCompleto} ({usuarioAutenticado.rol}).
          </p>
        </div>
        <button onClick={manejarCierreSesion} className="btn-primary"
          style={{ padding: "10px 32px", borderRadius: 8, fontSize: "0.85rem" }}>
          CERRAR SESIÓN
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={manejarEnvio} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <CampoTexto etiqueta="Usuario" valor={usuario} alCambiar={setUsuario} marcadorPosicion="usuario@gmail.com" mono />
      <CampoTexto etiqueta="Contraseña" tipo="password" valor={contrasena} alCambiar={setContrasena} marcadorPosicion="••••••••••••" />

      {error && <CajaError mensaje={error} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
          onClick={() => setRecordar(!recordar)}>
          <div style={{
            width: 16, height: 16, borderRadius: 4,
            border: `1.5px solid ${recordar ? "#00d4ff" : "rgba(0,212,255,0.25)"}`,
            background: recordar ? "#00d4ff" : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
          }}>
            {recordar && (
              <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                <path d="M1 3.5l2.5 2.5L8 1" stroke="#050810" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span style={{ fontFamily: "Exo 2, sans-serif", fontSize: "1rem", color: "#3a5070" }}>Recordarme</span>
        </label>
        <button type="button" style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "Exo 2, sans-serif", fontSize: "1rem", color: "#00d4ff", opacity: 0.75,
        }}>
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <button type="submit" disabled={cargando} className="btn-primary"
        style={{ width: "100%", padding: "15px", borderRadius: 8, fontSize: "1.05rem" }}>
        {cargando
          ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><IndicadorCarga /> AUTENTICANDO...</span>
          : "INICIAR SESIÓN"}
      </button>

      <p style={{ textAlign: "center", margin: 0, fontFamily: "Exo 2, sans-serif", fontSize: "1rem", color: "#3a5070" }}>
        ¿No tienes cuenta?{" "}
        <button type="button" onClick={alCambiarVista} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "#00d4ff", fontFamily: "Rajdhani, sans-serif",
          fontWeight: 700, fontSize: "1rem", letterSpacing: "0.08em",
        }}>
          CREAR CUENTA
        </button>
      </p>
    </form>
  );
}

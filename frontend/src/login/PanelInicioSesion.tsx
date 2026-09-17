import { useState } from "react";
import { TextField, ErrorBox, LoadingSpinner } from "./CamposFormulario";
import { login, type AuthenticatedUser } from "./api";

/** Login form; on success shows an authenticated state with a logout action. */
export function LoginPanel({ onSwitchView, mobile }: { onSwitchView: () => void; mobile: boolean }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password) { setError("Todos los campos son obligatorios."); return; }
    setError("");
    setLoading(true);
    try {
      const { token, user } = await login(username, password);
      (rememberMe ? localStorage : sessionStorage).setItem("token_bicash", token);
      setAuthenticatedUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token_bicash");
    sessionStorage.removeItem("token_bicash");
    setAuthenticatedUser(null);
    setUsername("");
    setPassword("");
  }

  if (authenticatedUser) {
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
            Bienvenido, {authenticatedUser.fullName} ({authenticatedUser.role}).
          </p>
        </div>
        <button onClick={handleLogout} className="btn-primary"
          style={{ padding: "10px 32px", borderRadius: 8, fontSize: "0.85rem" }}>
          CERRAR SESIÓN
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: mobile ? 16 : 24 }}>
      <TextField label="Usuario" value={username} onChange={setUsername} placeholder="usuario@gmail.com" mono />
      <TextField label="Contraseña" type="password" value={password} onChange={setPassword} placeholder="••••••••••••" />

      {error && <ErrorBox message={error} />}

      <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", justifyContent: "space-between", alignItems: mobile ? "flex-start" : "center", gap: mobile ? 10 : 0 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
          onClick={() => setRememberMe(!rememberMe)}>
          <div style={{
            width: 16, height: 16, borderRadius: 4,
            border: `1.5px solid ${rememberMe ? "#00d4ff" : "rgba(0,212,255,0.25)"}`,
            background: rememberMe ? "#00d4ff" : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
          }}>
            {rememberMe && (
              <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                <path d="M1 3.5l2.5 2.5L8 1" stroke="#050810" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span style={{ fontFamily: "Exo 2, sans-serif", fontSize: mobile ? "0.9rem" : "1rem", color: "#3a5070" }}>Recordarme</span>
        </label>
        <button type="button" style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "Exo 2, sans-serif", fontSize: mobile ? "0.9rem" : "1rem", color: "#00d4ff", opacity: 0.75,
          paddingLeft: 0,
        }}>
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <button type="submit" disabled={loading} className="btn-primary"
        style={{ width: "100%", padding: "15px", borderRadius: 8, fontSize: "1.05rem" }}>
        {loading
          ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><LoadingSpinner /> AUTENTICANDO...</span>
          : "INICIAR SESIÓN"}
      </button>

      <p style={{ textAlign: "center", margin: 0, fontFamily: "Exo 2, sans-serif", fontSize: "1rem", color: "#3a5070" }}>
        ¿No tienes cuenta?{" "}
        <button type="button" onClick={onSwitchView} style={{
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

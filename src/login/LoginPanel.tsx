import { useState } from "react";
import { InputField, ErrorBox, Spinner } from "./FormFields";

export function LoginPanel({ onSwitch }: { onSwitch: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password) { setError("Todos los campos son obligatorios."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <InputField label="Usuario" value={username} onChange={setUsername} placeholder="usuario@gmail.com" mono />
      <InputField label="Contraseña" type="password" value={password} onChange={setPassword} placeholder="••••••••••••" />

      {error && <ErrorBox msg={error} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
          onClick={() => setRemember(!remember)}>
          <div style={{
            width: 16, height: 16, borderRadius: 4,
            border: `1.5px solid ${remember ? "#00d4ff" : "rgba(0,212,255,0.25)"}`,
            background: remember ? "#00d4ff" : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
          }}>
            {remember && (
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

      <button type="submit" disabled={loading} className="btn-primary"
        style={{ width: "100%", padding: "15px", borderRadius: 8, fontSize: "1.05rem" }}>
        {loading
          ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Spinner /> AUTENTICANDO...</span>
          : "INICIAR SESIÓN"}
      </button>

      <p style={{ textAlign: "center", margin: 0, fontFamily: "Exo 2, sans-serif", fontSize: "1rem", color: "#3a5070" }}>
        ¿No tienes cuenta?{" "}
        <button type="button" onClick={onSwitch} style={{
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

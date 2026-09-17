import { useState } from "react";
import { TextField, SelectField, ErrorBox, LoadingSpinner, PasswordStrength } from "./CamposFormulario";
import { ROLES, type RegisterForm } from "./types";
import { register } from "./api";

/** Registration form; shows a success state once the account is created. */
export function RegisterPanel({ onSwitchView, mobile }: { onSwitchView: () => void; mobile: boolean }) {
  const [form, setForm] = useState<RegisterForm>({
    fullName: "", username: "", email: "", role: "", password: "", confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function setField(field: keyof RegisterForm) {
    return (v: string) => setForm((f) => ({ ...f, [field]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { fullName, username, email, role, password, confirmPassword } = form;
    if (!fullName || !username || !email || !role || !password || !confirmPassword) {
      setError("Todos los campos son obligatorios."); return;
    }
    if (password !== confirmPassword) { setError("Las contraseñas no coinciden."); return; }
    if (password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres."); return; }
    setError(""); setLoading(true);
    try {
      await register(form);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la cuenta.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
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
        <button onClick={onSwitchView} className="btn-primary"
          style={{ padding: "10px 32px", borderRadius: 8, fontSize: "0.85rem" }}>
          INICIAR SESIÓN
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: mobile ? 14 : 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 12 }}>
        <TextField label="Nombre completo" value={form.fullName} onChange={setField("fullName")} placeholder="Ana Torres" />
        <TextField label="Usuario" value={form.username} onChange={setField("username")} placeholder="usuario@gmail.com" mono />
      </div>
      <TextField label="Correo electrónico" type="email" value={form.email} onChange={setField("email")} placeholder="correo@gmail.com" mono />
      <SelectField label="Rol" value={form.role} onChange={setField("role")} options={ROLES} />
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 12 }}>
        <TextField label="Contraseña" type="password" value={form.password} onChange={setField("password")} placeholder="Mín. 8 caracteres" />
        <TextField label="Confirmar" type="password" value={form.confirmPassword} onChange={setField("confirmPassword")} placeholder="Repetir" />
      </div>
      {form.password.length > 0 && <PasswordStrength password={form.password} />}
      {error && <ErrorBox message={error} />}
      <button type="submit" disabled={loading} className="btn-primary"
        style={{ width: "100%", padding: "12px", borderRadius: 8, fontSize: "0.88rem", marginTop: 4 }}>
        {loading
          ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><LoadingSpinner /> REGISTRANDO...</span>
          : "CREAR CUENTA"}
      </button>
      <p style={{ textAlign: "center", margin: 0, fontFamily: "Exo 2, sans-serif", fontSize: "1rem", color: "#3a5070" }}>
        ¿Ya tienes cuenta?{" "}
        <button type="button" onClick={onSwitchView} style={{
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

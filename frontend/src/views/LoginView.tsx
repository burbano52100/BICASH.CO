import { useState } from "react";
import type { FormEvent } from "react";
import { apiLogin, apiRegister } from "../services/api";
import type { SessionUser } from "../services/api";
import { Label, Field, ErrorBox, Spinner, PasswordStrength } from "../components/CamposFormulario";
import { Logo } from "../components/Logo";

function LoginForm({ onSwitch, onLogin, mobile }: { onSwitch: () => void; onLogin: (user: SessionUser) => void; mobile: boolean }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!username || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { token, user } = await apiLogin(username, password);
      if (remember) localStorage.setItem("token_bicash", token);
      else sessionStorage.setItem("token_bicash", token);
      onLogin(user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: mobile ? 16 : 24 }}>
      <Field label="Usuario" value={username} onChange={setUsername} placeholder="usuario@gmail.com" mono />
      <Field label="Contraseña" type="password" value={password} onChange={setPassword} placeholder="••••••••••" />
      {error && <ErrorBox msg={error} />}
      <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", justifyContent: "space-between", alignItems: mobile ? "flex-start" : "center", gap: mobile ? 10 : 0 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => setRemember(!remember)}>
          <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${remember ? "#00d4ff" : "rgba(0,212,255,0.25)"}`, background: remember ? "#00d4ff" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
            {remember && (
              <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                <path d="M1 3.5l2.5 2.5L8 1" stroke="#050810" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span style={{ fontFamily: "Exo 2, sans-serif", fontSize: mobile ? "0.9rem" : "1rem", color: "#3a5070" }}>Recordarme</span>
        </label>
        <button type="button" style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "Exo 2, sans-serif", fontSize: mobile ? "0.9rem" : "1rem", color: "#00d4ff", opacity: 0.75, paddingLeft: 0 }}>
          ¿Olvidaste tu contraseña?
        </button>
      </div>
      <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: "15px", borderRadius: 8, fontSize: "1.05rem", display: "block", textAlign: "center" }}>
        {loading ? (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Spinner /> AUTENTICANDO...
          </span>
        ) : (
          "INICIAR SESIÓN"
        )}
      </button>
      <p style={{ textAlign: "center", margin: "0 auto", fontFamily: "Exo 2, sans-serif", fontSize: "1rem", color: "#3a5070", width: "100%" }}>
        ¿No tienes cuenta?{" "}
        <button type="button" onClick={onSwitch} style={{ background: "none", border: "none", cursor: "pointer", color: "#00d4ff", fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.08em" }}>
          CREAR CUENTA
        </button>
      </p>
    </form>
  );
}

function RegisterForm({ onSwitch, onLogin, mobile }: { onSwitch: () => void; onLogin: (user: SessionUser) => void; mobile: boolean }) {
  const [form, setForm] = useState({ fullName: "", username: "", email: "", phone: "", password: "", confirmPassword: "", salaryType: "variable", salaryAmount: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(false);
  const [createdUser, setCreatedUser] = useState<SessionUser | null>(null);

  const set = (key: string) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const { fullName, username, email, phone, password, confirmPassword, salaryType, salaryAmount } = form;
    if (!fullName || !username || !email || !phone || !password || !confirmPassword) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (salaryType === "fijo" && !salaryAmount) {
      setError("Ingresa el valor de tu salario fijo.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { user } = await apiRegister({ fullName, username, email, phone, password, confirmPassword, role: "Invitado", salaryType, salaryAmount: salaryAmount ? Number(salaryAmount) : null });
      setCreatedUser(user);
      setCreated(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (created && createdUser) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "16px 0", textAlign: "center" }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(0,255,204,0.08)", border: "2px solid rgba(0,255,204,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path d="M4 13l6.5 6.5L22 6" stroke="#00ffcc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#00ffcc", letterSpacing: "0.1em" }}>CUENTA CREADA</div>
          <p style={{ fontFamily: "Exo 2, sans-serif", fontSize: "0.875rem", color: "#3a5070", margin: "4px 0 0" }}>Tu acceso ha sido registrado exitosamente.</p>
        </div>
        <button onClick={() => onLogin(createdUser)} className="btn-primary" style={{ padding: "10px 32px", borderRadius: 8, fontSize: "0.85rem" }}>
          ENTRAR AL SISTEMA
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: mobile ? 14 : 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 12 }}>
        <Field label="Nombre completo" value={form.fullName} onChange={set("fullName")} placeholder="Ana Torres" />
        <Field label="Usuario" value={form.username} onChange={set("username")} placeholder="usuario@gmail.com" mono />
      </div>
      <Field label="Correo electrónico" type="email" value={form.email} onChange={set("email")} placeholder="correo@gmail.com" mono />
      <Field label="Número de celular" type="tel" value={form.phone} onChange={set("phone")} placeholder="+57 300 000 0000" mono />
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 12 }}>
        <Field label="Contraseña" type="password" value={form.password} onChange={set("password")} placeholder="Mín. 8 caracteres" />
        <Field label="Confirmar" type="password" value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Repetir" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 12 }}>
        <div>
          <Label>Tipo de salario</Label>
          <select className="tech-input" value={form.salaryType} onChange={(e) => set("salaryType")(e.target.value)}>
            <option value="variable">Variable</option>
            <option value="fijo">Fijo</option>
          </select>
        </div>
        {form.salaryType === "fijo" && (
          <Field label="Salario mensual (COP)" type="number" value={form.salaryAmount} onChange={set("salaryAmount")} placeholder="2500000" mono />
        )}
      </div>
      {form.password.length > 0 && <PasswordStrength password={form.password} />}
      {error && <ErrorBox msg={error} />}
      <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", padding: "15px", borderRadius: 8, fontSize: "1.05rem", marginTop: 4, display: "block", textAlign: "center" }}>
        {loading ? (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Spinner /> REGISTRANDO...
          </span>
        ) : (
          "CREAR CUENTA"
        )}
      </button>
      <p style={{ textAlign: "center", margin: "0 auto", fontFamily: "Exo 2, sans-serif", fontSize: "1rem", color: "#3a5070", width: "100%" }}>
        ¿Ya tienes cuenta?{" "}
        <button type="button" onClick={onSwitch} style={{ background: "none", border: "none", cursor: "pointer", color: "#00d4ff", fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.08em" }}>
          INICIAR SESIÓN
        </button>
      </p>
    </form>
  );
}

export function LoginView({ onLogin, mobile }: { onLogin: (user: SessionUser) => void; mobile: boolean }) {
  const [view, setView] = useState<"login" | "register">("login");
  return (
    <div className="dot-grid" style={{ minHeight: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: mobile ? "16px 16px" : "24px 16px", position: "relative" }}>
      <div style={{ position: "fixed", top: "5%", left: "8%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 65%)", filter: "blur(40px)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "5%", right: "5%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,255,204,0.05) 0%, transparent 65%)", filter: "blur(40px)", pointerEvents: "none" }} />
      <div className="auth-card corner-tl corner-br" style={{ width: "100%", maxWidth: 620, borderRadius: mobile ? 10 : 14, overflow: "hidden", position: "relative", transition: "max-width 0.3s ease" }}>
        <div style={{ padding: mobile ? "20px 24px 24px" : "28px 52px 38px" }}>
          <Logo mobile={mobile} />
          {view === "login" ? (
            <LoginForm onSwitch={() => setView("register")} onLogin={onLogin} mobile={mobile} />
          ) : (
            <RegisterForm onSwitch={() => setView("login")} onLogin={onLogin} mobile={mobile} />
          )}
        </div>
      </div>
    </div>
  );
}

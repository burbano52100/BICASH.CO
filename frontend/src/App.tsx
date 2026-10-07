import { useEffect, useState } from "react";
import type { FormEvent } from "react";

const API_BASE = "/api/auth";

interface SessionUser {
  id: string | number;
  fullName: string;
  username: string;
  email: string;
  role: string;
  password: string;
  phone: string;
  salaryType: "fijo" | "variable";
  salaryAmount: number | null;
  joinDate: string;
}

async function parseResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || "Ocurrió un error inesperado.");
  return data as T;
}

async function apiLogin(username: string, password: string) {
  return fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  }).then((res) => parseResponse<{ token: string; user: SessionUser }>(res));
}

async function apiRegister(form: Record<string, unknown>) {
  return fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  }).then((res) => parseResponse<{ user: SessionUser }>(res));
}

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 520);
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 520);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return mobile;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 600, fontSize: "0.85rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#3a5a7a", display: "block", marginBottom: 7 }}>
      {children}
    </label>
  );
}

function Field({ label, type = "text", value, onChange, placeholder, mono = false }: { label: string; type?: string; value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="tech-input"
        style={mono ? { fontFamily: "JetBrains Mono, monospace", fontSize: "1rem" } : { fontSize: "1rem" }}
      />
    </div>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div role="alert" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 6, padding: "8px 12px", color: "#f87171", fontFamily: "JetBrains Mono, monospace", fontSize: "0.78rem" }}>
      ⚠ {msg}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="rgba(5,8,16,0.3)" strokeWidth="2" />
      <path d="M8 2a6 6 0 016 6" stroke="#050810" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const score = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
  const labels = ["Débil", "Regular", "Buena", "Fuerte"];
  const colors = ["#ef4444", "#f97316", "#00d4ff", "#00ffcc"];
  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i < score ? colors[score - 1] : "rgba(255,255,255,0.07)", transition: "background 0.3s" }} />
        ))}
      </div>
      {score > 0 && <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", color: colors[score - 1] }}>Seguridad: {labels[score - 1]}</div>}
    </div>
  );
}

function Logo({ mobile }: { mobile: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: mobile ? 20 : 28 }}>
      <div style={{ position: "relative", width: mobile ? 116 : 152, height: mobile ? 116 : 152 }}>
        <svg viewBox="0 0 64 64" fill="none" style={{ width: "100%", height: "100%" }}>
          <polygon points="32,4 58,18 58,46 32,60 6,46 6,18" fill="rgba(0,212,255,0.07)" stroke="#00d4ff" strokeWidth="1.5" />
          <polygon points="32,13 49,22.5 49,41.5 32,51 15,41.5 15,22.5" fill="none" stroke="rgba(0,212,255,0.25)" strokeWidth="0.8" />
          <text x="32" y="37" textAnchor="middle" fontFamily="Rajdhani, sans-serif" fontWeight="700" fontSize="14" fill="#00d4ff">BC</text>
        </svg>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: mobile ? "1.8rem" : "2.6rem", letterSpacing: "0.22em", color: "#e2e8f8", lineHeight: 1.1 }}>
          BICASH<span style={{ color: "#00d4ff" }}>.CO</span>
        </div>
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: mobile ? "0.6rem" : "0.82rem", letterSpacing: mobile ? "0.16em" : "0.28em", color: "#3a5070", marginTop: 6 }}>
          SISTEMA DE ACCESO SEGURO
        </div>
      </div>
    </div>
  );
}

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

function InfoSection({ title, open, onToggle, fields, mobile }: { title: string; open: boolean; onToggle: () => void; fields: { label: string; value: React.ReactNode; mono?: boolean; accent?: boolean }[]; mobile: boolean }) {
  return (
    <section style={{ background: "rgba(13,17,32,0.95)", border: `1px solid ${open ? "rgba(0,212,255,0.24)" : "rgba(0,212,255,0.12)"}`, borderRadius: 12, overflow: "hidden", transition: "border-color 0.2s" }}>
      <button type="button" onClick={onToggle} aria-expanded={open} style={{ width: "100%", padding: "16px 22px", border: "none", background: open ? "rgba(0,212,255,0.05)" : "rgba(0,212,255,0.025)", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", color: "#3a5a7a" }}>
        <span style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>{title}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", color: open ? "#00d4ff" : "#3a5a7a" }}>
          <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div>
          {fields.map((f, i) => (
            <div key={f.label + i} style={{ display: "flex", flexDirection: mobile ? "column" : "row", alignItems: mobile ? "flex-start" : "center", padding: "14px 22px", gap: mobile ? 5 : 20, borderTop: "1px solid rgba(0,212,255,0.06)" }}>
              <div style={{ width: mobile ? "auto" : 190, fontFamily: "Rajdhani, sans-serif", fontWeight: 600, fontSize: "0.76rem", letterSpacing: "0.14em", color: "#2a3a5a", textTransform: "uppercase", flexShrink: 0 }}>{f.label}</div>
              <div style={{ fontFamily: f.mono ? "JetBrains Mono, monospace" : "Exo 2, sans-serif", fontSize: "0.9rem", color: f.accent ? "#00ffcc" : "#c0cce8", minWidth: 0 }}>{f.value}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ProfileView({ user, mobile }: { user: SessionUser; mobile: boolean }) {
  const initials = user.fullName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const [openAccount, setOpenAccount] = useState(false);
  const [openPersonal, setOpenPersonal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const accountFields = [
    { label: "Nombre completo", value: user.fullName },
    { label: "Usuario / Email", value: user.username, mono: true },
    { label: "Correo electrónico", value: user.email, mono: true },
    { label: "Fecha de registro", value: user.joinDate },
    { label: "Estado de cuenta", value: "Activa", accent: true },
    { label: "Nivel de acceso", value: user.role || "Usuario" },
  ];
  const salaryLabel = user.salaryType === "variable" ? "Variable" : user.salaryAmount ? `${new Intl.NumberFormat("es-CO").format(Number(user.salaryAmount))} COP` : "Sin registrar";
  const personalFields = [
    { label: "Número de celular", value: user.phone || "No registrado", mono: true },
    {
      label: "Contraseña",
      value: (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "JetBrains Mono, monospace" }}>{showPassword ? user.password : "••••••••"}</span>
          <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ border: "none", background: "transparent", color: "#00d4ff", fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.08em", cursor: "pointer", padding: 0 }}>
            {showPassword ? "OCULTAR" : "MOSTRAR"}
          </button>
        </div>
      ),
      mono: true,
    },
    { label: "Tipo de salario", value: user.salaryType === "fijo" ? "Fijo" : "Variable" },
    { label: "Valor del salario", value: salaryLabel, mono: user.salaryType === "fijo", accent: user.salaryType === "fijo" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 820 }}>
      <div style={{ display: "flex", flexDirection: "row", gap: mobile ? 16 : 22 }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: mobile ? 80 : 100, height: mobile ? 80 : 100, borderRadius: "50%", background: "linear-gradient(135deg,#00d4ff,#0066aa)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: mobile ? "2rem" : "2.5rem", color: "#050810", border: "3px solid rgba(0,212,255,0.3)", boxShadow: "0 0 30px rgba(0,212,255,0.2)" }}>
            {initials}
          </div>
          <div style={{ position: "absolute", bottom: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: "#00ffcc", border: "2px solid #050810", boxShadow: "0 0 8px rgba(0,255,204,0.6)" }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: mobile ? "1.35rem" : "2rem", color: "#e2e8f8", letterSpacing: "0.06em", overflowWrap: "anywhere" }}>{user.fullName}</div>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: mobile ? "0.66rem" : "0.75rem", color: "#2a3a5a", marginTop: 4, overflowWrap: "anywhere" }}>{user.email}</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 8, background: "rgba(0,255,204,0.08)", border: "1px solid rgba(0,255,204,0.3)", borderRadius: 20, padding: "3px 12px" }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00ffcc" }} />
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", color: "#00ffcc", letterSpacing: "0.1em" }}>CUENTA ACTIVA</span>
          </div>
        </div>
      </div>
      <InfoSection title="Información del usuario" open={openAccount} onToggle={() => setOpenAccount(!openAccount)} fields={accountFields} mobile={mobile} />
      <InfoSection title="Información personal" open={openPersonal} onToggle={() => setOpenPersonal(!openPersonal)} fields={personalFields} mobile={mobile} />
    </div>
  );
}

function ExpensesView({ user, mobile }: { user: SessionUser; mobile: boolean }) {
  const [period, setPeriod] = useState<"dia" | "semana" | "mes">("dia");
  const data: Record<string, { concept: string; date: string; amount: number }[]> = {
    dia: [
      { concept: "Mercado y alimentos", date: "Hoy, 8:42 a. m.", amount: 86500 },
      { concept: "Transporte", date: "Hoy, 12:15 p. m.", amount: 28000 },
      { concept: "Suscripción digital", date: "Hoy, 4:30 p. m.", amount: 42900 },
    ],
    semana: [
      { concept: "Compras y mercado", date: "Esta semana", amount: 286400 },
      { concept: "Transporte", date: "Esta semana", amount: 118000 },
      { concept: "Servicios", date: "Esta semana", amount: 164900 },
      { concept: "Entretenimiento", date: "Esta semana", amount: 78000 },
    ],
    mes: [
      { concept: "Vivienda y servicios", date: "Este mes", amount: 1240000 },
      { concept: "Compras y mercado", date: "Este mes", amount: 824600 },
      { concept: "Transporte", date: "Este mes", amount: 356000 },
      { concept: "Otros gastos", date: "Este mes", amount: 217300 },
    ],
  };
  const labels: Record<string, string> = { dia: "Día", semana: "Semana", mes: "Mes" };
  const items = data[period];
  const total = items.reduce((sum, it) => sum + it.amount, 0);
  const money = (n: number) => `$ ${new Intl.NumberFormat("es-CO").format(n)}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 880 }}>
      <div>
        <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: mobile ? "1.6rem" : "2.2rem", color: "#e2e8f8", letterSpacing: "0.06em" }}>
          Bienvenido, <span style={{ color: "#00d4ff" }}>{user.fullName.split(" ")[0]}</span>
        </div>
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.72rem", color: "#2a3a5a", marginTop: 4, letterSpacing: "0.1em" }}>
          {new Date().toLocaleDateString("es-CO", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>
      <section style={{ background: "rgba(13,17,32,0.92)", border: "1px solid rgba(0,212,255,0.14)", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ padding: mobile ? "18px 18px 16px" : "22px 26px 18px", borderBottom: "1px solid rgba(0,212,255,0.08)", display: "flex", flexDirection: mobile ? "column" : "row", alignItems: mobile ? "stretch" : "center", justifyContent: "space-between", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "1.05rem", letterSpacing: "0.12em", color: "#e2e8f8", textTransform: "uppercase" }}>Dinero que ha salido</div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.66rem", color: "#3a5070", marginTop: 4 }}>Movimientos del propietario de la cuenta</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", padding: 3, borderRadius: 8, background: "rgba(0,0,0,0.22)", border: "1px solid rgba(0,212,255,0.08)" }}>
            {Object.keys(labels).map((k) => (
              <button key={k} onClick={() => setPeriod(k as "dia" | "semana" | "mes")} style={{ padding: "8px 12px", border: "none", borderRadius: 6, cursor: "pointer", background: period === k ? "rgba(0,212,255,0.14)" : "transparent", color: period === k ? "#00d4ff" : "#3a5070", fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.08em" }}>
                {labels[k]}
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding: mobile ? "18px" : "22px 26px" }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.64rem", color: "#3a5070", letterSpacing: "0.14em", textTransform: "uppercase" }}>Total del periodo</div>
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: mobile ? "2rem" : "2.5rem", color: "#00d4ff", marginTop: 2 }}>
              {money(total)} <span style={{ fontSize: "0.8rem", color: "#3a5070" }}>COP</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {items.map((it) => (
              <div key={period + it.concept} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderTop: "1px solid rgba(0,212,255,0.07)" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.13)", display: "flex", alignItems: "center", justifyContent: "center", color: "#00d4ff", flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 5.5h10M4.5 3h7A1.5 1.5 0 0113 4.5v7a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 013 11.5v-7A1.5 1.5 0 014.5 3z" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M10.5 9h1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "Exo 2, sans-serif", fontWeight: 600, fontSize: mobile ? "0.86rem" : "0.94rem", color: "#c0cce8" }}>{it.concept}</div>
                  <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.61rem", color: "#2a3a5a", marginTop: 3 }}>{it.date}</div>
                </div>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontWeight: 500, fontSize: mobile ? "0.78rem" : "0.9rem", color: "#f87171", whiteSpace: "nowrap" }}>- {money(it.amount)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Dashboard({ user, onLogout, mobile }: { user: SessionUser; onLogout: () => void; mobile: boolean }) {
  const [tab, setTab] = useState<"inicio" | "perfil">("inicio");
  const [sidebarOpen, setSidebarOpen] = useState(!mobile);
  const initials = user.fullName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const navItems = [
    {
      id: "inicio" as const,
      label: "Inicio",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2 7.5L9 2l7 5.5V16a1 1 0 01-1 1H3a1 1 0 01-1-1V7.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M6 17V10h6v7" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: "perfil" as const,
      label: "Perfil",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M1.5 16.5c0-4 3.358-7 7.5-7s7.5 3 7.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100dvh", width: "100%", background: "#050810", position: "relative" }}>
      <aside style={{ width: sidebarOpen ? (mobile ? "100%" : 240) : 0, minWidth: sidebarOpen ? (mobile ? "100%" : 240) : 0, background: "rgba(13,17,32,0.98)", borderRight: "1px solid rgba(0,212,255,0.1)", display: "flex", flexDirection: "column", overflow: "hidden", transition: "width 0.25s ease, min-width 0.25s ease", position: mobile ? "fixed" : "relative", top: 0, left: 0, bottom: 0, zIndex: mobile ? 200 : 1 }}>
        <div style={{ padding: mobile ? "max(24px, calc(env(safe-area-inset-top) + 10px)) 24px 16px" : "20px 24px 16px", borderBottom: "1px solid rgba(0,212,255,0.08)", display: "flex", alignItems: "center", gap: 12 }}>
          <svg viewBox="0 0 64 64" fill="none" style={{ width: 32, height: 32, flexShrink: 0 }}>
            <polygon points="32,4 58,18 58,46 32,60 6,46 6,18" fill="rgba(0,212,255,0.07)" stroke="#00d4ff" strokeWidth="1.5" />
            <text x="32" y="37" textAnchor="middle" fontFamily="Rajdhani, sans-serif" fontWeight="700" fontSize="14" fill="#00d4ff">BC</text>
          </svg>
          <div>
            <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.15em", color: "#e2e8f8" }}>BICASH<span style={{ color: "#00d4ff" }}>.CO</span></div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.55rem", color: "#2a3a5a", letterSpacing: "0.12em" }}>PANEL DE CONTROL</div>
          </div>
          {mobile && (
            <button onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú" style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#3a5070" }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { setTab(item.id); if (mobile) setSidebarOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 8, border: "none", background: tab === item.id ? "rgba(0,212,255,0.1)" : "transparent", color: tab === item.id ? "#00d4ff" : "#3a5070", cursor: "pointer", textAlign: "left", transition: "all 0.15s", fontFamily: "Rajdhani, sans-serif", fontWeight: 600, fontSize: "0.95rem", letterSpacing: "0.08em", borderLeft: tab === item.id ? "2px solid #00d4ff" : "2px solid transparent" }}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: mobile ? "16px 12px max(16px, env(safe-area-inset-bottom))" : "16px 12px", borderTop: "1px solid rgba(0,212,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, background: "rgba(0,212,255,0.05)", marginBottom: 8 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#00d4ff,#0066aa)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#050810", flexShrink: 0 }}>{initials}</div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontFamily: "Exo 2, sans-serif", fontWeight: 600, fontSize: "0.82rem", color: "#e2e8f8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.fullName}</div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#2a3a5a" }}>{user.email}</div>
            </div>
          </div>
          <button onClick={onLogout} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "9px", borderRadius: 8, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer", color: "#f87171", fontFamily: "Rajdhani, sans-serif", fontWeight: 600, fontSize: "0.82rem", letterSpacing: "0.1em", transition: "all 0.15s" }}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M5 2H2a1 1 0 00-1 1v9a1 1 0 001 1h3M10 10.5l3.5-3L10 4M5.5 7.5h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            CERRAR SESIÓN
          </button>
        </div>
      </aside>
      {mobile && sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 199 }} />}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ display: "flex", alignItems: "center", gap: 12, padding: mobile ? "max(24px, calc(env(safe-area-inset-top) + 10px)) 18px 13px" : "13px 24px", borderBottom: "1px solid rgba(0,212,255,0.08)", background: "rgba(13,17,32,0.7)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 10 }}>
          {mobile && (
            <button onClick={() => setSidebarOpen(true)} aria-label="Abrir menú" style={{ background: "none", border: "none", cursor: "pointer", color: "#3a5070", padding: 0 }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
          <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.12em", color: "#e2e8f8", textTransform: "uppercase" }}>{tab === "perfil" ? "Mi Perfil" : "Inicio"}</div>
        </header>
        <main style={{ flex: 1, padding: mobile ? "24px 16px" : "40px 48px", overflowY: "auto" }}>
          <div className="dot-grid" style={{ position: "fixed", inset: 0, zIndex: -1, opacity: 0.5 }} />
          {tab === "inicio" && <ExpensesView user={user} mobile={mobile} />}
          {tab === "perfil" && <ProfileView user={user} mobile={mobile} />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [view, setView] = useState<"login" | "register">("login");
  const mobile = useIsMobile();

  if (user) {
    return <Dashboard user={user} onLogout={() => setUser(null)} mobile={mobile} />;
  }

  return (
    <div className="dot-grid" style={{ minHeight: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: mobile ? "16px 16px" : "24px 16px", position: "relative" }}>
      <div style={{ position: "fixed", top: "5%", left: "8%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 65%)", filter: "blur(40px)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "5%", right: "5%", width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,255,204,0.05) 0%, transparent 65%)", filter: "blur(40px)", pointerEvents: "none" }} />
      <div className="auth-card corner-tl corner-br" style={{ width: "100%", maxWidth: 620, borderRadius: mobile ? 10 : 14, overflow: "hidden", position: "relative", transition: "max-width 0.3s ease" }}>
        <div style={{ padding: mobile ? "20px 24px 24px" : "28px 52px 38px" }}>
          <Logo mobile={mobile} />
          {view === "login" ? (
            <LoginForm onSwitch={() => setView("register")} onLogin={setUser} mobile={mobile} />
          ) : (
            <RegisterForm onSwitch={() => setView("login")} onLogin={setUser} mobile={mobile} />
          )}
        </div>
      </div>
    </div>
  );
}

/** Small uppercase field caption used above every input/select. */
export function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      fontFamily: "Rajdhani, sans-serif",
      fontWeight: 600,
      fontSize: "0.85rem",
      letterSpacing: "0.18em",
      textTransform: "uppercase" as const,
      color: "#3a5a7a",
      display: "block",
      marginBottom: 7,
    }}>
      {children}
    </label>
  );
}

export function TextField({
  label, type = "text", value, onChange, placeholder, mono = false,
}: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; mono?: boolean;
}) {
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

export function SelectField({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div>
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="tech-input"
        style={{ cursor: "pointer", appearance: "none" as const, color: value ? "#e2e8f8" : "#3a4a6a" }}
      >
        <option value="">Seleccionar rol...</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  return (
    <div style={{
      background: "rgba(239,68,68,0.08)",
      border: "1px solid rgba(239,68,68,0.3)",
      borderRadius: 6,
      padding: "8px 12px",
      color: "#f87171",
      fontFamily: "JetBrains Mono, monospace",
      fontSize: "0.72rem",
    }}>
      ⚠ {message}
    </div>
  );
}

/** Small spinner shown on submit buttons while a request is in flight. */
export function LoadingSpinner() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="rgba(5,8,16,0.3)" strokeWidth="2" />
      <path d="M8 2a6 6 0 016 6" stroke="#050810" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Visual password strength meter based on length/uppercase/digit/symbol checks. */
export function PasswordStrength({ password }: { password: string }) {
  const checks = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)];
  const score = checks.filter(Boolean).length;
  const labels = ["Débil", "Regular", "Buena", "Fuerte"];
  const colors = ["#ef4444", "#f97316", "#00d4ff", "#00ffcc"];
  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 99,
            background: i < score ? colors[score - 1] : "rgba(255,255,255,0.07)",
            transition: "background 0.3s",
            boxShadow: i < score ? `0 0 5px ${colors[score - 1]}60` : "none",
          }} />
        ))}
      </div>
      {score > 0 && (
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", color: colors[score - 1] }}>
          Seguridad: {labels[score - 1]}
        </div>
      )}
    </div>
  );
}

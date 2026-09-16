export function Etiqueta({ children }: { children: React.ReactNode }) {
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

export function CampoTexto({
  etiqueta, tipo = "text", valor, alCambiar, marcadorPosicion, mono = false,
}: {
  etiqueta: string; tipo?: string; valor: string;
  alCambiar: (v: string) => void; marcadorPosicion?: string; mono?: boolean;
}) {
  return (
    <div>
      <Etiqueta>{etiqueta}</Etiqueta>
      <input
        type={tipo}
        value={valor}
        onChange={(e) => alCambiar(e.target.value)}
        placeholder={marcadorPosicion}
        className="tech-input"
        style={mono ? { fontFamily: "JetBrains Mono, monospace", fontSize: "1rem" } : { fontSize: "1rem" }}
      />
    </div>
  );
}

export function CampoSelector({
  etiqueta, valor, alCambiar, opciones,
}: {
  etiqueta: string; valor: string; alCambiar: (v: string) => void; opciones: string[];
}) {
  return (
    <div>
      <Etiqueta>{etiqueta}</Etiqueta>
      <select
        value={valor}
        onChange={(e) => alCambiar(e.target.value)}
        className="tech-input"
        style={{ cursor: "pointer", appearance: "none" as const, color: valor ? "#e2e8f8" : "#3a4a6a" }}
      >
        <option value="">Seleccionar rol...</option>
        {opciones.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export function CajaError({ mensaje }: { mensaje: string }) {
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
      ⚠ {mensaje}
    </div>
  );
}

export function IndicadorCarga() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="rgba(5,8,16,0.3)" strokeWidth="2" />
      <path d="M8 2a6 6 0 016 6" stroke="#050810" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function FortalezaContrasena({ contrasena }: { contrasena: string }) {
  const comprobaciones = [contrasena.length >= 8, /[A-Z]/.test(contrasena), /[0-9]/.test(contrasena), /[^A-Za-z0-9]/.test(contrasena)];
  const puntaje = comprobaciones.filter(Boolean).length;
  const etiquetas = ["Débil", "Regular", "Buena", "Fuerte"];
  const colores = ["#ef4444", "#f97316", "#00d4ff", "#00ffcc"];
  return (
    <div>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[0,1,2,3].map((i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 99,
            background: i < puntaje ? colores[puntaje - 1] : "rgba(255,255,255,0.07)",
            transition: "background 0.3s",
            boxShadow: i < puntaje ? `0 0 5px ${colores[puntaje-1]}60` : "none",
          }} />
        ))}
      </div>
      {puntaje > 0 && (
        <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.65rem", color: colores[puntaje-1] }}>
          Seguridad: {etiquetas[puntaje - 1]}
        </div>
      )}
    </div>
  );
}

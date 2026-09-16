export function Logo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 28 }}>
      <div style={{ position: "relative", width: 90, height: 90 }}>
        <svg viewBox="0 0 64 64" fill="none" style={{ width: "100%", height: "100%" }}>
          <polygon
            points="32,4 58,18 58,46 32,60 6,46 6,18"
            fill="rgba(0,212,255,0.07)"
            stroke="#00d4ff"
            strokeWidth="1.5"
          />
          <polygon
            points="32,13 49,22.5 49,41.5 32,51 15,41.5 15,22.5"
            fill="none"
            stroke="rgba(0,212,255,0.25)"
            strokeWidth="0.8"
          />
          <text
            x="32" y="37"
            textAnchor="middle"
            fontFamily="Rajdhani, sans-serif"
            fontWeight="700"
            fontSize="14"
            fill="#00d4ff"
          >BC</text>
        </svg>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "Rajdhani, sans-serif",
          fontWeight: 700,
          fontSize: "2.6rem",
          letterSpacing: "0.22em",
          color: "#e2e8f8",
          lineHeight: 1.1,
        }}>
          BICACH<span style={{ color: "#00d4ff" }}>.CO</span>
        </div>
        <div style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "0.82rem",
          letterSpacing: "0.28em",
          color: "#3a5070",
          marginTop: 6,
        }}>
          SISTEMA DE ACCESO SEGURO
        </div>
      </div>
    </div>
  );
}

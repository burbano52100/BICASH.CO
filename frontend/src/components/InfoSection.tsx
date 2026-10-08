import type { ReactNode } from "react";

export function InfoSection({ title, open, onToggle, fields, mobile }: { title: string; open: boolean; onToggle: () => void; fields: { label: string; value: ReactNode; mono?: boolean; accent?: boolean }[]; mobile: boolean }) {
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

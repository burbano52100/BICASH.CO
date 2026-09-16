import { useState } from "react";
import { Logo } from "./Logo";
import { PanelInicioSesion } from "./PanelInicioSesion";
import { PanelRegistro } from "./PanelRegistro";
import { usePantallaCompleta } from "./usePantallaCompleta";
import type { Vista } from "./types";

export function PaginaAutenticacion() {
  const [vista, setVista] = useState<Vista>("inicio");
  const { esPantallaCompleta, alternar } = usePantallaCompleta();

  return (
    <div className="dot-grid" style={{
      minHeight: "100vh", width: "100%",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px 16px", position: "relative",
    }}>
      {/* Manchas ambientales */}
      <div style={{
        position: "fixed", top: "5%", left: "8%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 65%)",
        filter: "blur(40px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", bottom: "5%", right: "5%",
        width: 360, height: 360, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,255,204,0.05) 0%, transparent 65%)",
        filter: "blur(40px)", pointerEvents: "none",
      }} />

      {/* Tarjeta */}
      <div className="auth-card corner-tl corner-br" style={{
        width: "100%",
        maxWidth: vista === "registro" ? 680 : 540,
        borderRadius: 14,
        overflow: "hidden",
        position: "relative",
        transition: "max-width 0.3s ease",
      }}>

        {/* Barra superior — el punto verde activa pantalla completa */}
        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "11px 18px",
          borderBottom: "1px solid rgba(0,212,255,0.1)",
          background: "rgba(0,212,255,0.03)",
        }}>
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#ff5f57" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#febc2e" }} />
          <button
            onClick={alternar}
            title={esPantallaCompleta ? "Salir de pantalla completa" : "Pantalla completa"}
            style={{
              width: 11, height: 11, borderRadius: "50%",
              background: esPantallaCompleta ? "#00ffcc" : "#28c840",
              border: "none", cursor: "pointer", padding: 0,
              boxShadow: esPantallaCompleta ? "0 0 8px rgba(0,255,204,0.7)" : "none",
              transition: "all 0.2s",
            }}
          />
          <div style={{ flex: 1 }} />
          <div style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.6rem", color: "#1a2a40", letterSpacing: "0.1em",
          }}>
            bicach.co / auth
          </div>
          <div style={{ flex: 1 }} />
          <div style={{
            background: "rgba(0,212,255,0.08)",
            border: "1px solid rgba(0,212,255,0.2)",
            borderRadius: 4, padding: "2px 7px",
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "0.58rem", color: "#00d4ff", letterSpacing: "0.1em",
          }}>
            SEGURO
          </div>
        </div>

        {/* Cuerpo */}
        <div style={{ padding: "44px 52px 38px" }}>
          <Logo />

          {vista === "inicio"
            ? <PanelInicioSesion alCambiarVista={() => setVista("registro")} />
            : <PanelRegistro alCambiarVista={() => setVista("inicio")} />}
        </div>

        {/* Pie de página */}
        <div style={{
          borderTop: "1px solid rgba(0,212,255,0.08)",
          padding: "10px 36px",
          display: "flex", justifyContent: "space-between",
          background: "rgba(0,0,0,0.2)",
        }}>
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#1a2a40" }}>v2.4.1</span>
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.6rem", color: "#1a2a40" }}>© 2026 bicach.co</span>
        </div>
      </div>
    </div>
  );
}

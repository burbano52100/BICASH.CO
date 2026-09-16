import { useState, useCallback, useEffect } from "react";

export function usePantallaCompleta() {
  const [esPantallaCompleta, setEsPantallaCompleta] = useState(false);
  useEffect(() => {
    const manejador = () => setEsPantallaCompleta(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", manejador);
    return () => document.removeEventListener("fullscreenchange", manejador);
  }, []);
  const alternar = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);
  return { esPantallaCompleta, alternar };
}

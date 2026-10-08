import { useEffect, useState } from "react";

/** Hook: true cuando el ancho de la ventana es menor a 520px. */
export function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 520);
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 520);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return mobile;
}

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT_PX = 520;

/** Tracks whether the viewport is narrower than the mobile breakpoint. */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT_PX);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT_PX);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

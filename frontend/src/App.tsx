import { useState } from "react";
import { LoginView } from "./views/LoginView";
import { DashboardView } from "./views/DashboardView";
import { useIsMobile } from "./hooks/useIsMobile";
import type { SessionUser } from "./services/api";

export default function App() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const mobile = useIsMobile();

  if (user) {
    return <DashboardView user={user} onLogout={() => setUser(null)} mobile={mobile} />;
  }

  return <LoginView onLogin={setUser} mobile={mobile} />;
}

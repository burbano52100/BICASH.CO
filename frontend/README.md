# frontend/

Interfaz React 19 + Vite 8 + Tailwind CSS v4.

```
frontend/
├── public/          # estáticos (favicon)
├── index.html       # plantilla Vite (con marcadores de Figma Make)
├── src/
│   ├── assets/      # index.css (Tailwind v4, fuentes, estilos globales)
│   ├── components/  # componentes reutilizables (Logo, CamposFormulario, InfoSection)
│   ├── views/       # pantallas completas (LoginView, DashboardView)
│   ├── hooks/       # useIsMobile
│   ├── services/    # api.ts: llamadas HTTP al backend
│   ├── App.tsx      # punto de entrada de la aplicación
│   └── main.tsx     # monta App en #root
└── package.json
```

- Dev server: `pnpm dev` (puerto 8443, proxy `/api` → backend :4000).
- Build: `pnpm build` → `dist/` en la raíz del monorepo.
- Typecheck: `pnpm typecheck`.

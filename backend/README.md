# backend/

API Express + PostgreSQL.

```
backend/
├── src/
│   ├── config/        # baseDatos.ts: pool pg desde DATABASE_URL
│   ├── controllers/   # autenticacionController.ts: lógica de register/login
│   ├── models/        # usuario.ts: interfaz Usuario y ROLES
│   ├── routes/        # autenticacion.ts: endpoints /api/auth/*
│   ├── middlewares/   # manejadorErrores.ts
│   └── index.ts       # arranque del servidor Express
├── scripts/migrate.ts # aplica database/schema.sql
├── .env               # NO se versiona (crear desde .env.example)
└── package.json
```

- Dev: `pnpm dev:backend` (tsx watch, puerto 4000).
- Build: `pnpm build:backend` → `backend/dist`.
- Typecheck: `pnpm typecheck`.

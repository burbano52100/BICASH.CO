# Cambios realizados en backend/

- `src/routes/autenticacion.ts`: se eliminó el uso de `bcryptjs`; el registro guarda la contraseña en texto plano y el login la compara directamente.
- Se eliminó `bcryptjs` de `dependencies` en `package.json` y se actualizó `pnpm-lock.yaml`.
- Se añadió el script `typecheck: tsc --noEmit` en `package.json`.
- Recordatorio: `backend/.env` no se versiona; crear desde `.env.example` y apuntar `DATABASE_URL` al PostgreSQL de Laragon (puerto 5433).

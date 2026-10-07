# Cambios realizados en backend/

**Importación de Figma Make (2026-10-07):**

- `src/routes/autenticacion.ts`:
  - `register` acepta y guarda `phone`, `salaryType`, `salaryAmount`; `role` ahora es opcional (default `Invitado`). Devuelve el usuario con `joinDate` formateado.
  - `login` devuelve además `phone`, `salaryType`, `salaryAmount`, `password` y `joinDate` para alimentar el panel de control.
- Se añadió `typecheck` en `package.json` (pasa).
- Se eliminó `bcryptjs` de dependencias.
- Recordatorio: `backend/.env` no se versiona; `DATABASE_URL` apunta al PostgreSQL de Laragon (puerto 5433).

# Cambios realizados en backend/

**Reorganización (2026-10-08):**

- `src/baseDatos.ts` → `src/config/baseDatos.ts`.
- Lógica de register/login → `src/controllers/autenticacionController.ts`; `src/routes/autenticacion.ts` quedó como router fino.
- `src/models/usuario.ts` — interfaz `Usuario` y lista `ROLES`.
- `src/middleware/` → `src/middlewares/`.
- `backend/README.md` creado.

**Importación de Figma Make (2026-10-07):**

- `src/routes/autenticacion.ts`:
  - `register` acepta y guarda `phone`, `salaryType`, `salaryAmount`; `role` ahora es opcional (default `Invitado`). Devuelve el usuario con `joinDate` formateado.
  - `login` devuelve además `phone`, `salaryType`, `salaryAmount`, `password` y `joinDate` para alimentar el panel de control.
- Se añadió `typecheck` en `package.json` (pasa).
- Se eliminó `bcryptjs` de dependencias.
- Recordatorio: `backend/.env` no se versiona; `DATABASE_URL` apunta al PostgreSQL de Laragon (puerto 5433).

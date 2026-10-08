# Cambios realizados en database/

**Reorganización (2026-10-08):**

- `migrations/001_schema.sql` — copia del esquema como migración versionada.
- `seeds/001_usuarios.sql` — usuario demo de prueba.

**Importación de Figma Make (2026-10-07):**

- `schema.sql`: nuevas columnas en `users`:
  - `phone TEXT`
  - `salary_type TEXT CHECK (salary_type IN ('fijo','variable'))`
  - `salary_amount NUMERIC`
- Ya estaba: `id SERIAL`, `password TEXT` en texto plano.
- Se aplicó la migración en el PostgreSQL de Laragon (puerto 5433) con `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` y se verificó con registro/login de prueba (usuarios de prueba eliminados).
- `README.md` actualizado.

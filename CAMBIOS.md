# Cambios realizados en la raíz

**Importación de los cambios de Figma Make (2026-10-07):**

- Se reemplazó la UI antigua (`frontend/src/login/` eliminada) por la versión nueva de Figma Make integrada en `frontend/src/App.tsx`: registro ampliado (celular, tipo y valor de salario), mostrar/ocultar contraseña, y **panel de control** con Inicio (gastos por día/semana/mes) y Perfil.
- `backend` y `database` extendidos con los nuevos campos (`phone`, `salary_type`, `salary_amount`); migración aplicada en PostgreSQL de Laragon (puerto 5433).
- `README.md` reescrito y actualizado con la nueva estructura.
- `AGENTS.md` actualizado (ya no existe `frontend/src/login/`).
- Limpieza de usuarios de prueba en la BD.

**Mejoras anteriores:**

- Se creó `README.md` (antes era `DOCUMENTACION.md`) con la documentación completa del proyecto; en GitHub ahora aparece como portada del repo.
- Se añadió `LICENSE` (MIT).
- Se añadió `.editorconfig` para formato consistente (UTF-8, LF, 2 espacios).
- Se añadió `* text=auto eol=lf` al inicio de `.gitattributes` para normalizar saltos de línea.
- Se creó CI en `.github/workflows/ci.yml`: en cada push/PR ejecuta `pnpm install`, `pnpm typecheck`, `pnpm build` y `pnpm build:backend`.
- Se añadió el script `pnpm typecheck` (tsc --noEmit en frontend y backend).
- Se actualizó `AGENTS.md` para reflejar la realidad: contraseñas en texto plano, `id` SERIAL, sin `bcryptjs`.

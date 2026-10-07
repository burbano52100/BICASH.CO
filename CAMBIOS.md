# Cambios realizados en la raíz

- Se creó `README.md` (antes era `DOCUMENTACION.md`) con la documentación completa del proyecto; en GitHub ahora aparece como portada del repo.
- Se añadió `LICENSE` (MIT).
- Se añadió `.editorconfig` para formato consistente (UTF-8, LF, 2 espacios).
- Se añadió `* text=auto eol=lf` al inicio de `.gitattributes` para normalizar saltos de línea.
- Se creó CI en `.github/workflows/ci.yml`: en cada push/PR ejecuta `pnpm install`, `pnpm typecheck`, `pnpm build` y `pnpm build:backend`.
- Se añadió el script `pnpm typecheck` (tsc --noEmit en frontend y backend).
- Se renombró/eliminó `DOCUMENTACION.md` (sustituido por `README.md`).
- Se actualizó `AGENTS.md` para reflejar la realidad: contraseñas en texto plano, `id` SERIAL, sin `bcryptjs`.

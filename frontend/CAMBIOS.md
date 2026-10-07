# Cambios realizados en frontend/

- Se unificó la marca: en `src/login/Logo.tsx` y `src/login/PaginaAutenticacion.tsx` se reemplazó `BICACH.CO`/`bicach.co` por `BICASH.CO`/`bicash.co`.
- Se unificó el ancho de la tarjeta de login/registro a `620px` fijos (`PaginaAutenticacion.tsx`), antes cambiaba bruscamente entre 540 y 680.
- Se añadió `role="alert"` a los mensajes de error (`CamposFormulario.tsx`) para accesibilidad.
- Se añadió el script `typecheck: tsc --noEmit` en `package.json`.

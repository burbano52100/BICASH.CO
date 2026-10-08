# Cambios realizados en frontend/

**Reorganización (2026-10-08):**

- Estructura nueva siguiendo `components/`, `views/`, `services/`, `hooks/`, `assets/`:
  - `src/App.tsx` quedó solo como punto de entrada (estado de sesión y selección de vista).
  - `src/views/LoginView.tsx` — la tarjeta de autenticación con login/registro.
  - `src/views/DashboardView.tsx` — panel de control (Inicio/Gastos y Perfil).
  - `src/components/` — `Logo.tsx`, `CamposFormulario.tsx` (Label, Field, ErrorBox, Spinner, PasswordStrength), `InfoSection.tsx`.
  - `src/services/api.ts` — llamadas HTTP (`apiLogin`, `apiRegister`, tipo `SessionUser`).
  - `src/hooks/useIsMobile.ts`.
  - `src/assets/index.css` (antes `src/index.css`).
  - `src/login/` eliminada por completo.
- `public/favicon.svg` añadido y `frontend/README.md` creado.

**Importación de Figma Make (2026-10-07):**

- Se eliminó la carpeta `src/login/` y se integró la versión nueva de Figma Make en `src/App.tsx` (todo en un solo archivo):
  - Login: campos usuario/contraseña, "Recordarme", botón "INICIAR SESIÓN", link a registro. Conectado al backend real (`POST /api/auth/login`).
  - Registro: nombre completo, usuario, correo, número de celular, contraseña + confirmar, tipo de salario (fijo/variable), salario mensual, indicador de seguridad de contraseña. Conectado a `POST /api/auth/register`. Pantalla de éxito con "ENTRAR AL SISTEMA".
  - **Panel de control** tras el login: barra lateral (Inicio / Perfil / cerrar sesión), header, y dos vistas:
    - `ExpensesView`: "Dinero que ha salido" con filtros Día/Semana/Mes y total en COP.
    - `ProfileView`: avatar con iniciales, estado de cuenta activa, secciones plegables "Información del usuario" e "Información personal" (incl. contraseña con MOSTRAR/OCULTAR).
- Ancho de tarjeta de auth unificado a 620px.
- Marca unificada `BICASH.CO`.
- `role="alert"` en mensajes de error.
- Script `typecheck` añadido y pasando.

# bicash-co

Monorepo (workspaces de pnpm) con tres capas: `frontend/` (React + Vite + Tailwind CSS, ejecutándose dentro de Figma Make), `backend/` (API en Node.js + Express) y `database/` (esquema de PostgreSQL). La funcionalidad de login/registro abarca las tres capas: la interfaz en `frontend/src/login/`, los endpoints en `backend/src/routes/autenticacion.ts`, y la tabla `users` en `database/schema.sql`.

**Convención de idioma:** los nombres de carpetas y archivos se mantienen en español (p. ej. `frontend/src/login/`, `autenticacion.ts`, `baseDatos.ts`, `PanelInicioSesion.tsx`), mientras que el código en sí — identificadores, funciones, tipos, comentarios y documentación técnica — está en inglés. El texto visible para el usuario final (etiquetas, botones, mensajes de error) permanece en español, ya que BICASH.CO es un producto para el mercado hispanohablante.

## Servidor de desarrollo

Ya hay un servidor de desarrollo de Vite **corriendo** en `$PORT` (por defecto 8443), solo para el **frontend**. No es necesario iniciarlo manualmente.

- URL de vista previa: el usuario puede acceder a la app corriendo a través del panel de vista previa
- Recarga en caliente: los cambios en los archivos fuente se reflejan de inmediato
- El **backend** no es gestionado por Figma Make. Se ejecuta aparte con `pnpm dev:backend` (ver `backend/` más abajo); el servidor de desarrollo del frontend redirige (proxy) las peticiones a `/api/*` hacia él.

## Estructura del proyecto

Esta es la estructura canónica del proyecto. Empieza por los archivos relevantes a la tarea listados abajo. Solo sigue imports o revisa otros archivos cuando sea necesario, cuando falte una ruta documentada, o cuando el repositorio contradiga esta guía.

### Raíz

- `package.json` - Raíz del workspace; `dev`/`build`/`preview` delegan a `frontend`, `dev:backend`/`build:backend`/`start:backend` delegan a `backend`, `db:migrate` aplica `database/schema.sql`
- `pnpm-workspace.yaml` - Declara los paquetes del workspace `frontend` y `backend`
- `.mise.toml` - Versiones del toolchain para Node.js y pnpm

### `frontend/` - Interfaz en React + Vite + Tailwind CSS

- `src/main.tsx` - Punto de entrada de React; importa `src/index.css` y monta `src/App.tsx` en el elemento `#root`
- `src/App.tsx` - Renderiza `PaginaAutenticacion` desde `src/login/`
- `src/login/` - Toda la interfaz y lógica de cliente de login/registro:
  - `PaginaAutenticacion.tsx` - La tarjeta contenedora (barra superior, logo, pie de página) que alterna entre las vistas de inicio de sesión y registro
  - `PanelInicioSesion.tsx` - Formulario de inicio de sesión (`LoginPanel`); llama al backend mediante `api.ts` y muestra un estado autenticado/cierre de sesión al tener éxito
  - `PanelRegistro.tsx` - Formulario de registro (`RegisterPanel`); llama al backend mediante `api.ts` y muestra un estado de éxito
  - `api.ts` - Envoltorios de `fetch` para `POST /api/auth/login` y `POST /api/auth/register`
  - `CamposFormulario.tsx` - Componentes de campo compartidos (`Label`, `TextField`, `SelectField`, `ErrorBox`, `LoadingSpinner`, `PasswordStrength`)
  - `Logo.tsx`, `usePantallaCompleta.ts` (`useFullscreen`), `usePantallaMovil.ts` (`useIsMobile`), `types.ts` - Lógica e interfaz de soporte
  - `index.ts` - Exportación centralizada (barrel)
- `src/index.css` - Punto de entrada de CSS global e import de Tailwind CSS v4
- `index.html` - Plantilla HTML de Vite que contiene el elemento `#root` y carga `src/main.tsx`
- `package.json` - Dependencias del frontend y scripts de Vite (dev/build/preview)
- `vite.config.ts` - Configuración de Vite con React, Tailwind CSS v4, plugins de Figma Make, el alias `@` para `src`, un `outDir` de build apuntando al `dist/` de la raíz del repo (para que `.figma/make/deploy` siga funcionando), y un proxy `/api` del servidor de desarrollo hacia el backend

### `backend/` - API en Node.js + Express

- `src/index.ts` - Arranque de la app Express (CORS, parseo de JSON, `/api/health`, monta `routes/autenticacion.ts`, manejador de errores)
- `src/routes/autenticacion.ts` - `POST /api/auth/register` y `POST /api/auth/login`; aplica hash a las contraseñas con bcrypt y emite un JWT al iniciar sesión
- `src/baseDatos.ts` - Pool de conexiones `pg` construido a partir de `DATABASE_URL`
- `src/middleware/manejadorErrores.ts` - Manejador de errores de Express genérico (`errorHandler`)
- `scripts/migrate.ts` - Aplica `database/schema.sql` contra `DATABASE_URL`
- `.env.example` - Cópialo a `.env` y completa `DATABASE_URL`, `JWT_SECRET`, `PORT`, `CORS_ORIGIN`
- `package.json` - Dependencias del backend y scripts `dev`/`build`/`start`/`db:migrate` (`tsx` para desarrollo, `tsc` para build)

### `database/` - Esquema de PostgreSQL

- `schema.sql` - Tabla `users` (nombre completo, usuario, correo, rol, hash de contraseña con bcrypt) más índices
- `README.md` - Instrucciones de configuración local y referencia de columnas

## Dependencias

- Runtime del frontend: React 19 y React DOM 19
- Estilos del frontend: Tailwind CSS v4 con el plugin `@tailwindcss/vite`
- Herramientas de build del frontend: Vite 8, TypeScript 5.7, y `@vitejs/plugin-react`
- Runtime del backend: Express, `pg`, `bcryptjs`, `jsonwebtoken`, `dotenv`, `cors`
- Herramientas de build del backend: TypeScript 5.7, `tsx`
- Base de datos: PostgreSQL (vía `pg`)
- Formateo: oxfmt (ejecutar desde la raíz del repo: `pnpm format`)

## Estilos

Este proyecto usa **Tailwind CSS v4** a través del plugin `@tailwindcss/vite` configurado en `frontend/vite.config.ts`. `frontend/src/index.css` importa Tailwind con `@import 'tailwindcss';`. Usa clases utilitarias de Tailwind directamente en el JSX y coloca el CSS global o la personalización del tema de Tailwind v4 en `frontend/src/index.css`. Este scaffold no necesita un archivo de configuración de Tailwind ni de PostCSS.

`frontend/src/main.tsx` importa `frontend/src/index.css`, así que la configuración global de fuentes va en `frontend/src/index.css`. Mantén los `@import` de CSS primero, y luego agrega cualquier regla `@font-face` y los valores por defecto de `font-family` ahí.

## Calidad de código

- Usa comillas dobles para cadenas con apóstrofes (`"We're here to help"`), o escápalas dentro de comillas simples. Un apóstrofe sin escapar dentro de una cadena con comillas simples rompe el build.
- Asegúrate de que las etiquetas JSX estén cerradas y las llaves balanceadas.
- Exporta los componentes del frontend como exportaciones nombradas desde `src/login/*` y como exportación por defecto desde `src/App.tsx`.
- Nunca subas `backend/.env` ni credenciales reales; solo `.env.example` está versionado.

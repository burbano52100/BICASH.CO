# BICASH.CO — Documentación del proyecto

## Descripción

Monorepo (pnpm workspaces) con tres capas:

- `frontend/` — interfaz React 19 + Vite 8 + Tailwind CSS v4 (pensada para ejecutarse dentro de Figma Make).
- `backend/` — API en Node.js + Express.
- `database/` — esquema de PostgreSQL.

La funcionalidad de **login/registro** abarca las tres capas: la interfaz en `frontend/src/App.tsx`, los endpoints en `backend/src/routes/autenticacion.ts` y la tabla `users` en `database/schema.sql`. Después del login se muestra un **panel de control** con Inicio (gastos por día/semana/mes) y Perfil.

**Convención de idioma:** las carpetas y archivos se nombran en español (`autenticacion.ts`, `baseDatos.ts`), mientras que el código (identificadores, funciones, tipos, comentarios) está en inglés. El texto visible para el usuario final permanece en español.

## Requisitos

| Herramienta | Versión | Cómo instalar |
|---|---|---|
| Node.js | 22 (ver `.mise.toml`) | https://nodejs.org |
| pnpm | 10.34.3 | `corepack enable; corepack prepare pnpm@10.34.3 --activate` |
| PostgreSQL | 17 | binarios de Laragon (`C:\laragon\bin\postgresql\pgsql`) |
| Laragon | — | PostgreSQL en el puerto 5433 (ver abajo) |
| Git | cualquiera reciente | Git for Windows |

## Base de datos con Laragon

PostgreSQL 17 está integrado en Laragon con sus datos en `C:\laragon\data\pgsql` y escucha en el **puerto 5433** (el 5432 lo ocupa la instalación standalone).

- Iniciarlo: `C:\laragon\bin\postgresql\inicio-postgresql.bat`, o:
  ```powershell
  & "C:\laragon\bin\postgresql\pgsql\bin\pg_ctl.exe" -D "C:\laragon\data\pgsql" -l "C:\laragon\data\pgsql\log.txt" start
  ```
- Usuario/contraseña: `postgres`/`postgres`. Base de datos: `bicash`.

## Instalación

```powershell
pnpm install
pnpm rebuild esbuild
Copy-Item backend\.env.example backend\.env   # ajustar DATABASE_URL al puerto 5433
pnpm db:migrate
```

## Variables de entorno

`backend/.env` (nunca se versiona; plantilla en `backend/.env.example`):

| Variable | Ejemplo | Descripción |
|---|---|---|
| `PORT` | `4000` | Puerto del backend |
| `DATABASE_URL` | `postgres://postgres:postgres@localhost:5433/bicash` | Conexión a PostgreSQL |
| `JWT_SECRET` | `change-this-secret` | Secreto para firmar JWT |
| `CORS_ORIGIN` | `http://localhost:8443` | Orígenes permitidos |

Frontend (Vite): `PORT` (8443), `BACKEND_URL` (`http://localhost:4000`), `FIGMA_PUBLIC_URL`, `FIGMA_DEV_SERVER_HOST`.

## Estructura

```
BURBANO.APP/
├── package.json            # scripts raíz del monorepo
├── pnpm-workspace.yaml     # paquetes: frontend, backend
├── .mise.toml              # tool versions
├── AGENTS.md / CLAUDE.md   # guía para agentes
├── README.md               # esta documentación
├── CAMBIOS.md              # cambios realizados por carpeta
├── LICENSE / .editorconfig / .gitattributes
├── .github/workflows/ci.yml
├── frontend/
│   ├── index.html, package.json, tsconfig.json, vite.config.ts
│   └── src/
│       ├── main.tsx        # punto de entrada; monta App
│       ├── App.tsx         # app completa: login/registro + panel de control
│       └── index.css       # fuentes, Tailwind v4, estilos globales
├── backend/
│   ├── src/
│   │   ├── index.ts        # bootstrap Express
│   │   ├── baseDatos.ts    # pool pg
│   │   ├── routes/autenticacion.ts
│   │   └── middleware/manejadorErrores.ts
│   └── scripts/migrate.ts
└── database/
    ├── schema.sql
    └── README.md
```

## Comandos

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Dev server de Vite (frontend), puerto 8443 |
| `pnpm build` | Build del frontend → `dist/` |
| `pnpm preview` | Sirve el build |
| `pnpm format` | Formatea con oxfmt |
| `pnpm typecheck` | tsc --noEmit en frontend y backend |
| `pnpm dev:backend` | Backend en modo watch, puerto 4000 |
| `pnpm build:backend` | Compila el backend → `backend/dist` |
| `pnpm start:backend` | Ejecuta el backend compilado |
| `pnpm db:migrate` | Aplica `database/schema.sql` |

## Cómo ejecutarlo

1. Inicia PostgreSQL de Laragon (ver arriba).
2. Terminal 1: `pnpm dev:backend` → API en http://localhost:4000 (`/api/health`).
3. Terminal 2: `pnpm dev` → frontend en http://localhost:8443 (proxy `/api` al backend).

## API

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/auth/register` | Registro: fullName, username, email, phone, role (default `Invitado`), password, confirmPassword, salaryType, salaryAmount. |
| `POST` | `/api/auth/login` | Login por username o email. Devuelve JWT (8h) y el usuario completo. |

## Base de datos

| Columna | Tipo | Notas |
|---|---|---|
| `id` | integer | PK, SERIAL autoincremental |
| `full_name` | text | nombre completo |
| `username` | text | UNIQUE |
| `email` | text | UNIQUE |
| `role` | text | CHECK con 5 roles |
| `password` | text | texto plano |
| `phone` | text | celular (nuevo) |
| `salary_type` | text | `fijo` o `variable` (nuevo) |
| `salary_amount` | numeric | salario mensual COP (nuevo) |
| `created_at` | timestamptz | default `now()` |

## Notas

- El backend no lo gestiona Figma Make: se levanta aparte con `pnpm dev:backend`.
- El token se guarda como `token_bicash` en localStorage (recordar) o sessionStorage.
- `backend/.env` y credenciales están en `.gitignore`.

# BICASH.CO — Guía completa del proyecto

Este documento explica **qué hace cada carpeta y cada archivo**, organizado por sección: Frontend, Backend, Base de datos y Raíz. Incluye notas y los commits relevantes del historial de Git.

## Índice

1. [Visión general](#visión-general)
2. [Raíz del proyecto](#raíz-del-proyecto)
3. [Frontend](#frontend)
4. [Backend](#backend)
5. [Base de datos](#base-de-datos)
6. [Historial de commits](#historial-de-commits)

---

## Visión general

BICASH.CO es un monorepo (pnpm workspaces) con tres capas: una interfaz web (React + Vite + Tailwind CSS v4), una API (Node.js + Express) y una base de datos PostgreSQL. Su funcionalidad actual es **login/registro** y, tras autenticarse, un **panel de control** con Inicio (gastos por día/semana/mes) y Perfil.

```
Navegador ──► frontend (Vite :8443) ──/api──► backend (Express :4000) ──► PostgreSQL (:5433)
```

---

## Raíz del proyecto

| Archivo | Qué hace | Notas |
|---|---|---|
| `package.json` | Scripts del monorepo: `dev`, `build`, `dev:backend`, `build:backend`, `start:backend`, `db:migrate`, `format`, `typecheck`. | Delega a `frontend`/`backend` con `pnpm --filter`. |
| `pnpm-workspace.yaml` | Declara los paquetes del workspace (`frontend`, `backend`). | Permite `pnpm -r`. |
| `pnpm-lock.yaml` | Lockfile con las versiones exactas de todas las dependencias. | Se versiona. |
| `.mise.toml` | Versiones del toolchain: Node 22, pnpm 10.34.3. | Usado por `mise`. |
| `README.md` | Documentación principal: instalación, comandos, API, variables de entorno. | Portada del repo en GitHub. |
| `AGENTS.md` / `CLAUDE.md` | Guía para agentes de IA que trabajen en el repo. | `CLAUDE.md` referencia a `AGENTS.md`. |
| `CAMBIOS.md` | Registro de los cambios realizados (en raíz, `frontend/`, `backend/`, `database/`). | Actualizado en cada iteración. |
| `LICENSE` | Licencia MIT. | |
| `.editorconfig` | Formato consistente: UTF-8, LF, 2 espacios, nueva línea final. | |
| `.gitignore` | Excluye `node_modules/`, `dist/`, `.env`, logs, caches. | `backend/.env` nunca se sube. |
| `.gitattributes` | Normaliza saltos de línea (`* text=auto eol=lf`) y reglas LFS para binarios. | |
| `docker-compose.yml` | Levanta PostgreSQL 17 en el puerto 5433 con `docker compose up`. | Opcional; solo incluye la BD. |
| `.github/workflows/ci.yml` | CI: en cada push/PR corre install, typecheck, build de frontend y backend. | |
| `.figma/make/` | Scripts del runtime de Figma Make (`dev`, `install`, `deploy`, `format`, `langserver`, `site.json`). | Imprescindible si editas desde Figma Make. |

---

## Frontend

Interfaz que ve el usuario en el navegador. React 19 + Vite 8 + Tailwind CSS v4.

```
frontend/
├── index.html                 # Plantilla HTML con el <div id="root"> (con marcadores de Figma Make)
├── package.json               # Dependencias y scripts de Vite
├── tsconfig.json              # TS estricto, alias @ -> src, JSX react-jsx
├── vite.config.ts             # React, Tailwind v4, plugins de Figma Make, proxy /api -> backend, alias @
├── vite-env.d.ts              # Tipos de Vite para importar assets
├── public/
│   └── favicon.svg            # Icono del sitio
├── src/
│   ├── main.tsx               # Punto de entrada: monta <App/> en #root con StrictMode
│   ├── App.tsx                # App: decide entre LoginView (sin sesión) y DashboardView (con sesión)
│   ├── assets/
│   │   └── index.css          # Fuentes Google, Tailwind v4, estilos globales (.dot-grid, .tech-input, .btn-primary, .auth-card, .corner-*)
│   ├── components/            # Componentes visuales reutilizables
│   │   ├── Logo.tsx           # Logo hexagonal BICASH.CO
│   │   ├── CamposFormulario.tsx  # Label, Field, ErrorBox (role=alert), Spinner, PasswordStrength
│   │   └── InfoSection.tsx    # Sección plegable usada en el Perfil
│   ├── views/                 # Pantallas completas
│   │   ├── LoginView.tsx      # Tarjeta de autenticación: LoginForm + RegisterForm (conectadas al backend)
│   │   └── DashboardView.tsx  # Panel de control: sidebar + header + ExpensesView/ProfileView
│   ├── hooks/
│   │   └── useIsMobile.ts     # Hook: true si el viewport es < 520px
│   └── services/
│       └── api.ts             # apiLogin/apiRegister: fetch a /api/auth/*, tipo SessionUser
├── frontend/README.md
└── frontend/CAMBIOS.md
```

**Notas:**
- El token JWT se guarda como `token_bicash` en `localStorage` (si marcaste "Recordarme") o `sessionStorage`.
- El dev server corre en el puerto **8443** y redirige `/api/*` al backend en **4000** (`BACKEND_URL`).
- El build genera `dist/` en la raíz (para que `.figma/make/deploy` funcione).

---

## Backend

API REST en Node.js + Express. Maneja autenticación con JWT y contraseñas en texto plano (decisión del proyecto; ver nota de seguridad en README).

```
backend/
├── package.json               # Dependencias: express, pg, jsonwebtoken, cors, dotenv; tsx para dev
├── tsconfig.json              # CommonJS, strict, outDir dist/
├── .env                       # ⚠️ Local, no versionado (DATABASE_URL, JWT_SECRET, PORT, CORS_ORIGIN)
├── .env.example               # Plantilla versionada de variables de entorno
├── scripts/
│   └── migrate.ts             # Aplica database/schema.sql contra DATABASE_URL
└── src/
    ├── index.ts               # Arranque: CORS, express.json(), /api/health, monta /api/auth, errorHandler, listen(PORT || 4000)
    ├── config/
    │   └── baseDatos.ts       # Pool de conexiones pg creado desde DATABASE_URL
    ├── models/
    │   └── usuario.ts         # Interfaz Usuario (fila de la tabla users) y lista ROLES
    ├── controllers/
    │   └── autenticacionController.ts  # register (valida, inserta, 409 en duplicado) y login (verifica y firma JWT)
    ├── routes/
    │   └── autenticacion.ts   # Router: POST /api/auth/register y POST /api/auth/login
    └── middlewares/
        └── manejadorErrores.ts    # Error handler genérico: log + 500 { message }
└── backend/README.md
└── backend/CAMBIOS.md
```

**Endpoints:**

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/health` | `{"status":"ok"}` |
| `POST` | `/api/auth/register` | Crea usuario; devuelve el usuario creado (con `joinDate`). |
| `POST` | `/api/auth/login` | Devuelve `{ token, user }` (user incluye phone, salaryType, salaryAmount, password, joinDate). |

**Notas:**
- JWT con expiración de 8 horas, claims `sub` y `role`, secreto `JWT_SECRET` (o `dev-secret` en desarrollo).
- Las contraseñas se guardan **en texto plano** y el login las compara directamente (ver aviso de seguridad en README).
- Roles válidos: `Administrador`, `Analista`, `Desarrollador`, `Operador`, `Invitado` (default en registro: `Invitado`).

---

## Base de datos

PostgreSQL 17 (integrado en Laragon, puerto 5433).

```
database/
├── schema.sql                 # Diseño de la tabla users (esquema canónico)
├── migrations/
│   └── 001_schema.sql         # Copia versionada del esquema para migraciones
├── seeds/
│   └── 001_usuarios.sql       # Usuario demo: jairo / password123456
├── README.md                  # Instrucciones y referencia de columnas
└── CAMBIOS.md
```

**Tabla `users`:**

| Columna | Tipo | Notas |
|---|---|---|
| `id` | integer | PK SERIAL autoincremental |
| `full_name` | text | NOT NULL |
| `username` | text | UNIQUE, NOT NULL |
| `email` | text | UNIQUE, NOT NULL |
| `role` | text | CHECK contra 5 roles, NOT NULL |
| `password` | text | NOT NULL (texto plano) |
| `phone` | text | Celular |
| `salary_type` | text | CHECK `fijo`/`variable` |
| `salary_amount` | numeric | Salario mensual en COP |
| `created_at` | timestamptz | default `now()` |

**Comandos útiles:**

```powershell
# Aplicar el esquema
pnpm db:migrate
# Conectarse por psql
& "C:\laragon\bin\postgresql\pgsql\bin\psql.exe" -U postgres -h localhost -p 5433 -d bicash
```

---

## Historial de commits

| Commit | Descripción |
|---|---|
| `4faab66` | Commit inicial: app de login/registro BICASH.CO |
| `9f84098` | División del proyecto en frontend, backend y database |
| `eb45069` | Traducción completa del proyecto al español |
| `ff09d65` | Eliminación de `baseUrl` no usado en tsconfig |
| `0468b23` | Identificadores traducidos a inglés, nombres de archivo en español |
| `ddbafbe` | Contraseñas en texto plano, id serial, PostgreSQL en Laragon, documentación |
| `f41e340` | Branding unificado, README, LICENSE, CI, editorconfig, typecheck, CAMBIOS.md |
| `40935e6` | Importación de los cambios de Figma Make (panel de control, registro ampliado, nuevos campos) |
| `dfbe248` | Reorganización: components/views/services/hooks/assets, config/controllers/models/middlewares, migrations, seeds, docker-compose, READMEs |

---

> Generado el 2026-10-08. Para detalles de instalación y ejecución ver `README.md`.

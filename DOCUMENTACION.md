�# BICASH.CO � Documentación del proyecto

## Descripción

Monorepo (pnpm workspaces) con tres capas:

- `frontend/` � interfaz React 19 + Vite 8 + Tailwind CSS v4 (pensada para ejecutarse dentro de Figma Make).
- `backend/` � API en Node.js + Express.
- `database/` � esquema de PostgreSQL.

La funcionalidad actual es **login/registro**, que abarca las tres capas: la interfaz en `frontend/src/login/`, los endpoints en `backend/src/routes/autenticacion.ts` y la tabla `users` en `database/schema.sql`.

**Convención de idioma:** las carpetas y archivos se nombran en español (`frontend/src/login/`, `autenticacion.ts`, `baseDatos.ts`, `PanelInicioSesion.tsx`), mientras que el código (identificadores, funciones, tipos, comentarios y documentación técnica) está en inglés. El texto visible para el usuario final permanece en español.

## Requisitos

| Herramienta | Versión | Cómo instalar |
|---|---|---|
| Node.js | 22 (ver `.mise.toml`; probado también con 24) | https://nodejs.org |
| pnpm | 10.34.3 | `corepack enable; corepack prepare pnpm@10.34.3 --activate` |
| PostgreSQL | 17 | instalador de EDB / binarios de Laragon |
| Laragon | � | PostgreSQL de Laragon en puerto 5433 (ver "Base de datos con Laragon") |

## Base de datos con Laragon

PostgreSQL 17 está integrado en Laragon en `C:\laragon\bin\postgresql\pgsql`, con sus datos en `C:\laragon\data\pgsql` y escuchando en el **puerto 5433** (el 5432 lo ocupa la instalación standalone de PostgreSQL).

- Iniciarlo manualmente: doble clic en `C:\laragon\bin\postgresql\inicio-postgresql.bat`, o:
  ```powershell
  & "C:\laragon\bin\postgresql\pgsql\bin\pg_ctl.exe" -D "C:\laragon\data\pgsql" -l "C:\laragon\data\pgsql\log.txt" start
  ```
- Usuario/contraseña: `postgres`/`postgres`. Base de datos del proyecto: `bicash`.
- `backend/.env` ya apunta a `postgres://postgres:postgres@localhost:5433/bicash`; el esquema ya fue aplicado con `pnpm db:migrate`.
- Si prefieres usar el puerto 5432, deten el servicio standalone (`Stop-Service postgresql-x64-17` desde una terminal como administrador), cambia el puerto de Laragon a 5432 en `C:\laragon\data\pgsql\postgresql.conf` y actualiza `DATABASE_URL`.
| Git | cualquiera reciente | Git for Windows |

## Estructura

```
BURBANO.APP/
�S���� package.json              # scripts raíz del monorepo
�S���� pnpm-workspace.yaml       # paquetes: frontend, backend
�S���� .mise.toml                # tool versions (Node 22, pnpm 10.34.3)
�S���� AGENTS.md / CLAUDE.md     # guía para agentes
�S���� frontend/
�   �S���� index.html
�   �S���� package.json
�   �S���� tsconfig.json
�   �S���� vite.config.ts
�   ����� src/
�       �S���� main.tsx          # punto de entrada; monta App
�       �S���� App.tsx           # renderiza PaginaAutenticacion
�       �S���� index.css         # fuentes, Tailwind v4, estilos globales
�       ����� login/            # login/registro completo
�           �S���� PaginaAutenticacion.tsx
�           �S���� PanelInicioSesion.tsx
�           �S���� PanelRegistro.tsx
�           �S���� CamposFormulario.tsx
�           �S���� Logo.tsx
�           �S���� api.ts        # fetch a /api/auth/*
�           �S���� types.ts      # View, RegisterForm, ROLES
�           �S���� usePantallaCompleta.ts
�           �S���� usePantallaMovil.ts
�           ����� index.ts      # exports centralizados
�S���� backend/
�   �S���� package.json
�   �S���� tsconfig.json
�   �S���� .env                  # NO versionado (crear desde .env.example)
�   �S���� .env.example
�   �S���� src/
�   �   �S���� index.ts          # bootstrap Express (CORS, JSON, rutas, errores)
�   �   �S���� baseDatos.ts      # pool pg desde DATABASE_URL
�   �   �S���� routes/autenticacion.ts
�   �   ����� middleware/manejadorErrores.ts
�   ����� scripts/migrate.ts    # aplica database/schema.sql
����� database/
    �S���� schema.sql
    ����� README.md
```

## Instalación

```powershell
# 1. Dependencias
pnpm install

# 2. Aprobar el build script de esbuild (si lo pide)
pnpm rebuild esbuild

# 3. Base de datos
createdb -U postgres -h localhost bicash   # o: psql -c "CREATE DATABASE bicash;"

# 4. Variables de entorno del backend
Copy-Item backend\.env.example backend\.env
# editar backend\.env si es necesario

# 5. Migrar el esquema
pnpm db:migrate
```

## Variables de entorno

`backend/.env` (nunca se versiona; plantilla en `backend/.env.example`):

| Variable | Ejemplo | Descripción |
|---|---|---|
| `PORT` | `4000` | Puerto del backend |
| `DATABASE_URL` | `postgres://postgres:postgres@localhost:5433/bicash` | Conexión a PostgreSQL (5433 = PostgreSQL de Laragon; 5432 = instancia standalone) |
| `JWT_SECRET` | `change-this-secret` | Secreto para firmar JWT (cambiar en producción) |
| `CORS_ORIGIN` | `http://localhost:8443` | Orígenes permitidos, separados por coma |

Variables de desarrollo para el frontend (Vite):

| Variable | Default | Descripción |
|---|---|---|
| `PORT` | `8443` | Puerto del dev server |
| `BACKEND_URL` | `http://localhost:4000` | Destino del proxy `/api` |
| `FIGMA_PUBLIC_URL` | � | `base` de Vite |
| `FIGMA_DEV_SERVER_HOST` | `0.0.0.0` | Host del dev server |

## Comandos

Desde la raíz:

| Comando | Qué hace |
|---|---|
| `pnpm dev` | Dev server de Vite (frontend), puerto 8443 por defecto |
| `pnpm build` | Build del frontend �  `dist/` en la raíz |
| `pnpm preview` | Sirve el build |
| `pnpm format` | Formatea con oxfmt |
| `pnpm dev:backend` | Backend en modo watch (tsx), puerto 4000 |
| `pnpm build:backend` | Compila el backend �  `backend/dist` |
| `pnpm start:backend` | Ejecuta el backend compilado |
| `pnpm db:migrate` | Aplica `database/schema.sql` a `DATABASE_URL` |

## Cómo ejecutarlo todo (desarrollo)

1. Terminal 1: `pnpm dev:backend` �  API en http://localhost:4000 (`GET /api/health` �  `{"status":"ok"}`).
2. Terminal 2: `pnpm dev` �  frontend en http://localhost:8443; el proxy de Vite redirige `/api/*` al backend.

## API del backend

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/auth/register` | Registro. Valida campos, rol permitido (`Administrador`, `Analista`, `Desarrollador`, `Operador`, `Invitado`), contraseñas coincidentes, mínimo 8 caracteres. Contrase�a en texto plano. 409 si username/email duplicado. |
| `POST` | `/api/auth/login` | Login por username o email. Devuelve JWT (8h, claims `sub`, `role`). |

## Base de datos

`database/schema.sql` crea la tabla `users`:

| Columna | Tipo | Notas |
|---|---|---|
| `id` | integer | PK, SERIAL (autoincremental) |
| `full_name` | text | nombre completo |
| `username` | text | UNIQUE |
| `email` | text | UNIQUE |
| `role` | text | CHECK contra los 5 roles |
| `password` | text | texto plano |
| `created_at` | timestamptz | default `now()` |

## Notas

- El backend **no** es gestionado por Figma Make: se levanta aparte con `pnpm dev:backend`.
- El frontend almacena el JWT como `token_bicash` en localStorage/sessionStorage.
- `backend/.env` y credenciales reales están cubiertos por `.gitignore`; solo `.env.example` se versiona.
- El build del frontend escribe en `dist/` de la raíz para que `.figma/make/deploy` siga funcionando.


# bicash-co

Monorepo (pnpm workspaces) with three layers: `frontend/` (React + Vite + Tailwind CSS, running inside Figma Make), `backend/` (Node.js + Express API), and `database/` (PostgreSQL schema). The login/registration feature spans all three: UI in `frontend/src/login/`, endpoints in `backend/src/routes/auth.ts`, and the `users` table in `database/schema.sql`.

## Development Server

A Vite development server is **already running** on `$PORT` (default 8443) for the **frontend only**. You don't need to start it manually.

- Preview URL: The user can access the running app through the preview panel
- Hot reload: Changes to source files are reflected immediately
- The **backend** is not managed by Figma Make. Run it yourself with `pnpm dev:backend` (see `backend/` below); the frontend dev server proxies `/api/*` requests to it.

## Project Structure

This is the canonical project structure. Start with task-relevant files below. Only follow imports or inspect other files when required, when a documented path is missing, or when the repository contradicts this guide.

### Root

- `package.json` - Workspace root; `dev`/`build`/`preview` delegate to `frontend`, `dev:backend`/`build:backend`/`start:backend` delegate to `backend`, `db:migrate` applies `database/schema.sql`
- `pnpm-workspace.yaml` - Declares the `frontend` and `backend` workspace packages
- `.mise.toml` - Toolchain versions for Node.js and pnpm

### `frontend/` - React + Vite + Tailwind CSS UI

- `src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into the `#root` element
- `src/App.tsx` - Renders `AuthPage` from `src/login/`
- `src/login/` - All login/registration UI and client logic:
  - `AuthPage.tsx` - The auth card shell (chrome bar, logo, footer) that switches between login and register views
  - `LoginPanel.tsx` - Login form; calls the backend via `api.ts` and shows an authenticated/logout state on success
  - `RegisterPanel.tsx` - Registration form; calls the backend via `api.ts` and shows a success state
  - `api.ts` - `fetch` wrappers for `POST /api/auth/login` and `POST /api/auth/register`
  - `FormFields.tsx` - Shared field primitives (`Label`, `InputField`, `SelectField`, `ErrorBox`, `Spinner`, `PasswordStrength`)
  - `Logo.tsx`, `useFullscreen.ts`, `types.ts` - Supporting UI/logic
  - `index.ts` - Barrel export
- `src/index.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `index.html` - Vite HTML shell containing the `#root` element and loading `src/main.tsx`
- `package.json` - Frontend dependencies and Vite dev/build/preview scripts
- `vite.config.ts` - Vite configuration with React, Tailwind CSS v4, Figma Make plugins, the `@` alias for `src`, a build `outDir` pointed at the repo-root `dist/` (so `.figma/make/deploy` keeps working), and a `/api` dev-server proxy to the backend

### `backend/` - Node.js + Express API

- `src/index.ts` - Express app bootstrap (CORS, JSON body parsing, `/api/health`, mounts `routes/auth.ts`, error handler)
- `src/routes/auth.ts` - `POST /api/auth/register` and `POST /api/auth/login`; hashes passwords with bcrypt and issues a JWT on login
- `src/db.ts` - `pg` connection pool built from `DATABASE_URL`
- `src/middleware/errorHandler.ts` - Catch-all Express error handler
- `scripts/migrate.ts` - Applies `database/schema.sql` to `DATABASE_URL`
- `.env.example` - Copy to `.env` and fill in `DATABASE_URL`, `JWT_SECRET`, `PORT`, `CORS_ORIGIN`
- `package.json` - Backend dependencies and `dev`/`build`/`start`/`db:migrate` scripts (`tsx` for dev, `tsc` for build)

### `database/` - PostgreSQL schema

- `schema.sql` - `users` table (full name, username, email, role, bcrypt password hash) plus indexes
- `README.md` - Local setup instructions and column reference

## Dependencies

- Frontend runtime: React 19 and React DOM 19
- Frontend styling: Tailwind CSS v4 with the `@tailwindcss/vite` plugin
- Frontend build tooling: Vite 8, TypeScript 5.7, and `@vitejs/plugin-react`
- Backend runtime: Express, `pg`, `bcryptjs`, `jsonwebtoken`, `dotenv`, `cors`
- Backend build tooling: TypeScript 5.7, `tsx`
- Database: PostgreSQL (via `pg`)
- Formatting: oxfmt (run from the repo root: `pnpm format`)

## Styling

This project uses **Tailwind CSS v4** through the `@tailwindcss/vite` plugin configured in `frontend/vite.config.ts`. `frontend/src/index.css` imports Tailwind with `@import 'tailwindcss';`. Use Tailwind utility classes directly in JSX and put global CSS or Tailwind v4 theme customization in `frontend/src/index.css`. This scaffold does not need a Tailwind config file or PostCSS config.

`frontend/src/main.tsx` imports `frontend/src/index.css`, so global font wiring belongs in `frontend/src/index.css`. Keep CSS `@import` statements first, then add any `@font-face` rules and font-family defaults there.

## Code quality

- Use double quotes for strings containing apostrophes (`"We're here to help"`), or escape them in single-quoted strings. An unescaped apostrophe in a single-quoted string breaks the build.
- Ensure JSX tags are closed and braces are balanced.
- Export frontend components as named exports from `src/login/*` and as the default export from `src/App.tsx`.
- Never commit `backend/.env` or real credentials; only `.env.example` is tracked.

-- BICASH.CO — database schema (PostgreSQL)

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('Administrador', 'Analista', 'Desarrollador', 'Operador', 'Invitado')),
  password TEXT NOT NULL,
  phone TEXT,
  salary_type TEXT CHECK (salary_type IN ('fijo', 'variable')),
  salary_amount NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

# Base de datos

PostgreSQL. El esquema vive en `schema.sql`.

## Configuración local

1. Crea una base de datos: `createdb bicash` (o el nombre que prefieras).
2. Copia `backend/.env.example` a `backend/.env` y ajusta `DATABASE_URL` con tus credenciales.
3. Aplica el esquema desde la raíz del proyecto:

   ```
   pnpm db:migrate
   ```

   Esto ejecuta `schema.sql` contra la base indicada en `DATABASE_URL`.

## Tablas

### `users`

| Columna         | Tipo          | Notas                                                                 |
|-----------------|---------------|------------------------------------------------------------------------|
| `id`            | `uuid`        | Clave primaria, generada con `gen_random_uuid()`.                     |
| `full_name`     | `text`        | Nombre completo.                                                       |
| `username`      | `text`        | Único.                                                                  |
| `email`         | `text`        | Único.                                                                  |
| `role`          | `text`        | Uno de: Administrador, Analista, Desarrollador, Operador, Invitado.    |
| `password_hash` | `text`        | Hash bcrypt de la contraseña (nunca se guarda en texto plano).        |
| `created_at`    | `timestamptz` | Fecha de creación.                                                     |

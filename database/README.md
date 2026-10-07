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
|------------------|---------------|------------------------------------------------------------------------|
| `id`              | `integer`     | Clave primaria autoincremental (SERIAL).                |
| `full_name`       | `text`        | Nombre completo.                                                       |
| `username`        | `text`        | Nombre de usuario, único.                                              |
| `email`           | `text`        | Correo electrónico, único.                                             |
| `role`            | `text`        | Uno de: Administrador, Analista, Desarrollador, Operador, Invitado.    |
| `password`       | `text`        | Contraseña en texto plano.                              |
| `created_at`      | `timestamptz` | Fecha de creación.                                                     |

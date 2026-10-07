# Cambios realizados en database/

- `schema.sql`: `id` ahora es `SERIAL` (autoincremental) en lugar de UUID, y la columna `password_hash` pasó a llamarse `password` (texto plano). Se eliminó la extensión `pgcrypto` ya que ya no se usa.
- `README.md`: actualizado para reflejar el nuevo esquema (id entero, password en texto plano).
- Se volvió a aplicar la migración en el PostgreSQL de Laragon (puerto 5433) y se verificó con registro/login de prueba.

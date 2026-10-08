-- Datos de prueba iniciales para la tabla users.
-- Usuario de ejemplo: Jairo / password123456 (texto plano, usuario demo)
INSERT INTO users (full_name, username, email, role, password, phone, salary_type, salary_amount)
VALUES ('Jairo Demo', 'jairo', 'jairo@bicash.co', 'Invitado', 'password123456', '+57 300 000 0000', 'fijo', 2500000)
ON CONFLICT (username) DO NOTHING;

import { Router } from "express";
import jwt from "jsonwebtoken";
import pool from "../baseDatos";

const authRouter = Router();

/** Roles a user account may have. Mirrors the `role` CHECK constraint in database/schema.sql. */
const ROLES = ["Administrador", "Analista", "Desarrollador", "Operador", "Invitado"];

/** POST /api/auth/register — creates a new user account. */
authRouter.post("/register", async (req, res, next) => {
  try {
    const { fullName, username, email, role, password, confirmPassword, phone, salaryType, salaryAmount } = req.body ?? {};

    if (!fullName || !username || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }
    const finalRole = role ?? "Invitado";
    if (!ROLES.includes(finalRole)) {
      return res.status(400).json({ message: "Rol inválido." });
    }
    if (salaryType && !["fijo", "variable"].includes(salaryType)) {
      return res.status(400).json({ message: "Tipo de salario inválido." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Las contraseñas no coinciden." });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 8 caracteres." });
    }

    const result = await pool.query(
      `INSERT INTO users (full_name, username, email, role, password, phone, salary_type, salary_amount)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, full_name AS "fullName", username, email, role, password, phone, salary_type AS "salaryType", salary_amount AS "salaryAmount", created_at AS "createdAt"`,
      [fullName, username, email, finalRole, password, phone ?? null, salaryType ?? "variable", salaryAmount ? Number(salaryAmount) : null],
    );

    const row = result.rows[0];
    return res.status(201).json({
      user: {
        ...row,
        password: row.password,
        phone: row.phone ?? "No registrado",
        joinDate: new Date(row.createdAt).toLocaleDateString("es-CO", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
    });
  } catch (err: any) {
    // Postgres unique_violation: username or email already exists.
    if (err?.code === "23505") {
      return res.status(409).json({ message: "El usuario o correo ya está registrado." });
    }
    next(err);
  }
});

/** POST /api/auth/login — verifies credentials and issues a JWT. */
authRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body ?? {};

    if (!username || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }

    const result = await pool.query(
      `SELECT id, full_name, username, email, role, password, phone, salary_type, salary_amount, created_at
       FROM users WHERE username = $1 OR email = $1`,
      [username],
    );
    const foundUser = result.rows[0];

    if (!foundUser || foundUser.password !== password) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const token = jwt.sign(
      { sub: foundUser.id, role: foundUser.role },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "8h" },
    );

    return res.json({
      token,
      user: {
        id: foundUser.id,
        fullName: foundUser.full_name,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
        password: foundUser.password,
        phone: foundUser.phone ?? "No registrado",
        salaryType: foundUser.salary_type ?? "variable",
        salaryAmount: foundUser.salary_amount ?? null,
        joinDate: new Date(foundUser.created_at).toLocaleDateString("es-CO", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      },
    });
  } catch (err) {
    next(err);
  }
});

export default authRouter;

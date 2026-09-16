import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../baseDatos";

const enrutadorAutenticacion = Router();

const ROLES = ["Administrador", "Analista", "Desarrollador", "Operador", "Invitado"];

enrutadorAutenticacion.post("/registro", async (req, res, next) => {
  try {
    const { nombreCompleto, usuario, correo, rol, contrasena, confirmarContrasena } = req.body ?? {};

    if (!nombreCompleto || !usuario || !correo || !rol || !contrasena || !confirmarContrasena) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
    }
    if (!ROLES.includes(rol)) {
      return res.status(400).json({ mensaje: "Rol inválido." });
    }
    if (contrasena !== confirmarContrasena) {
      return res.status(400).json({ mensaje: "Las contraseñas no coinciden." });
    }
    if (contrasena.length < 8) {
      return res.status(400).json({ mensaje: "La contraseña debe tener al menos 8 caracteres." });
    }

    const hashContrasena = await bcrypt.hash(contrasena, 12);

    const resultado = await pool.query(
      `INSERT INTO usuarios (nombre_completo, usuario, correo, rol, hash_contrasena)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, nombre_completo AS "nombreCompleto", usuario, correo, rol, creado_en AS "creadoEn"`,
      [nombreCompleto, usuario, correo, rol, hashContrasena],
    );

    return res.status(201).json({ usuario: resultado.rows[0] });
  } catch (err: any) {
    if (err?.code === "23505") {
      return res.status(409).json({ mensaje: "El usuario o correo ya está registrado." });
    }
    next(err);
  }
});

enrutadorAutenticacion.post("/iniciar-sesion", async (req, res, next) => {
  try {
    const { usuario, contrasena } = req.body ?? {};

    if (!usuario || !contrasena) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios." });
    }

    const resultado = await pool.query(
      `SELECT id, nombre_completo, usuario, correo, rol, hash_contrasena
       FROM usuarios WHERE usuario = $1 OR correo = $1`,
      [usuario],
    );
    const usuarioEncontrado = resultado.rows[0];

    if (!usuarioEncontrado || !(await bcrypt.compare(contrasena, usuarioEncontrado.hash_contrasena))) {
      return res.status(401).json({ mensaje: "Credenciales inválidas." });
    }

    const token = jwt.sign(
      { sub: usuarioEncontrado.id, rol: usuarioEncontrado.rol },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "8h" },
    );

    return res.json({
      token,
      usuario: {
        id: usuarioEncontrado.id,
        nombreCompleto: usuarioEncontrado.nombre_completo,
        usuario: usuarioEncontrado.usuario,
        correo: usuarioEncontrado.correo,
        rol: usuarioEncontrado.rol,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default enrutadorAutenticacion;

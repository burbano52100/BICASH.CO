import type { ErrorRequestHandler } from "express";

export const manejadorErrores: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ mensaje: "Error interno del servidor." });
};

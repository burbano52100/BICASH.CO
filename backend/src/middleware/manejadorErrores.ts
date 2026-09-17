import type { ErrorRequestHandler } from "express";

/** Generic Express error handler; logs the error and returns a safe 500 response. */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Error interno del servidor." });
};

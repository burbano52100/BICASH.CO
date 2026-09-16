import "dotenv/config";
import express from "express";
import cors from "cors";
import enrutadorAutenticacion from "./routes/autenticacion";
import { manejadorErrores } from "./middleware/manejadorErrores";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? true, credentials: true }));
app.use(express.json());

app.get("/api/salud", (_req, res) => res.json({ estado: "ok" }));
app.use("/api/autenticacion", enrutadorAutenticacion);

app.use(manejadorErrores);

const puerto = Number(process.env.PORT) || 4000;
app.listen(puerto, () => {
  console.log(`Backend API escuchando en http://localhost:${puerto}`);
});

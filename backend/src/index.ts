import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/autenticacion";
import { errorHandler } from "./middleware/manejadorErrores";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") ?? true, credentials: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRouter);

app.use(errorHandler);

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`Backend API listening on http://localhost:${port}`);
});

import "dotenv/config";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Pool } from "pg";

async function principal() {
  const rutaEsquema = resolve(__dirname, "../../database/schema.sql");
  const sql = readFileSync(rutaEsquema, "utf-8");

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    await pool.query(sql);
    console.log("Migración aplicada correctamente.");
  } finally {
    await pool.end();
  }
}

principal().catch((err) => {
  console.error("Error al migrar la base de datos:", err);
  process.exit(1);
});

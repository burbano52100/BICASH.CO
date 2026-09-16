import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL no está definido. Copia backend/.env.example a backend/.env y complétalo.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;

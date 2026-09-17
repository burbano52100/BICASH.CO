import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined. Copy backend/.env.example to backend/.env and fill it in.");
}

/** Shared PostgreSQL connection pool, configured from DATABASE_URL. */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default pool;

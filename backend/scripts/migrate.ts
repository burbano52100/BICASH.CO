import "dotenv/config";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Pool } from "pg";

/** Applies database/schema.sql against DATABASE_URL. */
async function main() {
  const schemaPath = resolve(__dirname, "../../database/schema.sql");
  const sql = readFileSync(schemaPath, "utf-8");

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  try {
    await pool.query(sql);
    console.log("Migration applied successfully.");
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Error migrating the database:", err);
  process.exit(1);
});

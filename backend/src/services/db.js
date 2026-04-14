const { Pool } = require("pg");

function getPoolConfig() {
  // Support common managed Postgres defaults (e.g. Neon/Render/Fly) that require SSL.
  const ssl =
    process.env.PGSSLMODE === "disable"
      ? false
      : { rejectUnauthorized: false };

  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl,
    };
  }

  const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
  const missing = ["DB_USER", "DB_PASSWORD", "DB_HOST", "DB_PORT", "DB_NAME"].filter(
    (k) => !process.env[k]
  );

  if (missing.length) {
    throw new Error(
      `Database env missing: ${missing.join(
        ", "
      )}. Provide DATABASE_URL or DB_* variables`
    );
  }

  return {
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: Number(DB_PORT),
    database: DB_NAME,
    ssl,
  };
}

const pool = new Pool(getPoolConfig());

async function query(text, params) {
  return pool.query(text, params);
}

module.exports = {
  pool,
  query,
};


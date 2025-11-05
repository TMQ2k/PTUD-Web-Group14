// db.js
import pg from "pg";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Render requires SSL connection
  },
});

// Test the connection immediately
pool.connect()
  .then(() => console.log("✅ Connected to Render PostgreSQL!"))
  .catch(err => console.error("❌ Connection error:", err.stack));

export default pool;

async function checkTable() {
  const res = await pool.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public';
  `);
  console.log(res.rows);
}

checkTable();

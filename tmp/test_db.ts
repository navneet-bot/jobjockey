const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    console.log("Attempting to connect to database...");
    const result = await sql`SELECT 1 as connected`;
    console.log("Connection successful:", result);
  } catch (err) {
    console.error("Connection failed!");
    console.error(err);
  }
}

testConnection();

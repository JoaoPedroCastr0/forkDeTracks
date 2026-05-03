import "dotenv/config";
import pkg from "pg";

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

try {
  await client.connect();
  console.log("✅ CONECTOU NO BANCO");
} catch (err) {
  console.error("❌ ERRO AO CONECTAR:", err);
}

await client.end();
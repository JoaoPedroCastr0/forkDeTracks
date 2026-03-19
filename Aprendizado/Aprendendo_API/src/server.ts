import { app } from "./app";
import "dotenv/config";

const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || "localhost";

app.listen({
  hostname: HOST,
  port: PORT,
});

console.log(`server is running on http://${HOST}:${PORT}`);
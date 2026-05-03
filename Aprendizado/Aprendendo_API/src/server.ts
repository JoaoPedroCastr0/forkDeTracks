import "dotenv/config";
import { app } from "./app";


const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || "localhost";

app.listen({
  hostname: HOST,
  port: PORT,
});

console.log(`server is running on http://${HOST}:${PORT}`);
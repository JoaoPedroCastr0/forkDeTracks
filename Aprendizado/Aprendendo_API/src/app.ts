import express from "express";
import cors from "cors";
import path from "path";
import router from "./routes/AllRoutes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { auth } from "./auth/auth";
import { toNodeHandler } from "better-auth/node";

export const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://[::1]:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
    "http://127.0.0.1:8080"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  credentials: true
}));
app.use("/api/auth", toNodeHandler(auth));

app.use(express.json());

app.use(express.static(path.join(__dirname, "../frontend")));

app.use(router);

app.use(errorMiddleware); 


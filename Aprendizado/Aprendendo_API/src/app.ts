import express from "express";
import cors from "cors";
import path from "path";
import router from "./routes/AllRoutes";
import { errorMiddleware } from "./middlewares/error.middleware";


export const app = express();

app.use(cors({
  origin: "http://127.0.0.1:8080",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use(express.static(path.join(__dirname, "../../frontend")));

app.use(router);

app.use(errorMiddleware);


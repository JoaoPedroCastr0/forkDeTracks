import express from "express";
import { router } from "./routes/AllRoutes";

export const app = express();

app.use(express.json())

app.use(router)
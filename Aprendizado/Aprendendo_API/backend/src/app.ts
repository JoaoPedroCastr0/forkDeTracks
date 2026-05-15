import path from 'node:path';
import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import express from 'express';
import { auth } from './auth/auth';
import { errorMiddleware } from './middlewares/error.middleware';
import router from './routes/AllRoutes';

export const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    credentials: true,
  }),
);
app.use('/api/auth', toNodeHandler(auth));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

app.use(router);

app.use(errorMiddleware);

import cors from 'cors';
import express from 'express';
import { errorMiddleware } from './middlewares/error.middleware';
import router from './routes/AllRoutes';

export const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'x-user-id', 'x-user-role', 'x-user-email'],
    credentials: true,
  }),
);

app.use(express.json());

// Monta as rotas da aplicação
app.use(router);

// Tratamento de rotas inexistentes (404)
app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware centralizado de erros
app.use(errorMiddleware);

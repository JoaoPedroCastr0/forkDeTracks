import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import express from 'express';
import { auth } from './auth/auth';
import { errorMiddleware } from './middlewares/error.middleware';
import router from './routes/AllRoutes';

export const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://localhost',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cookie',
      'x-user-id',
      'x-user-role',
      'x-user-email',
    ],
    credentials: true,
  }),
);

// Endpoints do Better Auth (deve ficar antes do body parser json do express)
app.all('/api/auth/{*path}', toNodeHandler(auth));

app.use(express.json());

// Monta as rotas da aplicação
app.use(router);

// Tratamento de rotas inexistentes (404)
app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Middleware centralizado de erros
app.use(errorMiddleware);

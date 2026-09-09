import { Router } from 'express';
import {
  atualizarCurso,
  criarCurso,
  listarCursos,
  obterCursoPorId,
} from '../controllers/cursoController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  atualizarCursoSchema,
  criarCursoSchema,
  idParamSchema,
} from '../schemas/cursoSchema';

const routes = Router();

// Endpoint de Saúde
routes.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', servico: 'ensino-api' });
});
//----------------------------------------------------------------//

// Rotas de Cursos
routes.post(
  '/cursos',
  authMiddleware,
  validate({ body: criarCursoSchema }),
  criarCurso,
);

routes.get('/cursos', listarCursos);

routes.get(
  '/cursos/:id',
  validate({ params: idParamSchema }),
  obterCursoPorId,
);

routes.put(
  '/cursos/:id',
  authMiddleware,
  validate({ params: idParamSchema, body: atualizarCursoSchema }),
  atualizarCurso,
);

export default routes;

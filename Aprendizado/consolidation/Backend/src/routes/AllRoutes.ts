import { Router } from 'express';
import { criarAula, criarModulo, obterConteudoCurso } from '../controllers/aulaController';
import {
  atualizarCurso,
  criarCurso,
  listarCursos,
  obterCursoPorId,
  removerCurso,
} from '../controllers/cursoController';
import {
  cancelarMatricula,
  listarMinhasMatriculas,
  matricular,
} from '../controllers/matriculaController';
import { concluirAula, desmarcarAula, obterProgresso } from '../controllers/progressoController';
import { cadastrarUsuario } from '../controllers/usuarioController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { criarAulaSchema, criarModuloSchema } from '../schemas/aulaSchema';
import { atualizarCursoSchema, criarCursoSchema, idParamSchema } from '../schemas/cursoSchema';
import { criarMatriculaSchema, cursoIdParamSchema } from '../schemas/matriculaSchema';
import { aulaIdParamSchema } from '../schemas/progressoSchema';
import { criarUsuarioSchema } from '../schemas/usuarioSchema';

const routes = Router();

// Rota Raiz Informativa da API
routes.get('/', (_req, res) => {
  res.status(200).json({
    servico: 'DevTracks Ensino API',
    status: 'online',
    frontend: 'http://localhost:3000',
    endpoints: {
      health: '/health',
      cursos: '/cursos',
      matriculas: '/matriculas/minhas',
    },
  });
});

// Endpoint de Saúde
routes.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', servico: 'ensino-api' });
});

//----------------------------------------------------------------//
// Rotas de Usuários / Cadastro
//----------------------------------------------------------------//
routes.post('/usuarios', validate({ body: criarUsuarioSchema }), cadastrarUsuario);

//----------------------------------------------------------------//
// Rotas de Cursos (Catálogo Geral)
//----------------------------------------------------------------//
routes.get('/cursos', listarCursos);
routes.get('/cursos/:id', validate({ params: idParamSchema }), obterCursoPorId);

//----------------------------------------------------------------//
// Rotas de Cursos (Administrativas / Professor)
//----------------------------------------------------------------//
routes.post(
  '/cursos',
  authMiddleware,
  requireRole('PROFESSOR'),
  validate({ body: criarCursoSchema }),
  criarCurso,
);

routes.put(
  '/cursos/:id',
  authMiddleware,
  requireRole('PROFESSOR'),
  validate({ params: idParamSchema, body: atualizarCursoSchema }),
  atualizarCurso,
);

routes.delete(
  '/cursos/:id',
  authMiddleware,
  requireRole('PROFESSOR'),
  validate({ params: idParamSchema }),
  removerCurso,
);

//----------------------------------------------------------------//
// Rotas de Conteúdo, Módulos e Aulas
//----------------------------------------------------------------//
routes.get(
  '/cursos/:id/conteudo',
  authMiddleware,
  validate({ params: idParamSchema }),
  obterConteudoCurso,
);

routes.post(
  '/cursos/:id/modulos',
  authMiddleware,
  requireRole('PROFESSOR'),
  validate({ params: idParamSchema, body: criarModuloSchema }),
  criarModulo,
);

routes.post(
  '/cursos/:id/aulas',
  authMiddleware,
  requireRole('PROFESSOR'),
  validate({ params: idParamSchema, body: criarAulaSchema }),
  criarAula,
);

//----------------------------------------------------------------//
// Rotas do Aluno: Matrículas
//----------------------------------------------------------------//
routes.post('/matriculas', authMiddleware, validate({ body: criarMatriculaSchema }), matricular);

routes.get('/matriculas/minhas', authMiddleware, listarMinhasMatriculas);

routes.delete(
  '/matriculas/:cursoId',
  authMiddleware,
  validate({ params: cursoIdParamSchema }),
  cancelarMatricula,
);

//----------------------------------------------------------------//
// Rotas do Aluno: Aulas e Progresso
//----------------------------------------------------------------//
routes.post(
  '/aulas/:aulaId/concluir',
  authMiddleware,
  validate({ params: aulaIdParamSchema }),
  concluirAula,
);

routes.delete(
  '/aulas/:aulaId/concluir',
  authMiddleware,
  validate({ params: aulaIdParamSchema }),
  desmarcarAula,
);

routes.get(
  '/cursos/:cursoId/progresso',
  authMiddleware,
  validate({ params: cursoIdParamSchema }),
  obterProgresso,
);

export default routes;

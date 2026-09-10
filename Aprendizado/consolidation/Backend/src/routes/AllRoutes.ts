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
  aprovarMatricula,
  cancelarMatricula,
  listarMatriculasPendentes,
  listarMinhasMatriculas,
  matricular,
  rejeitarMatricula,
} from '../controllers/matriculaController';
import { concluirAula, desmarcarAula, obterProgresso } from '../controllers/progressoController';
import {
  atualizarTrilha,
  criarTrilha,
  desativarTrilha,
  listarTrilhas,
  obterTrilhaPorId,
} from '../controllers/trilhaController';
import { cadastrarUsuario, obterListaAlunos } from '../controllers/usuarioController';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { criarAulaSchema, criarModuloSchema } from '../schemas/aulaSchema';
import { atualizarCursoSchema, criarCursoSchema, idParamSchema } from '../schemas/cursoSchema';
import {
  criarMatriculaSchema,
  cursoIdParamSchema,
  matriculaIdParamSchema,
} from '../schemas/matriculaSchema';
import { aulaIdParamSchema } from '../schemas/progressoSchema';
import {
  atualizarTrilhaSchema,
  criarTrilhaSchema,
  trilhaIdParamSchema,
} from '../schemas/trilhaSchema';
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
// Rotas de Usuários / Cadastro e Gestão
//----------------------------------------------------------------//
routes.post('/usuarios', validate({ body: criarUsuarioSchema }), cadastrarUsuario);
routes.get('/alunos', authMiddleware, requireRole('PROFESSOR'), obterListaAlunos);

//----------------------------------------------------------------//
// Rotas de Trilhas de Estudo
//----------------------------------------------------------------//
routes.get('/trilhas', optionalAuthMiddleware, listarTrilhas);
routes.get(
  '/trilhas/:id',
  optionalAuthMiddleware,
  validate({ params: trilhaIdParamSchema }),
  obterTrilhaPorId,
);

routes.post(
  '/trilhas',
  authMiddleware,
  requireRole('PROFESSOR'),
  validate({ body: criarTrilhaSchema }),
  criarTrilha,
);

routes.put(
  '/trilhas/:id',
  authMiddleware,
  requireRole('PROFESSOR'),
  validate({ params: trilhaIdParamSchema, body: atualizarTrilhaSchema }),
  atualizarTrilha,
);

routes.delete(
  '/trilhas/:id',
  authMiddleware,
  requireRole('PROFESSOR'),
  validate({ params: trilhaIdParamSchema }),
  desativarTrilha,
);

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
//----------------------------------------------------------------//
// Rotas de Matrículas (Aluno e Professor)
//----------------------------------------------------------------//
routes.post('/matriculas', authMiddleware, validate({ body: criarMatriculaSchema }), matricular);

routes.get('/matriculas/minhas', authMiddleware, listarMinhasMatriculas);

routes.get(
  '/matriculas/pendentes',
  authMiddleware,
  requireRole('PROFESSOR'),
  listarMatriculasPendentes,
);

routes.patch(
  '/matriculas/:id/aprovar',
  authMiddleware,
  requireRole('PROFESSOR'),
  validate({ params: matriculaIdParamSchema }),
  aprovarMatricula,
);

routes.patch(
  '/matriculas/:id/rejeitar',
  authMiddleware,
  requireRole('PROFESSOR'),
  validate({ params: matriculaIdParamSchema }),
  rejeitarMatricula,
);

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

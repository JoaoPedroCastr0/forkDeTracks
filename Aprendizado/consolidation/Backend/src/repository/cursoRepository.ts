import type { Curso } from '../models/Curso';
import type { AtualizarCursoDTO, CriarCursoDTO } from '../schemas/cursoSchema';

// Repositório inicial (será conectado ao Prisma Client na etapa de persistência)
const cursosDb: Curso[] = [];

export async function criarCurso(dados: CriarCursoDTO, professorId: string): Promise<Curso> {
  const novoCurso: Curso = {
    id: `curso_${Date.now()}`,
    titulo: dados.titulo,
    descricao: dados.descricao,
    cargaHorariaEstimada: dados.cargaHorariaEstimada,
    nivel: dados.nivel,
    status: 'RASCUNHO',
    professorId,
    trilhaId: dados.trilhaId ?? null,
    dataCriacao: new Date(),
    dataAtualizacao: new Date(),
    dataExclusao: null,
  };

  cursosDb.push(novoCurso);
  return novoCurso;
}

export async function listarCursos(): Promise<Curso[]> {
  return cursosDb.filter((c) => !c.dataExclusao);
}

export async function buscarCursoPorId(id: string): Promise<Curso | null> {
  const curso = cursosDb.find((c) => c.id === id && !c.dataExclusao);
  return curso ?? null;
}

export async function atualizarCurso(id: string, dados: AtualizarCursoDTO): Promise<Curso | null> {
  const index = cursosDb.findIndex((c) => c.id === id && !c.dataExclusao);
  if (index === -1) return null;

  const cursoExistente = cursosDb[index]!;
  const cursoAtualizado: Curso = {
    ...cursoExistente,
    ...dados,
    dataAtualizacao: new Date(),
  };

  cursosDb[index] = cursoAtualizado;
  return cursoAtualizado;
}

export type NivelCurso = 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';
export type StatusCurso = 'RASCUNHO' | 'PUBLICADO' | 'ARQUIVADO';
export type PapelUsuario = 'ALUNO' | 'PROFESSOR';

export interface Curso {
  id: string;
  titulo: string;
  descricao: string;
  cargaHorariaEstimada: number;
  nivel: NivelCurso;
  status: StatusCurso;
  professorId?: string;
  trilhaId?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date | null;
  modulosCount?: number;
  aulasCount?: number;
}

export interface Trilha {
  id: string;
  titulo: string;
  descricao?: string | null;
  ordem: number;
  ativa: boolean;
  alunoId?: string | null;
  aluno?: {
    id: string;
    name: string;
    email: string;
  } | null;
  totalCursos?: number;
  cursos?: Curso[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CriarTrilhaInput {
  titulo: string;
  descricao?: string;
  ordem?: number;
  alunoId?: string | null;
  cursosIds?: string[];
}

export interface AlunoResumo {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface Aula {
  id: string;
  titulo: string;
  descricao?: string | null;
  urlConteudo: string;
  duracaoMinutos: number;
  ordem: number;
  moduloId: string;
  cursoId: string;
}

export interface AulaConteudo {
  id: string;
  titulo: string;
  descricao?: string;
  urlConteudo: string;
  duracaoMinutos: number;
  ordem: number;
  concluida: boolean;
}

export interface ModuloConteudo {
  id: string;
  titulo: string;
  descricao?: string;
  ordem: number;
  aulas: AulaConteudo[];
}

export interface ProgressoCursoInfo {
  totalAulas: number;
  aulasConcluidas: number;
  percentualProgresso: number;
  cursoConcluido: boolean;
}

export interface ConteudoCursoDetalhado {
  curso: {
    id: string;
    titulo: string;
    descricao: string;
    nivel: string;
    cargaHorariaEstimada: number;
  };
  modulos: ModuloConteudo[];
  progresso: ProgressoCursoInfo;
}

export type StatusMatricula = 'PENDENTE' | 'ATIVA' | 'CONCLUIDA' | 'CANCELADA' | 'REJEITADA';

export interface ItemMatricula {
  id: string;
  status: StatusMatricula | string;
  percentualProgresso: number;
  curso: {
    id: string;
    titulo: string;
    descricao?: string;
  };
}

export interface MatriculaPendente {
  id: string;
  dataMatricula: string;
  usuario: {
    id: string;
    name: string;
    email: string;
  };
  curso: {
    id: string;
    titulo: string;
    nivel: string;
    professorId: string;
  };
}

export function obterPapelUsuario(user: unknown): PapelUsuario | null {
  if (typeof user === 'object' && user !== null && 'papel' in user) {
    const papel = (user as { papel?: unknown }).papel;
    if (papel === 'PROFESSOR') return 'PROFESSOR';
    if (papel === 'ALUNO') return 'ALUNO';
  }
  return null;
}

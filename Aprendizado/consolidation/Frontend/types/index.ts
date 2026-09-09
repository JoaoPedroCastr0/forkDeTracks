export type NivelCurso = 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';
export type StatusCurso = 'RASCUNHO' | 'PUBLICADO' | 'ARQUIVADO';

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
  cursos?: Curso[];
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

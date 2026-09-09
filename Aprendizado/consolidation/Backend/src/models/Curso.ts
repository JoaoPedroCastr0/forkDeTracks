export type NivelCurso = 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';
export type StatusCurso = 'RASCUNHO' | 'PUBLICADO' | 'ARQUIVADO';

export interface Curso {
  id: string;
  titulo: string;
  descricao: string;
  cargaHorariaEstimada: number;
  nivel: NivelCurso;
  status: StatusCurso;
  professorId: string;
  trilhaId?: string | null;
  dataCriacao: Date;
  dataAtualizacao: Date;
  dataExclusao?: Date | null;
}

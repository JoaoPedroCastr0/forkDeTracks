export type StatusMatricula = 'ATIVA' | 'CONCLUIDA' | 'CANCELADA';

export interface Matricula {
  id: string;
  usuarioId: string;
  cursoId: string;
  status: StatusMatricula;
  dataMatricula: Date;
  dataConclusao?: Date | null;
}

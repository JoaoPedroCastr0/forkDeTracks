export interface Progresso {
  id: string;
  matriculaId: string;
  usuarioId: string;
  cursoId: string;
  aulaId: string;
  concluida: boolean;
  dataConclusao?: Date | null;
}

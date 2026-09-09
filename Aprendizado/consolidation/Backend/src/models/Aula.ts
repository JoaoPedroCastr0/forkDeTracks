export interface Aula {
  id: string;
  titulo: string;
  descricao?: string;
  urlConteudo: string;
  duracaoMinutos: number;
  ordem: number;
  moduloId: string;
  cursoId: string;
  dataCriacao: Date;
}

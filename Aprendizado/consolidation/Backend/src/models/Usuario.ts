export type PapelUsuario = 'ALUNO' | 'PROFESSOR';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: PapelUsuario;
  avatarUrl?: string | null;
  dataCriacao: Date;
}

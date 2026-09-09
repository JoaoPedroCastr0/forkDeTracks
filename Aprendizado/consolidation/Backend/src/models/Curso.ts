import type { Curso as PrismaCurso } from '@prisma/client';

export type Curso = PrismaCurso;

export type NivelCurso = 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';
export type StatusCurso = 'RASCUNHO' | 'PUBLICADO' | 'ARQUIVADO';

import React from 'react';
import { Clock, BookOpen, ChevronRight, GraduationCap, PlayCircle } from 'lucide-react';
import type { Curso } from '@/types';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface MatriculaResumo {
  status: string;
  percentualProgresso: number;
}

interface CourseCardProps {
  curso: Curso;
  matricula?: MatriculaResumo | null;
  onVerConteudo?: (curso: Curso) => void;
}

export function CourseCard({ curso, matricula, onVerConteudo }: CourseCardProps) {
  const badgeVariant =
    curso.nivel === 'INICIANTE'
      ? 'success'
      : curso.nivel === 'INTERMEDIARIO'
        ? 'info'
        : 'warning';

  const isMatriculado = !!matricula && matricula.status !== 'CANCELADA';
  const isConcluido = matricula?.status === 'CONCLUIDA' || matricula?.percentualProgresso === 100;

  return (
    <Card
      onClick={() => onVerConteudo?.(curso)}
      className="group flex flex-col justify-between border-zinc-200/90 transition-all duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg dark:border-zinc-800 dark:hover:border-indigo-700 cursor-pointer"
    >
      <CardHeader className="space-y-3 pb-3">
        {/* Nível e Status de Matrícula */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Badge variant={badgeVariant} className="font-semibold uppercase tracking-wider text-[10px]">
              {curso.nivel}
            </Badge>
            {isMatriculado && (
              <Badge
                variant={isConcluido ? 'success' : 'default'}
                className={`text-[10px] font-bold uppercase ${
                  isConcluido
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                }`}
              >
                {isConcluido ? 'Concluído' : `${matricula.percentualProgresso}%`}
              </Badge>
            )}
          </div>
          <span className="flex items-center text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            <Clock className="mr-1 h-3.5 w-3.5 text-zinc-400" />
            {curso.cargaHorariaEstimada}h
          </span>
        </div>

        {/* Título do Curso */}
        <CardTitle className="line-clamp-2 text-lg font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {curso.titulo}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Descrição */}
        <CardDescription className="line-clamp-3 text-sm leading-relaxed">
          {curso.descricao}
        </CardDescription>

        {/* Barra de Progresso do Aluno */}
        {isMatriculado && (
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
              <span>Seu Progresso</span>
              <span>{matricula.percentualProgresso}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div
                className={`h-full transition-all duration-300 ${
                  isConcluido ? 'bg-emerald-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${matricula.percentualProgresso}%` }}
              />
            </div>
          </div>
        )}

        {/* Metadados Adicionais */}
        <div className="flex items-center space-x-4 text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800/80 pt-3">
          <div className="flex items-center">
            <BookOpen className="mr-1 h-3.5 w-3.5 text-zinc-400" />
            <span>{curso.modulosCount ?? 0} módulos</span>
          </div>
          <div className="flex items-center">
            <GraduationCap className="mr-1 h-3.5 w-3.5 text-zinc-400" />
            <span>{curso.aulasCount ?? 0} aulas</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          className={`w-full justify-between transition-colors ${
            isMatriculado
              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
              : 'bg-zinc-900 text-white hover:bg-indigo-600 dark:bg-zinc-800 dark:hover:bg-indigo-600'
          }`}
        >
          <span>{isMatriculado ? 'Continuar Aulas' : 'Ver Conteúdo'}</span>
          {isMatriculado ? (
            <PlayCircle className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          ) : (
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

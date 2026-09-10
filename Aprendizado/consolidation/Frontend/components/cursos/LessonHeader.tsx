'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Plus, Sparkles, Compass, Code2, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { calcularNivelMaestria } from '@/lib/pedagogicalContent';
import type { ProgressoCursoInfo } from '@/types';

interface LessonHeaderProps {
  cursoTitulo: string;
  isProfessor: boolean;
  progresso?: ProgressoCursoInfo;
  onCriarModulo?: () => void;
  onCriarAula?: () => void;
  temModulos?: boolean;
}

export function LessonHeader({
  cursoTitulo,
  isProfessor,
  progresso,
  onCriarModulo,
  onCriarAula,
  temModulos = false,
}: LessonHeaderProps) {
  const maestria = progresso ? calcularNivelMaestria(progresso.percentualProgresso) : null;

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95">
      <div className="container mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-zinc-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Catálogo
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate max-w-[200px] sm:max-w-md">
            {cursoTitulo}
          </span>
        </div>

        {isProfessor ? (
          <div className="flex items-center space-x-2">
            <Badge variant="warning" className="text-[10px] uppercase font-bold py-0.5 px-2">
              <ShieldCheck className="mr-1 h-3 w-3" />
              Modo Professor
            </Badge>
            {onCriarModulo && (
              <Button
                size="sm"
                variant="outline"
                onClick={onCriarModulo}
                className="h-8 text-xs font-semibold border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300"
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Módulo
              </Button>
            )}
            {onCriarAula && (
              <Button
                size="sm"
                onClick={onCriarAula}
                disabled={!temModulos}
                className="h-8 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold"
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Aula
              </Button>
            )}
          </div>
        ) : (
          progresso && maestria && (
            <div className="flex items-center space-x-3">
              {/* Badge Pedagógico de Maestria */}
              <div className="hidden md:flex items-center">
                <Badge
                  variant={
                    maestria.nivel === 'Arquiteto'
                      ? 'success'
                      : maestria.nivel === 'Construtor'
                        ? 'info'
                        : 'secondary'
                  }
                  className="text-[10px] uppercase font-bold px-2 py-0.5"
                  title={maestria.descricao}
                >
                  {maestria.nivel === 'Arquiteto' && <Trophy className="mr-1 h-3 w-3 text-emerald-500" />}
                  {maestria.nivel === 'Construtor' && <Code2 className="mr-1 h-3 w-3 text-blue-500" />}
                  {maestria.nivel === 'Aprendiz' && <Compass className="mr-1 h-3 w-3 text-zinc-500" />}
                  Nível: {maestria.nivel}
                </Badge>
              </div>

              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">
                  {progresso.percentualProgresso}% concluído
                </span>
                <span className="text-[10px] text-zinc-400">
                  {progresso.aulasConcluidas} de {progresso.totalAulas} aulas
                </span>
              </div>
              <div className="w-20 sm:w-32 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${progresso.percentualProgresso}%` }}
                />
              </div>
            </div>
          )
        )}
      </div>
    </header>
  );
}

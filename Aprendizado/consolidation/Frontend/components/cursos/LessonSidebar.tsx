'use client';

import React from 'react';
import { Layers, Plus, CheckCircle2, PlayCircle, Circle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ModuloConteudo } from '@/types';

interface LessonSidebarProps {
  modulos: ModuloConteudo[];
  aulaAtivaId: string | null;
  onSelecionarAula: (aulaId: string) => void;
  isProfessor: boolean;
  onCriarModulo?: () => void;
  onCriarAulaNoModulo?: (moduloId: string) => void;
}

export function LessonSidebar({
  modulos,
  aulaAtivaId,
  onSelecionarAula,
  isProfessor,
  onCriarModulo,
  onCriarAulaNoModulo,
}: LessonSidebarProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {/* Cabeçalho da Sidebar */}
        <div className="flex items-center justify-between mb-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <Layers className="h-4 w-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Conteúdo do Curso
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-zinc-500">{modulos.length} módulos</span>
            {isProfessor && onCriarModulo && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onCriarModulo}
                className="h-6 px-2 text-[10px] text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 font-bold"
              >
                <Plus className="mr-0.5 h-3 w-3" />
                Módulo
              </Button>
            )}
          </div>
        </div>

        {/* Lista de Módulos e Aulas */}
        <div className="space-y-4">
          {modulos.length === 0 ? (
            <p className="text-xs text-zinc-400 text-center py-4">Nenhum módulo adicionado.</p>
          ) : (
            modulos.map((modulo, modIdx) => (
              <div key={modulo.id} className="space-y-2">
                {/* Cabeçalho do Módulo */}
                <div className="flex items-center justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 rounded-lg">
                  <span className="truncate mr-2">
                    Módulo {modIdx + 1}: {modulo.titulo}
                  </span>
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <span className="text-[10px] text-zinc-400 font-normal">
                      {modulo.aulas.length} aulas
                    </span>
                    {isProfessor && onCriarAulaNoModulo && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onCriarAulaNoModulo(modulo.id)}
                        className="h-5 px-1.5 text-[9px] text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100/50 font-semibold"
                      >
                        <Plus className="mr-0.5 h-2.5 w-2.5" />
                        Aula
                      </Button>
                    )}
                  </div>
                </div>

                {/* Aulas do Módulo */}
                <div className="space-y-1 pl-1">
                  {modulo.aulas.length === 0 ? (
                    <p className="text-[11px] text-zinc-400 py-1 pl-3 italic">
                      Nenhuma aula neste módulo.
                    </p>
                  ) : (
                    modulo.aulas.map((aula) => {
                      const isAtiva = aula.id === aulaAtivaId;

                      return (
                        <button
                          key={aula.id}
                          type="button"
                          onClick={() => onSelecionarAula(aula.id)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs transition-all ${
                            isAtiva
                              ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                              : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/60'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 truncate mr-2">
                            {aula.concluida ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                            ) : isAtiva ? (
                              <PlayCircle className="h-4 w-4 text-indigo-600 shrink-0" />
                            ) : (
                              <Circle className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                            )}
                            <span className="truncate">{aula.titulo}</span>
                          </div>

                          <span className="text-[10px] text-zinc-400 shrink-0">
                            {aula.duracaoMinutos}m
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bloco de Filosofia Pedagógica */}
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3.5 text-xs dark:border-indigo-950/60 dark:bg-indigo-950/20 shadow-sm">
        <div className="flex items-center space-x-1.5 font-bold text-indigo-700 dark:text-indigo-300 text-[11px] mb-1">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Aprender → Construir → Evoluir</span>
        </div>
        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Cada aula combina fundamentação técnica, prática com cultura do erro e conexão com o projeto real da trilha.
        </p>
      </div>
    </div>
  );
}

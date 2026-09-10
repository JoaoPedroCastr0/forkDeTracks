'use client';

import React from 'react';
import {
  HelpCircle,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EducationalFeedbackProps {
  status: 'idle' | 'incorrect' | 'correct';
  misconceptionExplanation?: string;
  successExplanation?: string;
  socraticHint?: string;
  competencyGained?: string;
  onRetry: () => void;
  onConcluirAula?: () => void;
  aulaConcluida?: boolean;
}

export function EducationalFeedback({
  status,
  misconceptionExplanation,
  successExplanation,
  socraticHint,
  competencyGained,
  onRetry,
  onConcluirAula,
  aulaConcluida = false,
}: EducationalFeedbackProps) {
  if (status === 'idle') return null;

  if (status === 'incorrect') {
    return (
      <div className="rounded-xl border border-amber-300/80 bg-amber-50/70 p-5 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/30 animate-in fade-in-50 duration-200">
        <div className="flex items-start space-x-3.5">
          <div className="rounded-lg bg-amber-100 p-2 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300 shrink-0">
            <HelpCircle className="h-5 w-5" />
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Oportunidade de Aprendizado
              </span>
              <Badge variant="warning" className="text-[10px]">
                Cultura do Erro Ativa
              </Badge>
            </div>

            <p className="text-sm font-medium text-amber-950 dark:text-amber-100 leading-relaxed">
              {misconceptionExplanation ||
                'Essa hipótese parece plausível à primeira vista, mas gera efeitos colaterais na arquitetura.'}
            </p>

            {socraticHint && (
              <div className="flex items-start space-x-2 rounded-lg bg-white/70 p-3 text-xs text-amber-900 border border-amber-200/70 dark:bg-zinc-900/80 dark:text-amber-200 dark:border-amber-900/40">
                <Lightbulb className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <span className="font-bold">Pense sobre: </span>
                  <span>{socraticHint}</span>
                </div>
              </div>
            )}

            <div className="pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="border-amber-400/80 text-amber-900 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200 dark:hover:bg-amber-900/40 font-semibold"
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Refletir e Tentar Novamente
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // status === 'correct'
  return (
    <div className="rounded-xl border border-emerald-300/80 bg-emerald-50/70 p-5 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/30 animate-in fade-in-50 duration-200">
      <div className="flex items-start space-x-3.5">
        <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 shrink-0">
          <CheckCircle2 className="h-5 w-5" />
        </div>

        <div className="space-y-3 flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Hipótese Validada com Sucesso!
            </span>
            <Badge variant="success" className="text-[10px]">
              <Sparkles className="mr-1 h-3 w-3" />
              Construção Consolidada
            </Badge>
          </div>

          <p className="text-sm font-medium text-emerald-950 dark:text-emerald-100 leading-relaxed">
            {successExplanation ||
              'Você aplicou o raciocínio correto de engenharia, respeitando a integridade do sistema.'}
          </p>

          {competencyGained && (
            <div className="inline-flex items-center space-x-2 rounded-lg bg-emerald-100/70 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
              <span>🎯 Competência Dominada:</span>
              <span className="underline decoration-emerald-500/50">{competencyGained}</span>
            </div>
          )}

          {onConcluirAula && !aulaConcluida && (
            <div className="pt-2">
              <Button
                type="button"
                variant="success"
                size="sm"
                onClick={onConcluirAula}
                className="font-semibold"
              >
                Registrar Conclusão da Aula
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

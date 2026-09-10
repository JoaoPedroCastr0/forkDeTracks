'use client';

import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  Send,
  Check,
  Copy,
  Layers,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { EducationalFeedback } from './EducationalFeedback';
import type { PedagogicalChallenge, TerminalExperiment } from '@/lib/pedagogicalContent';

interface ChallengeCardProps {
  challenge: PedagogicalChallenge;
  terminalExperiment?: TerminalExperiment;
  onConcluirAula?: () => void;
  aulaConcluida?: boolean;
}

export function ChallengeCard({
  challenge,
  terminalExperiment,
  onConcluirAula,
  aulaConcluida = false,
}: ChallengeCardProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'incorrect' | 'correct'>('idle');
  const [copiado, setCopiado] = useState(false);

  const selectedOption = challenge.options.find((opt) => opt.id === selectedOptionId);

  const handleValidar = () => {
    if (!selectedOption) return;
    if (selectedOption.isCorrect) {
      setFeedbackStatus('correct');
    } else {
      setFeedbackStatus('incorrect');
    }
  };

  const handleRetry = () => {
    setFeedbackStatus('idle');
    setSelectedOptionId(null);
  };

  const copiarComando = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <CardHeader className="bg-zinc-50/70 border-b border-zinc-100 dark:bg-zinc-900/50 dark:border-zinc-800/80 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="rounded-lg bg-indigo-100 p-1.5 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
                <Code2 className="h-4 w-4" />
              </div>
              <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                {challenge.title}
              </CardTitle>
            </div>
            <Badge variant="secondary" className="text-[10px] font-semibold uppercase tracking-wider">
              <Sparkles className="mr-1 h-3 w-3 text-indigo-500" />
              Prática Ativa
            </Badge>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
            {challenge.scenario}
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-5">
          {/* Bloco de Código Contextual */}
          {challenge.codeSnippet && (
            <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-4 py-2 text-zinc-400">
                <div className="flex items-center space-x-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                  <span className="ml-2 text-[11px] font-medium text-zinc-400">
                    {challenge.codeLanguage || 'typescript'}
                  </span>
                </div>
              </div>
              <pre className="p-4 text-zinc-100 overflow-x-auto leading-relaxed">
                <code>{challenge.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Pergunta do Desafio */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {challenge.question}
            </h4>

            {/* Alternativas / Hipóteses */}
            <div className="space-y-2.5">
              {challenge.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                const isDisabled = feedbackStatus === 'correct';

                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      if (feedbackStatus !== 'correct') {
                        setSelectedOptionId(option.id);
                        if (feedbackStatus === 'incorrect') {
                          setFeedbackStatus('idle');
                        }
                      }
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start space-x-3 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-100 ring-1 ring-indigo-500'
                        : 'border-zinc-200 bg-white hover:bg-zinc-50/80 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/60'
                    } ${isDisabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div
                      className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-zinc-400 dark:border-zinc-600'
                      }`}
                    >
                      {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="leading-relaxed">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Botão de Validação de Hipótese */}
          {feedbackStatus === 'idle' && (
            <div className="pt-2 flex justify-end">
              <Button
                onClick={handleValidar}
                disabled={!selectedOptionId}
                className="bg-indigo-600 text-white hover:bg-indigo-700 font-semibold text-xs sm:text-sm"
              >
                <Send className="mr-1.5 h-3.5 w-3.5" />
                Validar Hipótese
              </Button>
            </div>
          )}

          {/* Feedback Pedagógico (Cultura do Erro & Sucesso) */}
          <EducationalFeedback
            status={feedbackStatus}
            misconceptionExplanation={selectedOption?.misconceptionExplanation}
            successExplanation={selectedOption?.successExplanation}
            socraticHint={challenge.socraticHint}
            competencyGained={challenge.competencyGained}
            onRetry={handleRetry}
            onConcluirAula={onConcluirAula}
            aulaConcluida={aulaConcluida}
          />
        </CardContent>
      </Card>

      {/* Bloco de Experimentação no Terminal Local */}
      {terminalExperiment && (
        <Card className="border-zinc-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="h-4 w-4 text-emerald-400" />
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  {terminalExperiment.title}
                </CardTitle>
              </div>
              <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                Prática Local
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-zinc-300 leading-relaxed">{terminalExperiment.objective}</p>

            <div className="flex items-center justify-between rounded-lg bg-black/60 p-3 font-mono text-zinc-200 border border-zinc-800">
              <span className="text-emerald-400 mr-2">$</span>
              <span className="flex-1 overflow-x-auto">{terminalExperiment.command}</span>
              <button
                type="button"
                onClick={() => copiarComando(terminalExperiment.command)}
                className="ml-2 rounded p-1 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                title="Copiar comando"
                aria-label="Copiar comando"
              >
                {copiado ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            <p className="text-[11px] text-zinc-400 italic">
              <span className="font-semibold text-zinc-300">Resultado Esperado: </span>
              {terminalExperiment.expectedOutcome}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

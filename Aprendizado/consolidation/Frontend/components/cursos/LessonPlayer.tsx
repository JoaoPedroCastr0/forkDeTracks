'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  PlayCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Loader2,
  Sparkles,
  AlertCircle,
  X,
  BookOpen,
  Code2,
  TrendingUp,
  Compass,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChallengeCard } from './ChallengeCard';
import {
  obterConteudoPedagogico,
  type LessonPedagogicalData,
} from '@/lib/pedagogicalContent';
import type { AulaConteudo } from '@/types';

interface LessonPlayerProps {
  aula: AulaConteudo;
  moduloTitulo?: string;
  isProfessor: boolean;
  atualizandoProgresso: boolean;
  onToggleConclusao: () => void;
  temAulaAnterior: boolean;
  temProximaAula: boolean;
  onAulaAnterior: () => void;
  onProximaAula: () => void;
  erroAcao?: string | null;
  onLimparErroAcao?: () => void;
}

type TabPedagogica = 'aprender' | 'construir' | 'evoluir';

export function LessonPlayer({
  aula,
  moduloTitulo,
  isProfessor,
  atualizandoProgresso,
  onToggleConclusao,
  temAulaAnterior,
  temProximaAula,
  onAulaAnterior,
  onProximaAula,
  erroAcao,
  onLimparErroAcao,
}: LessonPlayerProps) {
  const [activeTab, setActiveTab] = useState<TabPedagogica>('aprender');

  // Redefine a aba para 'aprender' sempre que a aula mudar
  useEffect(() => {
    setActiveTab('aprender');
  }, [aula.id]);

  const pedagogicalData: LessonPedagogicalData = useMemo(() => {
    return obterConteudoPedagogico(aula, moduloTitulo);
  }, [aula, moduloTitulo]);

  const isYoutube =
    aula.urlConteudo.includes('youtube.com') || aula.urlConteudo.includes('youtu.be');

  const youtubeEmbedUrl = isYoutube
    ? aula.urlConteudo.includes('watch?v=')
      ? aula.urlConteudo.replace('watch?v=', 'embed/')
      : aula.urlConteudo
    : null;

  return (
    <div className="space-y-6">
      {/* Alerta de erro de ação sem recorrer a alert() */}
      {erroAcao && (
        <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-50 p-4 text-xs font-medium text-red-700 dark:bg-red-950/40 dark:text-red-400">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{erroAcao}</span>
          </div>
          {onLimparErroAcao && (
            <button
              type="button"
              onClick={onLimparErroAcao}
              className="rounded p-1 hover:bg-red-100 dark:hover:bg-red-900/50"
              aria-label="Fechar aviso"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Barra de Navegação dos 3 Pilares Pedagógicos */}
      <div className="flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setActiveTab('aprender')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'aprender'
              ? 'bg-white text-indigo-700 shadow-sm dark:bg-zinc-800 dark:text-indigo-300'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>1. Aprender</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('construir')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'construir'
              ? 'bg-white text-indigo-700 shadow-sm dark:bg-zinc-800 dark:text-indigo-300'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <Code2 className="h-3.5 w-3.5" />
          <span>2. Construir</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('evoluir')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'evoluir'
              ? 'bg-white text-indigo-700 shadow-sm dark:bg-zinc-800 dark:text-indigo-300'
              : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          <span>3. Evoluir</span>
        </button>
      </div>

      {/* Conteúdo da Aba 1: APRENDER */}
      {activeTab === 'aprender' && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          {/* Player de Vídeo ou Visualizador de Conteúdo */}
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-black shadow-lg dark:border-zinc-800">
            <div className="relative aspect-video w-full">
              {isYoutube && youtubeEmbedUrl ? (
                <iframe
                  src={youtubeEmbedUrl}
                  title={aula.titulo}
                  className="h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-zinc-400 text-sm">
                  <PlayCircle className="mr-2 h-8 w-8 text-indigo-500" />
                  <span>Visualizador de Conteúdo: {aula.titulo}</span>
                </div>
              )}
            </div>
          </div>

          {/* Barra de Ações e Informações da Aula */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                {moduloTitulo || 'Módulo do Curso'}
              </span>
              <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{aula.titulo}</h1>
              <div className="flex items-center space-x-3 text-xs text-zinc-500">
                <span className="flex items-center">
                  <Clock className="mr-1 h-3.5 w-3.5" />
                  {aula.duracaoMinutos} minutos
                </span>
              </div>
            </div>

            {/* Botão de Conclusão para o Aluno ou Badge para o Professor */}
            {isProfessor ? (
              <Badge variant="warning" className="text-xs px-3 py-1.5 font-bold uppercase tracking-wider">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                Visualização do Administrador
              </Badge>
            ) : (
              <Button
                onClick={onToggleConclusao}
                disabled={atualizandoProgresso}
                variant={aula.concluida ? 'outline' : 'success'}
                className={
                  aula.concluida
                    ? 'border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-semibold'
                    : 'font-semibold'
                }
              >
                {atualizandoProgresso ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : aula.concluida ? (
                  <CheckCircle2 className="mr-1.5 h-4 w-4 text-emerald-600" />
                ) : (
                  <Circle className="mr-1.5 h-4 w-4" />
                )}
                <span>{aula.concluida ? 'Aula Concluída' : 'Marcar como Concluída'}</span>
              </Button>
            )}
          </div>

          {/* Objetivos de Aprendizagem */}
          <Card className="border-indigo-100 bg-indigo-50/30 dark:border-indigo-950 dark:bg-indigo-950/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center">
                <Compass className="mr-1.5 h-4 w-4" />
                O que você vai dominar nesta aula
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <ul className="space-y-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
                {pedagogicalData.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Conceitos-Chave da Aula */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Conceitos Fundamentais
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {pedagogicalData.keyConcepts.map((conc, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                    {conc.title}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {conc.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Descrição e Orientações do Professor */}
          {aula.descricao && (
            <Card className="border-zinc-200 dark:border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Orientações do Professor
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                {aula.descricao}
              </CardContent>
            </Card>
          )}

          {/* Call-to-action para Construir */}
          <div className="rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-white p-4 text-center dark:border-indigo-900/60 dark:from-indigo-950/30 dark:to-zinc-900">
            <p className="text-xs text-indigo-900 dark:text-indigo-200 mb-3 font-medium">
              Concluiu o vídeo e revisou os conceitos? É hora de colocar a mão na massa!
            </p>
            <Button
              onClick={() => setActiveTab('construir')}
              size="sm"
              className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm font-semibold"
            >
              <span>Avançar para a Prática (Construir)</span>
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Conteúdo da Aba 2: CONSTRUIR */}
      {activeTab === 'construir' && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <ChallengeCard
            challenge={pedagogicalData.challenge}
            terminalExperiment={pedagogicalData.terminalExperiment}
            onConcluirAula={onToggleConclusao}
            aulaConcluida={aula.concluida}
          />
        </div>
      )}

      {/* Conteúdo da Aba 3: EVOLUIR */}
      {activeTab === 'evoluir' && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardHeader className="bg-gradient-to-r from-indigo-50/80 to-purple-50/50 dark:from-indigo-950/40 dark:to-zinc-900 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  <CardTitle className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                    Visão de Evolução: Do Código à Arquitetura
                  </CardTitle>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  Fase: {pedagogicalData.projectConnection.phase}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Conexão com o Projeto Prático
                </h4>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {pedagogicalData.projectConnection.description}
                </p>
              </div>

              <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/60 p-4 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <Layers className="h-4 w-4" />
                  <span>Impacto Arquitetural na Aplicação</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {pedagogicalData.projectConnection.architecturalImpact}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-1 flex items-center">
                  <Sparkles className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                  Competência em Desenvolvimento
                </h4>
                <p className="text-xs text-emerald-900/90 dark:text-emerald-200">
                  {pedagogicalData.challenge.competencyGained}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navegação entre aulas */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
        <Button
          variant="outline"
          size="sm"
          onClick={onAulaAnterior}
          disabled={!temAulaAnterior}
          className="text-xs font-semibold"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Aula Anterior
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onProximaAula}
          disabled={!temProximaAula}
          className="text-xs font-semibold"
        >
          Próxima Aula
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

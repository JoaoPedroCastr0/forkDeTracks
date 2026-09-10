'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Trophy,
  AlertCircle,
  Clock,
  Loader2,
  Layers,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { extrairMensagemErro } from '@/lib/tratarErroApi';
import { useSession } from '@/lib/auth-client';
import { NovoModuloModal } from '@/components/cursos/NovoModuloModal';
import { NovaAulaModal } from '@/components/cursos/NovaAulaModal';
import { LessonHeader } from '@/components/cursos/LessonHeader';
import { LessonPlayer } from '@/components/cursos/LessonPlayer';
import { LessonSidebar } from '@/components/cursos/LessonSidebar';
import {
  type ConteudoCursoDetalhado,
  type AulaConteudo,
  obterPapelUsuario,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function SalaDeAulaPage() {
  const params = useParams();
  const cursoId = params?.id as string;
  const { data: session } = useSession();

  const papel = obterPapelUsuario(session?.user);
  const isProfessor = papel === 'PROFESSOR';

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [erroAcao, setErroAcao] = useState<string | null>(null);
  const [conteudo, setConteudo] = useState<ConteudoCursoDetalhado | null>(null);
  const [aulaAtivaId, setAulaAtivaId] = useState<string | null>(null);
  const [atualizandoProgresso, setAtualizandoProgresso] = useState(false);
  const [versao, setVersao] = useState(0);

  // Estados dos modais de gestão do professor
  const [modalNovoModuloAberto, setModalNovoModuloAberto] = useState(false);
  const [modalNovaAulaAberto, setModalNovaAulaAberto] = useState(false);
  const [moduloSelecionadoParaAula, setModuloSelecionadoParaAula] = useState<string | null>(null);

  // Carrega o conteúdo do curso
  useEffect(() => {
    if (!cursoId) return;

    let cancelado = false;

    async function carregarConteudo() {
      setCarregando(true);
      setErro(null);

      try {
        const res = await fetch(`${API_BASE_URL}/cursos/${cursoId}/conteudo`, {
          credentials: 'include',
        });

        if (!res.ok) {
          const msg = await extrairMensagemErro(res);
          throw new Error(msg);
        }

        const data: ConteudoCursoDetalhado = await res.json();
        if (!cancelado) {
          setConteudo(data);

          // Define a primeira aula pendente ou a primeira do curso como aula ativa
          const todas = data.modulos.flatMap((m) => m.aulas);
          const primeiraPendente = todas.find((a) => !a.concluida);
          setAulaAtivaId((prev) => {
            if (prev && todas.some((a) => a.id === prev)) return prev;
            return primeiraPendente ? primeiraPendente.id : todas[0]?.id || null;
          });
        }
      } catch (err: unknown) {
        if (!cancelado) {
          const msg = await extrairMensagemErro(err);
          setErro(msg);
        }
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregarConteudo();

    return () => {
      cancelado = true;
    };
  }, [cursoId, versao]);

  // Lista linear de todas as aulas para navegação "Anterior / Próxima"
  const todasAulas = useMemo(() => {
    return conteudo ? conteudo.modulos.flatMap((m) => m.aulas) : [];
  }, [conteudo]);

  // Aula atualmente selecionada
  const aulaAtiva: AulaConteudo | undefined = useMemo(() => {
    if (!aulaAtivaId) return todasAulas[0];
    return todasAulas.find((a) => a.id === aulaAtivaId) || todasAulas[0];
  }, [todasAulas, aulaAtivaId]);

  // Módulo ao qual a aula ativa pertence
  const moduloDaAulaAtiva = useMemo(() => {
    if (!conteudo || !aulaAtiva) return null;
    return conteudo.modulos.find((m) => m.aulas.some((a) => a.id === aulaAtiva.id));
  }, [conteudo, aulaAtiva]);

  // Índice para botões Anterior / Próxima
  const indiceAulaAtiva = useMemo(() => {
    if (!aulaAtiva) return -1;
    return todasAulas.findIndex((a) => a.id === aulaAtiva.id);
  }, [todasAulas, aulaAtiva]);

  // Alterna o status de conclusão da aula
  const handleToggleConclusao = async () => {
    if (!aulaAtiva || isProfessor || atualizandoProgresso) return;

    setAtualizandoProgresso(true);
    setErroAcao(null);

    const proximoStatusConcluida = !aulaAtiva.concluida;
    const metodo = proximoStatusConcluida ? 'POST' : 'DELETE';

    try {
      const res = await fetch(`${API_BASE_URL}/aulas/${aulaAtiva.id}/concluir`, {
        method: metodo,
        credentials: 'include',
      });

      if (!res.ok) {
        const msg = await extrairMensagemErro(res);
        throw new Error(msg);
      }

      const resData = (await res.json()) as {
        estatisticas?: {
          totalAulas: number;
          aulasConcluidas: number;
          percentual: number;
          cursoConcluido: boolean;
        };
      };

      // Atualiza o estado local de forma imutável
      setConteudo((prev) => {
        if (!prev) return null;

        const novosModulos = prev.modulos.map((mod) => ({
          ...mod,
          aulas: mod.aulas.map((a) =>
            a.id === aulaAtiva.id ? { ...a, concluida: proximoStatusConcluida } : a,
          ),
        }));

        const total = prev.progresso.totalAulas;
        const concluidas = proximoStatusConcluida
          ? Math.min(total, prev.progresso.aulasConcluidas + 1)
          : Math.max(0, prev.progresso.aulasConcluidas - 1);

        const percentual =
          resData.estatisticas?.percentual ?? (total > 0 ? Math.round((concluidas / total) * 100) : 0);

        const concluido =
          resData.estatisticas?.cursoConcluido ?? (total > 0 && concluidas === total);

        return {
          ...prev,
          modulos: novosModulos,
          progresso: {
            totalAulas: total,
            aulasConcluidas: concluidas,
            percentualProgresso: percentual,
            cursoConcluido: concluido,
          },
        };
      });
    } catch (err: unknown) {
      const msg = await extrairMensagemErro(err);
      setErroAcao(msg);
    } finally {
      setAtualizandoProgresso(false);
    }
  };

  const irParaAulaAnterior = () => {
    if (indiceAulaAtiva > 0) {
      const aulaAnterior = todasAulas[indiceAulaAtiva - 1];
      if (aulaAnterior) setAulaAtivaId(aulaAnterior.id);
    }
  };

  const irParaProximaAula = () => {
    if (indiceAulaAtiva < todasAulas.length - 1) {
      const proximaAula = todasAulas[indiceAulaAtiva + 1];
      if (proximaAula) setAulaAtivaId(proximaAula.id);
    }
  };

  if (carregando) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Carregando sala de aula e conteúdos...
        </p>
      </div>
    );
  }

  if (erro || !conteudo) {
    const isPendenteMsg = erro?.toLowerCase().includes('aguardando confirmação') || erro?.toLowerCase().includes('pendente');
    const isRecusadaMsg = erro?.toLowerCase().includes('recusada') || erro?.toLowerCase().includes('rejeitada');

    return (
      <div className="container mx-auto max-w-2xl px-4 py-20 text-center">
        <div
          className={`rounded-2xl border p-8 ${
            isPendenteMsg
              ? 'border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/20'
              : isRecusadaMsg
                ? 'border-red-500/30 bg-red-50/60 dark:bg-red-950/20'
                : 'border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50'
          }`}
        >
          {isPendenteMsg ? (
            <Clock className="mx-auto h-12 w-12 text-amber-500 mb-4 animate-pulse" />
          ) : (
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          )}

          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            {isPendenteMsg
              ? 'Matrícula em Análise'
              : isRecusadaMsg
                ? 'Matrícula Não Confirmada'
                : 'Acesso Restrito ao Conteúdo'}
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 max-w-md mx-auto leading-relaxed">
            {erro || 'Não foi possível carregar o conteúdo deste curso.'}
          </p>
          <Link href="/">
            <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Catálogo de Cursos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const modulosOptions = conteudo.modulos.map((m) => ({ id: m.id, titulo: m.titulo }));

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Barra Superior Modular */}
      <LessonHeader
        cursoTitulo={conteudo.curso.titulo}
        isProfessor={isProfessor}
        progresso={conteudo.progresso}
        onCriarModulo={() => setModalNovoModuloAberto(true)}
        onCriarAula={() => {
          setModuloSelecionadoParaAula(null);
          setModalNovaAulaAberto(true);
        }}
        temModulos={conteudo.modulos.length > 0}
      />

      {/* Conteúdo Principal: Player + Sidebar de Aulas */}
      <main className="container mx-auto max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {/* Banner comemorativo de curso 100% concluído para Aluno */}
        {!isProfessor && conteudo.progresso.cursoConcluido && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-50 p-4 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            <div className="flex items-center space-x-3">
              <Trophy className="h-6 w-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-sm font-bold">Parabéns! Você concluiu 100% deste curso!</h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Todas as aulas foram finalizadas. Sua matrícula foi marcada como concluída com sucesso.
                </p>
              </div>
            </div>
            <Sparkles className="h-5 w-5 text-emerald-500 shrink-0 hidden sm:block" />
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Coluna da Esquerda (2/3): Player e Material da Aula */}
          <div className="lg:col-span-2 space-y-6">
            {aulaAtiva ? (
              <LessonPlayer
                aula={aulaAtiva}
                moduloTitulo={moduloDaAulaAtiva?.titulo}
                isProfessor={isProfessor}
                atualizandoProgresso={atualizandoProgresso}
                onToggleConclusao={handleToggleConclusao}
                temAulaAnterior={indiceAulaAtiva > 0}
                temProximaAula={indiceAulaAtiva < todasAulas.length - 1}
                onAulaAnterior={irParaAulaAnterior}
                onProximaAula={irParaProximaAula}
                erroAcao={erroAcao}
                onLimparErroAcao={() => setErroAcao(null)}
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center text-zinc-500 dark:border-zinc-800">
                {isProfessor ? (
                  <div className="space-y-4">
                    <Layers className="mx-auto h-12 w-12 text-indigo-500" />
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      Nenhuma aula cadastrada ainda
                    </h3>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                      {conteudo.modulos.length === 0
                        ? 'Crie o primeiro módulo do curso para começar a organizar as aulas.'
                        : 'Adicione aulas aos módulos para que seus alunos possam estudar.'}
                    </p>
                    <div className="flex justify-center space-x-3 pt-2">
                      <Button
                        size="sm"
                        onClick={() => setModalNovoModuloAberto(true)}
                        variant="outline"
                      >
                        <Plus className="mr-1 h-3.5 w-3.5" />
                        Criar Módulo
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setModuloSelecionadoParaAula(null);
                          setModalNovaAulaAberto(true);
                        }}
                        disabled={conteudo.modulos.length === 0}
                        className="bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        <Plus className="mr-1 h-3.5 w-3.5" />
                        Criar Aula
                      </Button>
                    </div>
                  </div>
                ) : (
                  'Nenhuma aula disponível neste curso ainda.'
                )}
              </div>
            )}
          </div>

          {/* Coluna da Direita (1/3): Sidebar de Módulos */}
          <LessonSidebar
            modulos={conteudo.modulos}
            aulaAtivaId={aulaAtivaId}
            onSelecionarAula={(id) => setAulaAtivaId(id)}
            isProfessor={isProfessor}
            onCriarModulo={() => setModalNovoModuloAberto(true)}
            onCriarAulaNoModulo={(moduloId) => {
              setModuloSelecionadoParaAula(moduloId);
              setModalNovaAulaAberto(true);
            }}
          />
        </div>
      </main>

      {/* Modais Administrativos para o Professor */}
      {isProfessor && (
        <>
          <NovoModuloModal
            cursoId={cursoId}
            open={modalNovoModuloAberto}
            onOpenChange={setModalNovoModuloAberto}
            onModuloCriado={() => setVersao((v) => v + 1)}
          />

          <NovaAulaModal
            cursoId={cursoId}
            modulos={modulosOptions}
            moduloInicialId={moduloSelecionadoParaAula}
            open={modalNovaAulaAberto}
            onOpenChange={setModalNovaAulaAberto}
            onAulaCriada={() => setVersao((v) => v + 1)}
          />
        </>
      )}
    </div>
  );
}

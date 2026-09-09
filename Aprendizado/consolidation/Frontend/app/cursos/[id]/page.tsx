'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  PlayCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trophy,
  AlertCircle,
  Loader2,
  Layers,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { extrairMensagemErro } from '@/lib/tratarErroApi';
import { useSession } from '@/lib/auth-client';
import { NovoModuloModal } from '@/components/cursos/NovoModuloModal';
import { NovaAulaModal } from '@/components/cursos/NovaAulaModal';

interface Aula {
  id: string;
  titulo: string;
  descricao?: string;
  urlConteudo: string;
  duracaoMinutos: number;
  ordem: number;
  concluida: boolean;
}

interface Modulo {
  id: string;
  titulo: string;
  descricao?: string;
  ordem: number;
  aulas: Aula[];
}

interface ConteudoCurso {
  curso: {
    id: string;
    titulo: string;
    descricao: string;
    nivel: string;
    cargaHorariaEstimada: number;
  };
  modulos: Modulo[];
  progresso: {
    totalAulas: number;
    aulasConcluidas: number;
    percentualProgresso: number;
    cursoConcluido: boolean;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function SalaDeAulaPage() {
  const params = useParams();
  const router = useRouter();
  const cursoId = params?.id as string;
  const { data: session } = useSession();

  const isProfessor = (session?.user as any)?.papel === 'PROFESSOR';

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [conteudo, setConteudo] = useState<ConteudoCurso | null>(null);
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

        const data: ConteudoCurso = await res.json();
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
      } catch (err) {
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

  const indiceAulaAtiva = useMemo(() => {
    return todasAulas.findIndex((a) => a.id === aulaAtivaId);
  }, [todasAulas, aulaAtivaId]);

  const aulaAtiva = useMemo(() => {
    return todasAulas.find((a) => a.id === aulaAtivaId) || null;
  }, [todasAulas, aulaAtivaId]);

  const moduloDaAulaAtiva = useMemo(() => {
    if (!conteudo || !aulaAtiva) return null;
    return conteudo.modulos.find((m) => m.aulas.some((a) => a.id === aulaAtiva.id)) || null;
  }, [conteudo, aulaAtiva]);

  const modulosOptions = useMemo(() => {
    return conteudo ? conteudo.modulos.map((m) => ({ id: m.id, titulo: m.titulo })) : [];
  }, [conteudo]);

  // Alternar conclusão da aula (concluir ou desmarcar) — exclusivo para o Aluno
  const handleToggleConclusao = async () => {
    if (!aulaAtiva || atualizandoProgresso || isProfessor) return;

    setAtualizandoProgresso(true);
    const metodo = aulaAtiva.concluida ? 'DELETE' : 'POST';

    try {
      const res = await fetch(`${API_BASE_URL}/aulas/${aulaAtiva.id}/concluir`, {
        method: metodo,
        credentials: 'include',
      });

      if (!res.ok) {
        const msg = await extrairMensagemErro(res);
        throw new Error(msg);
      }

      const resData = await res.json();

      // Atualiza o estado local de forma reativa
      setConteudo((prev) => {
        if (!prev) return prev;

        const novosModulos = prev.modulos.map((modulo) => ({
          ...modulo,
          aulas: modulo.aulas.map((aula) => {
            if (aula.id === aulaAtiva.id) {
              return { ...aula, concluida: !aula.concluida };
            }
            return aula;
          }),
        }));

        return {
          ...prev,
          modulos: novosModulos,
          progresso: {
            totalAulas: resData.estatisticas.totalAulas,
            aulasConcluidas: resData.estatisticas.aulasConcluidas,
            percentualProgresso: resData.estatisticas.percentual,
            cursoConcluido: resData.estatisticas.cursoConcluido,
          },
        };
      });
    } catch (err) {
      const msg = await extrairMensagemErro(err);
      alert(msg);
    } finally {
      setAtualizandoProgresso(false);
    }
  };

  const irParaAulaAnterior = () => {
    if (indiceAulaAtiva > 0) {
      setAulaAtivaId(todasAulas[indiceAulaAtiva - 1].id);
    }
  };

  const irParaProximaAula = () => {
    if (indiceAulaAtiva < todasAulas.length - 1) {
      setAulaAtivaId(todasAulas[indiceAulaAtiva + 1].id);
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
    return (
      <div className="container mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="rounded-2xl border border-red-500/20 bg-red-50/50 p-8 dark:bg-red-950/20">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Acesso Restrito ao Conteúdo
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
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

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Barra Superior da Sala de Aula */}
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
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate max-w-[220px] sm:max-w-md">
              {conteudo.curso.titulo}
            </span>
          </div>

          {/* Ações contextuais no topo */}
          {isProfessor ? (
            <div className="flex items-center space-x-2">
              <Badge variant="warning" className="text-[10px] uppercase font-bold py-0.5 px-2">
                <ShieldCheck className="mr-1 h-3 w-3" />
                Modo Professor
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setModalNovoModuloAberto(true)}
                className="h-8 text-xs font-semibold border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300"
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Módulo
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setModuloSelecionadoParaAula(null);
                  setModalNovaAulaAberto(true);
                }}
                disabled={conteudo.modulos.length === 0}
                className="h-8 bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold"
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Aula
              </Button>
            </div>
          ) : (
            /* Barra de Progresso no Topo para Aluno */
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">
                  {conteudo.progresso.percentualProgresso}% concluído
                </span>
                <span className="text-[10px] text-zinc-400">
                  {conteudo.progresso.aulasConcluidas} de {conteudo.progresso.totalAulas} aulas
                </span>
              </div>
              <div className="w-24 sm:w-36 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${conteudo.progresso.percentualProgresso}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </header>

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
          {/* Coluna da Esquerda (2/3): Player de Vídeo e Material da Aula */}
          <div className="lg:col-span-2 space-y-6">
            {aulaAtiva ? (
              <>
                {/* Player de Conteúdo / Vídeo */}
                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-black shadow-lg dark:border-zinc-800">
                  <div className="relative aspect-video w-full">
                    {aulaAtiva.urlConteudo.includes('youtube.com') ||
                    aulaAtiva.urlConteudo.includes('youtu.be') ? (
                      <iframe
                        src={
                          aulaAtiva.urlConteudo.includes('watch?v=')
                            ? aulaAtiva.urlConteudo.replace('watch?v=', 'embed/')
                            : aulaAtiva.urlConteudo
                        }
                        title={aulaAtiva.titulo}
                        className="h-full w-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-zinc-400 text-sm">
                        <PlayCircle className="mr-2 h-8 w-8 text-indigo-500" />
                        <span>Visualizador de Conteúdo: {aulaAtiva.titulo}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Barra de Ações da Aula */}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      {moduloDaAulaAtiva?.titulo || 'Módulo do Curso'}
                    </span>
                    <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                      {aulaAtiva.titulo}
                    </h1>
                    <div className="flex items-center space-x-3 text-xs text-zinc-500">
                      <span className="flex items-center">
                        <Clock className="mr-1 h-3.5 w-3.5" />
                        {aulaAtiva.duracaoMinutos} minutos
                      </span>
                    </div>
                  </div>

                  {/* Ação de Conclusão para Aluno ou Badge para Professor */}
                  {isProfessor ? (
                    <Badge variant="warning" className="text-xs px-3 py-1.5 font-bold uppercase tracking-wider">
                      <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                      Visualização do Administrador
                    </Badge>
                  ) : (
                    <Button
                      onClick={handleToggleConclusao}
                      disabled={atualizandoProgresso}
                      variant={aulaAtiva.concluida ? 'outline' : 'default'}
                      className={
                        aulaAtiva.concluida
                          ? 'border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }
                    >
                      {atualizandoProgresso ? (
                        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                      ) : aulaAtiva.concluida ? (
                        <CheckCircle2 className="mr-1.5 h-4 w-4 text-emerald-600" />
                      ) : (
                        <Circle className="mr-1.5 h-4 w-4" />
                      )}
                      <span>{aulaAtiva.concluida ? 'Aula Concluída' : 'Marcar como Concluída'}</span>
                    </Button>
                  )}
                </div>

                {/* Navegação entre aulas */}
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={irParaAulaAnterior}
                    disabled={indiceAulaAtiva <= 0}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Aula Anterior
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={irParaProximaAula}
                    disabled={indiceAulaAtiva >= todasAulas.length - 1}
                  >
                    Próxima Aula
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>

                {/* Descrição e Orientações do Professor */}
                {aulaAtiva.descricao && (
                  <Card className="border-zinc-200 dark:border-zinc-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        Orientações e Material de Apoio
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                      {aulaAtiva.descricao}
                    </CardContent>
                  </Card>
                )}
              </>
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

          {/* Coluna da Direita (1/3): Módulos e Ementa do Curso */}
          <div className="space-y-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between mb-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
                <div className="flex items-center space-x-2">
                  <Layers className="h-4 w-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Conteúdo do Curso
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-zinc-500">
                    {conteudo.modulos.length} módulos
                  </span>
                  {isProfessor && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setModalNovoModuloAberto(true)}
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
                {conteudo.modulos.length === 0 ? (
                  <p className="text-xs text-zinc-400 text-center py-4">
                    Nenhum módulo adicionado.
                  </p>
                ) : (
                  conteudo.modulos.map((modulo, modIdx) => (
                    <div key={modulo.id} className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 rounded-lg">
                        <span className="truncate mr-2">
                          Módulo {modIdx + 1}: {modulo.titulo}
                        </span>
                        <div className="flex items-center space-x-1.5 shrink-0">
                          <span className="text-[10px] text-zinc-400 font-normal">
                            {modulo.aulas.length} aulas
                          </span>
                          {isProfessor && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setModuloSelecionadoParaAula(modulo.id);
                                setModalNovaAulaAberto(true);
                              }}
                              className="h-5 px-1.5 text-[9px] text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100/50 font-semibold"
                            >
                              <Plus className="mr-0.5 h-2.5 w-2.5" />
                              Aula
                            </Button>
                          )}
                        </div>
                      </div>

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
                                onClick={() => setAulaAtivaId(aula.id)}
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
          </div>
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

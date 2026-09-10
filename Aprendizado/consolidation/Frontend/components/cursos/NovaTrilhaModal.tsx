'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layers, AlertCircle, CheckCircle2, Loader2, BookOpen, Check, User, Users } from 'lucide-react';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { extrairMensagemErro } from '@/lib/tratarErroApi';
import type { Curso, AlunoResumo } from '@/types';

interface NovaTrilhaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTrilhaCriada?: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function NovaTrilhaModal({ open, onOpenChange, onTrilhaCriada }: NovaTrilhaModalProps) {
  const router = useRouter();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [ordem, setOrdem] = useState<number | ''>(1);
  const [alunoId, setAlunoId] = useState('');
  const [alunosDisponiveis, setAlunosDisponiveis] = useState<AlunoResumo[]>([]);
  const [carregandoAlunos, setCarregandoAlunos] = useState(false);
  const [cursosDisponiveis, setCursosDisponiveis] = useState<Curso[]>([]);
  const [cursosSelecionados, setCursosSelecionados] = useState<string[]>([]);
  const [carregandoCursos, setCarregandoCursos] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  // Busca cursos e alunos cadastrados para permitir personalização
  useEffect(() => {
    if (!open) return;

    let cancelado = false;

    async function carregarDados() {
      setCarregandoCursos(true);
      setCarregandoAlunos(true);
      try {
        const [resCursos, resAlunos] = await Promise.all([
          fetch(`${API_BASE_URL}/cursos`, { credentials: 'include' }),
          fetch(`${API_BASE_URL}/alunos`, { credentials: 'include' }),
        ]);

        if (resCursos.ok && !cancelado) {
          const dataCursos: Curso[] = await resCursos.json();
          setCursosDisponiveis(dataCursos);
        }

        if (resAlunos.ok && !cancelado) {
          const dataAlunos: AlunoResumo[] = await resAlunos.json();
          setAlunosDisponiveis(dataAlunos);
        }
      } catch {
        // Falha silenciosa de busca preliminar
      } finally {
        if (!cancelado) {
          setCarregandoCursos(false);
          setCarregandoAlunos(false);
        }
      }
    }

    carregarDados();

    return () => {
      cancelado = true;
    };
  }, [open]);

  const toggleCurso = (cursoId: string) => {
    setCursosSelecionados((prev) =>
      prev.includes(cursoId) ? prev.filter((id) => id !== cursoId) : [...prev, cursoId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    // 1. Validações rigorosas de borda
    if (!titulo.trim() || titulo.trim().length < 3) {
      setErro('O título da trilha deve ter no mínimo 3 caracteres.');
      return;
    }

    if (titulo.trim().length > 120) {
      setErro('O título da trilha não pode exceder 120 caracteres.');
      return;
    }

    if (descricao && descricao.trim().length > 500) {
      setErro('A descrição não pode exceder 500 caracteres.');
      return;
    }

    if (ordem === '' || Number(ordem) < 0) {
      setErro('A ordem de exibição deve ser um número inteiro maior ou igual a zero.');
      return;
    }

    setCarregando(true);

    try {
      // 2. Chamada autenticada com cookies de sessão do Professor Alex
      const res = await fetch(`${API_BASE_URL}/trilhas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          titulo: titulo.trim(),
          descricao: descricao.trim() ? descricao.trim() : undefined,
          ordem: Number(ordem),
          alunoId: alunoId.trim() ? alunoId.trim() : null,
          cursosIds: cursosSelecionados.length > 0 ? cursosSelecionados : undefined,
        }),
      });

      if (!res.ok) {
        const mensagemErro = await extrairMensagemErro(res);
        throw new Error(mensagemErro);
      }

      setSucesso(true);
      onTrilhaCriada?.();
      router.refresh();

      setTimeout(() => {
        setSucesso(false);
        setTitulo('');
        setDescricao('');
        setOrdem(1);
        setAlunoId('');
        setCursosSelecionados([]);
        onOpenChange(false);
      }, 1200);
    } catch (err: unknown) {
      const msg = await extrairMensagemErro(err);
      setErro(msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader className="shrink-0 mb-3">
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
          <Layers className="h-5 w-5" />
          <DialogTitle>Nova Trilha de Estudo</DialogTitle>
        </div>
        <DialogDescription className="text-xs">
          Organize uma jornada sequencial de formação conectando cursos do básico ao avançado.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
        {sucesso && (
          <div className="flex items-center space-x-2 rounded-lg border border-emerald-500/20 bg-emerald-50 p-2.5 mb-2 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 animate-in fade-in-50 shrink-0">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>Trilha de estudo criada com sucesso!</span>
          </div>
        )}

        {erro && (
          <div className="flex items-center space-x-2 rounded-lg border border-red-500/20 bg-red-50 p-2.5 mb-2 text-xs font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400 animate-in fade-in-50 shrink-0">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{erro}</span>
          </div>
        )}

        {/* Corpo com rolagem interna automática */}
        <div className="flex-1 overflow-y-auto pr-1.5 space-y-3.5 max-h-[56vh]">
          <div className="space-y-1">
            <label htmlFor="titulo-trilha" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Título da Trilha <span className="text-red-500">*</span>
            </label>
            <Input
              id="titulo-trilha"
              placeholder="Ex: Formação Engenharia de Backend & APIs"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              disabled={carregando}
              required
              className="text-sm h-9"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1">
              <label htmlFor="descricao-trilha" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Descrição Pedagógica (Opcional)
              </label>
              <Textarea
                id="descricao-trilha"
                placeholder="Objetivo de aprendizagem e competências desenvolvidas..."
                rows={2}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                disabled={carregando}
                className="text-xs resize-none"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="ordem-trilha" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Ordem
              </label>
              <Input
                id="ordem-trilha"
                type="number"
                min="0"
                value={ordem}
                onChange={(e) => setOrdem(e.target.value === '' ? '' : Number(e.target.value))}
                disabled={carregando}
                className="text-xs h-9"
              />
              <span className="text-[10px] text-zinc-400">Posição na lista</span>
            </div>
          </div>

          {/* Seleção do Destinatário da Trilha (Personalizada ou Geral) */}
          <div className="space-y-1.5 rounded-lg border border-zinc-200/80 bg-zinc-50/50 p-2.5 dark:border-zinc-800 dark:bg-zinc-900/30">
            <div className="flex items-center justify-between">
              <label htmlFor="aluno-destinatario" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center">
                {alunoId ? (
                  <User className="h-3.5 w-3.5 mr-1.5 text-amber-600 dark:text-amber-400" />
                ) : (
                  <Users className="h-3.5 w-3.5 mr-1.5 text-indigo-600 dark:text-indigo-400" />
                )}
                Destinatário da Trilha
              </label>
              {alunoId ? (
                <Badge variant="outline" className="text-[10px] font-semibold text-amber-700 border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300">
                  Trilha Personalizada
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400">
                  Pública (Todos os Alunos)
                </Badge>
              )}
            </div>

            {carregandoAlunos ? (
              <div className="flex items-center py-2 text-xs text-zinc-500">
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin text-indigo-600" />
                Carregando lista de alunos...
              </div>
            ) : (
              <select
                id="aluno-destinatario"
                value={alunoId}
                onChange={(e) => setAlunoId(e.target.value)}
                disabled={carregando}
                className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
              >
                <option value="">🌐 Todos os Alunos (Trilha Pública Geral)</option>
                {alunosDisponiveis.map((aluno) => (
                  <option key={aluno.id} value={aluno.id}>
                    👤 {aluno.name} ({aluno.email})
                  </option>
                ))}
              </select>
            )}

            <p className="text-[10px] text-zinc-500 leading-tight">
              {alunoId
                ? 'Esta trilha ficará visível exclusivamente para o aluno selecionado em seu painel.'
                : 'Esta trilha ficará aberta e visível para todos os alunos matriculados na plataforma.'}
            </p>
          </div>

          {/* Seleção de Cursos da Trilha */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center">
                <BookOpen className="h-3.5 w-3.5 mr-1.5 text-indigo-600" />
                Cursos Vinculados à Trilha
              </label>
              <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400">
                {cursosSelecionados.length} selecionado(s)
              </span>
            </div>

            {carregandoCursos ? (
              <div className="flex items-center justify-center py-4 text-xs text-zinc-500">
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-indigo-600" />
                Carregando cursos...
              </div>
            ) : cursosDisponiveis.length === 0 ? (
              <p className="text-xs text-zinc-500 italic py-2">
                Nenhum curso disponível para vincular no momento. Você poderá adicionar cursos posteriormente.
              </p>
            ) : (
              <div className="max-h-36 overflow-y-auto space-y-1 rounded-lg border border-zinc-200 bg-zinc-50/50 p-1.5 dark:border-zinc-800 dark:bg-zinc-900/40">
                {cursosDisponiveis.map((c) => {
                  const selecionado = cursosSelecionados.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleCurso(c.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-md text-left transition-colors text-xs ${
                        selecionado
                          ? 'bg-indigo-50 border border-indigo-200 dark:bg-indigo-950/50 dark:border-indigo-800'
                          : 'bg-white hover:bg-zinc-100 border border-zinc-200/60 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 dark:border-zinc-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <div
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                            selecionado
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-800'
                          }`}
                        >
                          {selecionado && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate">
                          {c.titulo}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase shrink-0 ml-2 py-0 px-1">
                        {c.nivel}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="shrink-0 pt-3 mt-2 border-t border-zinc-100 dark:border-zinc-800">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={carregando}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={carregando}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {carregando ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Criando Trilha...
              </>
            ) : (
              'Criar Trilha'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

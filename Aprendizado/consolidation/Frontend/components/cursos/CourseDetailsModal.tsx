'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Clock,
  Layers,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import type { Curso } from '@/types';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/auth-client';
import { extrairMensagemErro } from '@/lib/tratarErroApi';

interface CourseDetailsModalProps {
  curso: Curso | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function CourseDetailsModal({ curso, open, onOpenChange }: CourseDetailsModalProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const [carregando, setCarregando] = useState(false);
  const [matriculado, setMatriculado] = useState(false);
  const [verificandoMatricula, setVerificandoMatricula] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  const isProfessor = (session?.user as any)?.papel === 'PROFESSOR';
  const isAluno = (session?.user as any)?.papel === 'ALUNO';

  // Verifica se o aluno já possui matrícula ativa neste curso
  useEffect(() => {
    if (!open || !curso || !isAluno) {
      setMatriculado(false);
      setErro(null);
      setSucesso(false);
      return;
    }

    let cancelado = false;

    async function checarMatricula() {
      setVerificandoMatricula(true);
      try {
        const res = await fetch(`${API_BASE_URL}/matriculas/minhas`, {
          credentials: 'include',
        });
        if (res.ok && !cancelado) {
          const matriculas: any[] = await res.json();
          const jaMatriculado = matriculas.some(
            (m) => m.curso.id === curso?.id && m.status !== 'CANCELADA',
          );
          setMatriculado(jaMatriculado);
        }
      } catch {
        // Falha silenciosa de verificação
      } finally {
        if (!cancelado) setVerificandoMatricula(false);
      }
    }

    checarMatricula();

    return () => {
      cancelado = true;
    };
  }, [open, curso, isAluno]);

  // Ação de envio: Realizar Matrícula no Curso
  const handleMatricular = async () => {
    if (!curso) return;

    setCarregando(true);
    setErro(null);
    setSucesso(false);

    try {
      const res = await fetch(`${API_BASE_URL}/matriculas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          cursoId: curso.id,
        }),
      });

      if (!res.ok) {
        const mensagemErro = await extrairMensagemErro(res);
        throw new Error(mensagemErro);
      }

      setSucesso(true);
      setMatriculado(true);
      router.refresh();

      // Redireciona o aluno diretamente para a sala de aula do curso
      setTimeout(() => {
        onOpenChange(false);
        router.push(`/cursos/${curso.id}`);
      }, 1200);
    } catch (err) {
      const msg = await extrairMensagemErro(err);
      setErro(msg);
    } finally {
      setCarregando(false);
    }
  };

  if (!curso) return null;

  const badgeVariant =
    curso.nivel === 'INICIANTE'
      ? 'success'
      : curso.nivel === 'INTERMEDIARIO'
        ? 'info'
        : 'warning';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant={badgeVariant} className="text-[10px] font-bold tracking-wider uppercase">
              {curso.nivel}
            </Badge>
            <span className="flex items-center text-xs text-zinc-500 dark:text-zinc-400">
              <Clock className="mr-1 h-3.5 w-3.5" />
              {curso.cargaHorariaEstimada} horas estimadas
            </span>
          </div>

          {matriculado && (
            <Badge variant="success" className="text-[11px] font-semibold flex items-center">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Matriculado
            </Badge>
          )}
        </div>

        <DialogTitle className="text-xl font-bold mt-2 text-zinc-900 dark:text-zinc-50">
          {curso.titulo}
        </DialogTitle>
        <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
          Ministrado pelo Professor Alex • Plataforma DevTracks Ensino
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-2">
        {/* Notificação de Sucesso */}
        {sucesso && (
          <div className="flex items-center space-x-2 rounded-lg border border-emerald-500/20 bg-emerald-50 p-3 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>Parabéns! Sua matrícula foi confirmada. Bons estudos!</span>
          </div>
        )}

        {/* Notificação de Erro Sanitizado */}
        {erro && (
          <div className="flex items-center space-x-2 rounded-lg border border-red-500/20 bg-red-50 p-3 text-xs font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{erro}</span>
          </div>
        )}

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
            Sobre o Curso
          </h4>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
            {curso.descricao}
          </p>
        </div>

        {/* Módulos e Conteúdo Programático */}
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center mb-2">
            <Layers className="h-4 w-4 mr-1.5 text-indigo-600" />
            Estrutura da Formação
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>{curso.modulosCount ?? 0} Módulos Cadastrados</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>{curso.aulasCount ?? 0} Aulas Cadastradas</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Exercícios de Fixação</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Acompanhamento de Progresso</span>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter className="flex items-center justify-between sm:justify-between">
        <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} disabled={carregando}>
          Fechar
        </Button>

        {isProfessor ? (
          <Button
            size="sm"
            onClick={() => {
              onOpenChange(false);
              router.push(`/cursos/${curso.id}`);
            }}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <span>Gerenciar Curso e Aulas</span>
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        ) : isAluno ? (
          matriculado ? (
            <Button
              size="sm"
              onClick={() => {
                onOpenChange(false);
                router.push(`/cursos/${curso.id}`);
              }}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <span>Continuar Aulas</span>
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleMatricular}
              disabled={carregando || verificandoMatricula}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {carregando ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  <span>Confirmando Matrícula...</span>
                </>
              ) : (
                <>
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  <span>Matricular-se no Curso</span>
                </>
              )}
            </Button>
          )
        ) : (
          <Link href="/login">
            <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700">
              <span>Entrar para se Matricular</span>
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        )}
      </DialogFooter>
    </Dialog>
  );
}

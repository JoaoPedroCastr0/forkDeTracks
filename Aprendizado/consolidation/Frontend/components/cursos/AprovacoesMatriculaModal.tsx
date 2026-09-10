'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Check,
  X,
  Clock,
  User,
  BookOpen,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Inbox,
} from 'lucide-react';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { extrairMensagemErro } from '@/lib/tratarErroApi';
import type { MatriculaPendente } from '@/types';

interface AprovacoesMatriculaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAtualizado?: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function AprovacoesMatriculaModal({
  open,
  onOpenChange,
  onAtualizado,
}: AprovacoesMatriculaModalProps) {
  const [pendentes, setPendentes] = useState<MatriculaPendente[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [processandoId, setProcessandoId] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  const carregarPendentes = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const res = await fetch(`${API_BASE_URL}/matriculas/pendentes`, {
        credentials: 'include',
      });
      if (!res.ok) {
        const msg = await extrairMensagemErro(res);
        throw new Error(msg);
      }
      const data: MatriculaPendente[] = await res.json();
      setPendentes(data);
    } catch (err: unknown) {
      const msg = await extrairMensagemErro(err);
      setErro(msg);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    if (open) {
      carregarPendentes();
      setMensagemSucesso(null);
    }
  }, [open]);

  const handleAprovar = async (matriculaId: string) => {
    setProcessandoId(matriculaId);
    setErro(null);
    setMensagemSucesso(null);

    try {
      const res = await fetch(`${API_BASE_URL}/matriculas/${matriculaId}/aprovar`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (!res.ok) {
        const msg = await extrairMensagemErro(res);
        throw new Error(msg);
      }

      setPendentes((prev) => prev.filter((p) => p.id !== matriculaId));
      setMensagemSucesso('Matrícula confirmada com sucesso. O aluno já tem acesso liberado!');
      onAtualizado?.();
    } catch (err: unknown) {
      const msg = await extrairMensagemErro(err);
      setErro(msg);
    } finally {
      setProcessandoId(null);
    }
  };

  const handleRejeitar = async (matriculaId: string) => {
    setProcessandoId(matriculaId);
    setErro(null);
    setMensagemSucesso(null);

    try {
      const res = await fetch(`${API_BASE_URL}/matriculas/${matriculaId}/rejeitar`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (!res.ok) {
        const msg = await extrairMensagemErro(res);
        throw new Error(msg);
      }

      setPendentes((prev) => prev.filter((p) => p.id !== matriculaId));
      setMensagemSucesso('Solicitação de matrícula recusada com sucesso.');
      onAtualizado?.();
    } catch (err: unknown) {
      const msg = await extrairMensagemErro(err);
      setErro(msg);
    } finally {
      setProcessandoId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
          <Bell className="h-5 w-5" />
          <DialogTitle>Solicitações de Matrícula</DialogTitle>
        </div>
        <DialogDescription>
          Confirme ou recuse o acesso dos alunos aos seus cursos na plataforma.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-2 max-h-[60vh] overflow-y-auto">
        {mensagemSucesso && (
          <div className="flex items-center space-x-2 rounded-lg border border-emerald-500/20 bg-emerald-50 p-3 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 animate-in fade-in-50">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{mensagemSucesso}</span>
          </div>
        )}

        {erro && (
          <div className="flex items-center space-x-2 rounded-lg border border-red-500/20 bg-red-50 p-3 text-xs font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400 animate-in fade-in-50">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{erro}</span>
          </div>
        )}

        {carregando ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
            <p className="text-xs text-zinc-500">Buscando solicitações de matrícula...</p>
          </div>
        ) : pendentes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 text-zinc-500 dark:text-zinc-400">
            <div className="rounded-full bg-zinc-100 p-4 dark:bg-zinc-800/60">
              <Inbox className="h-8 w-8 text-zinc-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                Nenhuma solicitação pendente
              </h4>
              <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                Todas as matrículas enviadas por alunos foram analisadas.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {pendentes.map((item) => {
              const isProcessando = processandoId === item.id;
              const iniciais = item.usuario.name?.slice(0, 2).toUpperCase() || 'AL';

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/60 shadow-sm transition-all"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-xs shrink-0 mt-0.5">
                      {iniciais}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          {item.usuario.name}
                        </span>
                        <Badge variant="warning" className="text-[10px] uppercase font-bold py-0 px-1.5">
                          Pendente
                        </Badge>
                      </div>

                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {item.usuario.email}
                      </p>

                      <div className="flex items-center space-x-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium pt-0.5">
                        <BookOpen className="h-3.5 w-3.5 shrink-0" />
                        <span>{item.curso.titulo}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isProcessando}
                      onClick={() => handleRejeitar(item.id)}
                      className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:border-red-900/50 dark:hover:bg-red-950/40"
                    >
                      {isProcessando ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <X className="mr-1 h-3.5 w-3.5" />
                      )}
                      Recusar
                    </Button>

                    <Button
                      size="sm"
                      variant="success"
                      disabled={isProcessando}
                      onClick={() => handleAprovar(item.id)}
                      className="text-xs font-semibold"
                    >
                      {isProcessando ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check className="mr-1 h-3.5 w-3.5" />
                      )}
                      Aprovar
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
          Fechar
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

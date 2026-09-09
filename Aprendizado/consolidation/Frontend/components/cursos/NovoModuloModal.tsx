'use client';

import React, { useState } from 'react';
import { Layers, Plus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
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
import { extrairMensagemErro } from '@/lib/tratarErroApi';

interface NovoModuloModalProps {
  cursoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onModuloCriado: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function NovoModuloModal({
  cursoId,
  open,
  onOpenChange,
  onModuloCriado,
}: NovoModuloModalProps) {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [ordem, setOrdem] = useState<number>(1);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!titulo.trim() || titulo.trim().length < 3) {
      setErro('O título do módulo deve ter no mínimo 3 caracteres.');
      return;
    }

    setCarregando(true);

    try {
      const res = await fetch(`${API_BASE_URL}/cursos/${cursoId}/modulos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          titulo: titulo.trim(),
          descricao: descricao.trim() ? descricao.trim() : undefined,
          ordem: Number(ordem) || 1,
        }),
      });

      if (!res.ok) {
        const msg = await extrairMensagemErro(res);
        throw new Error(msg);
      }

      setSucesso(true);
      onModuloCriado();

      setTimeout(() => {
        setSucesso(false);
        setTitulo('');
        setDescricao('');
        setOrdem(1);
        onOpenChange(false);
      }, 1000);
    } catch (err: any) {
      const msg = await extrairMensagemErro(err);
      setErro(msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
          <Layers className="h-5 w-5" />
          <DialogTitle>Adicionar Novo Módulo</DialogTitle>
        </div>
        <DialogDescription>
          Organize o curso em módulos lógicos de aprendizado para seus alunos.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        {sucesso && (
          <div className="flex items-center space-x-2 rounded-lg border border-emerald-500/20 bg-emerald-50 p-3 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>Módulo adicionado com sucesso!</span>
          </div>
        )}

        {erro && (
          <div className="flex items-center space-x-2 rounded-lg border border-red-500/20 bg-red-50 p-3 text-xs font-medium text-red-700 dark:bg-red-950/40 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{erro}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Título do Módulo <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Ex: Módulo 1: Fundamentos da Linguagem"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            disabled={carregando}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Descrição do Módulo (Opcional)
          </label>
          <Textarea
            placeholder="Breve resumo dos conceitos abordados neste módulo..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            disabled={carregando}
            rows={3}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Ordem de Exibição
          </label>
          <Input
            type="number"
            min={1}
            value={ordem}
            onChange={(e) => setOrdem(Number(e.target.value))}
            disabled={carregando}
          />
        </div>

        <DialogFooter className="pt-2">
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
                Salvando Módulo...
              </>
            ) : (
              <>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Salvar Módulo
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

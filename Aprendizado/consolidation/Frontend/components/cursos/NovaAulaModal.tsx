'use client';

import React, { useState, useEffect } from 'react';
import { Video, Plus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
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

interface ModuloOption {
  id: string;
  titulo: string;
}

interface NovaAulaModalProps {
  cursoId: string;
  modulos: ModuloOption[];
  moduloInicialId?: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAulaCriada: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function NovaAulaModal({
  cursoId,
  modulos,
  moduloInicialId,
  open,
  onOpenChange,
  onAulaCriada,
}: NovaAulaModalProps) {
  const [moduloId, setModuloId] = useState<string>('');
  const [titulo, setTitulo] = useState('');
  const [urlConteudo, setUrlConteudo] = useState('');
  const [duracaoMinutos, setDuracaoMinutos] = useState<number>(15);
  const [descricao, setDescricao] = useState('');
  const [ordem, setOrdem] = useState<number>(1);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    if (moduloInicialId) {
      setModuloId(moduloInicialId);
    } else if (modulos.length > 0 && !moduloId) {
      setModuloId(modulos[0].id);
    }
  }, [moduloInicialId, modulos, moduloId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!moduloId) {
      setErro('Selecione um módulo para associar esta aula.');
      return;
    }

    if (!titulo.trim() || titulo.trim().length < 3) {
      setErro('O título da aula deve ter no mínimo 3 caracteres.');
      return;
    }

    if (!urlConteudo.trim() || urlConteudo.trim().length < 5) {
      setErro('Informe uma URL de vídeo ou conteúdo válida.');
      return;
    }

    setCarregando(true);

    try {
      const res = await fetch(`${API_BASE_URL}/cursos/${cursoId}/aulas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          moduloId,
          titulo: titulo.trim(),
          urlConteudo: urlConteudo.trim(),
          duracaoMinutos: Number(duracaoMinutos) || 0,
          descricao: descricao.trim() ? descricao.trim() : undefined,
          ordem: Number(ordem) || 1,
        }),
      });

      if (!res.ok) {
        const msg = await extrairMensagemErro(res);
        throw new Error(msg);
      }

      setSucesso(true);
      onAulaCriada();

      setTimeout(() => {
        setSucesso(false);
        setTitulo('');
        setUrlConteudo('');
        setDescricao('');
        setDuracaoMinutos(15);
        setOrdem(1);
        onOpenChange(false);
      }, 1000);
    } catch (err: unknown) {
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
          <Video className="h-5 w-5" />
          <DialogTitle>Publicar Nova Aula</DialogTitle>
        </div>
        <DialogDescription>
          Adicione uma nova aula gravada ou instrução prática em um dos módulos do curso.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        {sucesso && (
          <div className="flex items-center space-x-2 rounded-lg border border-emerald-500/20 bg-emerald-50 p-3 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>Aula publicada com sucesso!</span>
          </div>
        )}

        {erro && (
          <div className="flex items-center space-x-2 rounded-lg border border-red-500/20 bg-red-50 p-3 text-xs font-medium text-red-700 dark:bg-red-950/40 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{erro}</span>
          </div>
        )}

        {/* Seleção do Módulo Pai */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Módulo Pertencente <span className="text-red-500">*</span>
          </label>
          <select
            value={moduloId}
            onChange={(e) => setModuloId(e.target.value)}
            disabled={carregando}
            required
            className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
          >
            {modulos.length === 0 && (
              <option value="">Nenhum módulo cadastrado. Crie um módulo primeiro.</option>
            )}
            {modulos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.titulo}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Título da Aula <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Ex: Aula 1: Entendendo Tipos Básicos"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            disabled={carregando}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            URL do Vídeo / Conteúdo <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Ex: https://youtube.com/watch?v=id_do_video ou https://vimeo.com/..."
            value={urlConteudo}
            onChange={(e) => setUrlConteudo(e.target.value)}
            disabled={carregando}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Duração (minutos)
            </label>
            <Input
              type="number"
              min={1}
              value={duracaoMinutos}
              onChange={(e) => setDuracaoMinutos(Number(e.target.value))}
              disabled={carregando}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Ordem no Módulo
            </label>
            <Input
              type="number"
              min={1}
              value={ordem}
              onChange={(e) => setOrdem(Number(e.target.value))}
              disabled={carregando}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Orientações e Material de Apoio (Opcional)
          </label>
          <Textarea
            placeholder="Instruções para o aluno, links de repositório, comandos ou notas de aula..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            disabled={carregando}
            rows={3}
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
            disabled={carregando || modulos.length === 0}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {carregando ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Publicando Aula...
              </>
            ) : (
              <>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Publicar Aula
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

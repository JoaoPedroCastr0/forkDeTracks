'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, BookPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { extrairMensagemErro } from '@/lib/tratarErroApi';
import type { NivelCurso } from '@/types';

interface NovoCursoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCursoCriado?: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function NovoCursoModal({ open, onOpenChange, onCursoCriado }: NovoCursoModalProps) {
  const router = useRouter();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [cargaHorariaEstimada, setCargaHorariaEstimada] = useState<number | ''>(20);
  const [nivel, setNivel] = useState<'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO'>('INICIANTE');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!titulo.trim() || titulo.trim().length < 5) {
      setErro('O título deve ter no mínimo 5 caracteres.');
      return;
    }

    if (!descricao.trim() || descricao.trim().length < 10) {
      setErro('A descrição deve ter no mínimo 10 caracteres.');
      return;
    }

    if (!cargaHorariaEstimada || Number(cargaHorariaEstimada) <= 0) {
      setErro('A carga horária estimada deve ser um número positivo.');
      return;
    }

    setCarregando(true);

    try {
      // Chamada autenticada via cookies de sessão para POST /cursos
      const res = await fetch(`${API_BASE_URL}/cursos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          titulo: titulo.trim(),
          descricao: descricao.trim(),
          cargaHorariaEstimada: Number(cargaHorariaEstimada),
          nivel,
        }),
      });

      if (!res.ok) {
        const mensagemErro = await extrairMensagemErro(res);
        throw new Error(mensagemErro);
      }

      const novoCurso = await res.json();

      setSucesso(true);
      if (onCursoCriado) onCursoCriado();
      router.refresh();

      setTimeout(() => {
        setSucesso(false);
        setTitulo('');
        setDescricao('');
        setCargaHorariaEstimada(20);
        setNivel('INICIANTE');
        onOpenChange(false);
        if (novoCurso?.id) {
          router.push(`/cursos/${novoCurso.id}`);
        }
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
          <BookPlus className="h-5 w-5" />
          <DialogTitle>Publicar Novo Curso</DialogTitle>
        </div>
        <DialogDescription>
          Preencha os dados básicos do curso. Após criar, você será direcionado para cadastrar manualmente os módulos e aulas correspondentes.
        </DialogDescription>
      </DialogHeader>

      {sucesso && (
        <div className="mb-4 flex items-center space-x-2 rounded-lg border border-emerald-500/20 bg-emerald-50 p-3 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Curso criado com sucesso! Redirecionando para cadastrar módulos e aulas...</span>
        </div>
      )}

      {erro && (
        <div className="mb-4 flex items-center space-x-2 rounded-lg border border-red-500/20 bg-red-50 p-3 text-xs font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{erro}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Título do Curso
          </label>
          <Input
            type="text"
            placeholder="Ex: Arquitetura de Software com Clean Architecture"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Descrição Completa
          </label>
          <Textarea
            placeholder="Apresente os objetivos, módulos e o que o aluno irá aprender..."
            rows={3}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Carga Horária (Horas)
            </label>
            <Input
              type="number"
              min={1}
              max={500}
              value={cargaHorariaEstimada}
              onChange={(e) => setCargaHorariaEstimada(e.target.value ? Number(e.target.value) : '')}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Nível
            </label>
            <select
              value={nivel}
              onChange={(e) => setNivel(e.target.value as NivelCurso)}
              className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
            >
              <option value="INICIANTE">Iniciante</option>
              <option value="INTERMEDIARIO">Intermediário</option>
              <option value="AVANCADO">Avançado</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={carregando}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={carregando || sucesso}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Sparkles className="mr-1.5 h-4 w-4" />
            {carregando ? 'Salvando...' : 'Publicar Curso'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

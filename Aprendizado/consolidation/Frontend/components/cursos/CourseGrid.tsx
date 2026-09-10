'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, BookOpen, GraduationCap } from 'lucide-react';
import type { Curso, NivelCurso, ItemMatricula } from '@/types';
import { obterPapelUsuario } from '@/types';
import { CourseCard, type MatriculaResumo } from './CourseCard';
import { CourseDetailsModal } from './CourseDetailsModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/auth-client';

interface CourseGridProps {
  cursosIniciais: Curso[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function CourseGrid({ cursosIniciais }: CourseGridProps) {
  const { data: session } = useSession();
  const papel = obterPapelUsuario(session?.user);
  const isAluno = papel === 'ALUNO';

  const [busca, setBusca] = useState('');
  const [nivelSelecionado, setNivelSelecionado] = useState<NivelCurso | 'TODOS'>('TODOS');
  const [abaMatricula, setAbaMatricula] = useState<'TODOS' | 'MINHAS'>('TODOS');
  const [matriculasMap, setMatriculasMap] = useState<Record<string, MatriculaResumo>>({});
  const [cursoSelecionado, setCursoSelecionado] = useState<Curso | null>(null);
  const [detalhesAberto, setDetalhesAberto] = useState(false);

  // Carrega matrículas do aluno em tempo real
  useEffect(() => {
    if (!isAluno) {
      setMatriculasMap({});
      return;
    }

    let cancelado = false;

    async function carregarMatriculas() {
      try {
        const res = await fetch(`${API_BASE_URL}/matriculas/minhas`, {
          credentials: 'include',
        });
        if (res.ok && !cancelado) {
          const data = (await res.json()) as ItemMatricula[];
          const mapa: Record<string, MatriculaResumo> = {};
          for (const item of data) {
            if (item.curso?.id) {
              mapa[item.curso.id] = {
                status: item.status,
                percentualProgresso: item.percentualProgresso,
              };
            }
          }
          setMatriculasMap(mapa);
        }
      } catch {
        // Falha silenciosa
      }
    }

    carregarMatriculas();

    return () => {
      cancelado = true;
    };
  }, [isAluno]);

  const totalMatriculados = useMemo(() => {
    return Object.values(matriculasMap).filter((m) => m.status !== 'CANCELADA').length;
  }, [matriculasMap]);

  const cursosFiltrados = useMemo(() => {
    return cursosIniciais.filter((curso) => {
      const matchTexto =
        curso.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        curso.descricao.toLowerCase().includes(busca.toLowerCase());

      const matchNivel =
        nivelSelecionado === 'TODOS' || curso.nivel === nivelSelecionado;

      const matchAba =
        abaMatricula === 'TODOS' ||
        (abaMatricula === 'MINHAS' &&
          matriculasMap[curso.id] &&
          matriculasMap[curso.id].status !== 'CANCELADA');

      return matchTexto && matchNivel && matchAba;
    });
  }, [cursosIniciais, busca, nivelSelecionado, abaMatricula, matriculasMap]);

  const handleAbrirDetalhes = (curso: Curso) => {
    setCursoSelecionado(curso);
    setDetalhesAberto(true);
  };

  return (
    <div className="space-y-8">
      {/* Abas Superiores para o Aluno (Todos vs Minhas Matrículas) */}
      {isAluno && totalMatriculados > 0 && (
        <div className="flex items-center space-x-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <button
            type="button"
            onClick={() => setAbaMatricula('TODOS')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              abaMatricula === 'TODOS'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Todos os Cursos ({cursosIniciais.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setAbaMatricula('MINHAS')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              abaMatricula === 'MINHAS'
                ? 'bg-indigo-600 text-white'
                : 'text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Meus Cursos em Andamento ({totalMatriculados})</span>
          </button>
        </div>
      )}

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Campo de Busca */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            type="text"
            placeholder="Buscar por título, tecnologia ou conceito..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
          />
        </div>

        {/* Filtro de Nível */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-zinc-200/80 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-900">
          {(['TODOS', 'INICIANTE', 'INTERMEDIARIO', 'AVANCADO'] as const).map((nivel) => {
            const label =
              nivel === 'TODOS'
                ? 'Todos'
                : nivel === 'INICIANTE'
                  ? 'Iniciante'
                  : nivel === 'INTERMEDIARIO'
                    ? 'Intermediário'
                    : 'Avançado';

            const isActive = nivelSelecionado === nivel;

            return (
              <button
                key={nivel}
                type="button"
                onClick={() => setNivelSelecionado(nivel)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-50'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid de Cards */}
      {cursosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cursosFiltrados.map((curso) => (
            <CourseCard
              key={curso.id}
              curso={curso}
              matricula={matriculasMap[curso.id]}
              onVerConteudo={handleAbrirDetalhes}
            />
          ))}
        </div>
      ) : (
        /* Estado Vazio */
        <div className="rounded-2xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-800">
          <BookOpen className="mx-auto h-12 w-12 text-zinc-400" />
          <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            {abaMatricula === 'MINHAS'
              ? 'Você ainda não está matriculado em nenhum curso.'
              : 'Nenhum curso encontrado'}
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {abaMatricula === 'MINHAS'
              ? 'Explore o catálogo geral e matricule-se gratuitamente para começar a estudar!'
              : 'Tente buscar com outro termo ou redefinir os filtros de nível.'}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setBusca('');
              setNivelSelecionado('TODOS');
              setAbaMatricula('TODOS');
            }}
            className="mt-5"
          >
            {abaMatricula === 'MINHAS' ? 'Explorar Catálogo' : 'Limpar filtros'}
          </Button>
        </div>
      )}

      {/* Modal de Detalhes do Curso */}
      <CourseDetailsModal
        curso={cursoSelecionado}
        open={detalhesAberto}
        onOpenChange={setDetalhesAberto}
      />
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Code2, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface HeroSectionProps {
  totalCursos: number;
}

export function HeroSection({ totalCursos }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden border-b border-zinc-200/60 bg-gradient-to-b from-indigo-50/40 via-white to-white py-16 dark:border-zinc-800/60 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 sm:py-24">
      {/* Detalhe de fundo decorativo */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[450px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-transparent blur-3xl" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge do Topo */}
        <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Plataforma Oficial de Ensino de Programação</span>
        </div>

        {/* Título Principal */}
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl lg:text-6xl">
          Evolua do código básico à{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Arquitetura Profissional
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="mx-auto mt-5 max-w-2xl text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
          Trilhas estruturadas pelo Professor, módulos práticos, acompanhamento de progresso
          em tempo real e engenharia de software aplicada com as stacks mais modernas do mercado.
        </p>

        {/* Botões de Ação */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/#cursos">
            <Button size="lg" className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/25">
              Explorar Cursos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/#trilhas">
            <Button size="lg" variant="outline" className="border-zinc-300 dark:border-zinc-700">
              Conhecer as Trilhas
            </Button>
          </Link>
        </div>

        {/* Cards de Métricas em Destaque */}
        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          <div className="rounded-xl border border-zinc-200/80 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{totalCursos}+</div>
            <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Cursos Disponíveis</div>
          </div>
          <div className="rounded-xl border border-zinc-200/80 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">100%</div>
            <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Prático & Direto</div>
          </div>
          <div className="rounded-xl border border-zinc-200/80 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Prisma 7</div>
            <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Persistência Relacional</div>
          </div>
          <div className="rounded-xl border border-zinc-200/80 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Bun</div>
            <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Alta Performance</div>
          </div>
        </div>

        {/* Filosofia Pedagógica Central: Aprender -> Construir -> Evoluir */}
        <div className="mt-16 text-left">
          <div className="text-center mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Filosofia Pedagógica
            </h2>
            <p className="mt-1 text-xl font-extrabold text-zinc-900 dark:text-zinc-50 sm:text-2xl">
              Aprender → Construir → Evoluir
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-zinc-200/80 bg-white/80 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-sm">
                  1
                </div>
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                  Aprender
                </h3>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Aulas diretas com o Professor, foco em conceitos essenciais e objetivos claros de domínio para cada aula, sem enrolação.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200/80 bg-white/80 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-sm">
                  2
                </div>
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                  Construir
                </h3>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Desafios práticos interativos em cada aula, comandos para testar no seu terminal local e cultura do erro como ferramenta de raciocínio.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200/80 bg-white/80 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
              <div className="flex items-center space-x-3 mb-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                  3
                </div>
                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                  Evoluir
                </h3>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Conexão contínua com projetos reais da trilha, níveis de maestria e competências sólidas de arquitetura de software profissional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

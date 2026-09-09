import React from 'react';
import { Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function TrilhasSection() {
  const trilhas = [
    {
      id: 'trilha-iniciante',
      titulo: 'Trilha 1: Fundamentos & Lógica',
      descricao: 'O ponto de partida ideal. Aprenda a pensar como programador com algoritmos, sintaxe moderna de JavaScript e tipagem estrita com TypeScript.',
      etapas: ['Lógica de Programação', 'JavaScript ES6+', 'TypeScript Essencial', 'Estruturas de Dados'],
      badge: 'Básico ao Intermediário',
    },
    {
      id: 'trilha-backend-avancado',
      titulo: 'Trilha 2: Engenharia de Backend & APIs',
      descricao: 'Construa serviços robustos, arquitetura em camadas, ORM com Prisma, validação com Zod, autenticação segura e governança de banco de dados.',
      etapas: ['Arquitetura em Camadas', 'Prisma 7 & PostgreSQL', 'Autenticação & Sessões', 'Docker & Deploy'],
      badge: 'Intermediário ao Avançado',
    },
    {
      id: 'trilha-fullstack-moderno',
      titulo: 'Trilha 3: Full-Stack Next.js & Cloud',
      descricao: 'Integração ponta a ponta. Do design system com Tailwind e shadcn à renderização no servidor com Next.js App Router e Server Actions.',
      etapas: ['Next.js App Router', 'Tailwind & shadcn/ui', 'Consumo de APIs REST', 'Otimização & SEO'],
      badge: 'Avançado',
    },
  ];

  return (
    <section id="trilhas" className="py-20 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="outline" className="mb-3 font-semibold text-indigo-600 dark:text-indigo-400">
            Trilhas Recomendadas
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Aprenda com um plano passo a passo
          </h2>
          <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400">
            Em vez de cursos soltos e sem conexão, siga trilhas estruturadas onde cada módulo prepara você para o próximo nível de complexidade.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {trilhas.map((trilha) => (
            <Card key={trilha.id} className="flex flex-col justify-between border-zinc-200/90 dark:border-zinc-800">
              <CardHeader className="space-y-3">
                <Badge variant="secondary" className="w-fit text-xs font-medium">
                  {trilha.badge}
                </Badge>
                <CardTitle className="text-xl font-bold">{trilha.titulo}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {trilha.descricao}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2.5 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                  {trilha.etapas.map((etapa) => (
                    <div key={etapa} className="flex items-center text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{etapa}</span>
                    </div>
                  ))}
                </div>

                <Button variant="outline" className="w-full mt-4 justify-between group">
                  <span>Seguir esta Trilha</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

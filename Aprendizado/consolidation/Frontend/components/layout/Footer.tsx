import React from 'react';
import { Terminal, Github, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 bg-zinc-50/50 py-10 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="container mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-white">
            <Terminal className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Plataforma de Ensino de Programação
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <span>Next.js 15</span>
          <span>•</span>
          <span>Tailwind CSS</span>
          <span>•</span>
          <span>shadcn/ui</span>
          <span>•</span>
          <span>Bun & Express 5</span>
          <span>•</span>
          <span>Prisma 7 & PostgreSQL</span>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Construído com foco em arquitetura limpa e alta performance.
        </p>
      </div>
    </footer>
  );
}

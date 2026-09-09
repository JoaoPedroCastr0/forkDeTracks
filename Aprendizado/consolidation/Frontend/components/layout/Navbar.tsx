'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Layers, Sparkles, Terminal, LogOut, PlusCircle, User, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSession, signOut } from '@/lib/auth-client';
import { NovoCursoModal } from '@/components/cursos/NovoCursoModal';

export function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [modalNovoCursoAberto, setModalNovoCursoAberto] = useState(false);
  const [saindo, setSaindo] = useState(false);

  const usuario = session?.user;
  const isProfessor = (usuario as any)?.papel === 'PROFESSOR';
  const isAluno = (usuario as any)?.papel === 'ALUNO';

  const handleSignOut = async () => {
    try {
      setSaindo(true);
      await signOut();
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Erro ao sair:', err);
    } finally {
      setSaindo(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Marca */}
          <Link href="/" className="flex items-center space-x-2.5 transition-opacity hover:opacity-90">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-500/30">
              <Terminal className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                DevTracks <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">ENSINO</span>
              </span>
            </div>
          </Link>

          {/* Links Centrais */}
          <nav className="hidden items-center space-x-8 md:flex">
            <Link
              href="/"
              className="flex items-center space-x-1.5 text-sm font-medium text-zinc-700 transition-colors hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400"
            >
              <BookOpen className="h-4 w-4" />
              <span>Cursos</span>
            </Link>
            <Link
              href="#trilhas"
              className="flex items-center space-x-1.5 text-sm font-medium text-zinc-700 transition-colors hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400"
            >
              <Layers className="h-4 w-4" />
              <span>Trilhas Guiadas</span>
            </Link>
          </nav>

          {/* Área de Autenticação e Ações do Usuário */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {isPending ? (
              <div className="h-8 w-24 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
            ) : usuario ? (
              /* Usuário Autenticado */
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Badge do Papel */}
                <div className="hidden items-center sm:flex space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-xs">
                    {usuario.name?.slice(0, 2).toUpperCase() || 'US'}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-1 max-w-[120px]">
                      {usuario.name}
                    </span>
                    <Badge
                      variant={isProfessor ? 'warning' : 'success'}
                      className="text-[9px] py-0 px-1 font-bold uppercase tracking-wider w-fit"
                    >
                      {isProfessor ? 'Professor' : 'Aluno'}
                    </Badge>
                  </div>
                </div>

                {/* Ação específica do Professor: Criar Novo Curso */}
                {isProfessor && (
                  <Button
                    size="sm"
                    onClick={() => setModalNovoCursoAberto(true)}
                    className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 text-xs font-semibold"
                  >
                    <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
                    Novo Curso
                  </Button>
                )}

                {/* Botão Sair */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  disabled={saindo}
                  className="border-zinc-200 text-zinc-600 hover:text-red-600 hover:border-red-200 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-red-400"
                >
                  <LogOut className="h-3.5 w-3.5 sm:mr-1" />
                  <span className="hidden sm:inline">{saindo ? 'Saindo...' : 'Sair'}</span>
                </Button>
              </div>
            ) : (
              /* Visitante / Não Autenticado */
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-zinc-300 text-zinc-700 hover:text-indigo-600 hover:border-indigo-300 dark:border-zinc-700 dark:text-zinc-200 dark:hover:text-indigo-400 font-medium"
                  >
                    Entrar
                  </Button>
                </Link>
                <Link href="/cadastro">
                  <Button
                    size="sm"
                    className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 font-semibold"
                  >
                    <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                    Cadastre-se
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal de Publicação de Novo Curso (Disponível para o Professor) */}
      {isProfessor && (
        <NovoCursoModal
          open={modalNovoCursoAberto}
          onOpenChange={setModalNovoCursoAberto}
          onCursoCriado={() => {
            router.refresh();
          }}
        />
      )}
    </>
  );
}

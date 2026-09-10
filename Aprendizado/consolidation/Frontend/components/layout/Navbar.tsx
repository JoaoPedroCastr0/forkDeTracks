'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Layers,
  Sparkles,
  Terminal,
  LogOut,
  PlusCircle,
  User,
  ShieldCheck,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSession, signOut } from '@/lib/auth-client';
import { obterPapelUsuario, type MatriculaPendente } from '@/types';
import { NovoCursoModal } from '@/components/cursos/NovoCursoModal';
import { NovaTrilhaModal } from '@/components/cursos/NovaTrilhaModal';
import { AprovacoesMatriculaModal } from '@/components/cursos/AprovacoesMatriculaModal';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [modalNovoCursoAberto, setModalNovoCursoAberto] = useState(false);
  const [modalNovaTrilhaAberto, setModalNovaTrilhaAberto] = useState(false);
  const [modalAprovacoesAberto, setModalAprovacoesAberto] = useState(false);
  const [totalPendentes, setTotalPendentes] = useState(0);
  const [saindo, setSaindo] = useState(false);

  const usuario = session?.user;
  const papel = obterPapelUsuario(usuario);
  const isProfessor = papel === 'PROFESSOR';
  const isAluno = papel === 'ALUNO';

  const checarPendencias = useCallback(async () => {
    if (!isProfessor) return;
    try {
      const res = await fetch(`${API_BASE_URL}/matriculas/pendentes`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data: MatriculaPendente[] = await res.json();
        setTotalPendentes(data.length);
      }
    } catch {
      // Falha silenciosa
    }
  }, [isProfessor]);

  useEffect(() => {
    checarPendencias();
    if (isProfessor) {
      const interval = setInterval(checarPendencias, 30000);
      return () => clearInterval(interval);
    }
  }, [isProfessor, checarPendencias]);

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
              href="/#cursos"
              className="flex items-center space-x-1.5 text-sm font-medium text-zinc-700 transition-colors hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-indigo-400"
            >
              <BookOpen className="h-4 w-4" />
              <span>Cursos</span>
            </Link>
            <Link
              href="/#trilhas"
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

                {/* Notificações de Matrícula para o Professor Alex */}
                {isProfessor && (
                  <button
                    type="button"
                    onClick={() => setModalAprovacoesAberto(true)}
                    className="relative p-2 rounded-lg text-zinc-600 hover:text-indigo-600 hover:bg-indigo-50 dark:text-zinc-400 dark:hover:text-indigo-400 dark:hover:bg-zinc-800 transition-colors"
                    title={
                      totalPendentes > 0
                        ? `${totalPendentes} solicitação(ões) de matrícula pendente(s)`
                        : 'Nenhuma solicitação de matrícula pendente'
                    }
                    aria-label="Solicitações de Matrícula"
                  >
                    <Bell className="h-4 w-4" />
                    {totalPendentes > 0 && (
                      <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white shadow-sm animate-pulse">
                        {totalPendentes}
                      </span>
                    )}
                  </button>
                )}

                {/* Ações específicas do Professor: Criar Nova Trilha e Novo Curso */}
                {isProfessor && (
                  <div className="flex items-center space-x-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setModalNovaTrilhaAberto(true)}
                      className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-950/50 text-xs font-semibold"
                    >
                      <Layers className="mr-1.5 h-3.5 w-3.5" />
                      Nova Trilha
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => setModalNovoCursoAberto(true)}
                      className="bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 text-xs font-semibold"
                    >
                      <PlusCircle className="mr-1.5 h-3.5 w-3.5" />
                      Novo Curso
                    </Button>
                  </div>
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

      {/* Modais Administrativos para o Professor */}
      {isProfessor && (
        <>
          <NovoCursoModal
            open={modalNovoCursoAberto}
            onOpenChange={setModalNovoCursoAberto}
            onCursoCriado={() => {
              router.refresh();
            }}
          />

          <NovaTrilhaModal
            open={modalNovaTrilhaAberto}
            onOpenChange={setModalNovaTrilhaAberto}
            onTrilhaCriada={() => {
              router.refresh();
            }}
          />

          <AprovacoesMatriculaModal
            open={modalAprovacoesAberto}
            onOpenChange={setModalAprovacoesAberto}
            onAtualizado={() => {
              checarPendencias();
              router.refresh();
            }}
          />
        </>
      )}
    </>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Terminal, User, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { signUp } from '@/lib/auth-client';
import { extrairMensagemErro } from '@/lib/tratarErroApi';

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    // 1. Validações no cliente antes do envio
    if (!nome.trim() || !email.trim() || !senha) {
      setErro('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (nome.trim().length < 3) {
      setErro('O nome deve ter no mínimo 3 caracteres.');
      return;
    }

    if (senha.length < 8) {
      setErro('A senha deve ter no mínimo 8 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      setErro('A confirmação de senha não confere com a senha digitada.');
      return;
    }

    setCarregando(true);

    try {
      // 2. Chamada ao Better Auth (Regra de Negócio: todo auto-cadastro é estritamente ALUNO)
      const { data, error: signUpError } = await signUp.email({
        name: nome.trim(),
        email: email.trim().toLowerCase(),
        password: senha,
      });

      if (signUpError) {
        let msg = signUpError.message || 'Falha ao realizar cadastro.';
        if (
          msg.toLowerCase().includes('short') ||
          (signUpError as any)?.code === 'PASSWORD_TOO_SHORT'
        ) {
          msg = 'A senha é muito curta. Digite no mínimo 8 caracteres.';
        } else if (msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('duplicate')) {
          msg = 'Este e-mail já está cadastrado na plataforma. Tente fazer login.';
        }
        throw new Error(msg);
      }

      // 3. Sucesso: notifica e redireciona
      setSucesso(true);
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      const msg = await extrairMensagemErro(err, 'Não foi possível completar seu cadastro no momento. Por favor, tente novamente mais tarde.');
      setErro(msg);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Luz decorativa de fundo */}
      <div className="pointer-events-none absolute top-10 left-1/2 -z-10 h-[350px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-transparent blur-3xl" />

      <div className="w-full max-w-md space-y-6">
        {/* Voltar para Home */}
        <Link
          href="/"
          className="inline-flex items-center text-xs font-semibold text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Voltar para a página inicial
        </Link>

        <Card className="border-zinc-200/90 shadow-xl dark:border-zinc-800">
          <CardHeader className="space-y-3 text-center pb-4">
            {/* Logo */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/25">
              <Terminal className="h-6 w-6" />
            </div>

            <div>
              <CardTitle className="text-2xl font-bold tracking-tight">
                Crie sua conta de Aluno
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Acesse as aulas e trilhas do Professor e acompanhe sua evolução
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            {/* Alerta de Sucesso */}
            {sucesso && (
              <div className="flex items-center space-x-2 rounded-lg border border-emerald-500/20 bg-emerald-50 p-3 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                <span>Cadastro realizado com sucesso! Redirecionando para o login...</span>
              </div>
            )}

            {/* Alerta de Erro */}
            {erro && (
              <div className="flex items-center space-x-2 rounded-lg border border-red-500/20 bg-red-50 p-3 text-xs font-medium text-red-600 dark:bg-red-950/40 dark:text-red-400 animate-in fade-in">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{erro}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Nome Completo */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input
                    type="text"
                    placeholder="Ex: João Silva"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="pl-9 bg-white dark:bg-zinc-900"
                    required
                  />
                </div>
              </div>

              {/* E-mail */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 bg-white dark:bg-zinc-900"
                    required
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Senha (mínimo 8 caracteres)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input
                    type={mostrarSenha ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="pl-9 pr-9 bg-white dark:bg-zinc-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirmar Senha */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input
                    type={mostrarSenha ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="pl-9 bg-white dark:bg-zinc-900"
                    required
                  />
                </div>
              </div>

              {/* Botão de Enviar Cadastro */}
              <Button
                type="submit"
                disabled={carregando || sucesso}
                className="w-full mt-2 bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20 font-semibold"
              >
                {carregando ? 'Cadastrando aluno...' : 'Criar minha conta de Aluno'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3 pt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
            <div>
              Já tem uma conta?{' '}
              <Link href="/login" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
                Entrar agora
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

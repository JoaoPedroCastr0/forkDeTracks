import type React from 'react';
import { createContext, useContext } from 'react';
import { authClient } from '../shared/services/authClient';

interface AuthContextData {
  isAuthenticated: boolean;
  login: (token?: string, userId?: string) => void;
  logout: () => void;
  refetch: () => Promise<unknown>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data, isPending, refetch } = authClient.useSession();

  // LOG DE DIAGNÓSTICO: Vamos ver o que está vindo do servidor
  console.log('Sessão Atual:', { data, isPending });

  const isAuthenticated = !!data?.user;

  // Login agora é disparado pelo Better Auth na página Login.tsx,
  // mantemos a função para retrocompatibilidade se necessário, ou esvaziamos.
  const login = () => {
    // A sessão reativa (useSession) atualizará automaticamente o isAuthenticated
  };

  const logout = async () => {
    await authClient.signOut();
    localStorage.clear();
    window.location.href = '/login';
  };

  if (isPending) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        Carregando sessão...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, refetch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para facilitar o uso do Contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

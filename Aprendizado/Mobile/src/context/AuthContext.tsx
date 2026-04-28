import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ActivityIndicator } from 'react-native';

interface AuthContextData {
  isAuthenticated: boolean;
  login: (token: string, userId: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ao iniciar, verifica se já existe token armazenado no dispositivo
    const loadStorageData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Erro ao ler token do AsyncStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStorageData();
  }, []);

  const login = async (token: string, userId: string) => {
    try {
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', String(userId));
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro ao salvar no AsyncStorage:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userId');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro ao remover do AsyncStorage:', error);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111827' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{ marginTop: 10, color: '#9CA3AF' }}>Carregando sessão...</Text>
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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

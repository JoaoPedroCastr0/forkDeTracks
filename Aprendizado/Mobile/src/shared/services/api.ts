import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuração base da instância do Axios para o Mobile
export const api = axios.create({
  // Utilizando o IP local da máquina para acessar a API pelo emulador ou celular
  baseURL: 'http://192.168.2.116:4000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador para adicionar o token JWT
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

import axios from 'axios';

// Configuração base da instância do Axios
export const api = axios.create({
  baseURL: 'http://localhost:4000', // URL base do backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Futuramente, podemos adicionar interceptadores aqui para adicionar o token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

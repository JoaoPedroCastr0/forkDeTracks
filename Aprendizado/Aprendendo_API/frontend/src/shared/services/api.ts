import axios from 'axios';

// Configuração base da instância do Axios
export const api = axios.create({
  baseURL: 'http://localhost:4000', // URL base do backend
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Garante que os cookies da sessão sejam enviados
});
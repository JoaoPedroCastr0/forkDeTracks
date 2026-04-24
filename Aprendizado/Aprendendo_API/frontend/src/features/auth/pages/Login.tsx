import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../shared/api';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../../shared/components/Button';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/login', { email, password });

      setSuccess('Login realizado com sucesso!');
      
      // Usa o contexto global para efetuar o login na sessão da aplicação inteira
      login(response.data.token, response.data.user.id);
      
      // O Roteador gerencia a mudança visual
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Ocorreu um erro ao conectar com o servidor.');
      }
    }
  };

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Acessar Conta</h2>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Seu E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Sua Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="actions" style={{ marginTop: '10px' }}>
          <Button type="submit" variant="primary">Entrar</Button>
        </div>
      </form>

      <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px' }}>
        Não tem uma conta? <span style={{ color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/register')}>Cadastre-se aqui</span>
      </p>
    </div>
  );
};

export default Login;

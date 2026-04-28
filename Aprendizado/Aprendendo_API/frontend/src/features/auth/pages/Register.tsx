import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../shared/services/api';
import Button from '../../../shared/components/Button';

const Register: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await api.post('/register', { nome, email, password });
      
      setSuccess('Cadastro realizado com sucesso! Redirecionando para login...');
      setNome('');
      setEmail('');
      setPassword('');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Ocorreu um erro ao tentar cadastrar o usuário.');
      }
    }
  };

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Criar Conta</h2>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      
      <form onSubmit={handleRegister}>
        <input 
          type="text" 
          placeholder="Seu Nome Completo" 
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
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
          <Button type="submit" variant="primary">Cadastrar</Button>
        </div>
      </form>
      
      <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px' }}>
        Já possui conta? <span style={{ color: '#3b82f6', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/login')}>Faça login aqui</span>
      </p>
    </div>
  );
};

export default Register;

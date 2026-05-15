import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../../shared/components/Button';
import { authClient } from '../../../shared/services/authClient';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { refetch } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const { error: authError } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (authError) {
        setError(authError.message || 'Erro ao cadastrar usuário');
        return;
      }

      setSuccess(
        'Cadastro realizado com sucesso! Redirecionando para dashboard...',
      );
      setName('');
      setEmail('');
      setPassword('');

      // Sincronizamos a sessão antes de navegar para evitar o erro de "página não entra"
      await refetch();
      navigate('/dashboard');
    } catch (_err) {
      setError('Ocorreu um erro ao tentar cadastrar o usuário.');
    }
  };

  return (
    <div className='card' style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Criar Conta</h2>

      {error && <div className='error'>{error}</div>}
      {success && <div className='success'>{success}</div>}

      <form onSubmit={handleRegister}>
        <input
          type='text'
          placeholder='Seu Nome Completo'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type='email'
          placeholder='Seu E-mail'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='Sua Senha'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className='actions' style={{ marginTop: '10px' }}>
          <Button type='submit' variant='primary'>
            Cadastrar
          </Button>
        </div>
      </form>

      <p style={{ marginTop: '15px', textAlign: 'center', fontSize: '14px' }}>
        Já possui conta?{' '}
        <button
          type='button'
          style={{
            background: 'none',
            border: 'none',
            color: '#3b82f6',
            cursor: 'pointer',
            textDecoration: 'underline',
            padding: 0,
            fontSize: 'inherit',
            fontFamily: 'inherit',
          }}
          onClick={() => navigate('/login')}
        >
          Faça login aqui
        </button>
      </p>
    </div>
  );
};

export default Register;

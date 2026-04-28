import React, { useState, useEffect } from 'react';
import { api } from '../../../shared/services/api';
import { Task } from '../../../shared/types/task';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../../shared/components/Button';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  
  const { logout } = useAuth();

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err: any) {
      setError('Erro ao carregar tarefas.');
      if (err.response?.status === 401) {
        logout(); // Token expirado -> Context -> router chuta pro login
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await api.put(`/tasks/${editingId}`, { title });
        setEditingId(null);
      } else {
        await api.post('/tasks', { title, description });
      }
      
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Erro ao salvar tarefa.');
    }
  };

  const handleEdit = (task: Task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description || '');
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError('Erro ao apagar tarefa.');
    }
  };

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Minhas Tarefas</h2>
        <Button onClick={logout} variant="danger" style={{ width: 'auto' }}>Sair da Conta</Button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card">
        <h3>{editingId ? 'Editar Tarefa' : 'Nova Tarefa'}</h3>
        <form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
          <input 
            type="text" 
            placeholder="Título" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          {!editingId && (
            <input 
              type="text" 
              placeholder="Descrição (Opcional)" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          )}
          <Button type="submit" variant="primary">
            {editingId ? 'Atualizar Tarefa' : 'Adicionar Tarefa'}
          </Button>
          
          {editingId && (
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => { setEditingId(null); setTitle(''); setDescription(''); }} 
              style={{ marginTop: '10px' }}
            >
              Cancelar Edição
            </Button>
          )}
        </form>
      </div>

      <div className="task-list" style={{ marginTop: '30px' }}>
        {tasks.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8' }}>Nenhuma tarefa encontrada. Adicione uma acima!</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="task-item card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '15px' }}>
              <div style={{ flex: 1, paddingRight: '20px' }}>
                <h4 style={{ marginBottom: '5px', fontSize: '18px' }}>{task.title}</h4>
                {task.description && <p style={{ fontSize: '14px', color: '#cbd5e1' }}>{task.description}</p>}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button onClick={() => handleEdit(task)} variant="warning" style={{ width: 'auto', padding: '5px 15px', fontSize: '12px' }}>
                  Editar
                </Button>
                <Button onClick={() => handleDelete(task.id)} variant="danger" style={{ width: 'auto', padding: '5px 15px', fontSize: '12px' }}>
                  Excluir
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;

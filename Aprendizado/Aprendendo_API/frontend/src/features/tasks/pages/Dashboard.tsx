import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Button from '../../../shared/components/Button';
import { api } from '../../../shared/services/api';
import { authClient } from '../../../shared/services/authClient';
import type { Task } from '../../../shared/types/task';

const Dashboard: React.FC = () => {
  const { data: session } = authClient.useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deletedTasks, setDeletedTasks] = useState<Task[]>([]);
  const [showTrash, setShowTrash] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const { logout } = useAuth();

  const fetchTasks = useCallback(async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      setError('Erro ao carregar tarefas.');
      // Verificação simples para erro de autenticação sem usar any
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        (err as { response: { status: number } }).response?.status === 401
      ) {
        logout();
      }
    }
  }, [logout]);

  const fetchDeletedTasks = useCallback(async () => {
    try {
      const response = await api.get('/tasks/trash');
      setDeletedTasks(response.data);
    } catch (_err) {
      setError('Erro ao carregar lixeira.');
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchDeletedTasks();
  }, [fetchTasks, fetchDeletedTasks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await api.put(`/tasks/${editingId}`, { title, description });
        setEditingId(null);
      } else {
        await api.post('/tasks', { title, description });
      }

      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (err) {
      let message = 'Erro ao salvar tarefa.';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as {
          response: { data: { message?: string; error?: string } };
        };
        message =
          axiosError.response?.data?.message ||
          axiosError.response?.data?.error ||
          message;
      }
      setError(message);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description || '');
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
      fetchDeletedTasks();
    } catch (_err) {
      setError('Erro ao apagar tarefa.');
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await api.patch(`/tasks/${id}/restore`);
      fetchTasks();
      fetchDeletedTasks();
    } catch (_err) {
      setError('Erro ao restaurar tarefa.');
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir permanentemente esta tarefa?'))
      return;
    try {
      await api.delete(`/tasks/${id}/permanent`);
      fetchDeletedTasks();
    } catch (_err) {
      setError('Erro ao excluir permanentemente.');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      await api.patch(`/tasks/${task.id}/toggle`, {
        completed: !task.completed,
      });
      fetchTasks();
    } catch (_err) {
      setError('Erro ao atualizar status da tarefa.');
    }
  };

  return (
    <div className='dashboard'>
      <div style={{ marginBottom: '20px' }}>
        {session?.user && (
          <h3
            style={{
              color: '#94a3b8',
              fontSize: '16px',
              fontWeight: 'normal',
              marginBottom: '5px',
            }}
          >
            Olá,{' '}
            <span style={{ color: '#60f63b', fontWeight: 'bold' }}>
              {session.user.name}
            </span>
            !
          </h3>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2>Minhas Tarefas</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              onClick={() => setShowTrash(!showTrash)}
              variant='secondary'
              style={{ width: 'auto' }}
            >
              {showTrash ? 'Ver Ativas' : `Lixeira (${deletedTasks.length})`}
            </Button>
            <Button onClick={logout} variant='danger' style={{ width: 'auto' }}>
              Sair da Conta
            </Button>
          </div>
        </div>
      </div>

      {error && <div className='error'>{error}</div>}

      {!showTrash && (
        <div className='card'>
          <h3>{editingId ? 'Editar Tarefa' : 'Nova Tarefa'}</h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '15px' }}>
            <input
              type='text'
              placeholder='Título'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              type='text'
              placeholder='Descrição (Opcional)'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Button type='submit' variant='primary'>
              {editingId ? 'Atualizar Tarefa' : 'Adicionar Tarefa'}
            </Button>

            {editingId && (
              <Button
                type='button'
                variant='secondary'
                onClick={() => {
                  setEditingId(null);
                  setTitle('');
                  setDescription('');
                }}
                style={{ marginTop: '10px' }}
              >
                Cancelar Edição
              </Button>
            )}
          </form>
        </div>
      )}

      <div className='task-list' style={{ marginTop: '30px' }}>
        {showTrash ? (
          <>
            <h3 style={{ marginBottom: '15px' }}>Lixeira</h3>
            {deletedTasks.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8' }}>
                A lixeira está vazia.
              </p>
            ) : (
              deletedTasks.map((task) => (
                <div
                  key={task.id}
                  className='task-item card'
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '10px',
                    padding: '15px',
                    opacity: 0.7,
                  }}
                >
                  <div style={{ flex: 1, paddingRight: '20px' }}>
                    <h4
                      style={{
                        marginBottom: '5px',
                        fontSize: '18px',
                        textDecoration: 'line-through',
                      }}
                    >
                      {task.title}
                    </h4>
                    {task.description && (
                      <p style={{ fontSize: '14px', color: '#cbd5e1' }}>
                        {task.description}
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Button
                      onClick={() => handleRestore(task.id)}
                      variant='primary'
                      style={{
                        width: 'auto',
                        padding: '5px 15px',
                        fontSize: '12px',
                      }}
                    >
                      Restaurar
                    </Button>
                    <Button
                      onClick={() => handlePermanentDelete(task.id)}
                      variant='danger'
                      style={{
                        width: 'auto',
                        padding: '5px 15px',
                        fontSize: '12px',
                      }}
                    >
                      Excluir Permanente
                    </Button>
                  </div>
                </div>
              ))
            )}
          </>
        ) : tasks.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#94a3b8' }}>
            Nenhuma tarefa encontrada. Adicione uma acima!
          </p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className='task-item card'
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
                padding: '15px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flex: 1,
                  paddingRight: '20px',
                }}
              >
                <input
                  type='checkbox'
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task)}
                  style={{
                    marginRight: '15px',
                    cursor: 'pointer',
                    width: '20px',
                    height: '20px',
                  }}
                />
                <div>
                  <h4
                    style={{
                      marginBottom: '5px',
                      fontSize: '18px',
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? '#94a3b8' : 'inherit',
                    }}
                  >
                    {task.title}
                  </h4>
                  {task.description && (
                    <p
                      style={{
                        fontSize: '14px',
                        color: task.completed ? '#64748b' : '#cbd5e1',
                        textDecoration: task.completed
                          ? 'line-through'
                          : 'none',
                      }}
                    >
                      {task.description}
                    </p>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {!task.completed && (
                  <Button
                    onClick={() => handleEdit(task)}
                    variant='warning'
                    style={{
                      width: 'auto',
                      padding: '5px 15px',
                      fontSize: '12px',
                    }}
                  >
                    Editar
                  </Button>
                )}
                <Button
                  onClick={() => handleDelete(task.id)}
                  variant='danger'
                  style={{
                    width: 'auto',
                    padding: '5px 15px',
                    fontSize: '12px',
                  }}
                >
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

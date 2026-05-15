import { Outlet } from 'react-router-dom';

export function MainLayout() {
  return (
    <div
      className='container'
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        transition: 'max-width 0.3s ease',
      }}
    >
      <header>
        <h1 style={{ marginBottom: '30px', textAlign: 'center' }}>
          Aplicação de Tarefas
        </h1>
      </header>

      <main>
        {/* O Outlet renderizará as rotas filhas do layout */}
        <Outlet />
      </main>
    </div>
  );
}

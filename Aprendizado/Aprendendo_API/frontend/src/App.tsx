import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import Dashboard from './features/tasks/pages/Dashboard';
import PrivateRoute from './shared/components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="container" style={{ maxWidth: '800px', transition: 'max-width 0.3s ease' }}>
          <h1 style={{ marginBottom: '30px' }}>Aplicação de Tarefas</h1>
          
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rotas Privadas */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />

            {/* Rota padrão: redireciona para dashboard se logado, ou login se o PrivateRoute chutar */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

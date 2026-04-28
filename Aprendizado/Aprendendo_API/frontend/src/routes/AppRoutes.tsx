import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import Dashboard from '../features/tasks/pages/Dashboard';
import PrivateRoute from '../shared/components/PrivateRoute';
import { MainLayout } from '../shared/components/Layout/MainLayout';

export function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Rotas Privadas (Envoltas pelo Layout) */}
      <Route element={<MainLayout />}>
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
      </Route>

      {/* Rota padrão: redireciona para dashboard se logado, ou login se o PrivateRoute chutar */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

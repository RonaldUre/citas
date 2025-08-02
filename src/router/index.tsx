import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/features/auth/pages/LoginPage';
import DashboardPage from '@/features/dashboard/pages/DashboardPage';
import { ProtectedRoute } from './ProtectedRoute';
import PrivateLayout from '@/components/layout/PrivateLayout';
import NotFoundPage from './NotFoundPage';

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Público */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Privado con layout */}
        <Route
          element={
            <ProtectedRoute>
              <PrivateLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* Más rutas privadas aquí */}
        </Route>

        {/* Ruta para página no encontrada */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
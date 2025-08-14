import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import { ClientListPage } from "@/features/client/pages/ClientListPage";
import ClientFormPage from "@/features/client/pages/ClientFormPage";
import { UserListPage } from "@/features/user/pages/UserListPage";
import { UserFormPage } from "@/features/user/pages/UserFormPage";
import AppointmentCalendarPage from "@/features/appointment/pages/AppointmentCalendarPage";
import { ProtectedRoute } from "./ProtectedRoute";
import PrivateLayout from "@/components/layout/PrivateLayout";
import NotFoundPage from "./NotFoundPage";
import { ServiceListPage } from "@/features/service/pages/ServiceListPage";
import { ServiceFormPage } from "@/features/service/pages/ServiceFormPage";
import { AppointmentListPage } from "@/features/report/pages/AppointmentListPage"; // 👈 import nuevo

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

          {/* Módulo Clientes */}
          <Route path="/clients" element={<ClientListPage />} />
          <Route path="/clients/new" element={<ClientFormPage />} />
          <Route path="/clients/:id/edit" element={<ClientFormPage />} />

          {/* Módulo Usuarios */}
          <Route path="/users" element={<UserListPage />} />
          <Route path="/users/new" element={<UserFormPage />} />
          <Route path="/users/:id/edit" element={<UserFormPage />} />

          {/* Módulo Servicios */}
          <Route path="/services" element={<ServiceListPage />} />
          <Route path="/services/new" element={<ServiceFormPage />} />
          <Route path="/services/:id/edit" element={<ServiceFormPage />} />

          {/* Módulo Citas */}
          <Route path="/appointments" element={<AppointmentCalendarPage />} />

          {/* Módulo Reportes */}
          <Route path="/reportes" element={<AppointmentListPage />} /> {/* 👈 nueva ruta */}
        </Route>

        {/* Ruta para página no encontrada */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

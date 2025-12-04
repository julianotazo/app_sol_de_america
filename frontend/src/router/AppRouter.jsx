import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

import Layout from '../components/Layout';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

// Páginas del sistema
import DashboardPage from '../pages/dashboard/DashboardPage';
import SociosPage from '../pages/socios/SociosPage';
import DetalleSocioPage from '../pages/socios/DetalleSocioPage';
import HistorialPagosPage from '../pages/socios/HistorialPagosPage';
import HistorialAsistenciasPage from '../pages/socios/HistorialAsistenciasPage';
import SocioFormPage from '../pages/socios/SocioFormPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/" element={<LoginPage />} />

        {/* REGISTER: solo admin logueado */}
        <Route
          path="/register"
          element={
            <PrivateRoute>
              <AdminRoute>
                <RegisterPage />
              </AdminRoute>
            </PrivateRoute>
          }
        />

        {/* RUTAS PRIVADAS (CON LAYOUT) */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          {/* Todas estas usan Layout + están protegidas */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="socios" element={<SociosPage />} />
          <Route path="socios/:id" element={<DetalleSocioPage />} />
          <Route path="socios/:id/pagos" element={<HistorialPagosPage />} />
          <Route
            path="socios/:id/asistencias"
            element={<HistorialAsistenciasPage />}
          />
          <Route path="socios/crear" element={<SocioFormPage />} />
          <Route path="socios/:id/editar" element={<SocioFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

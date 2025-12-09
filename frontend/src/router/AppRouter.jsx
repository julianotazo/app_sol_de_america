import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

import Layout from '../components/Layout';
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';
import HomeRedirect from './HomeRedirect';

// Páginas del sistema
import DashboardPage from '../pages/dashboard/DashboardPage';
import SocioWelcomePage from '../pages/dashboard/SocioWelcomePage';
import SociosPage from '../pages/socios/SociosPage';
import DetalleSocioPage from '../pages/socios/DetalleSocioPage';
import HistorialPagosPage from '../pages/socios/HistorialPagosPage';
import HistorialAsistenciasPage from '../pages/socios/HistorialAsistenciasPage';
import SocioFormPage from '../pages/socios/SocioFormPage';
import ProfilePage from '../pages/profile/ProfilePage';
import CredentialPage from '../pages/profile/CredentialPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recuperar" element={<ForgotPasswordPage />} />

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
          <Route index element={<HomeRedirect />} />
          <Route
            path="dashboard"
            element={
              <AdminRoute>
                <DashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="socios"
            element={
              <AdminRoute>
                <SociosPage />
              </AdminRoute>
            }
          />
          <Route
            path="socios/:id"
            element={
              <AdminRoute>
                <DetalleSocioPage />
              </AdminRoute>
            }
          />
          <Route
            path="socios/:id/pagos"
            element={
              <AdminRoute>
                <HistorialPagosPage />
              </AdminRoute>
            }
          />
          <Route
            path="socios/:id/asistencias"
            element={
              <AdminRoute>
                <HistorialAsistenciasPage />
              </AdminRoute>
            }
          />
          <Route
            path="socios/crear"
            element={
              <AdminRoute>
                <SocioFormPage />
              </AdminRoute>
            }
          />
          <Route
            path="socios/editar/:id"
            element={
              <AdminRoute>
                <SocioFormPage />
              </AdminRoute>
            }
          />
          <Route path="bienvenida" element={<SocioWelcomePage />} />
          <Route path="perfil" element={<ProfilePage />} />
          <Route path="perfil/credencial" element={<CredentialPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

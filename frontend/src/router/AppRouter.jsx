import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

import DashboardPage from '../pages/dashboard/DashboardPage';

import PrivateRoute from './PrivateRoute';
import Layout from '../components/Layout';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas privadas con Layout */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          {/* Todas estas páginas usan el Layout */}
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Podés seguir agregando más acá */}
          {/* <Route path="sedes" element={<SedesPage />} /> */}
          {/* <Route path="personal" element={<PersonalPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

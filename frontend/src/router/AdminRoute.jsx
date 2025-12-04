import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Helper para decodificar un JWT sin librerías externas
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error decodificando token JWT:', e);
    return null;
  }
}

export default function AdminRoute({ children }) {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    // Sin token ni siquiera debería llegar acá
    return <Navigate to="/" replace />;
  }

  const payload = parseJwt(token);

  const isAdmin =
    payload?.roleId === 1 ||
    payload?.role === 'Admin' ||
    payload?.role === 'ADMIN';

  if (!isAdmin) {
    // Si está logueado pero no es admin, lo mandamos al dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // Es admin → puede ver el contenido
  return children;
}

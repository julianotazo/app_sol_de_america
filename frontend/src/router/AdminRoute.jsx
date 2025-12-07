import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { isAdmin } from '../utils/roles';

export default function AdminRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  if (!token) {
    // Sin token ni siquiera debería llegar acá
    return <Navigate to="/login" replace />;
  }

  const userIsAdmin = isAdmin(user, token);

  if (!userIsAdmin) {
    // Si está logueado pero no es admin, lo mandamos al inicio según su rol
    return <Navigate to="/bienvenida" replace />;
  }

  // Es admin → puede ver el contenido
  return children;
}

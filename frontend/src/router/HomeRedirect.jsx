import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { resolveRole } from '../utils/roles';

export default function HomeRedirect() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const role = resolveRole(user, token);

  if (!token) return <Navigate to="/login" replace />;
  if (!role) return <Navigate to="/bienvenida" replace />;

  return role === 'admin' ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/bienvenida" replace />
  );
}

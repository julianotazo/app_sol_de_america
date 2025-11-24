import AuthForm from '../components/AuthForm';
import api from '../libs/api';
import { useAuth } from '../store/auth.store';

export default function Login() {
  const setToken = useAuth((s) => s.setToken);

  const onSubmit = async ({ email, password }) => {
    const { data } = await api.post('/auth/login', { email, password });
    // backend devuelve { message, token }
    setToken(data.token);
  };

  return (
    <AuthForm
      title="Iniciar sesión"
      onSubmit={onSubmit}
      submitText="Ingresar"
    />
  );
}

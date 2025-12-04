import { useState } from 'react';
import { loginRequest, meRequest } from '../../services/auth';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = useAuthStore((state) => state.login);
  const setUser = useAuthStore((state) => state.setUser);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { token } = await loginRequest(email, password);
      login(token);

      const me = await meRequest();
      setUser(me);

      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* IZQUIERDA — LOGO / MARCA */}
      <div
        className="hidden md:flex flex-col items-center justify-center p-10 sticky top-0 h-screen"
        style={{
          background: 'linear-gradient(135deg, #004AAD 0%, #0B63D1 100%)'
        }}
      >
        <img
          src="../public/sol_de_america.png"
          alt="Club Sol de América"
          className="w-48 h-auto drop-shadow-2xl fade-slide-delay"
        />

        <h1 className="text-white text-3xl font-bold mt-6 tracking-wide text-center fade-slide-delay">
          Club Sol de América
        </h1>

        <p className="text-white/80 mt-2 text-center max-w-sm fade-slide-delay">
          Bienvenido nuevamente • Iniciá sesión para continuar
        </p>
      </div>

      {/* DERECHA — FORMULARIO */}
      <div
        className="flex justify-center items-start bg-[#eef3ff] p-6 h-screen overflow-y-auto pt-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5), rgba(238,243,255,1))'
        }}
      >
        <form
          onSubmit={handleLogin}
          className="bg-white p-10 rounded-2xl shadow-[0_4px_20px_rgba(0,74,173,0.15)] w-full max-w-md fade-slide"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-sol-blue">
            Iniciar sesión
          </h2>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          {/* Email */}
          <label className="block mb-4 w-full">
            <span className="text-gray-700 font-medium">Correo</span>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="
                  pl-10 p-2 w-full border rounded-lg 
                  input-anim 
                  focus:ring-2 focus:ring-sol-blue/40 
                  focus:outline-none 
                  transition-all duration-200
                "
              />
            </div>
          </label>

          {/* Password */}
          <label className="block mb-6 w-full">
            <span className="text-gray-700 font-medium">Contraseña</span>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="
                  pl-10 p-2 w-full border rounded-lg 
                  input-anim 
                  focus:ring-2 focus:ring-sol-blue/40 
                  focus:outline-none 
                  transition-all duration-200
                "
              />
            </div>
          </label>

          {/* Botón */}
          <button
            type="submit"
            className="
              w-full py-3 rounded-xl font-semibold text-white 
              bg-sol-blue hover:bg-blue-800 
              transition-all duration-300 
              shadow-md hover:shadow-xl 
              active:scale-[0.97]
            "
          >
            Entrar
          </button>

          {/* Link al registro */}
          <p className="text-center text-gray-600 mt-4 text-sm">
            ¿No tenés cuenta?{' '}
            <a
              href="/register"
              className="text-sol-blue font-semibold hover:underline"
            >
              Registrate aquí
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

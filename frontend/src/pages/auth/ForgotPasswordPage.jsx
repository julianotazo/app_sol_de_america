import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Correo de recuperación enviado');
    setEmail('');
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
          Recuperá el acceso a tu cuenta con tu correo electrónico
        </p>
      </div>

      {/* DERECHA — FORMULARIO */}
      <div
        className="flex justify-center items-center bg-[#eef3ff] p-6 h-screen overflow-y-auto"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5), rgba(238,243,255,1))'
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white p-10 rounded-2xl shadow-[0_4px_20px_rgba(0,74,173,0.15)] w-full max-w-md fade-slide"
        >
          <h2 className="text-2xl font-bold mb-2 text-center text-sol-blue">
            ¿Olvidaste tu contraseña?
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Ingresá tu correo y te enviaremos las instrucciones para
            recuperarla.
          </p>

          {/* Email */}
          <label className="block mb-6 w-full">
            <span className="text-gray-700 font-medium">
              Correo electrónico
            </span>
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
            Enviar correo de recuperación
          </button>

          <div className="flex items-center justify-center mt-6 text-sm text-gray-600">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <Link
              to="/login"
              className="text-sol-blue font-semibold hover:underline"
            >
              Volver a iniciar sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
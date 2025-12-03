import { useState } from "react";
import { loginRequest, meRequest } from "../../services/auth";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = useAuthStore((state) => state.login);
  const setUser = useAuthStore((state) => state.setUser);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { token } = await loginRequest(email, password);

      login(token);

      // Pedimos los datos del usuario
      const me = await meRequest();
      setUser(me);

      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-200">
      <form className="bg-white p-6 shadow-md rounded-md" onSubmit={handleLogin}>

        <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input
          className="border p-2 w-full mb-3"
          placeholder="Correo"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Contraseña"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}

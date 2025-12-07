import { useMemo } from 'react';
import { useAuthStore } from '../../store/authStore';

export default function SocioWelcomePage() {
  const user = useAuthStore((state) => state.user);

  const name = useMemo(() => {
    if (!user) return 'Bienvenido';
    const fullName = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();
    return fullName || user.name || 'Bienvenido';
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6 border-l-4 border-sol-blue">
        <h2 className="text-2xl font-bold text-sol-blue">Hola, {name}!</h2>
        <p className="text-gray-600 mt-2">
          Gracias por ser parte del Club Sol de América. Desde aquí podés
          consultar tu perfil y mantenerte al día con tus datos personales.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
          <h3 className="text-lg font-semibold text-sol-blue mb-2">
            Tu espacio personal
          </h3>
          <p className="text-gray-600">
            En la sección `Perfil Personal` vas a encontrar tus datos
            registrados en el club. Revisalos y asegurate de que estén siempre
            actualizados.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
          <h3 className="text-lg font-semibold text-sol-blue mb-2">
            Novedades del club
          </h3>
          <p className="text-gray-600">
            Seguiremos sumando más funcionalidades para que puedas acceder a
            información relevante sobre tu membresía y las actividades del club.
          </p>
        </div>
      </div>
    </div>
  );
}

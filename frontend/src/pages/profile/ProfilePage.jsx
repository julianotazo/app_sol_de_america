import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { meRequest } from '../../services/auth';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const me = await meRequest();
        setUser(me.user ?? me);
      } catch {
        logout();
      }
    };

    if (!user) {
      loadProfile();
    }
  }, [user, setUser, logout]);

  const fullName = user
    ? `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()
    : 'Usuario';

  const details = [
    { label: 'Nombre', value: fullName },
    { label: 'DNI', value: user?.dni },
    { label: 'Correo', value: user?.email },
    { label: 'Teléfono', value: user?.phone },
    { label: 'Dirección', value: user?.address },
    {
      label: 'Fecha de nacimiento',
      value: user?.birth_date
        ? new Date(user.birth_date).toLocaleDateString()
        : null
    },
    { label: 'Rol', value: user?.role },
    { label: 'Sede', value: user?.branch },
    {
      label: 'Fecha de ingreso',
      value: user?.join_date
        ? new Date(user.join_date).toLocaleDateString()
        : null
    },
    {
      label: 'Activo',
      value: user?.active != null ? (user.active ? 'Sí' : 'No') : null
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-2xl font-semibold text-sol-blue mb-4">
          Perfil del usuario
        </h2>
        <p className="text-gray-600">
          Revisa y consulta tus datos personales registrados.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {details.map(({ label, value }) => (
          <div
            key={label}
            className="bg-white rounded-lg shadow p-4 border border-gray-100"
          >
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-lg font-semibold text-gray-800">
              {value || '—'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

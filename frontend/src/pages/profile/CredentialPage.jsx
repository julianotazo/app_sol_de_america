import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { meRequest } from '../../services/auth';
import { useAuthStore } from '../../store/authStore';

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString() : '—';

const formatExpirationDate = (value) => {
  if (!value) return '—';
  const start = new Date(value);
  if (Number.isNaN(start.getTime())) return '—';

  const expiration = new Date(start);
  expiration.setFullYear(expiration.getFullYear() + 4);

  return expiration.toLocaleDateString();
};

export default function CredentialPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const ensureProfile = async () => {
      try {
        const me = await meRequest();
        setUser(me.user ?? me);
      } catch {
        logout();
      }
    };

    if (!user) {
      ensureProfile();
    }
  }, [logout, setUser, user]);

  const profileAvatar = '/default-avatar.png';
  const clubLogo = '/sol_de_america.png';

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-sol-blue">
          Credencial de Socio
        </h2>
        <button
          type="button"
          onClick={() => navigate('/perfil')}
          className="px-4 py-2 border border-sol-blue text-sol-blue rounded-lg hover:bg-blue-50"
        >
          Volver al perfil
        </button>
      </div>

      <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
        <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-sol-blue to-blue-500" />

        <div className="flex flex-col md:flex-row">
          {/* Lado izquierdo: avatar + ROL */}
          <div className="md:w-1/3 bg-gradient-to-b from-sol-blue to-blue-700 text-white p-6 flex flex-col justify-between items-center">
            <div className="flex-1 flex items-center justify-center">
              <div className="bg-white rounded-2xl p-4 shadow-lg">
                <img
                  src={profileAvatar}
                  alt="Foto del socio"
                  className="w-40 h-40 object-contain"
                />
              </div>
            </div>

            <div className="mt-4 w-full">
              <p className="text-center text-xl font-bold tracking-wide bg-blue-900/40 rounded-xl py-2 border border-blue-200 uppercase">
                {user?.role || 'SOCIO'}
              </p>
            </div>
          </div>

          {/* Lado derecho: datos del socio */}
          <div className="md:w-2/3 p-6 bg-white text-gray-800 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl md:text-3xl font-bold text-sol-blue tracking-wide">
                CLUB SOL DE AMÉRICA
              </h3>
              <img
                src={clubLogo}
                alt="Logo del club"
                className="w-16 h-16 md:w-28 md:h-28 object-contain drop-shadow"
              />
            </div>

            <dl className="space-y-3">
              <div className="flex items-center justify-between border-b border-blue-50 pb-2">
                <dt className="text-sm text-gray-600">Apellido</dt>
                <dd className="text-lg font-semibold text-sol-blue">
                  {user?.last_name || '—'}
                </dd>
              </div>

              <div className="flex items-center justify-between border-b border-blue-50 pb-2">
                <dt className="text-sm text-gray-600">Nombre</dt>
                <dd className="text-lg font-semibold text-sol-blue">
                  {user?.first_name || '—'}
                </dd>
              </div>

              <div className="flex items-center justify-between border-b border-blue-50 pb-2">
                <dt className="text-sm text-gray-600">DNI</dt>
                <dd className="text-lg font-semibold text-sol-blue">
                  {user?.dni || '—'}
                </dd>
              </div>

              <div className="flex items-center justify-between border-b border-blue-50 pb-2">
                <dt className="text-sm text-gray-600">Válido desde</dt>
                <dd className="text-lg font-semibold text-sol-blue">
                  {formatDate(user?.join_date)}
                </dd>
              </div>

              <div className="flex items-center justify-between border-b border-blue-50 pb-2">
                <dt className="text-sm text-gray-600">Válido hasta</dt>
                <dd className="text-lg font-semibold text-sol-blue">
                  {formatExpirationDate(user?.join_date)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

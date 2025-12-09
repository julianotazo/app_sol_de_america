import { useMemo } from 'react';
import { useAuthStore } from '../../store/authStore';
import {
  User,
  IdCard,
  BadgeCheck,
  PauseCircle,
  Ban,
  Info,
  ArrowRightCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const getEstadoConfig = (estado) => {
  const normalized = estado?.toLowerCase();

  switch (normalized) {
    case 'activo':
      return {
        label: 'Activo',
        className: 'bg-green-100 text-green-700 border-green-300',
        Icon: BadgeCheck
      };
    case 'inactivo':
      return {
        label: 'Inactivo',
        className: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        Icon: PauseCircle
      };
    case 'suspendido':
      return {
        label: 'Suspendido',
        className: 'bg-red-100 text-red-700 border-red-300',
        Icon: Ban
      };
    default:
      return {
        label: estado ?? 'Sin estado',
        className: 'bg-gray-100 text-gray-600 border-gray-300',
        Icon: Info
      };
  }
};

export default function SocioWelcomePage() {
  const user = useAuthStore((state) => state.user);

  const name = useMemo(() => {
    if (!user) return 'Bienvenido';
    const fullName = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim();
    return fullName || 'Bienvenido';
  }, [user]);

  const memberStateLabel = useMemo(() => {
    if (!user) return null;
    if (user.member_state_label) return user.member_state_label;
    if (user.estado) return user.estado;
    if (user.active !== undefined) return user.active ? 'Activo' : 'Inactivo';
    return null;
  }, [user]);

  const estadoConfig = useMemo(
    () => getEstadoConfig(memberStateLabel),
    [memberStateLabel]
  );

  return (
    <div className="space-y-6">
      {/* SALUDO PRINCIPAL */}
      <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-sol-blue">
        <h2 className="text-3xl font-bold text-sol-blue">Hola, {name}!</h2>
        <p className="text-gray-600 mt-2">
          Bienvenido a tu espacio personal dentro del Club Sol de América.
        </p>

        {/* BADGE DE ESTADO */}
        {estadoConfig.label && (
          <div
            className={`inline-flex items-center mt-4 px-3 py-1 rounded-full text-sm font-semibold border ${estadoConfig.className}`}
          >
            <estadoConfig.Icon className="w-4 h-4 mr-1" />
            {estadoConfig.label}
          </div>
        )}
      </div>

      {/* ACCESOS RÁPIDOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/perfil"
          className="bg-white rounded-xl shadow p-5 border border-gray-100 hover:shadow-md transition flex items-start gap-4"
        >
          <User className="w-10 h-10 text-sol-blue" />
          <div>
            <h3 className="text-lg font-semibold text-sol-blue">Mi Perfil</h3>
            <p className="text-gray-600 text-sm">
              Consultá tus datos personales y mantenelos actualizados.
            </p>
          </div>
        </Link>

        <Link
          to="/perfil/credencial"
          className="bg-white rounded-xl shadow p-5 border border-gray-100 hover:shadow-md transition flex items-start gap-4"
        >
          <IdCard className="w-10 h-10 text-sol-blue" />
          <div>
            <h3 className="text-lg font-semibold text-sol-blue">Mi Credencial</h3>
            <p className="text-gray-600 text-sm">
              Visualizá tu credencial digital como socio del club.
            </p>
          </div>
        </Link>
      </div>

      {/* NOVEDADES */}
      <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-sol-blue mb-2">Novedades del club</h3>
        <p className="text-gray-600">
          Estamos trabajando para sumar nuevas funcionalidades pensadas para vos.  
          Muy pronto vas a poder ver actividades, eventos y más beneficios exclusivos.
        </p>

        <div className="flex items-center gap-2 text-sol-blue mt-3 font-medium">
          Próximamente nuevas secciones...
          <ArrowRightCircle className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

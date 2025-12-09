import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { meRequest, updateProfileRequest } from '../../services/auth';
import {
  User,
  IdCard,
  Phone,
  MapPin,
  Mail,
  Calendar,
  Building,
  Pencil,
  XCircle
} from 'lucide-react';

// Input reutilizable con icono (igual estilo que CrearSocio)
const InputWithIcon = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  icon: Icon,
  disabled = false
}) => (
  <label className="block w-full">
    <span className="text-gray-700 font-medium">{label}</span>
    <div className="relative mt-1">
      {Icon && (
        <Icon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value ?? ''}
        onChange={onChange}
        disabled={disabled}
        readOnly={disabled}
        className={`
            ${Icon ? 'pl-10' : 'pl-3'}
            p-2 w-full border rounded-lg
            focus:outline-none
            transition-all duration-200
            ${disabled ? 'bg-gray-50 text-gray-700 cursor-default' : 'bg-white focus:ring-2 focus:ring-sol-blue/40'}
            border-gray-300
          `}
      />
    </div>
  </label>
);

const formatDateForInput = (value) =>
  value ? new Date(value).toISOString().split('T')[0] : '';

const formatDateForDisplay = (value) =>
  value ? new Date(value).toLocaleDateString() : '';

const profileAvatar = '/default-avatar.png';

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    birth_date: '',
    dni: ''
  });
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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

  const fullName = useMemo(
    () =>
      user
        ? `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()
        : 'Usuario',
    [user]
  );

  const syncFormWithUser = useCallback(() => {
    if (!user) return;

    setFormData({
      first_name: user.first_name ?? '',
      last_name: user.last_name ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
      address: user.address ?? '',
      birth_date: formatDateForInput(user.birth_date),
      dni: user.dni ?? ''
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleEditing = () => {
    if (!user) return;

    setStatusMessage('');
    setErrorMessage('');

    setIsEditing((prev) => {
      const next = !prev;
      if (next) {
        syncFormWithUser();
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setStatusMessage('');

    const sanitizedData = {};
    Object.entries(formData).forEach(([key, value]) => {
      const cleanedValue = typeof value === 'string' ? value.trim() : value;
      if (
        cleanedValue !== '' &&
        cleanedValue !== null &&
        cleanedValue !== undefined
      ) {
        sanitizedData[key] = cleanedValue;
      }
    });

    if (Object.keys(sanitizedData).length === 0) {
      setErrorMessage('No hay datos para actualizar.');
      return;
    }

    try {
      const response = await updateProfileRequest(sanitizedData);
      const updatedUser = response.user ?? response;
      setUser(updatedUser);
      setStatusMessage('Perfil actualizado correctamente.');
      setIsEditing(false);
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        'No se pudo actualizar el perfil. Inténtalo más tarde.';
      setErrorMessage(message);
    }
  };

  const getEstadoStyles = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'activo':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'inactivo':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'suspendido':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  const memberStateLabel = useMemo(() => {
    if (!user) return null;
    if (user.member_state_label) return user.member_state_label;
    if (user.estado) return user.estado;
    if (user.active !== undefined) return user.active ? 'Activo' : 'Inactivo';
    return null;
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Título */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-sol-blue">Perfil del usuario</h1>
        <p className="text-gray-600 mt-1">
          Revisa tu información personal y gestiona tus datos de socio.
        </p>
      </div>

      {/* Cabecera */}
      <div className="bg-white rounded-2xl shadow-lg px-6 py-5 flex flex-col gap-6 md:flex-row md:items-center">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-24 h-24 rounded-full border-4 border-sol-blue/10 bg-blue-50 flex items-center justify-center shadow-inner">
            <img
              src={profileAvatar}
              alt="Avatar del usuario"
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm uppercase tracking-wide text-gray-500">
              Usuario
            </p>
            <p className="text-2xl font-semibold text-gray-900">{fullName}</p>
            <p className="text-sm text-gray-600 mt-1">
              {user?.email || 'Sin correo registrado'}
            </p>
            {/* Estado del socio */}
            {memberStateLabel && (
              <p
                className={`inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-semibold border ${getEstadoStyles(
                  memberStateLabel
                )}`}
              >
                {memberStateLabel}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => navigate('/perfil/credencial')}
            className="w-full sm:w-auto px-4 py-2 bg-white border border-sol-blue text-sol-blue font-semibold rounded-lg shadow-sm hover:bg-blue-50 transition"
          >
            Ver credencial de socio
          </button>
          <button
            type="button"
            onClick={handleToggleEditing}
            className="w-full sm:w-auto px-4 py-2 bg-sol-blue text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition flex items-center justify-center"
          >
            {!isEditing && <Pencil className="w-5 h-5" />}
            {isEditing && <XCircle className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {statusMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* ======================= VISTA SOLO LECTURA ======================= */}
      {!isEditing && (
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Información del socio
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <InputWithIcon
              label="Nombre"
              id="view_first_name"
              name="view_first_name"
              value={user?.first_name}
              icon={User}
              disabled
            />
            <InputWithIcon
              label="Apellido"
              id="view_last_name"
              name="view_last_name"
              value={user?.last_name}
              icon={User}
              disabled
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <InputWithIcon
              label="DNI"
              id="view_dni"
              name="view_dni"
              value={user?.dni}
              icon={IdCard}
              disabled
            />
            <InputWithIcon
              label="Teléfono"
              id="view_phone"
              name="view_phone"
              value={user?.phone}
              icon={Phone}
              disabled
            />
          </div>

          <InputWithIcon
            label="Correo electrónico"
            id="view_email"
            name="view_email"
            value={user?.email}
            icon={Mail}
            disabled
          />

          <InputWithIcon
            label="Dirección"
            id="view_address"
            name="view_address"
            value={user?.address}
            icon={MapPin}
            disabled
          />

          <div className="grid md:grid-cols-2 gap-4">
            <InputWithIcon
              label="Fecha de nacimiento"
              id="view_birth_date"
              name="view_birth_date"
              value={formatDateForDisplay(user?.birth_date)}
              icon={Calendar}
              disabled
            />
            <InputWithIcon
              label="Fecha de ingreso"
              id="view_join_date"
              name="view_join_date"
              value={formatDateForDisplay(user?.join_date)}
              icon={Calendar}
              disabled
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <InputWithIcon
              label="Sede"
              id="view_branch"
              name="view_branch"
              value={user?.branch}
              icon={Building}
              disabled
            />
          </div>
        </div>
      )}

      {/* ======================= MODO EDICIÓN ======================= */}
      {isEditing && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6 space-y-4"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Editar información
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <InputWithIcon
              label="Nombre"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              icon={User}
            />
            <InputWithIcon
              label="Apellido"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              icon={User}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <InputWithIcon
              label="DNI"
              id="dni"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              icon={IdCard}
            />
            <InputWithIcon
              label="Teléfono"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              icon={Phone}
            />
          </div>

          <InputWithIcon
            label="Correo electrónico"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            icon={Mail}
          />

          <InputWithIcon
            label="Dirección"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            icon={MapPin}
          />

          <InputWithIcon
            label="Fecha de nacimiento"
            id="birth_date"
            name="birth_date"
            type="date"
            value={formData.birth_date}
            onChange={handleChange}
            icon={Calendar}
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Cancelar edición
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-sol-blue text-white font-semibold rounded-lg shadow hover:bg-blue-700 flex items-center gap-2"
            >
              <Pencil className="w-5 h-5" />
              Guardar cambios
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

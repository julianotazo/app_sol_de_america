import { useState } from 'react';
import { registerRequest } from '../../services/auth';
import { getBranches, getRoles } from '../../services/catalogsService';
import { toast } from 'sonner';
import {
  Mail,
  Lock,
  User,
  IdCard,
  Calendar,
  Phone,
  MapPin,
  Building,
  Shield
} from 'lucide-react';
import { useEffect } from 'react';

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    dni: '',
    first_name: '',
    last_name: '',
    birth_date: '',
    phone: '',
    address: '',
    branch_id: '',
    role_id: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loadingCatalogs, setLoadingCatalogs] = useState(false);

  const validate = () => {
    const err = {};

    if (!form.email) err.email = 'El email es obligatorio.';
    if (!/\S+@\S+\.\S+/.test(form.email))
      err.email = 'Ingresá un email válido.';

    if (!form.password) err.password = 'La contraseña es obligatoria.';
    if (form.password.length < 6)
      err.password = 'Debe tener al menos 6 caracteres.';

    if (!form.dni) err.dni = 'El DNI es obligatorio.';
    if (!/^\d+$/.test(form.dni)) err.dni = 'El DNI solo debe tener números.';

    if (!form.first_name) err.first_name = 'El nombre es obligatorio.';
    if (!form.last_name) err.last_name = 'El apellido es obligatorio.';

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Revisá los datos ingresados.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        email: form.email,
        password: form.password,
        dni: form.dni,
        first_name: form.first_name,
        last_name: form.last_name,
        birth_date: form.birth_date || undefined,
        phone: form.phone || undefined,
        address: form.address || undefined
      };

      if (form.branch_id) payload.branch_id = Number(form.branch_id);
      if (form.role_id) payload.role_id = Number(form.role_id);

      await registerRequest(payload);

      toast.success('Registro exitoso 🎉 Ya podés iniciar sesión.');

      setForm({
        email: '',
        password: '',
        dni: '',
        first_name: '',
        last_name: '',
        birth_date: '',
        phone: '',
        address: '',
        branch_id: '',
        role_id: ''
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.error ||
          'Error inesperado durante el registro 😢'
      );
    } finally {
      setLoading(false);
    }
  };

  // Carga de sedes y roles al montar el componente
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        setLoadingCatalogs(true);
        const [branchesData, rolesData] = await Promise.all([
          getBranches(),
          getRoles()
        ]);

        setBranches(branchesData);
        setRoles(rolesData);
      } catch (error) {
        console.error('Error cargando catálogos:', error);
        setErrors(
          'No se pudieron cargar las sedes y roles. Intenta recargar la página.'
        );
      } finally {
        setLoadingCatalogs(false);
      }
    };

    fetchCatalogs();
  }, []);

  const renderInput = ({
    label,
    name,
    type = 'text',
    icon: Icon,
    required = false
  }) => {
    // handler especial para DNI
    const handleSpecialChange = (e) => {
      let value = e.target.value;

      if (name === 'dni') {
        // dejar solo números
        value = value.replace(/\D/g, '');
      }

      setForm((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: null }));
    };

    return (
      <label className="block mb-3 w-full">
        <span className="text-gray-700 font-medium">{label}</span>

        <div className="relative mt-1">
          {Icon && (
            <Icon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          )}

          <input
            type={type}
            name={name}
            value={form[name]}
            onChange={handleSpecialChange} // <-- usa el handler nuevo
            required={required}
            autoComplete="off"
            inputMode={name === 'dni' ? 'numeric' : undefined} // teclado numérico en celular
            className={`
            ${Icon ? 'pl-10' : 'pl-3'} 
            p-2 w-full border rounded-lg 
            focus:ring-2 focus:ring-sol-blue/40 
            focus:outline-none
            transition-all duration-200
            ${errors[name] ? 'border-red-500' : 'border-gray-300'}
          `}
          />
        </div>

        {errors[name] && (
          <p className="text-red-600 text-sm mt-1">{errors[name]}</p>
        )}
      </label>
    );
  };

  const renderInputSelect = ({ label, name, icon: Icon, options }) => (
    <label className="block mb-3 w-full">
      <span className="text-gray-700 font-medium">{label}</span>

      <div className="relative mt-1">
        {Icon && (
          <Icon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        )}

        <select
          name={name}
          value={form[name]}
          onChange={handleChange}
          disabled={loadingCatalogs}
          className={`
          ${Icon ? 'pl-10' : 'pl-3'}
          p-2 w-full border rounded-lg bg-white
          focus:ring-2 focus:ring-sol-blue/40
          focus:outline-none
          transition-all duration-200
          ${errors[name] ? 'border-red-500' : 'border-gray-300'}
        `}
        >
          <option value="">Seleccionar opción...</option>

          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
      </div>

      {errors[name] && (
        <p className="text-red-600 text-sm mt-1">{errors[name]}</p>
      )}
    </label>
  );

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* IZQUIERDA — LOGO FIJO */}
      <div
        className="hidden md:flex flex-col items-center justify-center p-10 sticky top-0 h-screen"
        style={{
          background: 'linear-gradient(135deg, #004AAD 0%, #0B63D1 100%)'
        }}
      >
        <img
          src="../public/sol_de_america.png"
          alt="Club Sol de América"
          className="w-48 h-auto drop-shadow-2xl"
        />

        <h1 className="text-white text-3xl font-bold mt-6 tracking-wide text-center">
          Club Sol de América
        </h1>

        <p className="text-white/80 mt-2 text-center max-w-sm">
          Sistema institucional • Creá tu cuenta para continuar
        </p>
      </div>

      {/* DERECHA — FORMULARIO */}
      <div className="flex justify-center items-start bg-[#eef3ff] p-6 h-screen overflow-y-auto pt-10">
        <form
          onSubmit={onSubmit}
          className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,74,173,0.15)] w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-sol-blue">
            Crear una cuenta
          </h2>

          {renderInput({
            label: 'Email',
            name: 'email',
            type: 'email',
            icon: Mail,
            required: true
          })}

          {renderInput({
            label: 'Contraseña',
            name: 'password',
            type: 'password',
            icon: Lock,
            required: true
          })}

          {renderInput({
            label: 'DNI',
            name: 'dni',
            icon: IdCard,
            required: true
          })}

          {renderInput({
            label: 'Nombre',
            name: 'first_name',
            icon: User,
            required: true
          })}

          {renderInput({
            label: 'Apellido',
            name: 'last_name',
            icon: User,
            required: true
          })}

          {renderInput({
            label: 'Fecha de nacimiento',
            name: 'birth_date',
            type: 'date',
            icon: Calendar
          })}

          {renderInput({
            label: 'Teléfono',
            name: 'phone',
            icon: Phone
          })}

          {renderInput({
            label: 'Dirección',
            name: 'address',
            icon: MapPin
          })}

          {renderInputSelect({
            label: 'Sede del club (opcional)',
            name: 'branch_id',
            icon: Building,
            options: branches
          })}

          {renderInputSelect({
            label: 'Rol de usuario (opcional)',
            name: 'role_id',
            icon: Shield,
            options: roles
          })}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 mt-4 rounded-xl font-semibold text-white 
              bg-sol-blue hover:bg-blue-800 
              transition-all duration-300 
              shadow-md hover:shadow-xl 
              active:scale-[0.97]
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>

          <p className="text-center text-gray-600 mt-4 text-sm">
            ¿Ya tenés cuenta?{' '}
            <a href="/" className="text-sol-blue font-semibold hover:underline">
              Iniciar sesión
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

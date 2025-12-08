import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  User,
  IdCard,
  Phone,
  MapPin,
  BadgeCheck,
  Mail,
  Calendar,
  Building
} from 'lucide-react';

import {
  crearSocio,
  editarSocio,
  obtenerSocio
} from '../../services/sociosService';
import { getBranches } from '../../services/catalogsService';

export default function SocioFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const editando = Boolean(id);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errors, setErrors] = useState({});
  const [branches, setBranches] = useState([]);

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    dni: '',
    email: '',
    birth_date: '',
    telefono: '',
    direccion: '',
    estado: 'activo',
    branch_id: '',
    role_id: ''
  });

  // ============================================================
  // CARGAR SOCIO SI EDITAMOS
  // ============================================================
  useEffect(() => {
    async function cargar() {
      try {
        const [branchesData, socioData] = await Promise.all([
          getBranches(),
          editando ? obtenerSocio(id) : Promise.resolve(null)
        ]);

        setBranches(branchesData);

        if (editando && socioData) {
          setForm({
            first_name: socioData.first_name,
            last_name: socioData.last_name,
            dni: socioData.dni,
            email: socioData.email || '',
            birth_date: socioData.birth_date || '',
            telefono: socioData.telefono,
            direccion: socioData.direccion,
            estado: socioData.estado,
            branch_id: socioData.branch_id || '',
            role_id: socioData.role_id
          });
        }
      } catch {
        toast.error('Error cargando socio');
      } finally {
        setLoading(false);
      }
    }

    cargar();
  }, [id, editando]);

  // ============================================================
  // VALIDACIONES
  // ============================================================
  const validate = () => {
    const newErrors = {};

    if (!form.first_name.trim())
      newErrors.first_name = 'El nombre es obligatorio.';
    if (!form.last_name.trim())
      newErrors.last_name = 'El apellido es obligatorio.';
    if (!form.dni.trim()) newErrors.dni = 'El DNI es obligatorio.';
    if (!/^\d+$/.test(form.dni))
      newErrors.dni = 'El DNI debe contener solo números.';
    if (!form.email.trim()) newErrors.email = 'El email es obligatorio.';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'El email no es válido.';
    if (!form.branch_id) newErrors.branch_id = 'La sede es obligatoria.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const sanitizedValue = name === 'dni' ? value.replace(/\D/g, '') : value;

    setForm({ ...form, [name]: sanitizedValue });
    setErrors({ ...errors, [name]: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Revisá los campos.');
      return;
    }

    try {
      setGuardando(true);

      if (editando) {
        await editarSocio(id, form);
        toast.success('Socio actualizado.');
      } else {
        await crearSocio(form);
        toast.success('Socio creado.');
      }

      navigate('/socios');
    } catch (err) {
      console.error(err);
      const serverError =
        err?.response?.data?.error || err?.response?.data?.message;

      toast.error(serverError || 'No se pudo guardar.');
    } finally {
      setGuardando(false);
    }
  };

  if (loading) return <p>Cargando...</p>;

  const renderInput = ({ label, name, icon: Icon, type = 'text' }) => (
    <label className="block w-full">
      <span className="text-gray-700 font-medium">{label}</span>

      <div className="relative mt-1">
        {Icon && (
          <Icon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        )}

        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          className={`
            ${Icon ? 'pl-10' : 'pl-3'}
            p-2 w-full border rounded-lg bg-white
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

  const renderSelect = ({ label, name, icon: Icon, options }) => (
    <label className="block w-full">
      <span className="text-gray-700 font-medium">{label}</span>

      <div className="relative mt-1">
        {Icon && (
          <Icon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        )}

        <select
          name={name}
          value={form[name]}
          onChange={handleChange}
          className={`
            ${Icon ? 'pl-10' : 'pl-3'}
            p-2 w-full border rounded-lg bg-white
            focus:ring-2 focus:ring-sol-blue/40
            focus:outline-none
            transition-all duration-200
            ${errors[name] ? 'border-red-500' : 'border-gray-300'}
          `}
        >
          <option value="">Seleccioná una opción</option>
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-sol-blue">
        {editando ? 'Editar socio' : 'Crear socio'}
      </h2>

      <form
        className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,74,173,0.12)] space-y-4"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput({
            label: 'Nombre',
            name: 'first_name',
            icon: User
          })}

          {renderInput({
            label: 'Apellido',
            name: 'last_name',
            icon: User
          })}
        </div>

        {renderInput({
          label: 'DNI',
          name: 'dni',
          icon: IdCard
        })}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput({
            label: 'Email',
            name: 'email',
            icon: Mail,
            type: 'email'
          })}

          {renderInput({
            label: 'Fecha de nacimiento',
            name: 'birth_date',
            icon: Calendar,
            type: 'date'
          })}
        </div>

        {renderInput({
          label: 'Teléfono',
          name: 'telefono',
          icon: Phone
        })}

        {renderInput({
          label: 'Dirección',
          name: 'direccion',
          icon: MapPin
        })}

        {renderSelect({
          label: 'Sede',
          name: 'branch_id',
          icon: Building,
          options: branches
        })}

        <label className="block w-full">
          <span className="text-gray-700 font-medium">Estado del socio</span>

          <div className="relative mt-1">
            <BadgeCheck className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className={`
                pl-10 p-2 w-full border rounded-lg bg-white
                focus:ring-2 focus:ring-sol-blue/40
                focus:outline-none
                transition-all duration-200
                ${errors.estado ? 'border-red-500' : 'border-gray-300'}
              `}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="suspendido">Suspendido</option>
            </select>
          </div>

          {errors.estado && (
            <p className="text-red-600 text-sm mt-1">{errors.estado}</p>
          )}
        </label>

        <button
          type="submit"
          disabled={guardando}
          className="
            w-full md:w-auto px-6 py-3 bg-sol-blue text-white rounded-xl
            font-semibold shadow-md hover:shadow-lg hover:bg-blue-800
            transition-all duration-200 active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {guardando
            ? 'Guardando...'
            : editando
              ? 'Guardar cambios'
              : 'Crear socio'}
        </button>
      </form>
    </div>
  );
}

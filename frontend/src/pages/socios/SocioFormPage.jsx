import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  crearSocio,
  editarSocio,
  obtenerSocio
} from '../../services/sociosService';

import { toast } from 'sonner';

export default function SocioFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const editando = Boolean(id);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    nombre: '',
    dni: '',
    telefono: '',
    direccion: '',
    estado: 'activo'
  });

  // ============================================================
  // CARGAR SOCIO SI EDITAMOS
  // ============================================================
  useEffect(() => {
    async function cargar() {
      try {
        if (editando) {
          const data = await obtenerSocio(id);

          setForm({
            nombre: data.nombre,
            dni: data.dni,
            telefono: data.telefono,
            direccion: data.direccion,
            estado: data.estado,
            branch_id: data.branch_id,
            role_id: data.role_id
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

    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
    if (!form.dni.trim()) newErrors.dni = 'El DNI es obligatorio.';
    if (!/^\d+$/.test(form.dni))
      newErrors.dni = 'El DNI debe contener solo números.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null });
  };

  // ============================================================
  // GUARDAR
  // ============================================================
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
      toast.error('No se pudo guardar.');
    } finally {
      setGuardando(false);
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-sol-blue">
        {editando ? 'Editar socio' : 'Crear socio'}
      </h2>

      <form
        className="bg-white p-6 rounded-xl shadow space-y-4"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="font-medium mb-1">Nombre completo</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="p-2 border rounded-lg w-full"
          />
        </div>

        <div>
          <label className="font-medium mb-1">DNI</label>
          <input
            name="dni"
            value={form.dni}
            onChange={handleChange}
            className="p-2 border rounded-lg w-full"
          />
        </div>

        <div>
          <label className="font-medium mb-1">Teléfono</label>
          <input
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            className="p-2 border rounded-lg w-full"
          />
        </div>

        <div>
          <label className="font-medium mb-1">Dirección</label>
          <input
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            className="p-2 border rounded-lg w-full"
          />
        </div>

        <div>
          <label className="font-medium mb-1">Estado del socio</label>
          <select
            name="estado"
            value={form.estado}
            onChange={handleChange}
            className="p-2 border rounded-lg w-full"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="suspendido">Suspendido</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={guardando}
          className="px-4 py-2 bg-sol-blue text-white rounded-md"
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

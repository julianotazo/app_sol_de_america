import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  crearSocio,
  editarSocio,
  obtenerSocio
} from '../../services/sociosService';

import { toast } from "sonner";

export default function SocioFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const editando = Boolean(id);

  const [loading, setLoading] = useState(true);   // carga inicial
  const [guardando, setGuardando] = useState(false); // botón guardar
  const [errors, setErrors] = useState({}); // validaciones

  const [form, setForm] = useState({
    nombre: '',
    dni: '',
    nroSocio: '',
    telefono: '',
    direccion: '',
    estado: 'activo'
  });

  // Cargar socio si estamos editando
  useEffect(() => {
    async function cargar() {
      try {
        if (editando) {
          const data = await obtenerSocio(id);
          setForm(data);
        }
      } catch {
        toast.error("Error cargando datos del socio.");
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, [id, editando]);

  // Validaciones simples en vivo
  const validate = () => {
    const newErrors = {};

    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!form.dni.trim()) newErrors.dni = "El DNI es obligatorio.";
    if (!/^\d+$/.test(form.dni)) newErrors.dni = "El DNI debe contener solo números.";
    if (!form.nroSocio.trim()) newErrors.nroSocio = "El número de socio es obligatorio.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: null }); // limpiar error en vivo
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Revisá los campos del formulario.");
      return;
    }

    try {
      setGuardando(true);

      let resp;
      if (editando) {
        resp = await editarSocio(id, form);
      } else {
        resp = await crearSocio(form);
      }

      if (resp.ok) {
        toast.success(editando ? "Socio actualizado." : "Socio creado.");
        navigate('/socios');
      } else {
        toast.error("Ocurrió un error.");
      }
    } catch {
      toast.error("No se pudo guardar. Verificá los datos.");
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Cargando formulario...</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-sol-blue">
        {editando ? 'Editar socio' : 'Crear socio'}
      </h2>

      <form
        className="bg-white p-6 rounded-xl shadow space-y-4"
        onSubmit={handleSubmit}
      >
        {/* Nombre */}
        <div>
          <label className="block font-medium mb-1">Nombre</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className={`p-2 border rounded-lg w-full ${
              errors.nombre ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.nombre && (
            <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
          )}
        </div>

        {/* DNI */}
        <div>
          <label className="block font-medium mb-1">DNI</label>
          <input
            name="dni"
            value={form.dni}
            onChange={handleChange}
            className={`p-2 border rounded-lg w-full ${
              errors.dni ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.dni && (
            <p className="text-red-500 text-sm mt-1">{errors.dni}</p>
          )}
        </div>

        {/* N° Socio */}
        <div>
          <label className="block font-medium mb-1">N° Socio</label>
          <input
            name="nroSocio"
            value={form.nroSocio}
            onChange={handleChange}
            className={`p-2 border rounded-lg w-full ${
              errors.nroSocio ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
          {errors.nroSocio && (
            <p className="text-red-500 text-sm mt-1">{errors.nroSocio}</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label className="block font-medium mb-1">Teléfono</label>
          <input
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            className="p-2 border rounded-lg w-full"
          />
        </div>

        {/* Dirección */}
        <div>
          <label className="block font-medium mb-1">Dirección</label>
          <input
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            className="p-2 border rounded-lg w-full"
          />
        </div>

        {/* Estado */}
        <div>
          <label className="block font-medium mb-1">Estado</label>
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

        {/* Botón guardar */}
        <button
          type="submit"
          disabled={guardando}
          className={`px-4 py-2 bg-sol-blue text-white rounded-md font-medium
            hover:bg-blue-800 transition ${
              guardando ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          {guardando
            ? "Guardando..."
            : editando
            ? "Guardar cambios"
            : "Crear socio"}
        </button>
      </form>
    </div>
  );
}

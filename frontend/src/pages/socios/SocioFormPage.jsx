import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  crearSocio,
  editarSocio,
  obtenerSocio
} from '../../services/sociosService';

export default function SocioFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const editando = Boolean(id);

  const [form, setForm] = useState({
    nombre: '',
    dni: '',
    nroSocio: '',
    telefono: '',
    direccion: '',
    estado: 'activo'
  });

  useEffect(() => {
    if (editando) {
      obtenerSocio(id).then((data) => setForm(data));
    }
  }, [id, editando]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editando) {
      const resp = await editarSocio(id, form);
      if (resp.ok) {
        navigate('/socios');
      }
    } else {
      const resp = await crearSocio(form);
      if (resp.ok) {
        navigate('/socios');
      }
    }
  };

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
            className="p-2 border rounded-lg w-full"
            required
          />
        </div>

        {/* DNI */}
        <div>
          <label className="block font-medium mb-1">DNI</label>
          <input
            name="dni"
            value={form.dni}
            onChange={handleChange}
            className="p-2 border rounded-lg w-full"
            required
          />
        </div>

        {/* N° Socio */}
        <div>
          <label className="block font-medium mb-1">N° Socio</label>
          <input
            name="nroSocio"
            value={form.nroSocio}
            onChange={handleChange}
            className="p-2 border rounded-lg w-full"
            required
          />
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
          className="px-4 py-2 bg-sol-blue text-white rounded-md hover:bg-blue-800 font-medium"
        >
          {editando ? 'Guardar cambios' : 'Crear socio'}
        </button>
      </form>
    </div>
  );
}

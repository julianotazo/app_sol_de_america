import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ModalEliminarSocio from '../../components/ModalEliminarSocio';
import { obtenerSocios, eliminarSocio } from '../../services/sociosService';

export default function SociosPage() {
  const navigate = useNavigate();

  const [socios, setSocios] = useState([]);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('todos');
  const [eliminarId, setEliminarId] = useState(null);

  // Cargar socios
  useEffect(() => {
    async function cargar() {
      const data = await obtenerSocios();
      setSocios(data);
    }
    cargar();
  }, []);

  // Filtrar búsqueda + estado
  const sociosFiltrados = socios.filter((s) => {
    const coincideBusqueda =
      s.nombre.toLowerCase().includes(search.toLowerCase()) ||
      s.dni.includes(search) ||
      s.nroSocio.includes(search);

    const coincideEstado = estado === 'todos' || s.estado === estado;

    return coincideBusqueda && coincideEstado;
  });

  // Eliminar socio
  const handleConfirmarEliminar = async () => {
    const resp = await eliminarSocio(eliminarId);

    if (resp.ok) {
      setSocios((prev) => prev.filter((s) => s.id !== eliminarId));
      setEliminarId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-sol-blue">Gestión de Socios</h2>

      {/* BOTÓN CREAR */}
      <button
        onClick={() => navigate('/socios/crear')}
        className="px-4 py-2 bg-sol-blue text-white rounded-md hover:bg-blue-800 font-medium"
      >
        Crear socio
      </button>

      {/* BUSCADOR + FILTROS */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow">
        <input
          type="text"
          placeholder="Buscar por nombre, DNI o número de socio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
        />

        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="todos">Todos</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
          <option value="suspendido">Suspendidos</option>
        </select>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-sol-blue text-white">
            <tr>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">DNI</th>
              <th className="p-3 text-left">N° Socio</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left w-56">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {sociosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No se encontraron socios.
                </td>
              </tr>
            ) : (
              sociosFiltrados.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{s.nombre}</td>
                  <td className="p-3">{s.dni}</td>
                  <td className="p-3">{s.nroSocio}</td>
                  <td className="p-3 capitalize">{s.estado}</td>

                  <td className="p-3">
                    <div className="flex gap-2">
                      {/* VER DETALLE */}
                      <button
                        onClick={() => navigate(`/socios/${s.id}`)}
                        className="px-3 py-1 bg-sol-blue text-white rounded-md text-sm hover:bg-blue-800"
                      >
                        Ver
                      </button>

                      {/* EDITAR */}
                      <button
                        onClick={() => navigate(`/socios/${s.id}/editar`)}
                        className="px-3 py-1 bg-yellow-500 text-black rounded-md text-sm hover:bg-yellow-400"
                      >
                        Editar
                      </button>

                      {/* ELIMINAR */}
                      <button
                        onClick={() => setEliminarId(s.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL ELIMINAR */}
      <ModalEliminarSocio
        isOpen={eliminarId !== null}
        onClose={() => setEliminarId(null)}
        onConfirm={handleConfirmarEliminar}
      />
    </div>
  );
}

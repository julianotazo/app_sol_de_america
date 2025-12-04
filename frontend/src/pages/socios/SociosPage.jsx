import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalEliminarSocio from '../../components/ModalEliminarSocio';
import { obtenerSocios, eliminarSocio } from '../../services/sociosService';
import { toast } from 'sonner';

export default function SociosPage() {
  const navigate = useNavigate();

  const [socios, setSocios] = useState([]);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('todos');
  const [eliminarId, setEliminarId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [eliminando, setEliminando] = useState(false);

  // Cargar socios
  useEffect(() => {
    async function cargar() {
      try {
        setLoading(true);
        const data = await obtenerSocios();
        setSocios(data);
      } catch {
        toast.error('Error cargando socios.');
      } finally {
        setLoading(false);
      }
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
    try {
      setEliminando(true);
      const resp = await eliminarSocio(eliminarId);

      if (resp.ok) {
        setSocios((prev) => prev.filter((s) => s.id !== eliminarId));
        toast.success('Socio eliminado correctamente.');
      }
    } catch {
      toast.error('No se pudo eliminar el socio.');
    } finally {
      setEliminando(false);
      setEliminarId(null);
    }
  };

  // COMPONENTE: Skeleton Loader
  const LoaderFila = () => (
    <tr className="animate-pulse">
      <td className="p-4">
        <div className="h-4 bg-gray-300 rounded w-40"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-300 rounded w-20"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-300 rounded w-32"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-300 rounded w-24"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-gray-300 rounded w-32"></div>
      </td>
    </tr>
  );

  // Badge de estado
  const BadgeEstado = ({ estado }) => {
    const colores = {
      activo: 'bg-green-100 text-green-700',
      inactivo: 'bg-gray-200 text-gray-700',
      suspendido: 'bg-red-200 text-red-700'
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${colores[estado]}`}
      >
        {estado}
      </span>
    );
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
            {/* LOADING */}
            {loading && [...Array(5)].map((_, i) => <LoaderFila key={i} />)}

            {/* SIN RESULTADOS */}
            {!loading && sociosFiltrados.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  <p className="text-lg font-medium">
                    No se encontraron socios
                  </p>
                  <button
                    onClick={() => navigate('/socios/crear')}
                    className="mt-3 px-4 py-2 bg-sol-blue text-white rounded-md hover:bg-blue-800"
                  >
                    Crear primer socio
                  </button>
                </td>
              </tr>
            )}

            {/* FILAS */}
            {!loading &&
              sociosFiltrados.map((s) => (
                <tr
                  key={s.id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="p-3">{s.nombre}</td>
                  <td className="p-3">{s.dni}</td>
                  <td className="p-3">{s.nroSocio}</td>
                  <td className="p-3">
                    <BadgeEstado estado={s.estado} />
                  </td>

                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/socios/${s.id}`)}
                        className="px-3 py-1 bg-sol-blue text-white rounded-md text-sm hover:bg-blue-800"
                      >
                        Ver
                      </button>

                      <button
                        onClick={() => navigate(`/socios/${s.id}/editar`)}
                        className="px-3 py-1 bg-yellow-500 text-black rounded-md text-sm hover:bg-yellow-400"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => setEliminarId(s.id)}
                        className={`px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 ${
                          eliminando ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={eliminando}
                      >
                        {eliminando && eliminarId === s.id
                          ? 'Eliminando...'
                          : 'Eliminar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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

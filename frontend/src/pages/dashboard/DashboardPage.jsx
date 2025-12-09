import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { obtenerSocios } from '../../services/sociosService';

const initialStats = {
  total: 0,
  activo: 0,
  inactivo: 0,
  suspendido: 0
};
export default function DashboardPage() {
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarSocios() {
      try {
        const socios = await obtenerSocios();
        const counts = socios.reduce(
          (acc, socio) => {
            acc.total += 1;
            const estado = socio.estado?.toLowerCase();

            if (estado === 'activo') acc.activo += 1;
            else if (estado === 'inactivo') acc.inactivo += 1;
            else if (estado === 'suspendido') acc.suspendido += 1;

            return acc;
          },
          { ...initialStats }
        );

        setStats(counts);
      } catch (error) {
        console.error(error);
        toast.error('No se pudieron cargar las métricas de socios.');
      } finally {
        setLoading(false);
      }
    }

    cargarSocios();
  }, []);

  if (loading)
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-sol-blue font-semibold">Cargando métricas del club...</p>
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-sol-blue">Dashboard del Club</h2>
        <p className="text-gray-600">
          Resumen de los socios registrados del club.
        </p>
      </div>

      {/* Métricas de socios */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-sol-blue">
          <h3 className="text-sol-blue font-semibold text-lg">Socios registrados</h3>
          <p className="text-4xl font-bold mt-2">{stats.total}</p>
          <p className="text-sm text-gray-500 mt-1">Total de socios cargados en el sistema.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
          <h3 className="text-sol-blue font-semibold text-lg">Activos</h3>
          <p className="text-4xl font-bold mt-2 text-green-600">{stats.activo}</p>
          <p className="text-sm text-gray-500 mt-1">Con membresía vigente.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-yellow-400">
          <h3 className="text-sol-blue font-semibold text-lg">Inactivos</h3>
          <p className="text-4xl font-bold mt-2 text-yellow-700">{stats.inactivo}</p>
          <p className="text-sm text-gray-500 mt-1">Sin actividad reciente.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-red-500">
          <h3 className="text-sol-blue font-semibold text-lg">Suspendidos</h3>
          <p className="text-4xl font-bold mt-2 text-red-600">{stats.suspendido}</p>
          <p className="text-sm text-gray-500 mt-1">Revisar estado y motivos.</p>
        </div>
      </div>


        <div className="bg-white p-6 rounded-xl shadow space-y-3">
          <h3 className="text-lg font-semibold text-sol-blue">Próximamente</h3>
          <p className="text-gray-600">
            Integraremos gestión de planteles, eventos y reportes automáticos para que el
            club tenga toda la información en un solo lugar.
          </p>
          <p className="text-gray-500 text-sm">
            Mientras tanto, puedes seguir gestionando socios y cobranzas desde las
            secciones disponibles.
          </p>
        </div>
      </div>
  );
}

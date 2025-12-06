import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { obtenerHistorialAsistencias } from '../../services/asistenciasService';

export default function HistorialAsistenciasPage() {
  const { id } = useParams();
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarAsistencias() {
      const data = await obtenerHistorialAsistencias(id);
      setAsistencias(data);
      setLoading(false);
    }

    cargarAsistencias();
  }, [id]);

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-sol-blue">
        Historial de Asistencias - Socio #{id}
      </h2>

      <div className="bg-white rounded-xl shadow p-6">
        {asistencias.length === 0 ? (
          <p className="text-gray-600">No hay asistencias registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-sol-blue text-white">
                <tr>
                  <th className="p-3 text-left">Fecha y hora</th>
                </tr>
              </thead>

              <tbody>
                {asistencias.map((a, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="p-3">
                      {new Date(a.attended_at).toLocaleString('es-AR', {
                        dateStyle: 'short',
                        timeStyle: 'short'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

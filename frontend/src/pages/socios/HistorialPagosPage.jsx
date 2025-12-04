import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { obtenerHistorialPagos } from '../../services/cuotasService';

export default function HistorialPagosPage() {
  const { id } = useParams();
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarPagos() {
      const data = await obtenerHistorialPagos(id);
      setPagos(data);
      setLoading(false);
    }

    cargarPagos();
  }, [id]);

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-sol-blue">
        Historial de Pagos del Socio #{id}
      </h2>

      <div className="bg-white rounded-xl shadow p-6">
        {pagos.length === 0 ? (
          <p className="text-gray-600">
            Este socio aún no tiene pagos registrados.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-sol-blue text-white">
                <tr>
                  <th className="p-3 text-left">Fecha</th>
                  <th className="p-3 text-left">Monto</th>
                </tr>
              </thead>

              <tbody>
                {pagos.map((p, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="p-3">
                      {new Date(p.fecha).toLocaleDateString('es-AR')}
                    </td>
                    <td className="p-3 font-semibold">${p.monto}</td>
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

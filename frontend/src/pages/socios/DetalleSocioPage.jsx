import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalAsistencia from '../../components/ModalAsistencia';
import { registrarAsistencia } from '../../services/asistenciasService';
import ModalPago from '../../components/ModalPago';
import {
  registrarPago,
  obtenerHistorialPagos
} from '../../services/cuotasService';

export default function DetalleSocioPage() {
  const { id } = useParams();
  const [socio, setSocio] = useState(null);
  const [asistencias, setAsistencias] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPago, setModalPago] = useState(false);
  const [pagos, setPagos] = useState([]);
  const [estadoCuota, setEstadoCuota] = useState('desconocido');

  const navigate = useNavigate();

  // CARGA DE DATOS DEL SOCIO (CORREGIDO)
  useEffect(() => {
    async function cargarDatos() {
      const mockData = {
        id,
        nombre: 'Juan Pérez',
        dni: '40222333',
        nroSocio: '001',
        estado: 'activo',
        telefono: '3794-555222',
        direccion: 'Av. Siempre Viva 123',
        fechaAlta: '2021-03-10',
        ultimoPago: '2024-11-15'
      };

      setSocio(mockData);

      setAsistencias([
        { fecha: '2024-11-01 18:00' },
        { fecha: '2024-11-03 18:00' }
      ]);
    }

    cargarDatos();
  }, [id]);

  // CONTROL DE PAGOS (esto está perfecto)
  useEffect(() => {
    async function cargarPagos() {
      const historial = await obtenerHistorialPagos(id);
      setPagos(historial);

      const ultimaFecha = historial[0]?.fecha;
      const hoy = new Date();
      const ultimoPagoDate = new Date(ultimaFecha);

      const diasDiferencia = (hoy - ultimoPagoDate) / (1000 * 60 * 60 * 24);

      if (diasDiferencia <= 30) setEstadoCuota('al día');
      else if (diasDiferencia <= 60) setEstadoCuota('pendiente');
      else setEstadoCuota('moroso');
    }

    cargarPagos();
  }, [id]);

  if (!socio) return <p>Cargando...</p>;

  const handleConfirmarAsistencia = async () => {
    const resp = await registrarAsistencia();

    if (resp.ok) {
      setAsistencias((prev) => [{ fecha: resp.fecha }, ...prev]);
    }

    setModalOpen(false);
  };

  const handleRegistrarPago = async (monto) => {
    const resp = await registrarPago(null, monto);

    if (resp.ok) {
      setPagos((prev) => [{ fecha: resp.fecha, monto: resp.monto }, ...prev]);
      setEstadoCuota('al día');
    }

    setModalPago(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-sol-blue">
        Detalle del Socio #{socio.nroSocio}
      </h2>

      {/* INFO PRINCIPAL */}
      <div className="bg-white p-6 rounded-xl shadow border-l-4 border-sol-blue">
        <h3 className="text-xl font-semibold">{socio.nombre}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <p>
            <strong>DNI:</strong> {socio.dni}
          </p>
          <p>
            <strong>Estado:</strong> {socio.estado}
          </p>
          <p>
            <strong>Teléfono:</strong> {socio.telefono}
          </p>
          <p>
            <strong>Dirección:</strong> {socio.direccion}
          </p>
          <p>
            <strong>Alta:</strong> {socio.fechaAlta}
          </p>
        </div>
      </div>

      {/* ACCIONES */}
      <div className="flex gap-3">
        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2 bg-sol-blue text-white rounded-md hover:bg-blue-800 font-medium"
        >
          Registrar asistencia
        </button>

        <button
          onClick={() => navigate(`/socios/${socio.id}/pagos`)}
          className="px-5 py-2 bg-sol-yellow text-black rounded-md hover:bg-yellow-400 font-medium"
        >
          Ir al módulo de cuotas
        </button>
      </div>

      {/* ASISTENCIAS RECIENTES */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h4 className="font-semibold text-sol-blue mb-3">
          Asistencias recientes
        </h4>

        {asistencias.length === 0 ? (
          <p className="text-gray-500">No hay asistencias registradas.</p>
        ) : (
          <ul className="space-y-2">
            {asistencias.map((a, i) => (
              <li key={i} className="p-3 border rounded-md">
                {new Date(a.fecha).toLocaleString('es-AR')}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() => navigate(`/socios/${socio.id}/asistencias`)}
          className="px-4 py-2 bg-sol-blue text-white rounded-md hover:bg-blue-800 font-medium mt-4"
        >
          Ver historial completo
        </button>
      </div>

      {/* CONTROL DE CUOTAS */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h4 className="font-semibold text-sol-blue mb-3">Estado de cuotas</h4>

        <p className="text-lg mb-4">
          Estado actual:{' '}
          <span
            className={
              estadoCuota === 'al día'
                ? 'text-green-600 font-bold'
                : estadoCuota === 'pendiente'
                  ? 'text-yellow-600 font-bold'
                  : 'text-red-600 font-bold'
            }
          >
            {estadoCuota}
          </span>
        </p>

        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setModalPago(true)}
            className="px-4 py-2 bg-sol-yellow text-black rounded-md hover:bg-yellow-400 font-medium"
          >
            Registrar pago
          </button>

          <button
            onClick={() => navigate(`/socios/${socio.id}/pagos`)}
            className="px-4 py-2 bg-sol-blue text-white rounded-md hover:bg-blue-800 font-medium"
          >
            Ver todos los pagos
          </button>
        </div>

        <h5 className="font-semibold text-sol-blue mb-2">Últimos pagos</h5>

        {pagos.length === 0 ? (
          <p className="text-gray-500">Sin pagos registrados.</p>
        ) : (
          <>
            <ul className="mt-2 space-y-2">
              {pagos.slice(0, 3).map((p, i) => (
                <li
                  key={i}
                  className="p-3 border rounded-lg flex justify-between"
                >
                  <span>{new Date(p.fecha).toLocaleDateString('es-AR')}</span>
                  <strong>${p.monto}</strong>
                </li>
              ))}
            </ul>

            {pagos.length > 3 && (
              <p className="text-sm text-gray-600 mt-2">
                Mostrando los últimos 3 pagos.
              </p>
            )}
          </>
        )}
      </div>

      {/* MODALES */}
      <ModalAsistencia
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmarAsistencia}
        socio={socio}
      />

      <ModalPago
        isOpen={modalPago}
        onClose={() => setModalPago(false)}
        onConfirm={handleRegistrarPago}
      />
    </div>
  );
}

import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { obtenerSocio } from '../../services/sociosService';
import {
  obtenerHistorialAsistencias,
  registrarAsistencia
} from '../../services/asistenciasService';

import {
  registrarPago,
  obtenerHistorialPagos
} from '../../services/cuotasService';

import ModalAsistencia from '../../components/ModalAsistencia';
import ModalPago from '../../components/ModalPago';

export default function DetalleSocioPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [socio, setSocio] = useState(null);
  const [asistencias, setAsistencias] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [estadoCuota, setEstadoCuota] = useState('desconocido');

  const [modalAsistencia, setModalAsistencia] = useState(false);
  const [modalPago, setModalPago] = useState(false);

  // =====================================================
  // CARGAR SOCIO
  // =====================================================
  useEffect(() => {
    async function cargar() {
      try {
        const data = await obtenerSocio(id);
        setSocio(data);
      } catch {
        toast.error('Error cargando socio.');
      }
    }
    cargar();
  }, [id]);

  // =====================================================
  // CARGAR ASISTENCIAS
  // =====================================================
  useEffect(() => {
    async function cargar() {
      try {
        const data = await obtenerHistorialAsistencias(id);
        setAsistencias(data);
      } catch {
        toast.error('Error cargando asistencias.');
      }
    }
    cargar();
  }, [id]);

  // =====================================================
  // CARGAR PAGOS
  // =====================================================
  useEffect(() => {
    async function cargar() {
      try {
        const historial = await obtenerHistorialPagos(id);
        setPagos(historial);

        if (historial.length > 0) {
          const ultimaFecha = historial[0]?.month_year;
          const hoy = new Date();
          const fechaPago = new Date(ultimaFecha);

          const diferencia = (hoy - fechaPago) / (1000 * 60 * 60 * 24);

          if (diferencia <= 30) setEstadoCuota('al día');
          else if (diferencia <= 60) setEstadoCuota('pendiente');
          else setEstadoCuota('moroso');
        } else {
          setEstadoCuota('moroso');
        }
      } catch {
        toast.error('Error cargando pagos.');
      }
    }
    cargar();
  }, [id]);

  if (!socio) return <p>Cargando datos...</p>;

  // =====================================================
  // REGISTRAR ASISTENCIA
  // =====================================================
  const handleConfirmarAsistencia = async () => {
    try {
      const nueva = await registrarAsistencia(id);

      setAsistencias((prev) => [
        {
          id: nueva.id,
          attended_at: new Date().toISOString(),
          status: 'PRESENTE'
        },
        ...prev
      ]);

      toast.success('Asistencia registrada.');
    } catch {
      toast.error('Error registrando asistencia');
    }

    setModalAsistencia(false);
  };

  // =====================================================
  // REGISTRAR PAGO
  // =====================================================
  const handleRegistrarPago = async () => {
    try {
      const body = {
        month_year: new Date().toISOString().slice(0, 7) + '-01',
        payment_state_id: 1,
        member_state_id: 1,
        is_paid: true
      };

      const resp = await registrarPago(id, body);

      setPagos((prev) => [
        {
          id: resp.id, // ✔ CORRECTO: el backend devuelve { id: X }
          month_year: body.month_year,
          is_paid: true
        },
        ...prev
      ]);

      setEstadoCuota('al día');
      toast.success('Pago registrado.');
    } catch {
      toast.error('Error registrando pago.');
    }

    setModalPago(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-sol-blue">
        Detalle del Socio #{socio.club_user_id}
      </h2>

      {/* INFO PRINCIPAL */}
      <div className="bg-white p-6 rounded-xl shadow border-l-4 border-sol-blue">
        <h3 className="text-xl font-semibold">
          {socio.first_name} {socio.last_name}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <p>
            <strong>DNI:</strong> {socio.dni}
          </p>
          <p>
            <strong>Email:</strong> {socio.email}
          </p>
          <p>
            <strong>Teléfono:</strong> {socio.phone}
          </p>
          <p>
            <strong>Dirección:</strong> {socio.address}
          </p>
          <p>
            <strong>Sede:</strong> {socio.branch_name}
          </p>
          <p>
            <strong>Rol:</strong> {socio.role_name}
          </p>
        </div>
      </div>

      {/* ACCIONES */}
      <div className="flex gap-3">
        <button
          onClick={() => setModalAsistencia(true)}
          className="px-5 py-2 bg-sol-blue text-white rounded-md hover:bg-blue-800 font-medium"
        >
          Registrar asistencia
        </button>

        <button
          onClick={() => navigate(`/socios/${id}/pagos`)}
          className="px-5 py-2 bg-sol-yellow text-black rounded-md hover:bg-yellow-400 font-medium"
        >
          Ir al módulo de cuotas
        </button>
      </div>

      {/* ASISTENCIAS */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h4 className="font-semibold text-sol-blue mb-3">
          Asistencias recientes
        </h4>

        {asistencias.length === 0 ? (
          <p className="text-gray-500">No hay asistencias registradas.</p>
        ) : (
          <ul className="space-y-2">
            {asistencias.map((a) => (
              <li key={a.id} className="p-3 border rounded-md">
                {new Date(a.attended_at).toLocaleString('es-AR')}
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() => navigate(`/socios/${id}/asistencias`)}
          className="px-4 py-2 bg-sol-blue text-white rounded-md hover:bg-blue-800 font-medium mt-4"
        >
          Ver historial completo
        </button>
      </div>

      {/* CUOTAS */}
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
            onClick={() => navigate(`/socios/${id}/pagos`)}
            className="px-4 py-2 bg-sol-blue text-white rounded-md hover:bg-blue-800 font-medium"
          >
            Ver todos los pagos
          </button>
        </div>

        <h5 className="font-semibold text-sol-blue mb-2">Últimos pagos</h5>

        {pagos.length === 0 ? (
          <p className="text-gray-500">Sin pagos registrados.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {pagos.slice(0, 3).map((p) => (
              <li
                key={p.id}
                className="p-3 border rounded-lg flex justify-between"
              >
                <span>
                  {new Date(p.month_year + 'T00:00:00').toLocaleDateString(
                    'es-AR'
                  )}
                </span>
                <strong>{p.is_paid ? 'Pagado' : 'Pendiente'}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* MODALES */}
      <ModalAsistencia
        isOpen={modalAsistencia}
        onClose={() => setModalAsistencia(false)}
        onConfirm={handleConfirmarAsistencia}
      />

      <ModalPago
        isOpen={modalPago}
        onClose={() => setModalPago(false)}
        onConfirm={handleRegistrarPago}
      />
    </div>
  );
}

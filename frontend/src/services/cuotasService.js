import api from './api';

// Registrar un pago real
export async function registrarPago(socioId, data) {
  const res = await api.post(`/socios/${socioId}/pagos`, data);
  return res.data;
}

// Obtener pagos reales del backend
export async function obtenerHistorialPagos(socioId) {
  const res = await api.get(`/socios/${socioId}/pagos`);
  return res.data; // devolvemos tal cual viene del backend
}

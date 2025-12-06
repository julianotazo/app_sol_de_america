import api from './api';

export async function registrarAsistencia(socioId) {
  console.log('ENVIANDO AL BACK:', {
    attended_at: new Date().toISOString(),
    status: 'PRESENTE',
    notes: ''
  });

  const res = await api.post(`/socios/${socioId}/asistencias`, {
    attended_at: new Date().toISOString(),
    status: 'PRESENTE',
    notes: ''
  });

  return res.data;
}

// Obtener historial real
export async function obtenerHistorialAsistencias(socioId) {
  const res = await api.get(`/socios/${socioId}/asistencias`);
  return res.data;
}

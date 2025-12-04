export async function registrarAsistencia() {
  //por parametros me tiene que llegar socioId
  // TODO: reemplazar por tu API real
  // Ejemplo: await api.post(`/socios/${socioId}/asistencias`);

  return {
    ok: true,
    fecha: new Date().toISOString()
  };
}

// Obtener historial completo de asistencias
export async function obtenerHistorialAsistencias() {
  //por parametros me tiene que llegar socioId
  // TODO: conectar a tu backend real
  return [
    { fecha: '2024-11-01T18:00:00' },
    { fecha: '2024-11-03T18:00:00' },
    { fecha: '2024-11-05T18:00:00' }
  ];
}

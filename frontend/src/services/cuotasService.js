export async function registrarPago(monto) {
  //por parametros me tiene que llegar socioId
  // TODO: reemplazar por API real
  return {
    ok: true,
    fecha: new Date().toISOString(),
    monto
  };
}

export async function obtenerHistorialPagos() {
  //por parametros me tiene que llegar socioId
  // TODO: reemplazar por API real
  return [
    { fecha: '2024-11-15', monto: 5000 },
    { fecha: '2024-10-12', monto: 5000 },
    { fecha: '2024-09-10', monto: 5000 }
  ];
}

// Mocks (después se reemplazan por tu API real)

export async function obtenerSocios() {
  return [
    {
      id: 1,
      nombre: 'Juan Pérez',
      dni: '40222333',
      nroSocio: '001',
      estado: 'activo'
    },
    {
      id: 2,
      nombre: 'María López',
      dni: '37999888',
      nroSocio: '002',
      estado: 'inactivo'
    }
  ];
}

export async function obtenerSocio(id) {
  return {
    id,
    nombre: 'Juan Pérez',
    dni: '40222333',
    nroSocio: '001',
    estado: 'activo',
    telefono: '3794555222',
    direccion: 'Av. Siempre Viva 123'
  };
}

export async function crearSocio(data) {
  console.log('Crear socio:', data);
  return { ok: true };
}

export async function editarSocio(id, data) {
  console.log('Editar socio:', id, data);
  return { ok: true };
}

export async function eliminarSocio(id) {
  console.log('Eliminar socio:', id);
  return { ok: true };
}

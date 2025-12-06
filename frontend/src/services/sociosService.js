import api from './api';

// map frontend -> backend
const estadoMap = {
  activo: 1,
  inactivo: 2,
  suspendido: 3
};

// map backend -> frontend
const estadoReverseMap = {
  ACTIVO: 'activo',
  INACTIVO: 'inactivo',
  SUSPENDIDO: 'suspendido'
};

/* ================================
   OBTENER LISTA DE SOCIOS
================================ */
export async function obtenerSocios() {
  const res = await api.get('/socios');
  return res.data.map((s) => ({
    id: s.club_user_id,
    nombre: `${s.first_name} ${s.last_name}`,
    dni: s.dni,
    nroSocio: s.club_user_id,
    rol: s.role_name,
    estado: s.member_state_label // "Activo", "Inactivo", etc.
  }));
}

/* ================================
   OBTENER SOCIO POR ID
================================ */
export async function obtenerSocio(id) {
  const res = await api.get(`/socios/${id}`);
  const s = res.data;

  return {
    id: s.club_user_id,
    first_name: s.first_name,
    last_name: s.last_name,
    nombre: `${s.first_name} ${s.last_name}`,
    dni: s.dni,
    telefono: s.phone || '',
    direccion: s.address || '',
    email: s.email,
    branch_id: s.branch_id,
    role_id: s.role_id,
    estado: estadoReverseMap[s.member_state_label?.toUpperCase()] || 'activo'
  };
}

/* ================================
   CREAR SOCIO
================================ */
export async function crearSocio(data) {
  const payload = {
    dni: data.dni,
    first_name: data.nombre.split(' ')[0],
    last_name: data.nombre.split(' ').slice(1).join(' '),
    phone: data.telefono,
    email: data.email || 'sin-email@placeholder.com',
    address: data.direccion,
    branch_id: data.branch_id || 2,
    role_id: data.role_id || 2,
    member_state_id: estadoMap[data.estado]
  };

  const res = await api.post('/socios', payload);
  return res.data;
}

/* ================================
   EDITAR SOCIO
================================ */
export async function editarSocio(id, data) {
  const payload = {
    dni: data.dni,
    first_name: data.nombre.split(' ')[0],
    last_name: data.nombre.split(' ').slice(1).join(' '),
    phone: data.telefono,
    address: data.direccion,
    branch_id: data.branch_id,
    role_id: data.role_id,
    member_state_id: estadoMap[data.estado]
  };

  const res = await api.put(`/socios/${id}`, payload);
  return res.data;
}

/* ================================
   ELIMINAR SOCIO
================================ */
export async function eliminarSocio(id) {
  const res = await api.delete(`/socios/${id}`);
  return res.data;
}

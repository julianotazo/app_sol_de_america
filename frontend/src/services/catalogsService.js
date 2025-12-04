import api from './api';

// Trae todas las sedes del club
export async function getBranches() {
  const res = await api.get('/branches');
  return res.data; // se espera un array de sedes
}

// Trae todos los roles de usuario
export async function getRoles() {
  const res = await api.get('/roles');
  return res.data; // se espera un array de roles
}

import api from './api';

// sedes
export async function getBranches() {
  const res = await api.get('/branches');
  return res.data; // [{ id, name }]
}

// roles
export async function getRoles() {
  const res = await api.get('/roles');
  return res.data; // [{ id, name }]
}

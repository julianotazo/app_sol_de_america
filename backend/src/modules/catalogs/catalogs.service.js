import { pool } from '../../config/db.js';

export async function getAllBranches() {
  const query = 'SELECT id, name FROM branches ORDER BY name ASC';
  const result = await pool.query(query);
  return result.rows; // [{ id, name }, ...]
}

export async function getAllRoles() {
  const query = 'SELECT id, name FROM roles ORDER BY name ASC';
  const result = await pool.query(query);
  return result.rows; // [{ id, name }, ...]
}

import { pool } from '../../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const DEFAULT_SOCIO_ROLE_ID = 2;
const DEFAULT_SEDE_BRANCH_ID = 2;

export async function registerUser(data) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1) USERS
    const userRes = await client.query(
      `INSERT INTO public.users
        (dni, last_name, first_name, birth_date, phone, email, address)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING id, dni, last_name, first_name, birth_date, phone, email, address`,
      [
        data.dni,
        data.last_name,
        data.first_name,
        data.birth_date ?? null,
        data.phone ?? null,
        data.email,
        data.address ?? null
      ]
    );
    const user = userRes.rows[0];

    // 2) AUTH_LOCAL (solo FK + hash)
    const hashed = await bcrypt.hash(data.password, 10);
    await client.query(
      `INSERT INTO public.auth_local (user_id, password_hash)
       VALUES ($1,$2)`,
      [user.id, hashed]
    );

    // 3) CLUB_USERS
    // - branch_id: si no viene, usar Sede Principal (id = 2)
    // - role_id: si no viene, usar SOCIO (id = 2)
    const branchId = data.branch_id ?? DEFAULT_SEDE_BRANCH_ID;
    const roleId = data.role_id ?? DEFAULT_SOCIO_ROLE_ID;

    await client.query(
      `INSERT INTO public.club_users (user_id, branch_id, role_id)
       VALUES ($1, $2, $3)`,
      [user.id, branchId, roleId]
    );

    await client.query('COMMIT');
    return user;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function loginUser({ email, password }) {
  // buscamos por email y traemos también el rol (y su nombre)
  const credRes = await pool.query(
    `SELECT 
        u.id AS user_id,
        u.first_name,
        u.last_name,
        u.email,
        al.password_hash,
        cu.role_id,
        r.name AS role_name
     FROM public.users u
     JOIN public.auth_local al ON al.user_id = u.id
     LEFT JOIN public.club_users cu ON cu.user_id = u.id
     LEFT JOIN public.roles r ON r.id = cu.role_id
     WHERE u.email = $1`,
    [email]
  );

  if (!credRes.rows.length) {
    throw new Error('Usuario no encontrado');
  }

  const row = credRes.rows[0];

  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) {
    throw new Error('Contraseña incorrecta');
  }

  const roleId = row.role_id ?? DEFAULT_SOCIO_ROLE_ID;
  const roleName = row.role_name ?? 'SOCIO';

  const token = jwt.sign(
    {
      sub: row.user_id,
      email: row.email,
      name: `${row.first_name} ${row.last_name}`,
      roleId, // 👈 id del rol
      role: roleName // 👈 nombre del rol (ADMIN, SOCIO, ENTRENADOR, etc.)
    },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '2h' }
  );

  return token;
}

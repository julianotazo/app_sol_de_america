import { pool } from '../../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

type RegisterDTO = {
  email: string;
  password: string;
  dni: string;
  first_name: string;
  last_name: string;
  birth_date?: string;
  phone?: string;
  address?: string;
  branch_id?: number;
  role_id?: number;
};

type LoginDTO = { email: string; password: string };

export async function registerUser(data: RegisterDTO) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1) USERS (antes persons)
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
        data.address ?? null,
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

    // 3) (Opcional) CLUB_USERS: si envían branch_id/role_id
    if (data.branch_id && data.role_id) {
      await client.query(
        `INSERT INTO public.club_users (user_id, branch_id, role_id)
         VALUES ($1,$2,$3)`,
        [user.id, data.branch_id, data.role_id]
      );
    }

    await client.query('COMMIT');
    return user; // devolvés los datos del usuario creado
  } catch (err) {
    await client.query('ROLLBACK');
    // acá podrías chequear códigos de error para email/dni duplicado, etc.
    throw err;
  } finally {
    client.release();
  }
}

export async function loginUser({ email, password }: LoginDTO) {
  // buscamos por email en USERS y traemos el hash desde AUTH_LOCAL
  const credRes = await pool.query(
    `SELECT 
        u.id AS user_id,
        u.first_name,
        u.last_name,
        u.email,
        al.password_hash
     FROM public.users u
     JOIN public.auth_local al ON al.user_id = u.id
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

  const token = jwt.sign(
    { sub: row.user_id, email: row.email, name: `${row.first_name} ${row.last_name}` },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '2h' }
  );

  // devolvemos SOLO el string, así el controller responde { message, token }
  return token;
}
import { pool } from '../../config/db.js';

const DEFAULT_SOCIO_ROLE_ID = 2;
const DEFAULT_SEDE_BRANCH_ID = 2;

// LISTAR SOCIOS
export async function getAllSocios() {
  const query = `
    SELECT
      cu.id        AS club_user_id,
      u.id         AS user_id,
      u.dni,
      u.first_name,
      u.last_name,
      u.email,
      u.phone,
      b.id         AS branch_id,
      b.name       AS branch_name,
      r.id         AS role_id,
      r.name       AS role_name
    FROM club_users cu
    JOIN users u ON u.id = cu.user_id
    LEFT JOIN branches b ON b.id = cu.branch_id
    LEFT JOIN roles r ON r.id = cu.role_id
    ORDER BY u.last_name, u.first_name;
  `;
  const result = await pool.query(query);
  return result.rows;
}

// DETALLE SOCIO
export async function getSocioById(clubUserId) {
  const query = `
    SELECT
      cu.id        AS club_user_id,
      u.id         AS user_id,
      u.dni,
      u.first_name,
      u.last_name,
      u.birth_date,
      u.email,
      u.phone,
      u.address,
      b.id         AS branch_id,
      b.name       AS branch_name,
      r.id         AS role_id,
      r.name       AS role_name
    FROM club_users cu
    JOIN users u ON u.id = cu.user_id
    LEFT JOIN branches b ON b.id = cu.branch_id
    LEFT JOIN roles r ON r.id = cu.role_id
    WHERE cu.id = $1;
  `;
  const result = await pool.query(query, [clubUserId]);
  return result.rows[0] || null;
}

// CREAR SOCIO (NO crea auth_local)
export async function createSocio(data) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const userRes = await client.query(
      `
      INSERT INTO users (dni, last_name, first_name, birth_date, phone, email, address)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING id, dni, last_name, first_name, birth_date, phone, email, address
      `,
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

    const branchId = data.branch_id ?? DEFAULT_SEDE_BRANCH_ID;
    const roleId = data.role_id ?? DEFAULT_SOCIO_ROLE_ID;

    const clubUserRes = await client.query(
      `
      INSERT INTO club_users (user_id, branch_id, role_id)
      VALUES ($1,$2,$3)
      RETURNING id
      `,
      [user.id, branchId, roleId]
    );

    await client.query('COMMIT');

    return {
      club_user_id: clubUserRes.rows[0].id,
      user
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// ACTUALIZAR SOCIO
export async function updateSocio(clubUserId, data) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // obtener user_id asociado
    const rel = await client.query(
      'SELECT user_id FROM club_users WHERE id = $1',
      [clubUserId]
    );
    if (!rel.rows.length) {
      throw new Error('SOCIO_NOT_FOUND');
    }
    const userId = rel.rows[0].user_id;

    // update users
    await client.query(
      `
      UPDATE users
      SET
        dni = COALESCE($1, dni),
        last_name = COALESCE($2, last_name),
        first_name = COALESCE($3, first_name),
        birth_date = COALESCE($4, birth_date),
        phone = COALESCE($5, phone),
        email = COALESCE($6, email),
        address = COALESCE($7, address)
      WHERE id = $8
      `,
      [
        data.dni ?? null,
        data.last_name ?? null,
        data.first_name ?? null,
        data.birth_date ?? null,
        data.phone ?? null,
        data.email ?? null,
        data.address ?? null,
        userId
      ]
    );

    // update club_users
    await client.query(
      `
      UPDATE club_users
      SET
        branch_id = COALESCE($1, branch_id),
        role_id   = COALESCE($2, role_id)
      WHERE id = $3
      `,
      [data.branch_id ?? null, data.role_id ?? null, clubUserId]
    );

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    if (err.message === 'SOCIO_NOT_FOUND') throw err;
    throw err;
  } finally {
    client.release();
  }
}

// ELIMINAR SOCIO → borra solo club_users
export async function deleteSocio(clubUserId) {
  const result = await pool.query('DELETE FROM club_users WHERE id = $1', [
    clubUserId
  ]);
  return result.rowCount; // 0 = no existía, 1 = eliminado
}

// PAGOS (cuotas)
export async function addPago(clubUserId, data) {
  const query = `
    INSERT INTO membership_status
      (club_user_id, month_year, is_paid, payment_state_id, member_state_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
  `;

  const isPaid = data.is_paid ?? (data.payment_state_id ? true : false);

  const result = await pool.query(query, [
    clubUserId,
    data.month_year,
    isPaid,
    data.payment_state_id,
    data.member_state_id
  ]);

  return result.rows[0];
}

export async function getPagos(clubUserId) {
  const query = `
    SELECT
      ms.id,
      ms.month_year,
      ms.is_paid,
      ms.payment_state_id,
      ps.code  AS payment_state_code,
      ps.label AS payment_state_label,
      ms.member_state_id,
      ms2.code AS member_state_code,
      ms2.label AS member_state_label
    FROM membership_status ms
    LEFT JOIN payment_states ps ON ps.id = ms.payment_state_id
    LEFT JOIN member_states ms2 ON ms2.id = ms.member_state_id
    WHERE ms.club_user_id = $1
    ORDER BY ms.month_year DESC;
  `;
  const result = await pool.query(query, [clubUserId]);
  return result.rows;
}

// ASISTENCIAS (requiere una tabla, ej. attendances)
export async function addAsistencia(clubUserId, data) {
  const query = `
    INSERT INTO attendances (club_user_id, date, status, notes)
    VALUES ($1, $2, $3, $4)
    RETURNING id;
  `;
  const result = await pool.query(query, [
    clubUserId,
    data.date,
    data.status ?? null,
    data.notes ?? null
  ]);
  return result.rows[0];
}

export async function getAsistencias(clubUserId) {
  const query = `
    SELECT id, club_user_id, date, status, notes
    FROM attendances
    WHERE club_user_id = $1
    ORDER BY date DESC;
  `;
  const result = await pool.query(query, [clubUserId]);
  return result.rows;
}

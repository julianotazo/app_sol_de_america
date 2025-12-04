// 004_seed_admin_user.cjs
const bcrypt = require('bcryptjs');

exports.shorthands = {
  id: { type: 'serial', primaryKey: true }
};

exports.up = async (pgm) => {
  // 1) generar hash dinámico
  const hashed = await bcrypt.hash('admin1234', 10);

  // 2) insertar usuario admin
  pgm.sql(`
    INSERT INTO users (dni, last_name, first_name, birth_date, phone, email, address)
    VALUES (
      '10000000',
      'Administrador',
      'Usuario',
      '1990-01-01',
      '3704000000',
      'admin@sol.com',
      'Dirección administrativa'
    );
  `);

  // 3) insertar auth_local con el hash
  pgm.sql(`
    INSERT INTO auth_local (user_id, password_hash)
    SELECT id, '${hashed}'
    FROM users
    WHERE email = 'admin@sol.com';
  `);

  // 4) asociarlo a club_users (sede 2, rol 1)
  pgm.sql(`
    INSERT INTO club_users (user_id, branch_id, role_id)
    SELECT id, 2, 1
    FROM users
    WHERE email = 'admin@sol.com';
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DELETE FROM auth_local
    WHERE user_id IN (SELECT id FROM users WHERE email = 'admin@sol.com');

    DELETE FROM club_users
    WHERE user_id IN (SELECT id FROM users WHERE email = 'admin@sol.com');

    DELETE FROM users WHERE email = 'admin@sol.com';
  `);
};

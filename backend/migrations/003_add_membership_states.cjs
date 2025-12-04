exports.shorthands = {
  id: {
    type: 'serial',
    primaryKey: true
  }
};

exports.up = (pgm) => {
  // 1) Tabla de estados de pago
  pgm.createTable('payment_states', {
    id: 'id',
    code: { type: 'varchar(20)', notNull: true },
    label: { type: 'varchar(50)', notNull: true }
  });

  pgm.addConstraint('payment_states', 'payment_states_code_key', {
    unique: ['code']
  });

  // Seed inicial de payment_states
  pgm.sql(`
    INSERT INTO payment_states (code, label)
    VALUES
      ('AL_DIA',    'Al día'),
      ('PENDIENTE', 'Pendiente'),
      ('MOROSO',    'Moroso');
  `);

  // 2) Tabla de estados de miembro
  pgm.createTable('member_states', {
    id: 'id',
    code: { type: 'varchar(20)', notNull: true },
    label: { type: 'varchar(50)', notNull: true }
  });

  pgm.addConstraint('member_states', 'member_states_code_key', {
    unique: ['code']
  });

  // Seed inicial de member_states
  pgm.sql(`
    INSERT INTO member_states (code, label)
    VALUES
      ('ACTIVO',     'Activo'),
      ('INACTIVO',   'Inactivo'),
      ('SUSPENDIDO', 'Suspendido');
  `);

  // 3) Agregar columnas a membership_status
  pgm.addColumn('membership_status', {
    payment_state_id: { type: 'integer', notNull: true },
    member_state_id: { type: 'integer', notNull: true }
  });

  // 4) Foreign Keys
  pgm.addConstraint(
    'membership_status',
    'membership_status_payment_state_id_fkey',
    {
      foreignKeys: {
        columns: 'payment_state_id',
        references: 'payment_states(id)'
      }
    }
  );

  pgm.addConstraint(
    'membership_status',
    'membership_status_member_state_id_fkey',
    {
      foreignKeys: {
        columns: 'member_state_id',
        references: 'member_states(id)'
      }
    }
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(
    'membership_status',
    'membership_status_payment_state_id_fkey'
  );
  pgm.dropConstraint(
    'membership_status',
    'membership_status_member_state_id_fkey'
  );

  pgm.dropColumns('membership_status', ['payment_state_id', 'member_state_id']);

  pgm.dropTable('member_states');
  pgm.dropTable('payment_states');
};

exports.shorthands = {
  id: {
    type: 'serial',
    primaryKey: true
  }
};

exports.up = (pgm) => {
  pgm.createTable('attendances', {
    id: 'id',

    // Referencia al socio dentro del club (club_users)
    club_user_id: {
      type: 'integer',
      notNull: true,
      references: '"club_users"',
      onDelete: 'CASCADE'
    },

    // Fecha y hora de la asistencia
    attended_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('NOW()')
    },

    // Estado opcional (ej: PRESENTE, AUSENTE, JUSTIFICADO, etc.)
    status: {
      type: 'varchar(20)',
      notNull: false
    },

    // Notas opcionales sobre la asistencia
    notes: {
      type: 'text',
      notNull: false
    },

    // Timestamps de auditoría
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('NOW()')
    },
    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('NOW()')
    }
  });

  // Índices útiles para consultas
  pgm.createIndex('attendances', 'club_user_id');
  pgm.createIndex('attendances', ['club_user_id', 'attended_at']);
};

exports.down = (pgm) => {
  pgm.dropTable('attendances');
};

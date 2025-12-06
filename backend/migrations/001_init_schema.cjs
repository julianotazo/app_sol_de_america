exports.shorthands = {
  id: {
    type: 'serial',
    primaryKey: true
  }
};

exports.up = (pgm) => {
  // USERS (antes persons)
  pgm.createTable('users', {
    id: 'id',
    dni: { type: 'varchar(20)', notNull: true },
    last_name: { type: 'varchar(100)', notNull: true },
    first_name: { type: 'varchar(100)', notNull: true },
    birth_date: { type: 'date' },
    phone: { type: 'varchar(30)' },
    email: { type: 'varchar(180)', notNull: false },
    address: { type: 'varchar(200)' },
    created_at: { type: 'timestamp', default: pgm.func('CURRENT_TIMESTAMP') },
    updated_at: { type: 'timestamp', default: pgm.func('CURRENT_TIMESTAMP') }
  });

  pgm.addConstraint('users', 'users_dni_key', { unique: ['dni'] });
  // opcional pero recomendable: email único donde no sea null
  pgm.addConstraint('users', 'users_email_unique', {
    unique: ['email']
  });

  // BRANCHES
  pgm.createTable('branches', {
    id: 'id',
    name: { type: 'varchar(120)', notNull: true },
    description: { type: 'text' },
    address: { type: 'varchar(200)' },
    phone: { type: 'varchar(30)' },
    created_at: { type: 'timestamp', default: pgm.func('CURRENT_TIMESTAMP') },
    updated_at: { type: 'timestamp', default: pgm.func('CURRENT_TIMESTAMP') }
  });

  // ROLES
  pgm.createTable('roles', {
    id: 'id',
    name: { type: 'varchar(50)', notNull: true },
    description: { type: 'text' }
  });
  pgm.addConstraint('roles', 'roles_name_key', { unique: ['name'] });

  // SPORTS
  pgm.createTable('sports', {
    id: 'id',
    name: { type: 'varchar(100)', notNull: true }
  });
  pgm.addConstraint('sports', 'sports_name_key', { unique: ['name'] });

  // CATEGORIES
  pgm.createTable('categories', {
    id: 'id',
    name: { type: 'varchar(80)', notNull: true },
    sport_id: { type: 'integer', notNull: true },
    gender: { type: 'varchar(10)' },
    min_age: { type: 'integer' },
    max_age: { type: 'integer' }
  });

  pgm.addConstraint('categories', 'categories_sport_id_fkey', {
    foreignKeys: {
      columns: 'sport_id',
      references: 'sports(id)'
    }
  });
  pgm.addConstraint('categories', 'categories_gender_check', {
    check: "gender IN ('Masculino', 'Femenino', 'Mixto')"
  });

  // CLUB_USERS (persona dentro del club)
  pgm.createTable('club_users', {
    id: 'id',
    user_id: { type: 'integer', notNull: true }, // antes person_id
    branch_id: { type: 'integer', notNull: true },
    role_id: { type: 'integer', notNull: true },
    active: { type: 'boolean', default: true },
    join_date: { type: 'date', default: pgm.func('CURRENT_DATE') },
    notes: { type: 'text' },
    created_at: { type: 'timestamp', default: pgm.func('CURRENT_TIMESTAMP') },
    updated_at: { type: 'timestamp', default: pgm.func('CURRENT_TIMESTAMP') }
  });

  pgm.addConstraint('club_users', 'club_users_user_id_fkey', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'CASCADE'
    }
  });
  pgm.addConstraint('club_users', 'club_users_branch_id_fkey', {
    foreignKeys: {
      columns: 'branch_id',
      references: 'branches(id)'
    }
  });
  pgm.addConstraint('club_users', 'club_users_role_id_fkey', {
    foreignKeys: {
      columns: 'role_id',
      references: 'roles(id)'
    }
  });

  // MEMBERSHIP_STATUS (estado de cuotas por club_user)
  pgm.createTable('membership_status', {
    id: 'id',
    user_id: { type: 'integer', notNull: true }, // aquí es club_users.id
    month_year: { type: 'varchar(20)', notNull: true },
    is_paid: { type: 'boolean', notNull: true, default: false },
    updated_at: { type: 'timestamp', default: pgm.func('CURRENT_TIMESTAMP') }
  });

  pgm.addConstraint('membership_status', 'membership_status_user_id_fkey', {
    foreignKeys: {
      columns: 'user_id',
      references: 'club_users(id)',
      onDelete: 'CASCADE'
    }
  });
  pgm.addConstraint('membership_status', 'membership_status_uq_user_month', {
    unique: ['user_id', 'month_year']
  });

  // TEAMS
  pgm.createTable('teams', {
    id: 'id',
    name: { type: 'varchar(100)', notNull: true },
    sport_id: { type: 'integer', notNull: true },
    category_id: { type: 'integer' },
    branch_id: { type: 'integer', notNull: true },
    coach_id: { type: 'integer' },
    created_at: { type: 'timestamp', default: pgm.func('CURRENT_TIMESTAMP') },
    updated_at: { type: 'timestamp', default: pgm.func('CURRENT_TIMESTAMP') }
  });

  pgm.addConstraint('teams', 'teams_sport_id_fkey', {
    foreignKeys: {
      columns: 'sport_id',
      references: 'sports(id)'
    }
  });
  pgm.addConstraint('teams', 'teams_category_id_fkey', {
    foreignKeys: {
      columns: 'category_id',
      references: 'categories(id)'
    }
  });
  pgm.addConstraint('teams', 'teams_branch_id_fkey', {
    foreignKeys: {
      columns: 'branch_id',
      references: 'branches(id)'
    }
  });
  pgm.addConstraint('teams', 'teams_coach_id_fkey', {
    foreignKeys: {
      columns: 'coach_id',
      references: 'club_users(id)'
    }
  });

  // TEAM_PLAYERS
  pgm.createTable('team_players', {
    id: 'id',
    team_id: { type: 'integer', notNull: true },
    user_id: { type: 'integer', notNull: true }, // club_users.id
    joined_at: { type: 'date', default: pgm.func('CURRENT_DATE') },
    status: { type: 'varchar(20)', default: 'ACTIVO' }
  });

  pgm.addConstraint('team_players', 'team_players_team_id_fkey', {
    foreignKeys: {
      columns: 'team_id',
      references: 'teams(id)',
      onDelete: 'CASCADE'
    }
  });
  pgm.addConstraint('team_players', 'team_players_user_id_fkey', {
    foreignKeys: {
      columns: 'user_id',
      references: 'club_users(id)',
      onDelete: 'CASCADE'
    }
  });

  // AUTH_LOCAL (solo credenciales)
  pgm.createTable('auth_local', {
    id: 'id',
    user_id: { type: 'integer', notNull: true },
    password_hash: { type: 'varchar(255)', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('CURRENT_TIMESTAMP') }
  });

  pgm.addConstraint('auth_local', 'auth_local_user_id_fkey', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'CASCADE'
    }
  });
};

exports.down = (pgm) => {
  // El orden inverso para respetar FKs
  pgm.dropTable('auth_local');
  pgm.dropTable('team_players');
  pgm.dropTable('teams');
  pgm.dropTable('membership_status');
  pgm.dropTable('club_users');
  pgm.dropTable('categories');
  pgm.dropTable('sports');
  pgm.dropTable('roles');
  pgm.dropTable('branches');
  pgm.dropTable('users');
};

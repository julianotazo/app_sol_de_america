exports.up = (pgm) => {
  pgm.addColumn('club_users', {
    member_state_id: {
      type: 'integer',
      notNull: false
    }
  });

  pgm.addConstraint('club_users', 'club_users_member_state_fk', {
    foreignKeys: {
      columns: 'member_state_id',
      references: 'member_states(id)',
      onDelete: 'SET NULL'
    }
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('club_users', 'club_users_member_state_fk');
  pgm.dropColumn('club_users', 'member_state_id');
};

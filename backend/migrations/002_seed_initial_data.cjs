exports.shorthands = {
  id: {
    type: 'serial',
    primaryKey: true
  }
};

exports.up = (pgm) => {
  // 1) SEDES (branches)
  pgm.sql(`
    INSERT INTO branches (name, description, address, phone)
    VALUES
      (
        'Estadio',
        'Estadio de Club Sol de América de Formosa',
        'Direccion Estadio',
        '3704000001'
      ),
      (
        'Sede Principal',
        'Sede administrativa y central',
        'Direccion sede principal',
        '3704000002'
      ),
      (
        'Sede de Inferiores',
        'Sede para categorías formativas de fútbol',
        'Dirección Sede Inferiores',
        '3704000003'
      );
  `);

  // 2) ROLES
  pgm.sql(`
    INSERT INTO roles (name, description)
    VALUES
      ('ADMIN', 'Administrador del sistema y del club'),
      ('SOCIO', 'Socio/deportista del club (jugador)'),
      ('ENTRENADOR', 'Entrenador de planteles deportivos');
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DELETE FROM roles
    WHERE name IN ('ADMIN', 'ENTRENADOR', 'SOCIO');

    DELETE FROM branches
    WHERE name IN ('Estadio', 'Sede Principal', 'Sede de Inferiores');
  `);
};

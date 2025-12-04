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
        'Estadio Sol De América',
        'Estadio de Club Sol de América de Formosa',
        'Ruta Nacional 11 Lote N° 34 - Ciudad de Formosa, Provincia de Formosa',
        '3704000001'
      ),
      (
        'Sede Principal - Sol de América',
        'Sede administrativa y central',
        'Clotilde Villar Brizuela 189 - Ciudad de Formosa, Provincia de Formosa',
        '3704670577'
      ),
      (
        'Sede de Inferiores de Fútbol',
        'Sede para categorías formativas de fútbol',
        'Dirección Sede Inferiores',
        '3704000003'
      );
  `);

  // 2) ROLES
  pgm.sql(`
    INSERT INTO roles (name, description)
    VALUES
      ('Admin', 'Administrador del sistema y del club'),
      ('Socio', 'Socio/deportista del club (jugador)'),
      ('Entrenador', 'Entrenador de planteles deportivos');
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

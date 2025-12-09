const bcrypt = require('bcryptjs');

const MEMBER_COUNT = 120;

// Nombres y apellidos comunes en Argentina y especialmente en Formosa / NEA
const FIRST_NAMES = [
  'Agostina',
  'Julian',
  'Juan',
  'María',
  'Agustina',
  'Ezequiel',
  'Rodolfo',
  'Graciela',
  'Gonzalo',
  'Bruno',
  'Camila',
  'Valentina',
  'Agustín',
  'Matías',
  'Ramiro',
  'Sofía',
  'Carolina',
  'Juliana',
  'Nicolás',
  'Facundo',
  'Martina',
  'Lucía',
  'Florencia',
  'Lucio',
  'Pablo',
  'Diego',
  'Noelia',
  'Norma',
  'Sebastián',
  'Antonella',
  'Miguel',
  'Rocío'
];

const LAST_NAMES = [
  'González',
  'Benítez',
  'Insfrán',
  'Maidana',
  'Cantero',
  'Ramírez',
  'Fernández',
  'López',
  'Cabrera',
  'Gómez',
  'Ledesma',
  'Leguizamón',
  'Domínguez',
  'Sosa',
  'Flores',
  'Britez',
  'Torres',
  'García',
  'Ojeda',
  'Leiva',
  'Aranda',
  'Barrios',
  'Rojas',
  'Acuña',
  'Villalba',
  'Ortiz',
  'Vera',
  'Miño',
  'Ramón',
  'Cardozo'
];

// IDs de datos ya existentes en otras tablas
const BRANCH_IDS = [1, 2, 3];
const SPORT_IDS = [1, 2, 3, 4];
const MEMBER_STATE_IDS = [1, 2, 3]; // 1=ACTIVO, 2=INACTIVO, 3=SUSPENDIDO
const SOCIO_ROLE_ID = 2; // Coincide con seed inicial

// Utilidades de generación aleatoria y normalización
const randomIntBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randomChoice = (list) => list[randomIntBetween(0, list.length - 1)];

const removeAccents = (text) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '');

const randomDateBetween = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// Conjunto para evitar DNIs duplicados
const usedDnis = new Set();

const makeFakeMember = (index) => {
  const firstName = randomChoice(FIRST_NAMES);
  const lastName = randomChoice(LAST_NAMES);

  // Edad entre 18 y 65 años
  const now = new Date();
  const maxBirth = new Date(now);
  maxBirth.setFullYear(maxBirth.getFullYear() - 18);
  const minBirth = new Date(now);
  minBirth.setFullYear(minBirth.getFullYear() - 65);
  const birthDate = randomDateBetween(minBirth, maxBirth);

  // created_at y updated_at iguales, entre hace 4 años y hoy
  const createdAtStart = new Date(now);
  createdAtStart.setFullYear(createdAtStart.getFullYear() - 4);
  const createdAt = randomDateBetween(createdAtStart, now);
  const updatedAt = createdAt; // Igual que created_at según requerimiento

  // valid_until 4 años después de created_at
  const validUntil = new Date(createdAt);
  validUntil.setFullYear(validUntil.getFullYear() + 4);

  // DNI único básico
  let dni;
  do {
    dni = String(randomIntBetween(20000000, 50000000));
  } while (usedDnis.has(dni));
  usedDnis.add(dni);

  // email basado en nombre + índice, usado luego como usuario (password = dni)
  const slugFirst = removeAccents(firstName).toLowerCase();
  const slugLast = removeAccents(lastName).toLowerCase();
  const email = `${slugFirst}.${slugLast}.${index}@clubsol.com`;

  // Teléfono con característica de Formosa (3704)
  const phone = `3704${randomIntBetween(100000, 999999)}`;

  // Distribución de estado: mayormente activos
  const stateRoll = Math.random();
  const memberStateId = stateRoll < 0.7 ? MEMBER_STATE_IDS[0] : stateRoll < 0.9 ? MEMBER_STATE_IDS[1] : MEMBER_STATE_IDS[2];

  // Dirección al estilo solicitado
  const address = `Barrio Nueva Formosa Mz ${randomIntBetween(1, 30)} Casa ${randomIntBetween(1, 120)}`;

  return {
    first_name: firstName,
    last_name: lastName,
    dni,
    email,
    phone,
    address,
    birth_date: birthDate,
    created_at: createdAt,
    updated_at: updatedAt,
    valid_until: validUntil,
    branch_id: randomChoice(BRANCH_IDS),
    sport_id: randomChoice(SPORT_IDS),
    member_state_id: memberStateId
  };
};

const buildPlaceholders = (rows, columns) =>
  rows
    .map((_, rowIndex) => {
      const base = rowIndex * columns.length;
      const placeholders = columns.map((__, colIndex) => `$${base + colIndex + 1}`);
      return `(${placeholders.join(', ')})`;
    })
    .join(',\n');

exports.shorthands = { id: { type: 'serial', primaryKey: true } };

exports.up = async (pgm) => {
  const members = Array.from({ length: MEMBER_COUNT }, (_, index) => makeFakeMember(index + 1));

  // 1) Insertar usuarios
  const userColumns = [
    'dni',
    'last_name',
    'first_name',
    'birth_date',
    'phone',
    'email',
    'address',
    'created_at',
    'updated_at'
  ];

  const userValuesSql = buildPlaceholders(members, userColumns);
  const userValues = members.flatMap((member) => [
    member.dni,
    member.last_name,
    member.first_name,
    member.birth_date,
    member.phone,
    member.email,
    member.address,
    member.created_at,
    member.updated_at
  ]);

  const userInsertQuery = `INSERT INTO users (${userColumns.join(', ')}) VALUES ${userValuesSql} RETURNING id, dni, email, birth_date, created_at;`;
  const { rows: insertedUsers } = await pgm.db.query(userInsertQuery, userValues);

  // 2) Insertar credenciales locales (password = DNI como en crear socio)
  const authColumns = ['user_id', 'password_hash'];
  const authValues = insertedUsers.flatMap(({ id, dni }) => [id, bcrypt.hashSync(dni, 10)]);
  const authValuesSql = buildPlaceholders(insertedUsers, authColumns);
  const authInsertQuery = `INSERT INTO auth_local (${authColumns.join(', ')}) VALUES ${authValuesSql};`;
  await pgm.db.query(authInsertQuery, authValues);

  // 3) Insertar club_users con estado y deporte elegido
  const clubColumns = ['user_id', 'branch_id', 'role_id', 'member_state_id', 'join_date', 'notes', 'created_at', 'updated_at'];
  const clubValues = insertedUsers.flatMap((user, index) => [
    user.id,
    members[index].branch_id,
    SOCIO_ROLE_ID,
    members[index].member_state_id,
    members[index].created_at,
    `Socio generado por seed (${members[index].sport_id})`,
    members[index].created_at,
    members[index].updated_at
  ]);
  const clubValuesSql = buildPlaceholders(insertedUsers, clubColumns);
  const clubInsertQuery = `INSERT INTO club_users (${clubColumns.join(', ')}) VALUES ${clubValuesSql};`;
  await pgm.db.query(clubInsertQuery, clubValues);
};

exports.down = async (pgm) => {
  // Eliminamos socios creados por este seed identificando el dominio utilizado
  await pgm.db.query("DELETE FROM club_users WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@clubsol.com');");
  await pgm.db.query("DELETE FROM auth_local WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@clubsol.com');");
  await pgm.db.query("DELETE FROM users WHERE email LIKE '%@clubsol.com';");
};
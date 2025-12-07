// Utilidades para determinar el rol del usuario
function parseJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decodificando token JWT:', error);
    return null;
  }
}

function normalizeRoleString(role) {
  if (!role) return null;
  const normalized = role.toString().toLowerCase();

  if (normalized.includes('admin')) return 'admin';
  if (normalized.includes('socio') || normalized.includes('member'))
    return 'socio';

  return null;
}

function getRoleFromData(data) {
  if (!data) return null;

  const roleId =
    data.role_id ??
    data.roleId ??
    data.roleID ??
    data.rol_id ??
    data.rolId ??
    data.rolID;

  if (roleId === 1) return 'admin';
  if (roleId) return 'socio';

  return (
    normalizeRoleString(
      data.role || data.rol || data.role_name || data.roleName
    ) ?? null
  );
}

export function resolveRole(user, token) {
  return (
    getRoleFromData(user) ||
    (token ? getRoleFromData(parseJwtPayload(token)) : null)
  );
}

export function isAdmin(user, token) {
  return resolveRole(user, token) === 'admin';
}

export function isSocio(user, token) {
  return resolveRole(user, token) === 'socio';
}

export { parseJwtPayload };

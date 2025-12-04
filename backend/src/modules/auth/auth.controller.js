import jwt from 'jsonwebtoken';
import * as service from './auth.service.js';

/** Registro de usuario */
export const register = async (req, res, next) => {
  try {
    const user = await service.registerUser(req.body);
    res.status(201).json({ message: 'Usuario registrado', user });
  } catch (err) {
    next(err);
  }
};

/** Login de usuario */
export const login = async (req, res, next) => {
  try {
    // ahora loginUser devuelve un string (JWT)
    const token = await service.loginUser(req.body);
    res.status(200).json({ message: 'Login exitoso', token });
  } catch (err) {
    next(err);
  }
};

/** Middleware para proteger rutas: verifica JWT */
export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [, token] = authHeader.split(' '); // "Bearer xxx" → ["Bearer", "xxx"]

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'secret';
    const payload = jwt.verify(token, secret); // { sub, email, name, roleId, role, ... }
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
/** en el catch de arriba se borro (err) porque la variable estaba declarada pero no se usaba */

/** Middleware para restringir a administradores */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res
      .status(500)
      .json({ error: 'No se encontró usuario en la request (req.user)' });
  }

  const { roleId, role } = req.user;

  // Admin por id o por nombre de rol
  const isAdmin = roleId === 1 || role === 'Admin' || role === 'ADMIN'; // por si en DB está en mayúsculas

  if (!isAdmin) {
    return res
      .status(403)
      .json({ error: 'Acceso restringido: solo administradores' });
  }

  next();
};

/** Datos del usuario autenticado */
export const me = async (req, res) => {
  // req.user viene desde requireAuth
  if (!req.user) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  res.json({
    user: req.user
  });
};

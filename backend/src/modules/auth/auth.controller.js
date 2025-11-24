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

/** Middleware para proteger rutas */
export const requireAuth = (req, res, next) => {
  // Aquí podrías validar el JWT
  next();
};

/** Datos del usuario autenticado */
export const me = async (req, res) => {
  res.json({ message: 'Datos del usuario autenticado (ejemplo)' });
};

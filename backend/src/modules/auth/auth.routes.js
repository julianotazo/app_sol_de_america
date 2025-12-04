// src/modules/auth/auth.routes.js
import { Router } from 'express';
import * as ctrl from './auth.controller.js';
import { validate } from './auth.validators.js';

const r = Router();

// Solo admin logueado puede registrar usuarios
r.post(
  '/register',
  ctrl.requireAuth,
  ctrl.requireAdmin,
  validate('register'),
  ctrl.register
);

r.post('/login', validate('login'), ctrl.login);

// /me ahora devuelve los datos del token
r.get('/me', ctrl.requireAuth, ctrl.me);

export default r;

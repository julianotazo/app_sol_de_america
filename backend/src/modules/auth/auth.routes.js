import { Router } from 'express';
import * as ctrl from './auth.controller.js';
import { validate } from './auth.validators.js';

const r = Router();

r.post('/register', validate('register'), ctrl.register);
r.post('/login', validate('login'), ctrl.login);
r.get('/me', ctrl.requireAuth, ctrl.me);

export default r;

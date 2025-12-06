import { Router } from 'express';
import { requireAuth, requireAdmin } from '../auth/auth.controller.js';
import {
  listSocios,
  getSocio,
  createSocioController,
  updateSocioController,
  deleteSocioController,
  addPagoController,
  listPagosController,
  addAsistenciaController,
  listAsistenciasController
} from './socios.controller.js';
import { validateSocios } from './socios.validators.js';

const r = Router();

// Todas requieren estar autenticado
r.use(requireAuth);

// SOCIOS
r.get('/', listSocios);
r.get('/:id', getSocio);

// Solo admin puede crear/editar/eliminar socios
r.post('/', requireAdmin, validateSocios('create'), createSocioController);
r.put('/:id', requireAdmin, validateSocios('update'), updateSocioController);
r.delete('/:id', requireAdmin, deleteSocioController);

// PAGOS
r.post('/:id/pagos', requireAdmin, validateSocios('pago'), addPagoController);
r.get('/:id/pagos', listPagosController);

// ASISTENCIAS
r.post(
  '/:id/asistencias',
  requireAdmin,
  validateSocios('asistencia'),
  addAsistenciaController
);
r.get('/:id/asistencias', listAsistenciasController);

export default r;

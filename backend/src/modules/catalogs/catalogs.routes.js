import { Router } from 'express';
import { listBranches, listRoles } from './catalogs.controller.js';

const router = Router();

// GET /api/branches
router.get('/branches', listBranches);

// GET /api/roles
router.get('/roles', listRoles);

export default router;

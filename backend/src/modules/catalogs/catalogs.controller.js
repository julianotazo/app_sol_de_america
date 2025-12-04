import { getAllBranches, getAllRoles } from './catalogs.service.js';

export async function listBranches(req, res, next) {
  try {
    const branches = await getAllBranches();
    res.json(branches);
  } catch (error) {
    next(error);
  }
}

export async function listRoles(req, res, next) {
  try {
    const roles = await getAllRoles();
    res.json(roles);
  } catch (error) {
    next(error);
  }
}

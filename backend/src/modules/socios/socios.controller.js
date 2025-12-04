import {
  getAllSocios,
  getSocioById,
  createSocio,
  updateSocio,
  deleteSocio,
  addPago,
  getPagos,
  addAsistencia,
  getAsistencias
} from './socios.service.js';

export async function listSocios(req, res, next) {
  try {
    const socios = await getAllSocios();
    res.json(socios);
  } catch (error) {
    next(error);
  }
}

export async function getSocio(req, res, next) {
  try {
    const { id } = req.params;
    const socio = await getSocioById(Number(id));

    if (!socio) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }

    res.json(socio);
  } catch (error) {
    next(error);
  }
}

export async function createSocioController(req, res, next) {
  try {
    const result = await createSocio(req.body);
    res.status(201).json({ message: 'Socio creado', socio: result });
  } catch (error) {
    next(error);
  }
}

export async function updateSocioController(req, res, next) {
  try {
    const { id } = req.params;

    try {
      await updateSocio(Number(id), req.body);
    } catch (err) {
      if (err.message === 'SOCIO_NOT_FOUND') {
        return res.status(404).json({ error: 'Socio no encontrado' });
      }
      throw err;
    }

    res.json({ message: 'Socio actualizado' });
  } catch (error) {
    next(error);
  }
}

export async function deleteSocioController(req, res, next) {
  try {
    const { id } = req.params;
    const count = await deleteSocio(Number(id));
    if (count === 0) {
      return res.status(404).json({ error: 'Socio no encontrado' });
    }
    res.json({ message: 'Socio eliminado' });
  } catch (error) {
    next(error);
  }
}

// PAGOS
export async function addPagoController(req, res, next) {
  try {
    const { id } = req.params;
    const pago = await addPago(Number(id), req.body);
    res.status(201).json({ message: 'Pago registrado', pago });
  } catch (error) {
    next(error);
  }
}

export async function listPagosController(req, res, next) {
  try {
    const { id } = req.params;
    const pagos = await getPagos(Number(id));
    res.json(pagos);
  } catch (error) {
    next(error);
  }
}

// ASISTENCIAS
export async function addAsistenciaController(req, res, next) {
  try {
    const { id } = req.params;
    const asistencia = await addAsistencia(Number(id), req.body);
    res.status(201).json({ message: 'Asistencia registrada', asistencia });
  } catch (error) {
    next(error);
  }
}

export async function listAsistenciasController(req, res, next) {
  try {
    const { id } = req.params;
    const asistencias = await getAsistencias(Number(id));
    res.json(asistencias);
  } catch (error) {
    next(error);
  }
}

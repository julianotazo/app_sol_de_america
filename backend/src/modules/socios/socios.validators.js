import { z } from 'zod';

const baseSocioSchema = z.object({
  dni: z.string().min(6),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  birth_date: z.string().optional(), // 'YYYY-MM-DD'
  phone: z.string().optional(),
  email: z.string().email(),
  address: z.string().optional(),

  branch_id: z.number().int().optional(), // se puede usar default en servicio
  role_id: z.number().int().optional() // normalmente será rol Socio
});

const createSocioSchema = baseSocioSchema;

const updateSocioSchema = baseSocioSchema.partial(); // todos opcionales

const pagoSchema = z.object({
  month_year: z.string(), // ej: '2025-12-01' o '2025-12'
  payment_state_id: z.number().int(),
  member_state_id: z.number().int(),
  is_paid: z.boolean().optional()
});

const asistenciaSchema = z.object({
  date: z.string(), // 'YYYY-MM-DD'
  status: z.string().optional(), // ej: 'PRESENTE' / 'AUSENTE'
  notes: z.string().optional()
});

export function validateSocios(type) {
  return (req, res, next) => {
    try {
      let schema;

      if (type === 'create') schema = createSocioSchema;
      else if (type === 'update') schema = updateSocioSchema;
      else if (type === 'pago') schema = pagoSchema;
      else if (type === 'asistencia') schema = asistenciaSchema;
      else throw new Error('Tipo de validación no soportado');

      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({ error: 'Datos inválidos', details: error });
    }
  };
}

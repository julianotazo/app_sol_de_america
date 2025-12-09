import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),

  dni: z.string().min(6),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  birth_date: z.string().optional(), // ISO date o vacío
  phone: z.string().min(6),
  address: z.string().optional(),

  branch_id: z.number().int().optional(),
  role_id: z.number().int().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const updateProfileSchema = z
  .object({
    first_name: z.string().min(2).optional(),
    last_name: z.string().min(2).optional(),
    phone: z.string().min(6).optional(),
    email: z.string().email().optional(),
    address: z.string().optional(),
    birth_date: z.string().optional(),
    dni: z.string().min(6).optional()
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    'Debes enviar al menos un campo a actualizar'
  );

export function validate(type) {
  const schemas = {
    register: registerSchema,
    login: loginSchema,
    updateProfile: updateProfileSchema
  };
  return (req, res, next) => {
    try {
      const schema = schemas[type];
      if (!schema) {
        return res.status(500).json({ error: 'Validador no configurado' });
      }
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({ error: 'Datos inválidos', details: error });
    }
  };
}

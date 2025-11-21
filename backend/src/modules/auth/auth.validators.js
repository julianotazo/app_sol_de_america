import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),

  dni: z.string().min(6),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  birth_date: z.string().optional(), // ISO date o vacío
  phone: z.string().optional(),
  address: z.string().optional(),

  branch_id: z.number().int().optional(),
  role_id: z.number().int().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export function validate(type) {
  return (req, res, next) => {
    try {
      const schema = type === 'register' ? registerSchema : loginSchema;
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({ error: 'Datos inválidos', details: error });
    }
  };
}

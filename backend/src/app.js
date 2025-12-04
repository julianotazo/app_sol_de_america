import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './modules/auth/auth.routes.js';
import sociosRoutes from './modules/socios/socios.routes.js';
import catalogsRoutes from './modules/catalogs/catalogs.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

export const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/socios', sociosRoutes);
app.use('/api', catalogsRoutes);

// Manejo global de errores
app.use(errorMiddleware);

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './modules/auth/auth.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);

app.use(errorMiddleware);

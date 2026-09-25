import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import env from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import recipientRoutes from './routes/recipientRoutes.js';
import driverRoutes from './routes/driverRoutes.js';
import rescueRoutes from './routes/rescueRoutes.js';
import impactRoutes from './routes/impactRoutes.js';
import intakeRoutes from './routes/intakeRoutes.js';
import whatsappRoutes from './routes/whatsappRoutes.js';
import { authOptional } from './middleware/auth.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

const allowedOrigins = new Set([env.clientOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173']);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error(`CORS origin not allowed: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(authOptional);

app.get('/api/health', (_req, res) => res.json({ success: true, service: 'RescueLoop API', status: 'ok', time: new Date().toISOString() }));
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/recipients', recipientRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/rescues', rescueRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/intake', intakeRoutes);
app.use('/api/whatsapp', whatsappRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { db } from './config/firebase.js';
import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/users/users.routes.js';
import campaignRoutes from './modules/campaigns/campaign.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import trackingRoutes from './modules/tracking/tracking.routes.js';
import errorHandler from './middleware/error.middleware.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/tracking', trackingRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'AttackSimulator API is running 🚀' });
});

// Error handler
app.use(errorHandler);

export default app;
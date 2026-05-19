import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import Route Handlers
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import workerRoutes from './routes/worker.routes.js';
import materialRoutes from './routes/material.routes.js';
import financeRoutes from './routes/finance.routes.js';
import reportRoutes from './routes/report.routes.js';
import alertRoutes from './routes/alert.routes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Base Route
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    message: 'ConstructOps API is online',
    timestamp: new Date(),
  });
});

// Bind API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/workers', workerRoutes);
app.use('/api/v1/materials', materialRoutes);
app.use('/api/v1/expenses', financeRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/alerts', alertRoutes);

// Error Handling Middleware
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

export default app;

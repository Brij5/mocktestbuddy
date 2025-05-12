// console.log('[DEBUG] Top of server/app.js');

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from './utils/logger.js';
import config from './config/config.js';
import { errorHandler, notFound, apiNotFound } from './middleware/error/errorMiddleware.js';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import main API router
import allApiRoutes from './routes/index.js'; 

// Create Express app
const app = express();

// 1) GLOBAL MIDDLEWARES

// Set security HTTP headers
app.use(helmet());

// Development logging
if (config.env === 'development') {
  const morgan = await import('morgan'); 
  app.use(morgan.default('dev'));
}

// Enable CORS
app.use(cors(config.corsOptions));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Serving static files 
// app.use(express.static(path.join(__dirname, 'public'))); 

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) ROUTES
// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Exam Buddy API is running!',
    documentation: '/api-docs',
    environment: config.env,
    timestamp: new Date().toISOString()
  });
});

// Mount all API routes from routes/index.js
app.use('/api', allApiRoutes);

// Handle 404 for API routes
app.all('/api/*', apiNotFound);

// Serve Frontend in production (Example - needs refinement)
if (config.env === 'production') {
  // Correct path to client build directory
  const clientBuildPath = path.resolve(__dirname, '../client/dist'); 
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(clientBuildPath, 'index.html'));
  });
} else {
  // Handle 404 for non-API routes in development
  app.use('*', notFound);
}

// Global error handling middleware
app.use(errorHandler);

// 3) START SERVER (Logic moved to start.js)
// ... removed server start logic ...

export default app;

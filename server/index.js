import express from 'express';
import cors from 'cors';
import path from 'path';

// Import config
import config from './config/config.js';

// Import database connection
import connectDB from './config/db.js';

// Import routes
import apiRoutes from './routes/index.js';

// Import middleware
import { error } from './middleware/index.js';

const { server: serverConfig, paths } = config;

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: serverConfig.isProduction ? serverConfig.clientUrl : '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log requests in development
if (serverConfig.isDevelopment) {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`); 
    next();
  });
}

// API Routes
app.use('/api', apiRoutes);

// Serve static files in production
if (serverConfig.isProduction) {
  // Set static folder
  app.use(express.static(paths.client + '/dist'));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(paths.client, 'dist', 'index.html'));
  });
}

// Basic Route
app.get('/', (req, res) => {
  res.send('Exam Buddy API is running!');
});

// Error Handling Middleware
app.use(error.notFound);
app.use(error.errorHandler);

let server; 

const startServer = async () => {
  try {
    await connectDB(); 

    server = app.listen(serverConfig.port, () => {
      console.log(`Server running in ${serverConfig.nodeEnv} mode on port ${serverConfig.port}`);
      console.log(`API: http://localhost:${serverConfig.port}/api`);
      console.log(`Client URL: ${serverConfig.clientUrl}`); 
    });

  } catch (err) {
    console.error('Failed to connect to the database or start server.', err);
    process.exit(1); 
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`, err);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

startServer();

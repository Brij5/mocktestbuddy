import mongoose from 'mongoose';
import { logger } from './logger.js';
import config from '../config/config.js';

// Remove Mongoose's deprecated warning
mongoose.set('strictQuery', false);

// Set up event listeners for MongoDB connection
const setupMongooseEventListeners = () => {
  mongoose.connection.on('connected', () => {
    logger.info('MongoDB connected successfully');
  });

  mongoose.connection.on('error', (err) => {
    logger.error(`MongoDB connection error: ${err}`);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  // Close the Mongoose connection when the Node process ends
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed due to app termination');
    process.exit(0);
  });
};

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    // Setup event listeners
    setupMongooseEventListeners();

    // Connect to MongoDB
    await mongoose.connect(config.mongo.uri, config.mongo.options);
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB database
 * @returns {Promise<void>}
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
  } catch (error) {
    logger.error(`Error disconnecting from MongoDB: ${error.message}`);
    throw error;
  }
};

/**
 * Drop the entire database (use with caution!)
 * @returns {Promise<void>}
 */
const dropDatabase = async () => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cannot drop database in production environment');
  }

  try {
    await mongoose.connection.dropDatabase();
    logger.info('Database dropped successfully');
  } catch (error) {
    logger.error(`Error dropping database: ${error.message}`);
    throw error;
  }
};

export { connectDB, disconnectDB, dropDatabase };

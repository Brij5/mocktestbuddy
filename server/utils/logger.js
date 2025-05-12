import winston from 'winston';
import config from '../config/config.js';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { combine, timestamp, printf, colorize, json } = winston.format;

// Custom format for console output
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  const log = `${timestamp} [${level}]: ${stack || message}`;
  return log;
});

// Create a logger instance
const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info', // Log more levels in development
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }), // Include stack traces in errors
    config.env === 'development' 
      ? combine(colorize(), consoleFormat) // Pretty print for development
      : json() // JSON format for production
  ),
  defaultMeta: { service: 'exam-buddy-api' },
  transports: [
    // Write all logs with level `error` and below to `error.log`
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    // Write all logs with level `info` and below to `combined.log`
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
});

// If we're not in production, log to the console as well
if (config.env !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), consoleFormat),
    })
  );
}

// Create logs directory if it doesn't exist
if (process.env.NODE_ENV !== 'test') {
  const logDir = 'logs';
  if (!existsSync(logDir)) {
    mkdirSync(logDir, { recursive: true });
  }
}

export { logger };

// Example usage:
// logger.error('Error message', { error });
// logger.warn('Warning message');
// logger.info('Info message');
// logger.debug('Debug message');

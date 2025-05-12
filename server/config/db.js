import mongoose from 'mongoose';
import config from './config.js';

const { mongo } = config;

// Handle MongoDB connection events
const connectDB = async () => {
  try {
    console.log('🔌 Attempting to connect to MongoDB...');
    
    // Close any existing connections first
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    
    // Connect to MongoDB
    const conn = await mongoose.connect(mongo.uri, mongo.options);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Log the current collections in development
    if (config.server.isDevelopment) {
      const collections = await conn.connection.db.listCollections().toArray();
      console.log('📚 Available collections:', collections.map(c => c.name));
    }
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Full Error:', error);
    process.exit(1);
  }
};

export default connectDB;

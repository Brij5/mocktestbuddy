import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/user/User.js';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Use MONGODB_URI from environment variables, or default to exam-buddy-dev
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/exam-buddy-dev';

const checkDbConnection = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    
    console.log('✅ MongoDB connected successfully');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📚 Collections in database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Check users collection
    const users = await User.find({});
    console.log('\n👥 Users in database:');
    if (users.length === 0) {
      console.log('No users found in the database');
    } else {
      users.forEach(user => {
        console.log(`- ${user.name} (${user.email}) - ${user.role}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    if (error.name === 'MongoServerSelectionError') {
      console.error('Please make sure MongoDB is running and accessible');
    }
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

checkDbConnection();

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/exam-buddy');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

// Dummy user data
const dummyUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123', // Will be hashed
    role: 'Admin',
    isVerified: true
  },
  {
    name: 'Student User',
    email: 'student@example.com',
    password: 'student123', // Will be hashed
    role: 'Student',
    isVerified: true
  },
  {
    name: 'Exam Manager',
    email: 'exammanager@example.com',
    password: 'manager123', // Will be hashed
    role: 'ExamManager',
    isVerified: true
  }
];

// Seed the database
const seedDatabase = async () => {
  try {
    // Delete existing users
    await User.deleteMany({});
    console.log('Deleted existing users');

    // Create new users
    const users = await User.create(dummyUsers);
    console.log('Created users:', users.length);

    // Close the connection
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the script
connectDB().then(() => seedDatabase());

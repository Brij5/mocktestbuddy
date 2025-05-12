import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import bcrypt from 'bcryptjs';

dotenv.config();

// Import models
import User from './models/User.js';
import ExamCategory from './models/ExamCategory.js';
import Exam from './models/Exam.js';

// Helper function to hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'Admin',
    isVerified: true
  },
  {
    name: 'Exam Manager',
    email: 'exammanager@example.com',
    password: 'manager123',
    role: 'ExamManager',
    isVerified: true
  },
  {
    name: 'Priya',
    email: 'priya@example.com',
    password: 'priya123',
    role: 'Student',
    isVerified: true
  },
  {
    name: 'Rahul',
    email: 'rahul@example.com',
    password: 'rahul123',
    role: 'Student',
    isVerified: true
  }
];

const categories = [
  {
    name: 'Civil Services',
    description: 'Exams for Civil Services and Government Jobs'
  },
  {
    name: 'SSC',
    description: 'Staff Selection Commission Exams'
  },
  {
    name: 'Banking',
    description: 'Banking and Financial Sector Exams'
  },
  {
    name: 'University Entrance',
    description: 'University Entrance Exams including CUET'
  }
];

const exams = [
  {
    name: 'UPSC Civil Services Exam',
    description: 'Union Public Service Commission Civil Services Exam',
    category: 'Civil Services',
    durationMinutes: 180,
    totalMarks: 200,
    passingMarks: 100,
    isActive: true
  },
  {
    name: 'SSC CGL',
    description: 'Staff Selection Commission Combined Graduate Level Exam',
    category: 'SSC',
    durationMinutes: 120,
    totalMarks: 200,
    passingMarks: 100,
    isActive: true
  },
  {
    name: 'IBPS PO',
    description: 'Institute of Banking Personnel Selection Probationary Officer Exam',
    category: 'Banking',
    durationMinutes: 120,
    totalMarks: 200,
    passingMarks: 100,
    isActive: true
  },
  {
    name: 'CUET-UG',
    description: 'Common University Entrance Test for Undergraduate Programs',
    category: 'University Entrance',
    durationMinutes: 180,
    totalMarks: 400,
    passingMarks: 200,
    isActive: true
  }
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Delete existing data
    await User.deleteMany();
    await ExamCategory.deleteMany();
    await Exam.deleteMany();

    // Insert categories first since exams reference them
    const categoryDocs = await ExamCategory.insertMany(categories);
    
    // Update category IDs in exams
    exams.forEach(exam => {
      const category = categories.find(cat => cat.name === exam.category);
      if (category) {
        exam.category = categoryDocs.find(cat => cat.name === category.name)._id;
      }
    });
    
    // Insert exams
    await Exam.insertMany(exams);
    
    // Insert users with hashed passwords
    for (const user of users) {
      const hashedPassword = await hashPassword(user.password);
      user.password = hashedPassword;
    }
    await User.insertMany(users);
    
    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

importData();

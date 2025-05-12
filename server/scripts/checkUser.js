import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/user/User.js';

dotenv.config();

// User credentials for testing
const testUsers = [
  {
    email: 'admin@exambuddy.com',
    password: 'Admin@Secure123',
    role: 'Admin'
  },
  {
    email: 'manager@exambuddy.com',
    password: 'Manager@Secure456',
    role: 'ExamManager'
  },
  {
    email: 'priya@exambuddy.com',
    password: 'Student@Secure789',
    role: 'Student'
  }
];

const checkUser = async (userData) => {
  try {
    const { email, password, role } = userData;
    
    // Find user by email with password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log(`❌ ${role} user not found`);
      return false;
    }

    console.log(`\n✅ ${role} user found:`);
    console.log(`- Name: ${user.name}`);
    console.log(`- Email: ${user.email}`);
    console.log(`- Role: ${user.role}`);
    console.log(`- Is verified: ${user.isVerified}`);
    
    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(`- Password match: ${passwordMatch ? '✅' : '❌'}`);

    return passwordMatch;
  } catch (error) {
    console.error(`Error checking ${userData.role} user:`, error);
    return false;
  }
};

const checkAllUsers = async () => {
  try {
    // Connect to MongoDB
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exam-buddy');
    console.log('✅ MongoDB connected');

    // Check all test users
    let allUsersValid = true;
    for (const user of testUsers) {
      const isValid = await checkUser(user);
      if (!isValid) {
        allUsersValid = false;
      }
    }

    // Check if all users are valid
    if (allUsersValid) {
      console.log('\n🎉 All users are valid and can log in!');
    } else {
      console.log('\n⚠️ Some users have issues. Please check the logs above.');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

// Run the check
checkAllUsers();

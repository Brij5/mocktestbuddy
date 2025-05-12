import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors'; // Optional: for colorful console output
import users from './data/users.js'; // Import dummy users
import connectDB from './config/db.js';

// Load Models
import User from './models/User.js'; // Needed if seeding users or relating exams to users later
import ExamCategory from './models/ExamCategory.js';
import Exam from './models/Exam.js';

// Load env vars
dotenv.config();

// Connect to DB
// Note: connectDB function already exists and handles connection.
// We could call it, or replicate the connection logic here specifically for the seeder.
// Calling connectDB might be cleaner if it doesn't exit on error immediately.
// Let's try calling connectDB first.

// Dummy Data (Based on PROJECT_REQUIREMENTS.md)
const categories = [
  {
    name: 'Banking Exams',
    description: 'Mock tests for various banking recruitment exams like IBPS PO, SBI Clerk, etc.',
  },
  {
    name: 'SSC Exams',
    description: 'Preparation tests for Staff Selection Commission exams including CGL, CHSL, etc.',
  },
  {
    name: 'UPSC Civil Services',
    description: 'Practice tests for the Union Public Service Commission Civil Services Examination (IAS, IPS, etc.).',
  },
  {
    name: 'Engineering Entrance',
    description: 'Mock tests for engineering entrance exams like JEE Main, JEE Advanced, BITSAT.',
  },
  {
    name: 'Medical Entrance',
    description: 'Preparation tests for medical entrance exams like NEET.',
  },
];

// Placeholder for exams - we need category IDs first
const exams = (
  categoryMap // categoryMap will map category names to their DB IDs
) => [
  // Banking
  {
    name: 'IBPS PO Prelims Mock Test 1',
    description: 'A full mock test simulating the IBPS PO Preliminary Exam pattern.',
    category: categoryMap['Banking Exams'],
    durationMinutes: 60,
    totalMarks: 100,
    passingMarks: 65,
    isActive: true,
  },
  {
    name: 'SBI Clerk Mains Mock Test 1',
    description: 'Comprehensive mock test for the SBI Clerk Mains examination.',
    category: categoryMap['Banking Exams'],
    durationMinutes: 160, // 2 hours 40 mins
    totalMarks: 200,
    passingMarks: 90,
    isActive: true,
  },
  // SSC
  {
    name: 'SSC CGL Tier 1 Mock Test 1',
    description: 'Practice test covering Quantitative Aptitude, Reasoning, English, and General Awareness for SSC CGL Tier 1.',
    category: categoryMap['SSC Exams'],
    durationMinutes: 60,
    totalMarks: 200,
    passingMarks: 130,
    isActive: true,
  },
  // UPSC
  {
    name: 'UPSC Prelims GS Paper 1 Mock Test 1',
    description: 'General Studies Paper 1 mock test for UPSC Civil Services Prelims.',
    category: categoryMap['UPSC Civil Services'],
    durationMinutes: 120,
    totalMarks: 200,
    passingMarks: 98, // Approx cutoff varies
    isActive: true,
  },
  // Engineering
  {
    name: 'JEE Main Full Syllabus Mock Test 1',
    description: 'Simulates the JEE Main exam with questions from Physics, Chemistry, and Mathematics.',
    category: categoryMap['Engineering Entrance'],
    durationMinutes: 180,
    totalMarks: 300,
    passingMarks: 90, // Approx percentile cutoff varies greatly
    isActive: true,
  },
  // Medical
  {
    name: 'NEET Biology Mock Test 1',
    description: 'Focuses on the Biology section (Botany & Zoology) for NEET preparation.',
    category: categoryMap['Medical Entrance'],
    durationMinutes: 90, // Part of the full 3hr 20min test
    totalMarks: 360, // Biology portion
    passingMarks: 280, // Indicative for biology section
    isActive: true,
  },
  {
    name: 'NEET Chemistry Mock Test 1',
    description: 'Focuses on the Chemistry section for NEET preparation.',
    category: categoryMap['Medical Entrance'],
    durationMinutes: 90, // Part of the full 3hr 20min test
    totalMarks: 360, // Chemistry portion
    passingMarks: 280, // Indicative for chemistry section
    isActive: true,
  },
  {
    name: 'NEET Physics Mock Test 1',
    description: 'Focuses on the Physics section for NEET preparation.',
    category: categoryMap['Medical Entrance'],
    durationMinutes: 90, // Part of the full 3hr 20min test
    totalMarks: 360, // Physics portion
    passingMarks: 280, // Indicative for physics section
    isActive: true,
  },
];

// Import data into DB
const importData = async () => {
  try {
    // Clear existing data
    await Exam.deleteMany();
    await ExamCategory.deleteMany();
    await User.deleteMany();

    console.log('Existing data cleared.'.yellow);

    // Insert Users individually to trigger pre-save hooks (password hashing)
    console.log('Importing users...'.cyan);
    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(` -> User '${user.email}' created.`.grey);
    }
    console.log(`Users Imported: ${createdUsers.length}`.green.inverse);

    // Insert Categories
    const createdCategories = await ExamCategory.insertMany(categories);
    console.log(`Categories Imported: ${createdCategories.length}`.green.inverse);

    // Create a map of category names to IDs for exam linking
    const categoryMap = createdCategories.reduce((map, category) => {
      map[category.name] = category._id;
      return map;
    }, {});

    // Prepare exams with correct category IDs
    const examsToCreate = exams(categoryMap); // Generate exams with IDs

    // Insert Exams
    const createdExams = await Exam.insertMany(examsToCreate);
    console.log(`Exams Imported: ${createdExams.length}`.green.inverse);

    console.log('Data Imported Successfully!'.green.bold);
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error}`.red.inverse);
    process.exit(1);
  }
};

// Destroy data from DB
const destroyData = async () => {
  try {
    await Exam.deleteMany();
    await ExamCategory.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error}`.red.inverse);
    process.exit(1);
  }
};

// Connect to DB before running import/destroy
const runSeeder = async () => {
  await connectDB(); // Ensure DB is connected

  if (process.argv[2] === '-d') {
    await destroyData();
  } else {
    await importData();
  }
};

// Execute the seeder function
runSeeder();

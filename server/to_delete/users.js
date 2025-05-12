// Dummy user data for seeding

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123', // This will be hashed by the pre-save hook
    role: 'Admin',
    isVerified: true // Assume admin is pre-verified
  },
  {
    name: 'Test Student',
    email: 'student@example.com',
    password: 'password123',
    role: 'Student', // Default, but explicitly set here
    isVerified: true // Assume student is pre-verified for testing ease
  },
  {
    name: 'Exam Manager User',
    email: 'manager@example.com',
    password: 'password123',
    role: 'ExamManager',
    isVerified: true // Assume manager is pre-verified
  },
  // Add more users as needed
];

export default users;

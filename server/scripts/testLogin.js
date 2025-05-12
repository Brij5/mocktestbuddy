import axios from 'axios';

// Test users with their credentials
const testUsers = [
  {
    email: 'admin@exambuddy.com',
    password: 'Admin@Secure123',
    role: 'Admin',
    name: 'Admin User'
  },
  {
    email: 'manager@exambuddy.com',
    password: 'Manager@Secure456',
    role: 'Exam Manager',
    name: 'Exam Manager'
  },
  {
    email: 'priya@exambuddy.com',
    password: 'Student@Secure789',
    role: 'Student',
    name: 'Priya Sharma'
  }
];

const testLogin = async (user) => {
  console.log(`\n🔐 Testing login for ${user.role} (${user.email})...`);
  
  try {
    const response = await axios.post('http://localhost:5001/api/user/login', {
      email: user.email,
      password: user.password
    });
    
    console.log('✅ Login successful!');
    console.log('🔑 Token received:', response.data.token ? '✅' : '❌ (missing token)');
    console.log('👤 User data:', {
      id: response.data._id,
      name: response.data.name,
      email: response.data.email,
      role: response.data.role
    });
    
    return true;
  } catch (error) {
    console.error('❌ Login failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data?.message || 'Unknown error');
      if (error.response.data?.stack) {
        console.error('Stack:', error.response.data.stack.split('\n')[0]);
      }
    } else if (error.request) {
      console.error('No response received from server');
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
};

const runAllTests = async () => {
  console.log('🚀 Starting login tests...');
  console.log('='.repeat(60));
  
  let allTestsPassed = true;
  
  for (const user of testUsers) {
    const success = await testLogin(user);
    if (!success) {
      allTestsPassed = false;
    }
    console.log('='.repeat(60));
  }
  
  if (allTestsPassed) {
    console.log('🎉 All login tests passed successfully!');
  } else {
    console.log('⚠️ Some login tests failed. Please check the logs above.');
  }
  
  process.exit(allTestsPassed ? 0 : 1);
};

// Run all tests
runAllTests();

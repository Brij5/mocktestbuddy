import mongoose from 'mongoose';

const testConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    await mongoose.connect('mongodb://localhost:27017/exam-buddy', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // List all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections in exam-buddy database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection error:', error);
    process.exit(1);
  }
};

testConnection();

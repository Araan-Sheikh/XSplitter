import { connectToDatabase } from '../lib/mongodb';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    await connectToDatabase();
    console.log('Connection test successful!');
    process.exit(0);
  } catch (error) {
    console.error('Connection test failed:', error);
    process.exit(1);
  }
}

testConnection(); 
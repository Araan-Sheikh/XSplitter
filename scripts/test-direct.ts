import { MongoClient } from 'mongodb';

async function testDirectConnection() {
  const uri = process.env.MONGODB_URI!;
  const client = new MongoClient(uri);

  try {
    console.log('Attempting direct connection...');
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Direct connection successful!');
  } catch (error) {
    console.error('Direct connection failed:', error);
  } finally {
    await client.close();
  }
}

testDirectConnection(); 
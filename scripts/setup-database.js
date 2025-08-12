#!/usr/bin/env node

// Simple MongoDB setup script for testing
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.error('❌ No MongoDB connection string found');
  console.log('Set MONGO_URI environment variable');
  process.exit(1);
}

console.log('🔄 Testing MongoDB connection...');

async function testConnection() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    
    // Try with minimal options first
    const client = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const db = client.db();
    
    // List existing collections
    const collections = await db.listCollections().toArray();
    console.log(`📁 Found ${collections.length} collections:`, collections.map(c => c.name));
    
    // Try to insert a test document
    const testCollection = db.collection('connection_test');
    const result = await testCollection.insertOne({
      message: 'Connection test successful',
      timestamp: new Date(),
      from: 'police-management-system'
    });
    
    console.log('✅ Test document inserted:', result.insertedId);
    
    // Clean up test document
    await testCollection.deleteOne({ _id: result.insertedId });
    console.log('✅ Test document removed');
    
    await client.close();
    console.log('✅ Connection test completed successfully!');
    console.log('\nYour MongoDB connection is working. Run the full setup with:');
    console.log('node scripts/mongodb-setup.js');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.log('\n🔧 Troubleshooting: Authentication Error');
      console.log('- Check your username and password in the connection string');
      console.log('- Make sure the user has read/write permissions');
      console.log('- Verify the database name is correct');
    } else if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.log('\n🔧 Troubleshooting: SSL/TLS Error');
      console.log('- This may be due to network restrictions in the current environment');
      console.log('- Try connecting from a different network or environment');
      console.log('- Check MongoDB Atlas network access settings');
      console.log('- Ensure your IP is whitelisted in Atlas');
    } else if (error.message.includes('timeout') || error.message.includes('ENOTFOUND')) {
      console.log('\n🔧 Troubleshooting: Network Error');
      console.log('- Check your internet connection');
      console.log('- Verify the MongoDB Atlas cluster is running');
      console.log('- Check if there are firewall restrictions');
    }
    
    console.log('\n💡 Alternative: For VS Code development, you can:');
    console.log('1. Install MongoDB locally');
    console.log('2. Use a different MongoDB Atlas cluster');
    console.log('3. Use the in-memory storage (current fallback)');
  }
}

testConnection();
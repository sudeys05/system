// Database configuration for switching between storage types
import { MemStorage } from './storage.js';
import { mongoStorage } from './mongodb-storage.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Choose storage type based on environment
const USE_MONGODB = process.env.USE_MONGODB === 'true' || process.env.NODE_ENV === 'production';
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/police_management';

let storage;

if (USE_MONGODB) {
  console.log('Using MongoDB storage');
  console.log('Connecting to:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs
  storage = mongoStorage;
  
  // Connect to MongoDB
  try {
    await storage.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.log('Falling back to in-memory storage');
    storage = new MemStorage();
  }
} else {
  console.log('Using in-memory storage');
  storage = new MemStorage();
}

export { storage };
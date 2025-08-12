#!/usr/bin/env node

// MongoDB setup script for initial database configuration
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/police_management';

async function setupDatabase() {
  console.log('Setting up MongoDB database...');
  
  try {
    // MongoDB connection options for better compatibility
    const options = {
      retryWrites: true,
      w: 'majority',
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 1,
    };

    const client = new MongoClient(MONGODB_URI, options);
    await client.connect();
    
    // Test the connection
    await client.db().admin().ping();
    console.log('Connected to MongoDB Atlas successfully');
    
    const db = client.db();
    
    // Check existing collections
    const collections = await db.listCollections().toArray();
    console.log(`Found ${collections.length} existing collections:`, collections.map(c => c.name));
    
    // Ask user preference for existing data
    if (collections.length > 0) {
      console.log('\nOptions:');
      console.log('1. Keep existing data and add missing collections/indexes');
      console.log('2. Drop all collections and start fresh');
      console.log('\nTo drop existing data, set RESET_DATABASE=true in environment');
      
      if (process.env.RESET_DATABASE === 'true') {
        for (const collection of collections) {
          await db.collection(collection.name).drop();
          console.log(`Dropped collection: ${collection.name}`);
        }
      } else {
        console.log('Keeping existing data...');
      }
    }
    
    // Create collections with validation
    await createCollections(db);
    
    // Create indexes
    await createIndexes(db);
    
    // Insert sample data
    await insertSampleData(db);
    
    await client.close();
    console.log('MongoDB setup completed successfully!');
    
  } catch (error) {
    console.error('MongoDB setup failed:', error);
    process.exit(1);
  }
}

async function createCollections(db) {
  // Users collection with validation
  await db.createCollection('users', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['username', 'email', 'password', 'firstName', 'lastName', 'role'],
        properties: {
          username: { bsonType: 'string' },
          email: { bsonType: 'string' },
          password: { bsonType: 'string' },
          firstName: { bsonType: 'string' },
          lastName: { bsonType: 'string' },
          role: { enum: ['admin', 'user'] },
          isActive: { bsonType: 'bool' }
        }
      }
    }
  });
  
  // Cases collection
  await db.createCollection('cases', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['caseNumber', 'title', 'status', 'priority'],
        properties: {
          caseNumber: { bsonType: 'string' },
          title: { bsonType: 'string' },
          status: { enum: ['open', 'in_progress', 'closed'] },
          priority: { enum: ['low', 'medium', 'high', 'critical'] }
        }
      }
    }
  });
  
  // OB Entries collection
  await db.createCollection('obEntries');
  
  // License Plates collection
  await db.createCollection('licensePlates');
  
  // Evidence collection
  await db.createCollection('evidence');
  
  // Geofiles collection
  await db.createCollection('geofiles');
  
  // Police Vehicles collection
  await db.createCollection('policeVehicles');
  
  // Reports collection
  await db.createCollection('reports');
  
  // Password Reset Tokens collection
  await db.createCollection('passwordResetTokens');
  
  console.log('Collections created successfully');
}

async function createIndexes(db) {
  // User indexes
  await db.collection('users').createIndex({ username: 1 }, { unique: true });
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('users').createIndex({ badgeNumber: 1 });
  
  // Case indexes
  await db.collection('cases').createIndex({ caseNumber: 1 }, { unique: true });
  await db.collection('cases').createIndex({ status: 1 });
  await db.collection('cases').createIndex({ priority: 1 });
  await db.collection('cases').createIndex({ createdAt: -1 });
  
  // OB Entry indexes
  await db.collection('obEntries').createIndex({ obNumber: 1 }, { unique: true });
  await db.collection('obEntries').createIndex({ dateTime: -1 });
  
  // License plate indexes
  await db.collection('licensePlates').createIndex({ plateNumber: 1 }, { unique: true });
  
  // Evidence indexes
  await db.collection('evidence').createIndex({ evidenceNumber: 1 }, { unique: true });
  await db.collection('evidence').createIndex({ caseId: 1 });
  
  // Vehicle indexes
  await db.collection('policeVehicles').createIndex({ vehicleId: 1 }, { unique: true });
  await db.collection('policeVehicles').createIndex({ licensePlate: 1 }, { unique: true });
  
  // Geofile indexes
  await db.collection('geofiles').createIndex({ filename: 1 });
  await db.collection('geofiles').createIndex({ fileType: 1 });
  await db.collection('geofiles').createIndex({ accessLevel: 1 });
  
  console.log('Indexes created successfully');
}

async function insertSampleData(db) {
  // Check if admin user already exists
  const existingAdmin = await db.collection('users').findOne({ username: 'admin' });
  
  if (!existingAdmin) {
    // Create default admin user
    const adminUser = {
      username: 'admin',
      email: 'admin@police.gov',
      password: 'admin123', // In production, hash this password
      firstName: 'System',
      lastName: 'Administrator',
      role: 'admin',
      badgeNumber: 'ADMIN001',
      department: 'IT',
      position: 'System Administrator',
      phone: '+1-555-0000',
      profileImage: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: null,
    };
    
    await db.collection('users').insertOne(adminUser);
    console.log('Created admin user');
  } else {
    console.log('Admin user already exists');
  }
  
  // Create sample officers
  const officers = [
    {
      username: 'officer.johnson',
      email: 'johnson@police.gov',
      password: 'officer123',
      firstName: 'Mike',
      lastName: 'Johnson',
      role: 'user',
      badgeNumber: 'BADGE001',
      department: 'Patrol',
      position: 'Police Officer',
      phone: '+1-555-0001',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'detective.smith',
      email: 'smith@police.gov',
      password: 'detective123',
      firstName: 'Sarah',
      lastName: 'Smith',
      role: 'user',
      badgeNumber: 'DET001',
      department: 'Detective',
      position: 'Detective',
      phone: '+1-555-0002',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  // Check if officers already exist
  const existingOfficers = await db.collection('users').countDocuments({ role: 'user' });
  if (existingOfficers === 0) {
    await db.collection('users').insertMany(officers);
    console.log('Created sample officers');
  } else {
    console.log('Officers already exist');
  }
  
  // Create sample cases
  const cases = [
    {
      caseNumber: 'CASE-2025-001',
      title: 'Burglary at Main Street Store',
      description: 'Break-in occurred at electronics store on Main Street. Several items reported missing.',
      status: 'in_progress',
      priority: 'high',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      caseNumber: 'CASE-2025-002',
      title: 'Traffic Accident Investigation',
      description: 'Multi-vehicle accident at highway intersection. Minor injuries reported.',
      status: 'open',
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  // Check if cases already exist
  const existingCases = await db.collection('cases').countDocuments();
  if (existingCases === 0) {
    await db.collection('cases').insertMany(cases);
    console.log('Created sample cases');
  } else {
    console.log('Cases already exist');
  }
  
  console.log('Sample data setup completed');
}

// Run the setup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase();
}

export { setupDatabase };
# MongoDB Setup Guide

This guide will help you set up MongoDB for the Police Management System when running in VS Code or your local environment.

## Prerequisites

1. **Install MongoDB**: Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. **Install Node.js dependencies**: Make sure you have the MongoDB driver installed:
   ```bash
   npm install mongodb
   ```

## MongoDB Setup Options

### Option 1: Local MongoDB Installation

1. **Install MongoDB Community Edition**
   - Windows: Download the MSI installer from MongoDB website
   - macOS: Use Homebrew: `brew install mongodb-community`
   - Linux: Follow the distribution-specific instructions

2. **Start MongoDB Service**
   ```bash
   # Windows (if installed as service)
   net start MongoDB
   
   # macOS/Linux
   mongod --dbpath /path/to/your/data/directory
   ```

3. **Update Environment Variables**
   Create a `.env` file in the project root:
   ```env
   USE_MONGODB=true
   MONGODB_URI=mongodb://localhost:27017/police_management
   SESSION_SECRET=your-secret-key-here
   NODE_ENV=development
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create MongoDB Atlas Account**
   - Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Create a free account and cluster

2. **Get Connection String**
   - In Atlas dashboard, click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

3. **Update Environment Variables**
   ```env
   USE_MONGODB=true
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/police_management?retryWrites=true&w=majority
   SESSION_SECRET=your-secret-key-here
   NODE_ENV=development
   ```

## Database Initialization

1. **Run the MongoDB setup script**:
   ```bash
   node scripts/mongodb-setup.js
   ```

2. **Start the application**:
   ```bash
   npm run dev
   ```

## Default Login Credentials

After running the setup script, you can log in with:
- **Username**: admin
- **Password**: admin123

Additional test accounts:
- **Officer Johnson**: officer.johnson / officer123
- **Detective Smith**: detective.smith / detective123

## Database Collections

The system creates the following collections:

### users
- Stores user accounts (officers, admins)
- Indexes: username (unique), email (unique), badgeNumber

### cases
- Police case records
- Indexes: caseNumber (unique), status, priority, createdAt

### obEntries
- Occurrence Book entries
- Indexes: obNumber (unique), dateTime

### licensePlates
- License plate records
- Indexes: plateNumber (unique)

### evidence
- Evidence tracking
- Indexes: evidenceNumber (unique), caseId

### policeVehicles
- Police vehicle tracking
- Indexes: vehicleId (unique), licensePlate (unique)

### geofiles
- Geographic files and maps
- Indexes: filename, fileType, accessLevel

### passwordResetTokens
- Password reset functionality
- TTL index for automatic cleanup

## Switching Between Storage Types

The application automatically detects the storage type based on environment variables:

- **In-Memory Storage**: Set `USE_MONGODB=false` or leave unset
- **MongoDB Storage**: Set `USE_MONGODB=true`

## Development Tips

1. **MongoDB Compass**: Install MongoDB Compass for a GUI to view your data
2. **VS Code Extension**: Install the MongoDB extension for VS Code
3. **Backup**: Regularly backup your data using `mongodump`
4. **Monitoring**: Use MongoDB's built-in profiler for performance monitoring

## Troubleshooting

### Common Issues

1. **SSL/TLS Connection Errors (Atlas)**
   - Common in containerized environments like Replit
   - Network restrictions prevent SSL handshake
   - Solution: Use VS Code or local development environment
   - Fallback: System automatically uses in-memory storage

2. **Connection Refused**
   - Make sure MongoDB service is running
   - Check if port 27017 is available
   - Verify connection string in .env file

3. **Authentication Failed**
   - Check username/password in connection string
   - Ensure user has proper permissions

4. **Collection Not Found**
   - Run the setup script: `node scripts/mongodb-setup.js`
   - Check if database name is correct

### Replit Environment Notes

Due to network restrictions, MongoDB Atlas connections may fail in Replit with SSL/TLS errors. The system automatically falls back to in-memory storage, which provides the same functionality for development and testing.

### Debug Commands

```bash
# Check MongoDB service status
mongod --version

# Connect to MongoDB shell
mongosh

# List databases
show dbs

# Use police management database
use police_management

# List collections
show collections

# Count documents in users collection
db.users.countDocuments()
```

## Production Deployment

For production deployment:

1. Use MongoDB Atlas or a dedicated MongoDB server
2. Enable authentication and SSL
3. Set up proper user roles and permissions
4. Configure backup strategies
5. Monitor performance and set up alerts

```env
NODE_ENV=production
USE_MONGODB=true
MONGODB_URI=mongodb+srv://prod-user:secure-password@production-cluster.mongodb.net/police_management?retryWrites=true&w=majority
SESSION_SECRET=super-secure-session-secret
```
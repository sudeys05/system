#!/usr/bin/env node

// Start script to run JavaScript files without tsx dependency
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Import and run the main server file
import('./server/index.js').catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
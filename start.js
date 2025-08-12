#!/usr/bin/env node

// Simple JavaScript startup script for Replit environment
// Sets NODE_ENV to development and starts the server

process.env.NODE_ENV = 'development';

// Import and run the server
import('./server/index.js').catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
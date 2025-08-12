#!/usr/bin/env node

// Windows-compatible startup script for the Police Management System
// This ensures proper localhost binding on Windows systems

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting Police Management System for Windows...');
console.log('📍 Server will be available at: http://localhost:5000');

// Set Windows-specific environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Start the server with TSX
const serverPath = join(__dirname, 'server', 'index.ts');
const child = spawn('npx', ['tsx', serverPath], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    FORCE_COLOR: '1'  // Enable colors in Windows terminal
  }
});

child.on('error', (error) => {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
});

child.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Server exited with code ${code}`);
    process.exit(code);
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  child.kill('SIGTERM');
});

process.on('SIGTERM', () => {
  child.kill('SIGTERM');
});
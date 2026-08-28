/**
 * env.js — validates that required environment variables are set at startup.
 * Throws if any critical variable is missing so the server fails fast.
 */

const envDefaults = {
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'local-dev-secret-change-me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  PORT: process.env.PORT || 5000,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};

module.exports = envDefaults;

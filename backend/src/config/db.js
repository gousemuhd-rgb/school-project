/**
 * db.js — Establishes and exports the Mongoose connection.
 * Falls back to an in-memory MongoDB instance for local testing when no external DB is configured.
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MONGODB_URI } = require('./env');

let memoryServer;

const connectDB = async () => {
  try {
    const uri = MONGODB_URI || process.env.MONGODB_URI;
    const conn = await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/college-complaints', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    try {
      memoryServer = await MongoMemoryServer.create();
      const uri = memoryServer.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`✅ MongoDB connected (in-memory): ${conn.connection.host}`);
    } catch (memoryError) {
      console.error(`❌ MongoDB connection error: ${memoryError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;

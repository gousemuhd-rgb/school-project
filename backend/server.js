/**
 * server.js — Express application entry point.
 * Loads env vars, connects to DB, registers middleware & routes.
 */

require('dotenv').config();
require('./src/config/env'); // Validate required env vars

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const complaintRoutes = require('./src/routes/complaintRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const { PORT, FRONTEND_URL } = require('./src/config/env');

const app = express();

// ── Security & Parsing Middleware ─────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
// User management endpoints share the auth router (GET /api/users, PUT /api/users/:id)
app.use('/api', authRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ── Global Error Handler (must be last) ───────────────────────────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────────────────────
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/health`);
  });
};

start();

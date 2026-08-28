/**
 * authService.js — Business logic for authentication.
 * Controllers call these functions; never call MongoDB directly from a controller.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

/** Generate a signed JWT for the given user id */
const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Register a new user.
 * @param {Object} data - { name, email, password, role?, department? }
 * @returns {{ user, token }}
 */
const registerUser = async ({ name, email, password, role, department }) => {
  // Check for duplicate email
  const existing = await User.findOne({ email });
  if (existing) {
    const error = new Error('An account with this email already exists');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({ name, email, password, role, department });
  const token = signToken(user._id);

  // Strip password from response
  user.password = undefined;
  return { user, token };
};

/**
 * Authenticate a user by email and password.
 * @param {string} email
 * @param {string} password
 * @returns {{ user, token }}
 */
const loginUser = async (email, password) => {
  // Explicitly select password (select:false in schema)
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = signToken(user._id);
  user.password = undefined;
  return { user, token };
};

/**
 * Return the current authenticated user's profile.
 * @param {string} userId
 * @returns {User}
 */
const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

/**
 * List all users (admin only).
 * @returns {User[]}
 */
const listUsers = async () => {
  return User.find().select('-password').sort({ createdAt: -1 });
};

/**
 * Update a user's role and/or department (admin only).
 * @param {string} userId
 * @param {Object} updates - { role?, department? }
 */
const updateUser = async (userId, updates) => {
  const allowed = {};
  if (updates.role) allowed.role = updates.role;
  if (updates.department !== undefined) allowed.department = updates.department;

  const user = await User.findByIdAndUpdate(userId, allowed, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

module.exports = { registerUser, loginUser, getMe, listUsers, updateUser };

/**
 * authRoutes.js — HTTP routes for authentication and user management.
 */

const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const authController = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/auth');

// ── Validation rules ────────────────────────────────────────────────────────

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['student', 'staff', 'admin'])
    .withMessage('Role must be student, staff, or admin'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const updateUserValidation = [
  param('id').isMongoId().withMessage('Invalid user ID'),
  body('role')
    .optional()
    .isIn(['student', 'staff', 'admin'])
    .withMessage('Role must be student, staff, or admin'),
];

// ── Routes ───────────────────────────────────────────────────────────────────

// POST /api/auth/register
router.post('/register', registerValidation, authController.register);

// POST /api/auth/login
router.post('/login', loginValidation, authController.login);

// GET /api/auth/me  (protected)
router.get('/me', protect, authController.getMe);

// GET /api/users  (admin only)
router.get('/users', protect, restrictTo('admin'), authController.listUsers);

// PUT /api/users/:id  (admin only)
router.put('/users/:id', protect, restrictTo('admin'), updateUserValidation, authController.updateUser);

module.exports = router;

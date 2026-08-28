/**
 * complaintRoutes.js — routes for complaints and comments.
 */

const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();

const complaintController = require('../controllers/complaintController');
const { protect, restrictTo } = require('../middleware/auth');

const complaintValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 150 }).withMessage('Title cannot exceed 150 characters'),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 2500 }).withMessage('Description cannot exceed 2500 characters'),
  body('category').isIn(['Maintenance', 'IT', 'Academic', 'Hostel', 'Administration', 'Library', 'Sports']).withMessage('Invalid category'),
  body('urgency').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid urgency'),
];

const statusValidation = [
  param('id').isMongoId().withMessage('Invalid complaint ID'),
  body('status').isIn(['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED']).withMessage('Invalid status'),
];

const commentValidation = [
  param('id').isMongoId().withMessage('Invalid complaint ID'),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 }).withMessage('Comment cannot exceed 2000 characters'),
];

router.get('/', protect, complaintController.listComplaints);
router.post('/', protect, complaintValidation, complaintController.createComplaint);
router.get('/:id', protect, complaintController.getComplaintById);
router.put('/:id/status', protect, restrictTo('staff', 'admin'), statusValidation, complaintController.updateComplaintStatus);
router.post('/:id/comments', protect, commentValidation, complaintController.addComment);

module.exports = router;

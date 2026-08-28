/**
 * Comment.js — Thread comments attached to complaint tickets.
 */

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Comment message is required'],
      trim: true,
      maxlength: [2000, 'Comment cannot exceed 2000 characters'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);

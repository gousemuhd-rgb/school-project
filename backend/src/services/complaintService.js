/**
 * complaintService.js — complaint CRUD and role-based access rules.
 */

const Complaint = require('../models/Complaint');
const Comment = require('../models/Comment');
const User = require('../models/User');

const buildComplaintQuery = (user, filters = {}) => {
  const query = {};

  if (user.role === 'student') {
    query.createdBy = user._id;
  }

  if (user.role === 'staff') {
    query.$or = [
      { assignedTo: user._id },
      { department: user.department },
    ];
  }

  if (filters.status) query.status = filters.status;
  if (filters.category) query.category = filters.category;
  if (filters.department) query.department = filters.department;

  return query;
};

const listComplaints = async (user, filters = {}) => {
  const query = buildComplaintQuery(user, filters);

  const complaints = await Complaint.find(query)
    .populate('createdBy', 'name email role department')
    .populate('assignedTo', 'name email role department')
    .sort({ createdAt: -1 });

  return complaints;
};

const getComplaintById = async (complaintId, user) => {
  const complaint = await Complaint.findById(complaintId)
    .populate('createdBy', 'name email role department')
    .populate('assignedTo', 'name email role department');

  if (!complaint) {
    const error = new Error('Complaint not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.role === 'student' && complaint.createdBy._id.toString() !== user._id.toString()) {
    const error = new Error('Access denied');
    error.statusCode = 403;
    throw error;
  }

  if (user.role === 'staff') {
    const permitted =
      complaint.assignedTo?._id?.toString() === user._id.toString() ||
      complaint.department === user.department;

    if (!permitted) {
      const error = new Error('Access denied');
      error.statusCode = 403;
      throw error;
    }
  }

  return complaint;
};

const createComplaint = async ({ title, description, category, urgency, userId }) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const complaint = await Complaint.create({
    title,
    description,
    category,
    urgency: urgency || 'medium',
    createdBy: userId,
    department: user.department || null,
    assignedTo: user.role === 'student' ? null : user._id,
  });

  return complaint;
};

const updateComplaintStatus = async (complaintId, user, status) => {
  const complaint = await Complaint.findById(complaintId);

  if (!complaint) {
    const error = new Error('Complaint not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.role !== 'admin' && user.role !== 'staff') {
    const error = new Error('Only staff and admins can update complaint status');
    error.statusCode = 403;
    throw error;
  }

  if (user.role === 'staff' && complaint.department && complaint.department !== user.department) {
    const error = new Error('You can only update complaints in your department');
    error.statusCode = 403;
    throw error;
  }

  complaint.status = status;
  await complaint.save();

  return complaint;
};

const addComment = async (complaintId, userId, message) => {
  const complaint = await Complaint.findById(complaintId);
  if (!complaint) {
    const error = new Error('Complaint not found');
    error.statusCode = 404;
    throw error;
  }

  const dbUser = await User.findById(userId);
  if (!dbUser) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const canComment =
    dbUser.role === 'admin' ||
    dbUser.role === 'staff' ||
    complaint.createdBy.toString() === dbUser._id.toString();

  if (!canComment) {
    const error = new Error('You are not allowed to comment on this complaint');
    error.statusCode = 403;
    throw error;
  }

  const comment = await Comment.create({
    complaintId,
    userId,
    message,
  });

  return comment;
};

const getComplaintComments = async (complaintId) => {
  const comments = await Comment.find({ complaintId })
    .populate('userId', 'name email role department')
    .sort({ createdAt: 1 });

  return comments;
};

module.exports = {
  listComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
  addComment,
  getComplaintComments,
};

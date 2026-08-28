/**
 * complaintController.js — Thin HTTP handlers for complaint endpoints.
 */

const { validationResult } = require('express-validator');
const complaintService = require('../services/complaintService');

const listComplaints = async (req, res, next) => {
  try {
    const complaints = await complaintService.listComplaints(req.user, req.query);
    res.status(200).json({ complaints });
  } catch (err) {
    next(err);
  }
};

const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await complaintService.getComplaintById(req.params.id, req.user);
    const comments = await complaintService.getComplaintComments(req.params.id);
    res.status(200).json({ complaint, comments });
  } catch (err) {
    next(err);
  }
};

const createComplaint = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const complaint = await complaintService.createComplaint({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      urgency: req.body.urgency,
      userId: req.user._id,
    });

    res.status(201).json({ message: 'Complaint created successfully', complaint });
  } catch (err) {
    next(err);
  }
};

const updateComplaintStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const complaint = await complaintService.updateComplaintStatus(req.params.id, req.user, req.body.status);
    res.status(200).json({ message: 'Complaint status updated', complaint });
  } catch (err) {
    next(err);
  }
};

const addComment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const comment = await complaintService.addComment(req.params.id, req.user._id, req.body.message);
    res.status(201).json({ message: 'Comment added', comment });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
  addComment,
};

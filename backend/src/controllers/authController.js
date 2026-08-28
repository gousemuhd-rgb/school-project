/**
 * authController.js — Thin HTTP handlers. Delegates to authService.
 * No MongoDB calls here.
 */

const { validationResult } = require('express-validator');
const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password, role, department } = req.body;
    const { user, token } = await authService.registerUser({ name, email, password, role, department });
    res.status(201).json({ message: 'Registration successful', user, token });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);
    res.status(200).json({ message: 'Login successful', user, token });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user._id);
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const users = await authService.listUsers();
    res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await authService.updateUser(req.params.id, req.body);
    res.status(200).json({ message: 'User updated', user });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe, listUsers, updateUser };

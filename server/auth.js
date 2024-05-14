const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  const errors = [];
  if (!validator.isEmail(email)) {
    errors.push('Invalid email format');
  }
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  try {
    const existin
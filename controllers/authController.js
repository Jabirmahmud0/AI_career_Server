const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User.js');
const connectDB = require('../config/db.js');

const DEMO_EMAIL = 'demo@careerai.app';
const DEMO_PASSWORD = 'Recruiter123!';
const DEMO_PROFILE = {
  fullName: 'Alex Morgan',
  educationLevel: 'Bachelor',
  department: 'Computer Science',
  experienceLevel: 'Junior',
  preferredTrack: 'Web Development',
  skills: ['JavaScript', 'React', 'Node.js', 'Git', 'UI/UX'],
  targetRoles: ['Frontend Developer', 'Full Stack Developer'],
  bio: 'Product-minded developer building accessible, user-focused web experiences.',
  projects: [{ title: 'CareerAI Portfolio', description: 'Built a responsive AI-assisted career planning experience.', technologies: ['React', 'Node.js', 'MongoDB'] }]
};

// Generate JWT
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    
    // Ensure database connection
    await connectDB();
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password, educationLevel, department, experienceLevel, preferredTrack } = req.body;

    // Check if user exists
    console.log('Checking if user exists with email:', email);
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('User already exists with this email:', email);
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    console.log('Creating new user with email:', email);
    const user = await User.create({
      fullName,
      email,
      password,
      educationLevel,
      department,
      experienceLevel,
      preferredTrack
    });

    if (user) {
      console.log('User created successfully:', user._id);
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        educationLevel: user.educationLevel,
        department: user.department,
        experienceLevel: user.experienceLevel,
        preferredTrack: user.preferredTrack,
        token: generateToken(user._id)
      });
    } else {
      console.log('Invalid user data');
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    // Ensure database connection
    await connectDB();
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Keep the public recruiter demo available without a separate seed step.
    let user = await User.findOne({ email });
    if (email?.toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      if (!user) {
        user = await User.create({ email: DEMO_EMAIL, password: DEMO_PASSWORD, ...DEMO_PROFILE });
      } else {
        const demoPasswordIsCurrent = await user.matchPassword(DEMO_PASSWORD);
        Object.assign(user, DEMO_PROFILE);
        if (!demoPasswordIsCurrent) user.password = DEMO_PASSWORD;
        await user.save();
      }
    }

    // Find user
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      educationLevel: user.educationLevel,
      department: user.department,
      experienceLevel: user.experienceLevel,
      preferredTrack: user.preferredTrack,
      skills: user.skills,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe
};

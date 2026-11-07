const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, university, degree, year } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email and password");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    university,
    degree,
    year,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    university: user.university,
    degree: user.degree,
    year: user.year,
    token: generateToken(user._id),
  });
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    university: user.university,
    degree: user.degree,
    year: user.year,
    theme: user.theme,
    token: generateToken(user._id),
  });
});

// @desc    Get current user's profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @desc    Update current user's profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name ?? user.name;
  user.university = req.body.university ?? user.university;
  user.degree = req.body.degree ?? user.degree;
  user.year = req.body.year ?? user.year;
  user.theme = req.body.theme ?? user.theme;
  user.profileImage = req.body.profileImage ?? user.profileImage;

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    university: updatedUser.university,
    degree: updatedUser.degree,
    year: updatedUser.year,
    theme: updatedUser.theme,
    profileImage: updatedUser.profileImage,
  });
});

module.exports = { register, login, getProfile, updateProfile };

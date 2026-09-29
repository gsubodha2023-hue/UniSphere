const asyncHandler = require("express-async-handler");
const Task = require("../models/Task");

// @desc    Get all tasks for logged-in user (supports filters)
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const { status, category, type, priority, from, to, search } = req.query;

  const filter = { user: req.user._id };

  if (status) filter.status = status;
  if (category) filter.category = category;
  if (type) filter.type = type;
  if (priority) filter.priority = priority;

  if (from || to) {
    filter.dueDate = {};
    if (from) filter.dueDate.$gte = new Date(from);
    if (to) filter.dueDate.$lte = new Date(to);
  }

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }

  const tasks = await Task.find(filter).sort({ dueDate: 1 });
  res.json(tasks);
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  res.json(task);
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, category, type, priority, dueDate, reminder } =
    req.body;

  if (!title || !dueDate) {
    res.status(400);
    throw new Error("Title and due date are required");
  }

  const task = await Task.create({
    user: req.user._id,
    title,
    description,
    category,
    type,
    priority,
    dueDate,
    reminder,
  });

  res.status(201).json(task);
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  const fields = [
    "title",
    "description",
    "category",
    "type",
    "priority",
    "status",
    "dueDate",
    "reminder",
  ];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) task[field] = req.body[field];
  });

  const updatedTask = await task.save();
  res.json(updatedTask);
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user._id });

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  await task.deleteOne();
  res.json({ message: "Task removed", id: req.params.id });
});

// @desc    Get dashboard task statistics
// @route   GET /api/tasks/stats/summary
// @access  Private
const getTaskStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const total = await Task.countDocuments({ user: userId });
  const completed = await Task.countDocuments({ user: userId, status: "Completed" });
  const pending = await Task.countDocuments({ user: userId, status: "Pending" });
  const inProgress = await Task.countDocuments({ user: userId, status: "In Progress" });

  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const upcoming = await Task.find({
    user: userId,
    status: { $ne: "Completed" },
    dueDate: { $gte: now, $lte: in7Days },
  }).sort({ dueDate: 1 });

  const overdue = await Task.find({
    user: userId,
    status: { $ne: "Completed" },
    dueDate: { $lt: now },
  }).sort({ dueDate: 1 });

  res.json({
    total,
    completed,
    pending,
    inProgress,
    upcoming,
    overdue,
  });
});

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};

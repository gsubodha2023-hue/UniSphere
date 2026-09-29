const asyncHandler = require("express-async-handler");
const PomodoroSession = require("../models/PomodoroSession");

// @desc    Log a completed pomodoro/focus session
// @route   POST /api/pomodoro
// @access  Private
const logSession = asyncHandler(async (req, res) => {
  const { task, durationMinutes, type } = req.body;

  if (!durationMinutes) {
    res.status(400);
    throw new Error("durationMinutes is required");
  }

  const session = await PomodoroSession.create({
    user: req.user._id,
    task: task || null,
    durationMinutes,
    type: type || "focus",
  });

  res.status(201).json(session);
});

// @desc    Get productivity analytics (sessions grouped by day)
// @route   GET /api/pomodoro/analytics
// @access  Private
const getAnalytics = asyncHandler(async (req, res) => {
  const { days = 7 } = req.query;
  const since = new Date();
  since.setDate(since.getDate() - Number(days));

  const sessions = await PomodoroSession.find({
    user: req.user._id,
    type: "focus",
    completedAt: { $gte: since },
  }).sort({ completedAt: 1 });

  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
  const totalSessions = sessions.length;

  const byDay = {};
  sessions.forEach((s) => {
    const key = s.completedAt.toISOString().slice(0, 10);
    byDay[key] = (byDay[key] || 0) + s.durationMinutes;
  });

  res.json({ totalMinutes, totalSessions, byDay, sessions });
});

module.exports = { logSession, getAnalytics };

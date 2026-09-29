const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/database");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const Task = require("./models/Task");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Make io accessible in controllers if needed via req.app.get('io')
app.set("io", io);

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));
app.use("/api/notes", require("./routes/noteRoutes"));
app.use("/api/pomodoro", require("./routes/pomodoroRoutes"));

app.get("/", (req, res) => {
  res.json({ message: "UniSphere API is running", status: "healthy" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(notFound);
app.use(errorHandler);

// Socket.IO: rooms per user for targeted notifications
io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    if (userId) {
      socket.join(userId.toString());
    }
  });

  socket.on("disconnect", () => {
    // no-op, room membership is cleaned up automatically
  });
});

// Simple in-process reminder checker: every 5 minutes, find tasks due within
// the next 24 hours that haven't had a reminder sent, and emit a notification
// to that user's room.
const REMINDER_WINDOW_MS = 24 * 60 * 60 * 1000;
const CHECK_INTERVAL_MS = 5 * 60 * 1000;

const checkReminders = async () => {
  try {
    const now = new Date();
    const windowEnd = new Date(now.getTime() + REMINDER_WINDOW_MS);

    const dueTasks = await Task.find({
      reminder: true,
      status: { $ne: "Completed" },
      dueDate: { $gte: now, $lte: windowEnd },
      reminderSentAt: null,
    });

    for (const task of dueTasks) {
      io.to(task.user.toString()).emit("notification", {
        type: "deadline",
        title: `Upcoming: ${task.title}`,
        message: `Due ${task.dueDate.toLocaleString()}`,
        taskId: task._id,
      });
      task.reminderSentAt = now;
      await task.save();
    }
  } catch (err) {
    console.error("Reminder check failed:", err.message);
  }
};

setInterval(checkReminders, CHECK_INTERVAL_MS);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`UniSphere server running on port ${PORT}`);
});

module.exports = { app, server, io };

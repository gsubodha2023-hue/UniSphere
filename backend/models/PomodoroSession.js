const mongoose = require("mongoose");

const pomodoroSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
    durationMinutes: { type: Number, required: true },
    type: { type: String, enum: ["focus", "break"], default: "focus" },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PomodoroSession", pomodoroSessionSchema);

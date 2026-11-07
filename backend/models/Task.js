const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["Academic", "Personal", "Work", "Other"],
      default: "Academic",
    },
    type: {
      type: String,
      enum: ["Assignment", "Exam", "Quiz", "Personal Work", "Meeting", "Other"],
      default: "Other",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    dueDate: { type: Date, required: [true, "Due date is required"] },
    reminder: { type: Boolean, default: true },
    reminderSentAt: { type: Date, default: null },
  },
  { timestamps: true }
);

taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model("Task", taskSchema);

const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: [true, "Note title is required"], trim: true },
    content: { type: String, default: "" },
    tags: [{ type: String, trim: true }],
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

noteSchema.index({ user: 1, title: "text", content: "text", tags: "text" });

module.exports = mongoose.model("Note", noteSchema);

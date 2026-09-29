const asyncHandler = require("express-async-handler");
const Note = require("../models/Note");

// @desc    Get all notes (supports search)
// @route   GET /api/notes
// @access  Private
const getNotes = asyncHandler(async (req, res) => {
  const { search, tag } = req.query;
  const filter = { user: req.user._id };

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  if (tag) filter.tags = tag;

  const notes = await Note.find(filter).sort({ pinned: -1, updatedAt: -1 });
  res.json(notes);
});

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Private
const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }
  res.json(note);
});

// @desc    Create note
// @route   POST /api/notes
// @access  Private
const createNote = asyncHandler(async (req, res) => {
  const { title, content, tags, pinned } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }

  const note = await Note.create({
    user: req.user._id,
    title,
    content,
    tags,
    pinned,
  });

  res.status(201).json(note);
});

// @desc    Update note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  const fields = ["title", "content", "tags", "pinned"];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) note[field] = req.body[field];
  });

  const updatedNote = await note.save();
  res.json(updatedNote);
});

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
  if (!note) {
    res.status(404);
    throw new Error("Note not found");
  }

  await note.deleteOne();
  res.json({ message: "Note removed", id: req.params.id });
});

module.exports = { getNotes, getNoteById, createNote, updateNote, deleteNote };

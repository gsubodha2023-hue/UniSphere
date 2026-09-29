import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotes, addNote, editNote, removeNote } from "../redux/slices/noteSlice";

const emptyForm = { title: "", content: "", tags: "" };

const NotesPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.notes);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      dispatch(fetchNotes(search ? { search } : {}));
    }, 300);
    return () => clearTimeout(t);
  }, [dispatch, search]);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (note) => {
    setForm({ ...note, tags: (note.tags || []).join(", ") });
    setEditingId(note._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    if (editingId) {
      await dispatch(editNote({ id: editingId, data: payload }));
    } else {
      await dispatch(addNote(payload));
    }
    setShowForm(false);
  };

  const togglePin = (note) => {
    dispatch(editNote({ id: note._id, data: { pinned: !note.pinned } }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold">Notes</h1>
        <div className="flex items-center gap-3">
          <input
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 bg-transparent"
          />
          <button
            onClick={openCreate}
            className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium"
          >
            + New Note
          </button>
        </div>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading notes...</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((note) => (
          <div
            key={note._id}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex flex-col"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-medium">{note.title}</h3>
              <button onClick={() => togglePin(note)} title="Pin note">
                {note.pinned ? "📌" : "📍"}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1 flex-1 line-clamp-4 whitespace-pre-wrap">
              {note.content}
            </p>
            {note.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 dark:bg-primary-600/20 dark:text-primary-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => openEdit(note)}
                className="text-xs px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800"
              >
                Edit
              </button>
              <button
                onClick={() => dispatch(removeNote(note._id))}
                className="text-xs px-3 py-1 rounded-lg bg-red-50 text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <p className="text-sm text-gray-500">No notes found.</p>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-lg p-6">
            <h2 className="font-semibold mb-4">
              {editingId ? "Edit Note" : "New Note"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                required
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent"
              />
              <textarea
                placeholder="Write your note..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent"
              />
              <input
                placeholder="Tags (comma separated)"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-lg text-sm bg-gray-100 dark:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm bg-primary-600 hover:bg-primary-700 text-white"
                >
                  {editingId ? "Save Changes" : "Create Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;

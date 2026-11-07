import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  addTask,
  editTask,
  removeTask,
} from "../redux/slices/taskSlice";

const emptyForm = {
  title: "",
  description: "",
  category: "Academic",
  type: "Assignment",
  priority: "Medium",
  status: "Pending",
  dueDate: "",
  reminder: true,
};

const priorityColor = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-green-100 text-green-700",
};

const statusColor = {
  Pending: "bg-gray-100 text-gray-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
};

const TasksPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.tasks);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    dispatch(fetchTasks(filterStatus ? { status: filterStatus } : {}));
  }, [dispatch, filterStatus]);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (task) => {
    setForm({
      ...task,
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    });
    setEditingId(task._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await dispatch(editTask({ id: editingId, data: form }));
    } else {
      await dispatch(addTask(form));
    }
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (confirm("Delete this task?")) dispatch(removeTask(id));
  };

  const toggleStatus = (task) => {
    const next =
      task.status === "Pending"
        ? "In Progress"
        : task.status === "In Progress"
        ? "Completed"
        : "Pending";
    dispatch(editTask({ id: task._id, data: { status: next } }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">My Tasks</h1>
        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-1.5 bg-transparent"
          >
            <option value="">All statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button
            onClick={openCreate}
            className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium"
          >
            + New Task
          </button>
        </div>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading tasks...</p>}

      <div className="grid gap-3">
        {items.map((task) => (
          <div
            key={task._id}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex items-start justify-between gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium">{task.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColor[task.priority]}`}>
                  {task.priority}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor[task.status]}`}>
                  {task.status}
                </span>
              </div>
              {task.description && (
                <p className="text-sm text-gray-500 mt-1">{task.description}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {task.type} · {task.category} · Due{" "}
                {new Date(task.dueDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button
                onClick={() => toggleStatus(task)}
                className="text-xs px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Advance
              </button>
              <button
                onClick={() => openEdit(task)}
                className="text-xs px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="text-xs px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!loading && items.length === 0 && (
          <p className="text-sm text-gray-500">
            No tasks yet. Create your first one!
          </p>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-lg p-6">
            <h2 className="font-semibold mb-4">
              {editingId ? "Edit Task" : "New Task"}
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
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent"
                rows={3}
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent"
                >
                  {["Academic", "Personal", "Work", "Other"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent"
                >
                  {[
                    "Assignment",
                    "Exam",
                    "Quiz",
                    "Personal Work",
                    "Meeting",
                    "Other",
                  ].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent"
                >
                  {["Low", "Medium", "High"].map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
                <input
                  type="date"
                  required
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent"
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.reminder}
                  onChange={(e) =>
                    setForm({ ...form, reminder: e.target.checked })
                  }
                />
                Send reminder before due date
              </label>
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
                  {editingId ? "Save Changes" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;

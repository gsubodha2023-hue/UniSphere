import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../redux/slices/authSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: user?.name || "",
    university: user?.university || "",
    degree: user?.degree || "",
    year: user?.year || 1,
    theme: user?.theme || "light",
  });
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile(form));
    document.documentElement.classList.toggle("dark", form.theme === "dark");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-xl font-semibold">Profile Settings</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4"
      >
        <div>
          <label className="text-sm font-medium">Full Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            disabled
            value={user?.email}
            className="mt-1 w-full px-3 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium">University</label>
          <input
            value={form.university}
            onChange={(e) => setForm({ ...form, university: e.target.value })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Degree</label>
            <input
              value={form.degree}
              onChange={(e) => setForm({ ...form, degree: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Year</label>
            <input
              type="number"
              min={1}
              max={7}
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Theme</label>
          <select
            value={form.theme}
            onChange={(e) => setForm({ ...form, theme: e.target.value })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium"
        >
          {saved ? "Saved ✓" : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
